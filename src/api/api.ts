import config from "$config/config.ts";
import type { ApiError, ApiTokens } from "$shared/lib/ts/api/generic.ts";
import { GenericErrorCode } from "$shared/lib/enums/api.ts";
import ky, { type KyResponse } from "ky";
import StorageItem from "$objects/StorageItem";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { devLog } from "$utils/generic";
import Endpoints from "./Endpoints";

const session = new StorageItem<ApiTokens>("session");

const checkTokenHasExpired = async (accessToken: string) => {
	try {
		const payload = jwtDecode(accessToken);

		if (!payload) return null;

		const { exp } = payload as any;

		if (!exp) return null;

		const expiry = dayjs.unix(exp);

		const diff = expiry.diff();
		const minutesLeft = diff / 1000 / 60;

		const hasExpired = minutesLeft <= 1;

		devLog(`Current session:\nMinutes left: ${minutesLeft}\nHas Expired: ${hasExpired}`);

		return hasExpired;
	} catch (err: any) {
		// logErrorToSanity(err.message, err.stack);
		return true;
	}
};

const refreshSession = async (refreshToken: string) => {
	const { data, error } = await Endpoints.auth.refresh.call({
		body: {
			refreshToken
		}
	});

	if (error) {
		// logErrorToSanity(err.message, err.stack);
		return;
	}
	if (data) session.set(data.tokens);
};

const createAuthorizationHeader = () => {
	let { data, error } = session.get();
	if (error || !data) return null;
	const { sessionToken } = data;

	return `BEARER ${sessionToken}`;
};

const isKyError = (
	err: any
): err is {
	response: KyResponse;
} => !!err?.response?.json;

export const getErrorFromApiErr = async <K extends string | number | symbol>(
	err: any
): Promise<ApiError<K>> => {
	if (isKyError(err)) {
		try {
			const data = (await err.response.json()) as ApiError<K>;
			if (data) return data;
		} catch (_err: any) {}
	}

	return {
		error: err.message ?? err,
		errorCode: GenericErrorCode.KyError
	} as ApiError<K>;
};

const injectJwt = async (req: Request) => {
	const { data, error } = session.get();
	if (error || !data) return;

	const { sessionToken, refreshToken } = data;

	if (req.url?.includes("/auth")) return;

	const expired = await checkTokenHasExpired(sessionToken);

	if (expired) await refreshSession(refreshToken);

	const authorizationHeader = createAuthorizationHeader();

	if (authorizationHeader) req.headers.set("Authorization", authorizationHeader);
};

export const api = ky.create({
	prefixUrl: config.apiUrl,
	hooks: {
		beforeRequest: [injectJwt],
		beforeError: [
			(error) => {
				return error;
			}
		],
		beforeRetry: [(options) => {}]
	}
});

export interface ApiCallRes<R> {
	error: ApiError<keyof R> | undefined;
	data: R | undefined;
}

export const apiCall = async <R>(func: () => Promise<R>) => {
	const res: ApiCallRes<R> = {
		data: undefined,
		error: undefined
	};
	try {
		const data = await func();
		res.data = data;
	} catch (err: any) {
		const error = await getErrorFromApiErr(err);
		res.error = error;
	}

	return res;
};
