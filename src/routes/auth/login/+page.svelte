<script lang="ts">
	import Button from "$lib/components/common/generic/Button.svelte";
	import { generateDiscordAuthUrl } from "$utils/generic";

	const authUrl = generateDiscordAuthUrl();
</script>

<main>
	<Button color="white" textColor="black" href={authUrl} openInNewTab>
		<!-- <div slot="start-icon" let:class={className} class={className}></div> -->
		Login
	</Button>
</main>

<style lang="scss">
	main {
		display: flex;
		align-items: center;
		justify-content: center;

		min-height: inherit;
	}
</style>
