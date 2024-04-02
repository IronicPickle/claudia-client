<script lang="ts">
	import Input from "$components/common/form/Input.svelte";
	import Button from "$components/common/generic/Button.svelte";
	import Pane from "$components/common/generic/Pane.svelte";

	import IoPencil from "~icons/ion/pencil";
</script>

<main>
	<Pane>
		<div class="pane-inner">
			<Button variant="contained" color="blue-1" justifyContent="center">Contained</Button>
			<Button variant="outlined" color="blue-1" justifyContent="center">Outlined</Button>
			<Button variant="flat" color="blue-1" justifyContent="center">Blue Flat</Button>
			<Button variant="flat" color="red" justifyContent="space-between">
				<IoPencil slot="start" />
				<IoPencil slot="end" />Red Flat</Button
			>

			<Input variant="contained" color="red" type="password">
				<IoPencil slot="end" />
			</Input>
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
