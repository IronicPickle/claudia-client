<script lang="ts">
	import colors from "$constants/colors";
	import type { Color } from "$ts/generic";
	import { classNames, styles } from "$utils/generic";
	import { createEventDispatcher } from "svelte";
	import { linear } from "svelte/easing";
	import { fly } from "svelte/transition";

	const dispatch = createEventDispatcher();

	const handleClose = () => dispatch("close");

	let clazz: string | undefined = undefined;
	let id: string | undefined = undefined;
	let style: string | undefined = undefined;
	export { clazz as class, id, style };

	let _in: boolean = false;
	export { _in as in };

	export let side: "left" | "right" | "bottom" | "top" = "left";
	export let distance: string = "2%";
	export let size: string = "300px";
	export let color: Color = "black-2";
	export let borderColor: Color = "black-3";

	const actualDistance = ["left", "top"].includes(side) ? `-${distance}` : distance;
	const x = ["left", "right"].includes(side) ? actualDistance : undefined;
	const y = ["top", "bottom"].includes(side) ? actualDistance : undefined;
</script>

{#if _in}
	<div
		transition:fly={{
			duration: 300,
			easing: linear,
			x,
			y,
			opacity: 0
		}}
		class={classNames("drawer-wrapper", side, clazz)}
		{id}
		style={`${styles({
			"--color": colors[color],
			"--border-color": colors[borderColor],
			"--size": size
		})}${style}`}
		on:click={handleClose}
		on:keydown={handleClose}
		role="button"
		tabindex={0}
	>
		<div class="drawer" on:click={(event) => event.stopPropagation()} role="none">
			<slot />
		</div>
	</div>
{/if}

<style lang="scss">
	.drawer-wrapper {
		$color: var(--color);
		$borderColor: var(--border-color);
		$size: var(--size);

		position: fixed;
		display: flex;

		background-color: rgba($black, 0.6);

		z-index: $z-drawer;

		& > * {
			pointer-events: all;
		}

		&.left {
			width: 300%;

			top: 0;
			bottom: 0;
			left: 0;

			.drawer {
				width: $size;

				top: 0;
				bottom: 0;
				left: 0;

				border-right-style: solid;
			}
		}

		&.right {
			width: 300%;

			top: 0;
			bottom: 0;
			right: 0;

			.drawer {
				width: $size;

				top: 0;
				bottom: 0;
				right: 0;

				border-left-style: solid;
			}
		}

		&.bottom {
			height: 300%;
			left: 0;
			right: 0;
			bottom: 0;

			.drawer {
				height: $size;

				left: 0;
				right: 0;
				bottom: 0;

				border-top-style: solid;
			}
		}

		&.top {
			height: 300%;
			left: 0;
			right: 0;
			top: 0;

			.drawer {
				height: $size;

				left: 0;
				right: 0;
				top: 0;

				border-bottom-style: solid;
			}
		}

		.drawer {
			position: absolute;

			background-color: $color;
			border-color: $borderColor;

			border-style: none;
			border-width: 2px;

			box-sizing: border-box;
		}
	}
</style>
