<script lang="ts">
	import getMe from "$stores/getMe";

	import { generateDiscordAvatarUrl } from "$utils/generic";
	import { derived } from "svelte/store";
	import Avatar from "$components/common/generic/Avatar.svelte";
	import getNavDrawerIn from "$stores/getNavDrawerIn";
	import IconButton from "$components/common/generic/IconButton.svelte";

	import IonMenu from "~icons/ion/menu";
	import Select from "$components/common/form/Select.svelte";
	import getSelectedDiscordGuild from "$stores/getSelectedDiscordGuild";
	import getDiscordGuilds from "$stores/getDiscordGuilds";
	import getBreakpoints from "$stores/getBreakpoints";

	const breakpoints = getBreakpoints();

	const { store: discordGuildsStore } = getDiscordGuilds();

	const { store: meStore } = getMe();
	const { set: setNavDrawerIn } = getNavDrawerIn();
	const { store: selectedDiscordGuildStore, set: setSelectedDiscordGuild } =
		getSelectedDiscordGuild();

	let avatarUrl = derived(meStore, ({ data }) =>
		data?.discordUser.avatar
			? generateDiscordAvatarUrl(data.discordUser.userId, data.discordUser.avatar)
			: undefined
	);
</script>

<header>
	<div class="wrapper">
		<div class="controls">
			{#if $breakpoints.md}
				<IconButton
					variant="flat"
					fontSize="18px"
					color="white"
					iconColor="white"
					rounded
					on:click={() => setNavDrawerIn(true)}
				>
					<IonMenu />
				</IconButton>
			{/if}

			<Select
				variant="outlined"
				fontSize="16px"
				color="blue-2"
				optionsColor="blue-2"
				optionsTextColor="white"
				value={$selectedDiscordGuildStore?._id}
				on:change={({ detail: { value } }) => setSelectedDiscordGuild(value)}
				useEmptyOption
				emptyOptionProps={{
					label: "Select a server"
				}}
				options={$discordGuildsStore.data?.discordGuilds.map((guild) => ({
					value: guild._id,
					label: guild.name
				})) ?? []}
				isLoading={$discordGuildsStore.isLoading}
			/>
		</div>

		{#if !$breakpoints.md}
			<div class="user-details">
				<div class="text-wrapper">
					<h2>{$meStore.data?.discordUser.username}</h2>
				</div>
				<Avatar src={$avatarUrl} alt="Discord avatar" size={48} />
			</div>
		{/if}
	</div>
</header>

<style lang="scss">
	header {
		height: 80px;

		padding: 12px 16px;

		background-color: $black-3;

		box-sizing: border-box;

		.wrapper {
			display: flex;
			align-items: center;
			justify-content: space-between;

			width: 100%;
			height: 100%;

			.controls {
				display: flex;
				align-items: center;
				gap: 16px;
			}

			.user-details {
				display: flex;
				align-items: center;
				gap: 16px;

				.text-wrapper {
					h2 {
						@include inter(500);
						font-size: 16px;
						color: $white;
					}
				}
			}
		}
	}
</style>
