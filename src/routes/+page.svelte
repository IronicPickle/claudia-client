<script lang="ts">
	import Button from "$components/common/generic/Button.svelte";
	import Pane from "$components/common/generic/Pane.svelte";
</script>

<main>
	<Pane>
		<div class="pane-inner">
			<Button fontSize="20px" variant="contained" color="blue-1" justifyContent="center"
				>Contained</Button
			>
			<Button fontSize="20px" variant="outlined" color="blue-1" justifyContent="center"
				>Outlined</Button
			>
			<Button fontSize="20px" variant="flat" color="blue-1" justifyContent="center"
				>Blue Flat</Button
			>
			<Button fontSize="20px" variant="flat" color="red" justifyContent="center">Red Flat</Button>
		</div>
	</Pane>
</main>

<style lang="scss">
	main {
		display: flex;
		align-items: center;
		justify-content: center;

		min-height: inherit;

		.pane-inner {
			display: flex;
			flex-direction: column;
			gap: 24px;

			width: 280px;
			min-height: 300px;
		}
	}
</style>
