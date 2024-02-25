<script lang="ts">
	import Drawer from "$components/common/generic/Drawer.svelte";
	import getNavDrawerExpanded from "$stores/getNavDrawerExpanded";
	import getNavDrawerIn from "$stores/getNavDrawerIn";
	import { classNames } from "$utils/generic";
	import NavDrawerContent from "./NavContent.svelte";

	const { item: navDrawerInItem, set: setNavDrawerIn } = getNavDrawerIn();
	const { item: navDrawerExpandedItem, set: setNavDrawerExpanded } = getNavDrawerExpanded();
</script>

<div class={classNames("nav-drawer", $navDrawerExpandedItem && "expanded")}>
	<NavDrawerContent
		expanded={!!$navDrawerExpandedItem.data}
		on:expand={() => setNavDrawerExpanded(true)}
		on:collapse={() => setNavDrawerExpanded(false)}
	/>
</div>

<!-- <Drawer in={!!$navDrawerInItem.data} on:close={() => setNavDrawerIn(false)}>
	<NavDrawerContent />
</Drawer> -->

<style lang="scss">
	.nav-drawer {
	}
</style>
