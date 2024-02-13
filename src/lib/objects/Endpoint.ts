import Validator from "$shared/lib/objects/Validator.ts";
import type {
	ApiCallRes,
	RequestDetails,
	RequestInputs,
	RequestResponse,
	ValidatorInputs
} from "$shared/lib/ts/api/generic.ts";
import { apiCall } from "$api/api.ts";
import type { RequestManagerReturn } from "$utils/api/requestManager";
import requestManager from "$utils/api/requestManager";

type InputCall<RD extends RequestDetails> = (
	requestInputs: RequestInputs<RD>
) => Promise<RequestResponse<RD>>;
type Call<RD extends RequestDetails> = (
	requestInputs: RequestInputs<RD>
) => Promise<ApiCallRes<RD>>;
type Manager<RD extends RequestDetails> = <F>(defaultValue: F) => RequestManagerReturn<RD, F>;
type Validators<RD extends RequestDetails> = (
	inputs: ValidatorInputs<RD>
) => Record<keyof ValidatorInputs<RD>, Validator>;

export default class Endpoint<RD extends RequestDetails> {
	public call: Call<RD>;
	public manager: Manager<RD>;
	public getValidators?: Validators<RD>;

	constructor(call: InputCall<RD>, getValidators?: Validators<RD>) {
		this.call = async (requestInputs: RequestInputs<RD>) =>
			apiCall<RD>(async () => call(requestInputs));
		this.getValidators = getValidators;

		this.manager = <F>(defaultValue: F) => requestManager(this.call, defaultValue);
	}
}
