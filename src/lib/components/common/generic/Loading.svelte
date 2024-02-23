<script lang="ts">
	import type { Color } from "$ts/generic";
	import { SpinLine } from "svelte-loading-spinners";

	type Variant = "spinline";

	export let variant: Variant = "spinline";
	export let color: Color = "white";
</script>

<div class="loading">
	{#if variant === "spinline"}
		<SpinLine {color} />
	{/if}
</div>

<style lang="scss">
	.loading {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;

		inset: 0;
	}
</style>
