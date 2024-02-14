<script lang="ts">
	import me from "$stores/me";

	import { generateDiscordAvatarUrl } from "$utils/generic";
	import { derived } from "svelte/store";
	import Avatar from "$components/common/generic/Avatar.svelte";

	import MdiCat from "~icons/mdi/cat";

	const { state: meState } = me;

	let avatarUrl = derived(meState, ({ data }) =>
		data?.discordUser.avatar
			? generateDiscordAvatarUrl(data.discordUser.userId, data.discordUser.avatar)
			: undefined
	);
</script>

<header>
	<div class="wrapper">
		<h1><MdiCat /> Claudia</h1>

		<div class="user-details">
			<div class="text-wrapper">
				<h2>{$meState.data?.discordUser.username}</h2>
			</div>
			<Avatar src={$avatarUrl} alt="Discord avatar" size={64} />
		</div>
	</div>
</header>

<style lang="scss">
	header {
		padding: 16px 32px;

		background-color: $black-3;

		.wrapper {
			display: flex;
			align-items: center;
			justify-content: space-between;

			width: 100%;

			h1 {
				display: inline-flex;
				align-items: center;
				gap: 8px;

				@include quantico(400);
				font-size: 32px;
				color: $white;

				:global(svg) {
					@include size(48px);
				}
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
