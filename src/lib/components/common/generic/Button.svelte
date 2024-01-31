<script lang="ts">
	import type { Color, JustifyContent } from "$lib/ts/generic";
	import colors from "$lib/constants/colors";
	import { alphaColor, classNames, offsetColor, styles } from "$lib/utils/generic";
	import { openInNewTabProps } from "$lib/constants/generic";

	export let variant: "contained" | "outlined" | "flat" = "contained";
	export let size: "extra-small" | "small" | "medium" | "large" | "extra-large" = "medium";

	export let color: Color = "black";
	export let textColor: Color = "white";
	export let iconColor: Color = textColor;

	export let justifyContent: JustifyContent = "space-between";
	export let wrap: boolean = false;

	export let rounded: boolean = false;
	export let disabled: boolean = false;
	export let readOnly: boolean = false;
	export let disableHover: boolean = false;
	export let isLoading: boolean = false;
	export let active: boolean = false;

	export let href: string | undefined = undefined;
	export let openInNewTab: boolean = false;

	const hasStartIcon = $$slots["start-icon"];
	const hasEndIcon = $$slots["end-icon"];
</script>

{#if !href}
	<button
		style={styles({
			"--color": colors[color],
			"--color-offset-1": offsetColor(color, 0.3),
			"--color-offset-2": offsetColor(color, 0.5),
			"--color-alpha": alphaColor(color, 0.1),

			"--text-color": colors[textColor],
			"--icon-color": colors[iconColor],

			"--justify-content": justifyContent
		})}
		class={classNames(
			"button",
			readOnly && "read-only",
			disableHover && "hover-disabled",
			wrap && "wrap",
			(hasStartIcon || hasEndIcon || justifyContent !== "space-between") && "do-justify",
			isLoading && "is-loading",
			active && "active",

			rounded && "rounded",

			size,
			variant
		)}
		{disabled}
	>
		<div class="button-inner">
			<slot name="start-icon" class="button-icon" />
			<span><slot /></span>
			<slot name="end-icon" class="button-icon" />
		</div>
	</button>
{:else}
	<a
		{...openInNewTab ? openInNewTabProps : {}}
		{href}
		style={styles({
			"--color": colors[color],
			"--color-offset-1": offsetColor(color, 0.3),
			"--color-offset-2": offsetColor(color, 0.5),
			"--color-alpha": alphaColor(color, 0.1),

			"--text-color": colors[textColor],
			"--icon-color": colors[iconColor],

			"--justify-content": justifyContent
		})}
		class={classNames(
			"button",
			readOnly && "read-only",
			disableHover && "hover-disabled",
			wrap && "wrap",
			(hasStartIcon || hasEndIcon || justifyContent !== "space-between") && "do-justify",
			isLoading && "is-loading",
			active && "active",
			disabled && "disabled",

			rounded && "rounded",

			size,
			variant
		)}
	>
		<div class="button-inner">
			<slot name="start-icon" class="button-icon" />
			<span><slot /></span>
			<slot name="end-icon" class="button-icon" />
		</div>
	</a>
{/if}

<style lang="scss">
	.button {
		$color: var(--color);
		$colorOffset1: var(--color-offset-1);
		$colorOffset2: var(--color-offset-2);
		$colorAlpha: var(--color-alpha);

		$textColor: var(--text-color);
		$iconColor: var(--icon-color);

		$justifyContent: var(--justify-content);

		display: inline-block;

		height: fit-content;

		border: 0;
		box-shadow: 0 0 0 1px transparent;

		color: $textColor;

		cursor: pointer;
		box-sizing: border-box;

		transition:
			background-color 300ms ease,
			border-radius 300ms ease,
			color 300ms ease,
			box-shadow 75ms ease-out,
			width 300ms ease;

		&:disabled,
		&.disabled {
			@include disabled;
		}

		&.is-loading {
			pointer-events: none;
		}

		&:not(.wrap) {
			.button-inner {
				& > span {
					@include textOverflow;
				}
			}
		}

		&.do-justify {
			.button-inner {
				justify-content: $justifyContent;
			}
		}

		.button-inner {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;

			& > span {
				display: inline-flex;
				align-items: center;
				gap: 8px;

				// @include inter(600);
			}
		}

		:global(.button-icon) {
			color: $iconColor;
		}

		&.contained {
			background-color: $color;
			box-shadow: 0 0 0 1px $color;

			&:not(.hover-disabled) {
				&:hover {
					background-color: $colorOffset1;
					box-shadow: 0 0 0 1px $colorOffset1;
				}

				&:active,
				&.active {
					background-color: $colorOffset1;
					box-shadow: 0 0 0 2px $colorOffset1;
				}
			}
		}

		&.outlined {
			background-color: transparent;

			box-shadow: 0 0 0 1px $color;

			&:not(.hover-disabled) {
				&:hover {
					background-color: $colorAlpha;
					box-shadow: 0 0 0 1px $colorOffset1;
				}

				&:active,
				&.active {
					background-color: $colorAlpha;
					box-shadow: 0 0 0 2px $colorOffset2;
				}
			}
		}

		&.flat {
			background-color: transparent;

			&:not(.hover-disabled) {
				&:hover {
					background-color: $colorAlpha;
					box-shadow: 0 0 0 1px $colorAlpha;
				}

				&:active,
				&.active {
					background-color: $colorAlpha;
					box-shadow: 0 0 0 2px $colorAlpha;
				}
			}
		}

		@mixin sizing(
			$vertical-padding,
			$horizontal-padding,
			$border-radius,
			$font-size,
			$icon-size,
			$icon-spacing,
			$scale,
			$translate
		) {
			padding: $vertical-padding $horizontal-padding;

			border-radius: $border-radius;

			font-size: $font-size;

			:global(.button-icon) {
				&:not(.not-icon) {
					@include size($icon-size);
				}

				&:first-child:not(.not-icon) {
					margin-right: $icon-spacing;
				}

				&:last-child:not(.not-icon) {
					margin-left: $icon-spacing;
				}
			}

			&.rounded {
				border-radius: calc($border-radius * 4.3);
			}
		}

		&.extra-small {
			@include sizing(
				$vertical-padding: 3px,
				$horizontal-padding: 5.5px,
				$border-radius: 3px,
				$font-size: 10px,
				$icon-size: 12px,
				$icon-spacing: 4px,
				$scale: 0.175,
				$translate: -32px
			);
		}

		&.small {
			@include sizing(
				$vertical-padding: 7px,
				$horizontal-padding: 9px,
				$border-radius: 4px,
				$font-size: 12px,
				$icon-size: 15px,
				$icon-spacing: 6px,
				$scale: 0.225,
				$translate: -30px
			);
		}

		&.medium {
			@include sizing(
				$vertical-padding: 12px,
				$horizontal-padding: 18px,
				$border-radius: 6px,
				$font-size: 14px,
				$icon-size: 17px,
				$icon-spacing: 8px,
				$scale: 0.25,
				$translate: -30px
			);
		}

		&.large {
			@include sizing(
				$vertical-padding: 18px,
				$horizontal-padding: 27px,
				$border-radius: 8px,
				$font-size: 16px,
				$icon-size: 20px,
				$icon-spacing: 10px,
				$scale: 0.3,
				$translate: -28px
			);
		}

		&.extra-large {
			@include sizing(
				$vertical-padding: 28px,
				$horizontal-padding: 42px,
				$border-radius: 10px,
				$font-size: 24px,
				$icon-size: 29px,
				$icon-spacing: 14px,
				$scale: 0.4,
				$translate: -25px
			);
		}
	}
</style>
