import type { LayoutLoad } from "./auth/$types";
import { pushError } from "$utils/generic";
import { isResError } from "$shared/lib/utils/api";
import type { ApiTokens } from "$shared/lib/ts/api/generic";
import StorageItem from "$objects/StorageItem";
import getDiscordGuilds from "$stores/getDiscordGuilds";
import getMe from "$stores/getMe";
import getBreakpoints from "$stores/getBreakpoints";

export const ssr = false;

export const load: LayoutLoad = async () => {
	const tokens = new StorageItem<ApiTokens>("session");

	const me = getMe();
	const discordGuilds = getDiscordGuilds();
	const breakpoints = getBreakpoints();

	const fetchStores = async () => {
		const meRes = await me.send({});
		if (isResError(meRes)) return pushError(meRes.error);

		const discordGuildsRes = await discordGuilds.send({
			params: {
				userId: meRes.data.discordUser.userId
			}
		});
		if (isResError(discordGuildsRes)) return pushError(discordGuildsRes.error);
	};

	if (tokens.get().data) fetchStores();

	const handleResize = () => {
		const viewWidth = document.body.clientWidth;
		const newBreakpoints = {
			xs: viewWidth <= 350,
			sm: viewWidth <= 600,
			md: viewWidth <= 960,
			lg: viewWidth <= 1280,
			xl: viewWidth <= 1780,
			sl: viewWidth <= 2560,
			ul: viewWidth <= 3840
		};
		breakpoints.set(newBreakpoints);
	};

	handleResize();
	window.addEventListener("resize", handleResize);
};
