<script lang="ts">
	import Drawer from "$components/common/generic/Drawer.svelte";
	import getBreakpoints from "$stores/getBreakpoints";
	import getNavDrawerExpanded from "$stores/getNavDrawerExpanded";
	import getNavDrawerIn from "$stores/getNavDrawerIn";
	import { classNames } from "$utils/generic";
	import NavDrawerContent from "./NavContent.svelte";

	const breakpoints = getBreakpoints();

	const { item: navDrawerInItem, set: setNavDrawerIn } = getNavDrawerIn();
	const { item: navDrawerExpandedItem, set: setNavDrawerExpanded } = getNavDrawerExpanded();
</script>

{#if $breakpoints.md}
	<Drawer in={!!$navDrawerInItem.data} on:close={() => setNavDrawerIn(false)} size="280px">
		<NavDrawerContent />
	</Drawer>
{:else}
	<div class={classNames("nav-drawer", $navDrawerExpandedItem && "expanded")}>
		<NavDrawerContent
			expanded={!!$navDrawerExpandedItem.data}
			on:expand={() => setNavDrawerExpanded(true)}
			on:collapse={() => setNavDrawerExpanded(false)}
		/>
	</div>
{/if}

<style lang="scss">
	.nav-drawer {
	}
</style>
