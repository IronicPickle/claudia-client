<script lang="ts">
	import { discordAuthCallbackUrl } from "$utils/generic";
	import Endpoints from "$api/Endpoints";
	import { onMount } from "svelte";
	import storageItem from "$utils/storageItem";
	import type { ApiTokens } from "$shared/lib/ts/api/generic";

	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get("code");
	const state = urlParams.get("state");

	const { set: setSessionItem } = storageItem<ApiTokens>("session");

	onMount(async () => {
		if (code && state) {
			const { data, error } = await Endpoints.auth.login.call({
				body: {
					code,
					state,
					redirectUri: discordAuthCallbackUrl
				}
			});

			if (data && !error) {
				setSessionItem(data.tokens);
			}
		}
	});
</script>

<main>Test</main>

<style lang="scss">
</style>
