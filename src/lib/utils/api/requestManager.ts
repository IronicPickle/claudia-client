import type Endpoint from "$objects/Endpoint";
import type {
	ApiCallRes,
	RequestDetails,
	RequestInputs,
	RequestResponse,
	ValidatorInputs
} from "$shared/lib/ts/api/generic";
import { derived, writable } from "svelte/store";
import requestState from "./requestState";
import { isResError } from "$shared/lib/utils/api";

export type RequestManagerReturn<RD extends RequestDetails, F = undefined> = ReturnType<
	typeof requestManager<RequestInputs<RD>, RD["res"], F>
>;

export type ExtractRequestDetails<E> = E extends Endpoint<infer RD> ? RD : never;

export type ExtractRequestManagerReturn<E> =
	E extends Endpoint<infer RD> ? RequestManagerReturn<RD> : never;

export type ExtractManagerRetrun<E extends Endpoint<RD>, RD extends RequestDetails> = ReturnType<
	E["manager"]
>;

const requestManager = <
	D extends RequestInputs<RequestDetails>,
	R extends RequestResponse<RequestDetails>,
	F = undefined,
	RD extends RequestDetails = D & { res: R }
>(
	func: (reqData: D) => Promise<ApiCallRes<RD>>,
	defaultValue: F
) => {
	const { reqState, setIdle, setLoading, setSuccess, setError } = requestState<
		ValidatorInputs<RD>,
		RequestResponse<RD> | F
	>(defaultValue);

	const resPromise = writable<Promise<ApiCallRes<RD>>>();

	const send = async (reqData: D): Promise<ApiCallRes<RD>> => {
		const promise = func(reqData);
		resPromise.set(promise);

		const res = await promise;

		setLoading();
		if (isResError(res)) setError(res.error);
		else setSuccess(res.data);

		return res;
	};

	const state = derived([reqState, resPromise], ([reqState, resPromise]) => ({
		promise: resPromise,
		isLoading: reqState.isLoading,
		error: reqState.error,
		data: reqState.data
	}));

	return {
		state,
		send,
		setters: {
			setIdle,
			setLoading,
			setSuccess,
			setError
		}
	};
};

export default requestManager;
