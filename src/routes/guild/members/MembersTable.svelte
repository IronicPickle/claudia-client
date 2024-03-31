<script lang="ts">
	import Endpoints from "$api/Endpoints";
	import Avatar from "$components/common/generic/Avatar.svelte";
	import Table from "$components/common/table/Table.svelte";
	import getMe from "$stores/getMe";
	import getSelectedDiscordGuild from "$stores/getSelectedDiscordGuild";
	import { generateDiscordAvatarUrl } from "$utils/generic";
	import tableSort from "$utils/tableSort";
	import dayjs from "dayjs";
	import { derived, readable } from "svelte/store";
	import MembersTableDropdownContent from "./MembersTableDropdownContent.svelte";

	const { store: guildMembersStore, ...guildMembers } =
		Endpoints.users.guilds.members.getAll.manager(undefined);

	const { store: selectedDiscordGuild } = getSelectedDiscordGuild();

	const { store: meStore } = getMe();

	$: {
		if ($meStore.data && $selectedDiscordGuild) {
			guildMembers.send({
				params: {
					userId: $meStore.data.discordUser.userId,
					guildId: $selectedDiscordGuild.guildId
				}
			});
		}
	}

	const { columns, sortedRows, totalRows, handleSort } = tableSort(
		readable([
			{
				key: "avatar",
				label: ""
			},
			{
				key: "username",
				label: "Username",
				sortable: true,
				searchable: true
			},
			{
				key: "nick",
				label: "Nickname",
				sortable: true,
				searchable: true
			},
			{
				key: "joinedAt",
				label: "Joined",
				sortable: true,
				searchable: true,
				dateFormat: "HH:mm Do MMM YYYY"
			}
		] as const),
		derived(guildMembersStore, ({ data }) => {
			if (!data?.guildMembers) return [];
			return data.guildMembers.map((guildMember) => ({
				key: guildMember._id,
				dropdownContent: {
					Component: MembersTableDropdownContent,
					props: {
						guildMember: guildMember
					}
				},
				cells: {
					avatar: {
						Component: Avatar,
						props: {
							src: guildMember.user?.avatar
								? generateDiscordAvatarUrl(guildMember.user?.userId, guildMember.user?.avatar)
								: "",
							alt: guildMember.user?.username
						}
					},
					nick: guildMember.nick ?? "",
					username: guildMember.user?.username,
					joinedAt: dayjs(guildMember.joinedAt).format("HH:mm Do MMM YYYY")
				}
			}));
		})
	);
</script>

<Table
	columns={$columns}
	rows={$sortedRows}
	isLoading={$guildMembersStore.isLoading}
	error={$guildMembersStore.error?.error}
	on:sort={({ detail: { sortDirection, sortKey } }) => handleSort(sortKey, sortDirection)}
/>

<style lang="scss"></style>
