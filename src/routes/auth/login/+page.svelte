<script lang="ts">
	import Button from "$components/common/generic/Button.svelte";
	import { generateDiscordAuthUrl } from "$utils/generic";
	import FaDiscord from "~icons/fa6-brands/discord";

	const authUrl = generateDiscordAuthUrl();
</script>

<main>
	<div class="box">
		<h1>Login</h1>
		<h2>Connect your Discord account to access the Claudia</h2>

		<FaDiscord class="icon" />

		<Button fontSize="24px">
			<FaDiscord slot="end" />
			Connect Discord
		</Button>
	</div>
</main>

<style lang="scss">
	main {
		display: flex;
		align-items: center;
		justify-content: center;

		min-height: inherit;

		.box {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 24px;

			max-width: 340px;

			padding: 64px;

			background-color: $black-2;
			border-radius: 10px;
			border: 2px solid $black-3;

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
				@include size(200px);
				color: $blue-5;
			}
		}
	}
</style>
