import type { ApiError } from "$shared/lib/ts/api/generic";
import { writable } from "svelte/store";

export type CurrentReqState<D, R> = {
	isLoading: boolean;
	data: R;
	error?: ApiError<keyof D>;
};

const requestState = <D, R>(defaultData: R) => {
	const createReqState = (
		isLoading: boolean,
		data: R,
		error?: ApiError<keyof D>
	): CurrentReqState<D, R> => ({
		isLoading,
		data,
		error
	});

	const reqState = writable<CurrentReqState<D, R>>(createReqState(false, defaultData));

	const setIdle = () => {
		const newReqState = createReqState(false, defaultData);
		reqState.set(newReqState);
		return newReqState;
	};
	const setLoading = () => {
		const newReqState = createReqState(true, defaultData);
		reqState.set(newReqState);
		return newReqState;
	};
	const setSuccess = (data: R) => {
		const newReqState = createReqState(false, data);
		reqState.set(newReqState);
		return newReqState;
	};
	const setError = (error: ApiError<keyof D>) => {
		const newReqState = createReqState(false, defaultData, error);
		reqState.set(newReqState);
		return newReqState;
	};

	return { reqState, setIdle, setLoading, setSuccess, setError };
};

export default requestState;
