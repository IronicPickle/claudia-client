<script lang="ts">
	import colors from "$constants/colors";
	import { openInNewTabProps } from "$constants/generic";
	import type { Color } from "$ts/generic";
	import { alphaColor, classNames, offsetColor, styles } from "$utils/generic";
	import type { CursorCoords } from "$utils/storeRelativeCursorPosition";
	import storeRelativeCursorPosition from "$utils/storeRelativeCursorPosition";
	import { createEventDispatcher } from "svelte";
	import { writable } from "svelte/store";

	type Variant = "contained" | "flat";

	export let fontSize: string = "24px";
	export let variant: Variant = "contained";

	export let color: Color = "blue-1";
	export let iconColor: Color = "white";

	export let rounded: boolean = false;
	export let disabled: boolean = false;
	export let readOnly: boolean = false;
	export let disableHover: boolean = false;
	export let isLoading: boolean = false;
	export let active: boolean = false;

	export let href: string | undefined = undefined;
	export let openInNewTab: boolean = false;

	let clicked = false;
	let clickedTimeout: any;

	const dispatch = createEventDispatcher<{
		click: MouseEvent;
	}>();

	const handleClick = (event: MouseEvent) => {
		clearTimeout(clickedTimeout);
		clicked = true;
		clickedTimeout = setTimeout(() => {
			clicked = false;
		}, 250);

		dispatch("click", event);
	};

	const coords = writable<CursorCoords>({
		x: 0,
		y: 0
	});
	let width: number = 0;

	let sharedProps:
		| svelteHTML.HTMLAttributes<HTMLButtonElement>
		| svelteHTML.HTMLAttributes<HTMLAnchorElement> = {};

	$: {
		sharedProps = {
			style: styles({
				"--font-size": fontSize,

				"--color": colors[color],
				"--color-offset-1": offsetColor(color, 0.1),
				"--color-offset-2": offsetColor(color, 0.25),
				"--color-alpha": alphaColor(color, 0.1),

				"--icon-color": colors[iconColor],

				"--x-offset": `${Math.floor($coords.x / (width / 100))}%`
			}),
			class: classNames(
				"button",
				readOnly && "read-only",
				disableHover && "hover-disabled",
				isLoading && "is-loading",
				(active || clicked) && "active",
				disabled && "disabled",

				rounded && "rounded",

				variant
			),
			disabled
		};
	}
</script>

{#if !href}
	<button
		{...sharedProps}
		on:click={handleClick}
		on:mousemove={storeRelativeCursorPosition(coords)}
		bind:clientWidth={width}
	>
		<div class="inner">
			<slot />
		</div>

		<div class="shine" />
	</button>
{:else}
	<a
		{...openInNewTab ? openInNewTabProps : {}}
		{href}
		{...sharedProps}
		on:click={handleClick}
		on:mousemove={storeRelativeCursorPosition(coords)}
		bind:clientWidth={width}
	>
		<div class="inner">
			<slot />
		</div>

		<div class="shine" />
	</a>
{/if}

<style lang="scss">
	$fontSize: var(--font-size);

	$color: var(--color);
	$colorOffset1: var(--color-offset-1);
	$colorOffset2: var(--color-offset-2);
	$colorAlpha: var(--color-alpha);

	$iconColor: var(--icon-color);

	$xOffset: var(--x-offset);

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

		&.contained {
			background-color: $color;
			box-shadow: 0 0 0 0.05em $color;

			.shine {
				background-image: linear-gradient(-65deg, rgba(255, 255, 255, 0.2) 45%, transparent 55%);
			}

			&:not(.hover-disabled) {
				&:active,
				&.active {
					box-shadow: 0 0 0 0.1em $color;
				}
			}
		}

		&.flat {
			background-color: transparent;
			box-shadow: 0 0 0 0.05em transparent;

			.shine {
				background-image: linear-gradient(-65deg, $colorAlpha 45%, transparent 55%);

				opacity: 0;
			}

			&:not(.hover-disabled) {
				&:hover {
					box-shadow: 0 0 0 0.05em $colorAlpha;

					.shine {
						opacity: 1;
					}
				}

				&:active,
				&.active {
					box-shadow: 0 0 0 0.1em $colorAlpha;

					.shine {
						opacity: 1;
					}
				}
			}
		}

		&:not(.hover-disabled) {
			&:hover {
				.shine {
					background-position: calc(100% - $xOffset);
				}
			}

			&:active,
			&.active {
				.shine {
					background-position: 100% 100%;
				}
			}

			&:not(:hover),
			&:active {
				.shine {
					transition: background-position 200ms ease;
				}
			}
		}

		.shine {
			position: absolute;
			inset: 0;

			background-size: 220%;
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
