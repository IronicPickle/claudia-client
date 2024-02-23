<script lang="ts">
	import Button from "$components/common/generic/Button.svelte";
	import Pane from "$components/common/generic/Pane.svelte";
	import { generateDiscordAuthUrl } from "$utils/generic";
	import FaDiscord from "~icons/fa6-brands/discord";
	import IoArrowForward from "~icons/ion/arrow-forward";

	const authUrl = generateDiscordAuthUrl();
</script>

<main>
	<Pane>
		<div class="pane-inner">
			<h1>Login</h1>
			<h2>Connect your Discord account to access the Claudia</h2>

			<FaDiscord class="icon" />

			<Button fontSize="24px" color="blue-2" href={authUrl}>
				<IoArrowForward slot="end" />
				Connect
			</Button>
		</div>
	</Pane>
</main>

<style lang="scss">
	main {
		display: flex;
		align-items: center;
		justify-content: center;

		min-height: inherit;

		.pane-inner {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 24px;

			max-width: 340px;

			h1 {
				@include quantico(700);
				font-size: 64px;
				color: $white;
				text-align: center;
			}

			h2 {
				@include inter(500);
				font-size: 18px;
				color: $gray-3;
				text-align: center;
			}

			:global(.icon) {
				@include size(128px);

				margin: 32px 0;

				color: $blue-5;
			}
		}
	}
</style>
