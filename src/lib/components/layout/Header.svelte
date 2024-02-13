<script lang="ts">
	import { generateDiscordAvatarUrl } from "$utils/generic";

	import me from "$stores/me";
	import { derived } from "svelte/store";
	import Avatar from "$components/common/generic/Avatar.svelte";

	const { state: meState } = me;

	let avatarUrl = derived(meState, ({ data }) =>
		data?.discordUser.avatar
			? generateDiscordAvatarUrl(data.discordUser.userId, data.discordUser.avatar)
			: undefined
	);
</script>

<header>
	<div class="wrapper">
		<h1>Claudia</h1>

		<div class="user-details">
			<div class="text-wrapper">
				<h1>{$meState.data?.discordUser.username}</h1>
			</div>
			<Avatar src={$avatarUrl} alt="Discord avatar" size={64} />
		</div>
	</div>
</header>

<style lang="scss">
	header {
		padding: 16px 32px;

		background-color: $white;

		.wrapper {
			display: flex;
			align-items: center;
			justify-content: space-between;

			width: 100%;

			.user-details {
				display: flex;
				align-items: center;
				gap: 16px;

				.text-wrapper {
					h1 {
						@include inter(500);
						font-size: 16px;
					}
				}
			}
		}
	}
</style>
