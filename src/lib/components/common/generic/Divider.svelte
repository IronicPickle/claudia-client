<script lang="ts">
	import colors from "$constants/colors";
	import type { Color, Orientation } from "$ts/generic";
	import { classNames, styles } from "$utils/generic";

	let clazz: string | undefined = undefined;
	let id: string | undefined = undefined;
	let style: string | undefined = undefined;
	export { clazz as class, id, style };

	type Variant = "solid" | "dotted" | "dashed";

	export let color: Color = "black-4";
	export let variant: Variant = "solid";
	export let orientation: Orientation = "horizontal";
	export let opacity = 1;
	export let width = "1px";
</script>

<div
	class={classNames("divider", orientation, variant, clazz)}
	{id}
	style={`${styles({
		"--opacity": opacity,
		"--width": width,
		"--color": colors[color]
	})}${style}`}
/>

<style lang="scss">
	$opacity: var(--opacity);
	$width: var(--width);
	$color: var(--color);

	.divider {
		opacity: $opacity;

		&.horizontal {
			width: 100%;
			height: 0;
			min-height: 0;
			max-height: 0;
			border-width: $width;

			&.solid {
				border-top-style: solid;
			}

			&.dotted {
				border-top-style: dotted;
			}

			&.dashed {
				border-top-style: dashed;
			}
		}

		border-color: $color;

		&.vertical {
			height: 100%;
			width: 0;
			min-width: 0;
			max-width: 0;
			border-width: $width;

			&.solid {
				border-left-style: solid;
			}

			&.dotted {
				border-left-style: dotted;
			}

			&.dashed {
				border-left-style: dashed;
			}
		}
	}
</style>
