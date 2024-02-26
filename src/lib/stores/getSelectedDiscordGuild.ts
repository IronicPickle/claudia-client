import storageItem from "$utils/storageItem";
import { get, writable } from "svelte/store";
import getDiscordGuilds from "./getDiscordGuilds";
import type { DbDiscordGuild, WithDbId } from "$shared/lib/api/server/internal/discord/dbSpec";

const discordGuilds = getDiscordGuilds();

export default () => {
	const { item, set, remove } = storageItem<string>("selected-discord-guild-id");

	const selectedDiscordGuild = writable<WithDbId<DbDiscordGuild> | null>(null);

	discordGuilds.store.subscribe(({ data }) => {
		const guild = data?.discordGuilds.find(({ _id }) => _id === get(item).data);
		selectedDiscordGuild.set(guild ?? null);
	});

	item.subscribe(({ data }) => {
		const guild = get(discordGuilds.store).data?.discordGuilds.find(({ _id }) => _id === data);
		selectedDiscordGuild.set(guild ?? null);
	});

	return { store: selectedDiscordGuild, set, remove };
};
