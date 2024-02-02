<script lang="ts">
	import { discordAuthCallbackUrl } from "$lib/utils/generic";
	import Endpoints from "../../../api/Endpoints";

	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get("code");
	const state = urlParams.get("state");

	$: {
		if (code && state) {
			Endpoints.auth.login.call({
				body: {
					code,
					state,
					redirectUri: discordAuthCallbackUrl
				}
			});
		}
	}
</script>

<main>Test</main>

<style lang="scss">
</style>
