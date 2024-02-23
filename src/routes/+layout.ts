import type { LayoutLoad } from "./auth/$types";
import { pushError } from "$utils/generic";
import { isResError } from "$shared/lib/utils/api";
import type { ApiTokens } from "$shared/lib/ts/api/generic";
import StorageItem from "$objects/StorageItem";
import getDiscordGuilds from "$stores/getDiscordGuilds";
import getMe from "$stores/getMe";

export const ssr = false;

export const load: LayoutLoad = async () => {
	const tokens = new StorageItem<ApiTokens>("session");

	const me = getMe();
	const discordGuilds = getDiscordGuilds();

	const fetchStores = async () => {
		const meRes = await me.send({});
		if (isResError(meRes)) return pushError(meRes.error);

		const discordGuildsRes = await discordGuilds.send({
			params: {
				userId: meRes.data.user._id
			}
		});
		if (isResError(discordGuildsRes)) return pushError(discordGuildsRes.error);
	};

	if (tokens.get().data) fetchStores();
};
