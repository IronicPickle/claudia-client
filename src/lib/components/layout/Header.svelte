<script lang="ts">
	import getMe from "$stores/getMe";

	import { generateDiscordAvatarUrl } from "$utils/generic";
	import { derived } from "svelte/store";
	import Avatar from "$components/common/generic/Avatar.svelte";
	import Button from "$components/common/generic/Button.svelte";
	import getNavDrawerIn from "$stores/getNavDrawerIn";
	import IconButton from "$components/common/generic/IconButton.svelte";

	import Logo from "$components/media/Logo.svelte";
	import IonMenu from "~icons/ion/menu";

	const { store: meStore } = getMe();
	const { set: setNavDrawerIn } = getNavDrawerIn();

	let avatarUrl = derived(meStore, ({ data }) =>
		data?.discordUser.avatar
			? generateDiscordAvatarUrl(data.discordUser.userId, data.discordUser.avatar)
			: undefined
	);
</script>

<header>
	<div class="wrapper">
		<div class="controls">
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
		</div>

		<div class="user-details">
			<div class="text-wrapper">
				<h2>{$meStore.data?.discordUser.username}</h2>
			</div>
			<Avatar src={$avatarUrl} alt="Discord avatar" size={48} />
		</div>
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
