<script lang="ts">
	import { discordAuthCallbackUrl, pushError } from "$utils/generic";
	import Endpoints from "$api/Endpoints";
	import { onMount } from "svelte";
	import storageItem from "$utils/storageItem";
	import type { ApiTokens } from "$shared/lib/ts/api/generic";
	import { isResError } from "$shared/lib/utils/api";
	import { goto } from "$app/navigation";

	import me from "$stores/me";

	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get("code");
	const state = urlParams.get("state");

	const { set: setSessionItem } = storageItem<ApiTokens>("session");

	onMount(async () => {
		if (code && state) {
			const res = await Endpoints.auth.login.call({
				body: {
					code,
					state,
					redirectUri: discordAuthCallbackUrl
				}
			});

			if (isResError(res)) {
				pushError(res.error.error);
			} else {
				setSessionItem(res.data.tokens);

				me.setters.setSuccess({
					user: res.data.user,
					discordUser: res.data.discordUser
				});

				goto("/");
			}
		}
	});
</script>

<main>
	<h1>We're logging you in...</h1>
</main>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		min-height: inherit;

		h1 {
			@include inter(700);
			font-size: 32px;
			color: $white;
		}
	}
</style>
