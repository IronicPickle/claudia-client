import type { LayoutLoad } from "./auth/$types";
import { pushError } from "$utils/generic";
import { isResError } from "$shared/lib/utils/api";
import me from "$stores/me";
import type { ApiTokens } from "$shared/lib/ts/api/generic";
import StorageItem from "$objects/StorageItem";

export const ssr = false;

export const load: LayoutLoad = async () => {
	const tokens = new StorageItem<ApiTokens>("session");

	if (tokens.get().data) {
		me.send({}).then((res) => {
			if (isResError(res)) pushError(res.error);
		});
	}
};
