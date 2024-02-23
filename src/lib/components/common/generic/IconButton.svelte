<script lang="ts">
	import colors from "$constants/colors";
	import { openInNewTabProps } from "$constants/generic";
	import type { Color } from "$ts/generic";
	import { alphaColor, classNames, offsetColor, styles } from "$utils/generic";

	type Variant = "contained" | "flat";

	export let fontSize: string = "24px";
	export let variant: Variant = "contained";

	export let color: Color = "blue-1";
	export let borderColor: Color = "blue-5";
	export let innerShadowColor: Color = "black";
	export let iconColor: Color = "white";

	export let rounded: boolean = false;
	export let disabled: boolean = false;
	export let readOnly: boolean = false;
	export let disableHover: boolean = false;
	export let isLoading: boolean = false;
	export let active: boolean = false;

	export let href: string | undefined = undefined;
	export let openInNewTab: boolean = false;

	const sharedProps:
		| svelteHTML.HTMLAttributes<HTMLButtonElement>
		| svelteHTML.HTMLAttributes<HTMLAnchorElement> = {
		style: styles({
			"--font-size": fontSize,

			"--color": colors[color],
			"--color-offset-1": offsetColor(color, 0.1),
			"--color-offset-2": offsetColor(color, 0.25),
			"--color-alpha": alphaColor(color, 0.1),

			"--inner-shadow-color": colors[innerShadowColor],

			"--border-color": colors[borderColor],
			"--border-color-alpha": alphaColor(borderColor, 0.1),
			"--icon-color": colors[iconColor]
		}),
		class: classNames(
			"button",
			readOnly && "read-only",
			disableHover && "hover-disabled",
			isLoading && "is-loading",
			active && "active",
			disabled && "disabled",

			rounded && "rounded",

			variant
		),
		disabled
	};
</script>

{#if !href}
	<button {...sharedProps} on:click>
		<div class="inner">
			<slot />
		</div>

		<div class="shadow top" />
		<div class="shadow right" />
		<div class="shadow bottom" />
		<div class="shadow left" />
	</button>
{:else}
	<a {...openInNewTab ? openInNewTabProps : {}} {href} {...sharedProps}>
		<div class="inner">
			<slot />
		</div>

		<div class="shadow top" />
		<div class="shadow right" />
		<div class="shadow bottom" />
		<div class="shadow left" />
	</a>
{/if}

<style lang="scss">
	$fontSize: var(--font-size);

	$color: var(--color);
	$colorOffset1: var(--color-offset-1);
	$colorOffset2: var(--color-offset-2);
	$colorAlpha: var(--color-alpha);

	$innerShadowColor: var(--inner-shadow-color);
	$borderColor: var(--border-color);
	$borderColorAlpha: var(--border-color-alpha);
	$iconColor: var(--icon-color);

	button,
	a {
		position: relative;

		border-radius: 0.4em;
		border: none;

		@include quantico(700);
		font-size: $fontSize;
		text-transform: uppercase;

		overflow: hidden;
		cursor: pointer;
		transition: background-color 200ms ease;

		&:disabled,
		&.disabled {
			@include disabled;
		}

		&.is-loading {
			pointer-events: none;
		}

		&.rounded {
			border-radius: 50%;
		}

		&.flat {
			background-color: transparent;

			.shadow {
				box-shadow: 0 0 0.2em 0.04em transparent;
			}

			&:not(.hover-disabled) {
				&:hover {
					background-color: $colorAlpha;

					.shadow {
						box-shadow: -0.15em -0.15em 0.5em 0.1em $innerShadowColor;
					}
				}

				&:active,
				&.active {
					background-color: $colorAlpha;

					.shadow {
						box-shadow: -0.05em -0.05em 0.3em 0.06em $innerShadowColor;
					}
				}
			}
		}

		&.contained {
			background-color: $color;

			.shadow {
				box-shadow: -0.15em -0.15em 0.5em 0.1em $innerShadowColor;
			}

			&:not(.hover-disabled) {
				&:hover {
					background-color: $colorOffset1;

					.shadow {
						box-shadow: -0.15em -0.15em 0.5em 0.1em $innerShadowColor;
					}
				}

				&:active,
				&.active {
					background-color: $colorOffset2;

					.shadow {
						box-shadow: -0.05em -0.05em 0.3em 0.06em $innerShadowColor;
					}
				}
			}
		}

		.inner {
			display: flex;
			align-items: center;

			padding: 0.7em;

			:global(> *:not(span):not(.not-icon)) {
				@include size(1.25em);

				color: $iconColor;
			}
		}

		.shadow {
			position: absolute;

			font-size: inherit;

			transition: box-shadow 200ms ease;

			&.top {
				left: 0;
				top: 0;
				right: 0;

				height: 0;
				width: 100%;
			}

			&.right {
				top: 0;
				right: 0;
				bottom: 0;

				height: 100%;
				width: 0;
			}

			&.bottom {
				right: 0;
				bottom: 0;
				left: 0;

				height: 0;
				width: 100%;
			}

			&.left {
				bottom: 0;
				left: 0;
				top: 0;

				height: 100%;
				width: 0;
			}
		}
	}
</style>
