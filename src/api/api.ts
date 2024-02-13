import config from "$config/config.ts";
import type {
	ApiCallRes,
	ApiError,
	ApiTokens,
	RequestDetails,
	RequestResponse
} from "$shared/lib/ts/api/generic.ts";
import { GenericErrorCode } from "$shared/lib/enums/api.ts";
import ky, { type KyResponse } from "ky";
import StorageItem from "$objects/StorageItem";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { devLog, pushError } from "$utils/generic";
import Endpoints from "./Endpoints";
import { isResError } from "$shared/lib/utils/api";

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
		pushError(err);
		return true;
	}
};

const refreshSession = async (refreshToken: string) => {
	const res = await Endpoints.auth.refresh.call({
		body: {
			refreshToken
		}
	});

	if (isResError(res)) {
		pushError(res.error.error);
	} else {
		session.set(res.data.tokens);
	}
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

export const apiCall = async <RD extends RequestDetails>(
	func: () => Promise<RequestResponse<RD>>
): Promise<ApiCallRes<RD>> => {
	try {
		const data = await func();
		return { data };
	} catch (err: any) {
		const error = await getErrorFromApiErr(err);
		return { error };
	}
};
