<script lang="ts">
	import colors from "$constants/colors";
	import { openInNewTabProps } from "$constants/generic";
	import type { Color, JustifyContent } from "$ts/generic";
	import { alphaColor, classNames, offsetColor, styles } from "$utils/generic";

	export let fontSize: string = "24px";

	export let color: Color = "blue-1";
	export let borderColor: Color = "blue-5";
	export let innerShadowColor: Color = "black";
	export let outerShadowColor: Color = "black";
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

	const hasStartIcon = $$slots["start"];
	const hasEndIcon = $$slots["end"];

	const sharedProps:
		| svelteHTML.HTMLAttributes<HTMLButtonElement>
		| svelteHTML.HTMLAttributes<HTMLAnchorElement> = {
		style: styles({
			"--font-size": fontSize,

			"--color": colors[color],
			"--color-offset-1": offsetColor(color, 0.1),
			"--color-offset-2": offsetColor(color, 0.25),

			"--inner-shadow-color": colors[innerShadowColor],
			"--outer-shadow-color": alphaColor(outerShadowColor, 0.25),

			"--border-color": colors[borderColor],
			"--text-color": colors[textColor],
			"--icon-color": colors[iconColor],

			"--justify-content": justifyContent
		}),
		class: classNames(
			"button",
			readOnly && "read-only",
			disableHover && "hover-disabled",
			wrap && "wrap",
			(hasStartIcon || hasEndIcon || justifyContent !== "space-between") && "do-justify",
			isLoading && "is-loading",
			active && "active",
			disabled && "disabled",

			rounded && "rounded"
		),
		disabled
	};
</script>

{#if !href}
	<button {...sharedProps}>
		<div class="inner">
			<slot name="start" />
			<span><slot /></span>
			<slot name="end" />
		</div>

		<div class="shadow top" />
		<div class="shadow right" />
		<div class="shadow bottom" />
		<div class="shadow left" />
	</button>
{:else}
	<a {...openInNewTab ? openInNewTabProps : {}} {href} {...sharedProps}>
		<div class="inner">
			<slot name="start-icon" />
			<span><slot /></span>
			<slot name="end-icon" />
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

	$innerShadowColor: var(--inner-shadow-color);
	$outerShadowColor: var(--outer-shadow-color);
	$borderColor: var(--border-color);
	$textColor: var(--text-color);
	$iconColor: var(--icon-color);

	$justifyContent: var(--justify-content);

	button,
	a {
		position: relative;

		background-color: $color;
		border: 0.2em solid $borderColor;
		box-shadow: 0 0 0.04em 0.04em $outerShadowColor;
		border-radius: 0.4em;

		@include quantico(700);
		font-size: $fontSize;
		color: $textColor;
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

		&:not(.wrap) {
			.inner {
				& > span {
					@include textOverflow;
				}
			}
		}

		&.do-justify {
			.inner {
				justify-content: $justifyContent;
			}
		}

		&:not(.hover-disabled) {
			&:hover {
				background-color: $colorOffset1;

				.shadow {
					box-shadow: 0 0 0.4em 0.08em $innerShadowColor;
				}
			}

			&:active,
			&.active {
				background-color: $colorOffset2;

				.shadow {
					box-shadow: 0 0 0.6em 0.1em $innerShadowColor;
				}
			}
		}

		.inner {
			display: flex;
			align-items: center;

			padding: 0.5em 0.8em;

			:global(> *:not(span):not(.not-icon)) {
				@include size(1.2em);

				color: $iconColor;

				&:first-child {
					margin-right: 0.6em;
				}

				&:last-child {
					margin-left: 0.6em;
				}
			}
		}

		.shadow {
			position: absolute;

			box-shadow: 0 0 0.2em 0.04em $innerShadowColor;

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
