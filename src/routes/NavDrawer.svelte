<script lang="ts">
	import Drawer from "$components/common/generic/Drawer.svelte";
	import getNavDrawerIn from "$stores/getNavDrawerIn";
	import NavDrawerContent from "./NavDrawerContent.svelte";

	const { item: navDrawerInItem, set: setNavDrawerIn } = getNavDrawerIn();
</script>

<Drawer in={!!$navDrawerInItem.data} on:close={() => setNavDrawerIn(false)}>
	<NavDrawerContent />
</Drawer>
