<script lang="ts">
	import Header from "$components/layout/Header.svelte";
	import type { ApiTokens } from "$shared/lib/ts/api/generic";
	import storageItem from "$utils/storageItem";
	import NavDrawer from "../lib/components/layout/NavDrawer.svelte";
	import { page } from "$app/stores";

	import dayjs from "dayjs";
	import advancedFormat from "dayjs/plugin/advancedFormat";
	import customParseFormat from "dayjs/plugin/customParseFormat";

	dayjs.extend(advancedFormat);
	dayjs.extend(customParseFormat);

	const { item } = storageItem<ApiTokens>("session");

	$: {
		if (!$item.data && !$page.url.pathname.startsWith("/auth"))
			window.location.replace("/auth/login");
	}
</script>

<div class="root">
	<div class="viewport-wrapper">
		<NavDrawer />
		<div class="page-wrapper">
			<Header />
			<slot />
		</div>
	</div>
</div>

<style lang="scss">
	@import "$lib/styles/generic.scss";

	.root {
		display: flex;
		flex-direction: column;

		min-height: 100vh;

		.viewport-wrapper {
			display: flex;
			flex-direction: row;

			min-height: inherit;

			.page-wrapper {
				flex-grow: 1;

				display: flex;
				flex-direction: column;

				min-height: inherit;
				min-width: 0;
			}
		}
	}
</style>
