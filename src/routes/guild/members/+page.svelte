<script lang="ts">
	import Pane from "$components/common/generic/Pane.svelte";
	import MembersTable from "./MembersTable.svelte";
</script>

<main>
	<Pane>
		<div class="pane-inner">
			<MembersTable />
		</div>
	</Pane>
</main>

<style lang="scss">
	main {
		.pane-inner {
			display: flex;
			flex-direction: column;
		}
	}
</style>
