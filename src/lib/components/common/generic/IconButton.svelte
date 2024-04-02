<script lang="ts">
	import colors from "$constants/colors";
	import { openInNewTabProps } from "$constants/generic";
	import type { Color } from "$ts/generic";
	import { alphaColor, classNames, offsetColor, styles } from "$utils/generic";
	import type { CursorCoords } from "$utils/storeRelativeCursorPosition";
	import storeRelativeCursorPosition from "$utils/storeRelativeCursorPosition";
	import { createEventDispatcher } from "svelte";
	import { writable } from "svelte/store";

	type Variant = "contained" | "outlined" | "flat";

	let clazz: string | undefined = undefined;
	let id: string | undefined = undefined;
	let style: string | undefined = undefined;
	export { clazz as class, id, style };

	export let fontSize: string = "20px";
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

	export let type: "button" | "submit" | "reset" = "button";
	export let name: string | undefined = undefined;

	let element: HTMLButtonElement | HTMLAnchorElement | undefined = undefined;

	let clicked = false;
	let clickedTimeout: any;

	const dispatch = createEventDispatcher<{
		click: MouseEvent;
		blur: FocusEvent;
	}>();

	const handleClick = (event: MouseEvent) => {
		clearTimeout(clickedTimeout);
		clicked = true;
		clickedTimeout = setTimeout(() => {
			clicked = false;
		}, 250);

		dispatch("click", event);
	};

	const handleBlur = (event: FocusEvent) => dispatch("blur", event);

	const coords = writable<CursorCoords>({
		x: 0,
		y: 0
	});

	let sharedStyle = "";
	let sharedClass = "";

	$: {
		const width = element?.clientWidth ?? 0;
		let xOffset = Math.floor($coords.x / (width / 100));
		xOffset /= 2;
		xOffset += 25;
		sharedStyle = `${styles({
			"--font-size": fontSize,

			"--color": colors[color],
			"--color-offset-1": offsetColor(color, 0.1),
			"--color-offset-2": offsetColor(color, 0.25),
			"--color-alpha": alphaColor(color, 0.1),

			"--icon-color": colors[iconColor],

			"--x-offset": `${xOffset}%`
		})} ${style}`;
	}

	$: {
		sharedClass = classNames(
			"button",
			readOnly && "read-only",
			disableHover && "hover-disabled",
			isLoading && "is-loading",
			(active || clicked) && "active",
			disabled && "disabled",

			rounded && "rounded",

			variant,

			clazz
		);
	}
</script>

{#if !href}
	<button
		style={sharedStyle}
		class={sharedClass}
		{disabled}
		{id}
		{name}
		{type}
		tabIndex={0}
		on:click={handleClick}
		on:blur={handleBlur}
		on:mousemove={storeRelativeCursorPosition(coords)}
		bind:this={element}
	>
		<div class="inner">
			<slot />
		</div>

		<div class="shine" />
	</button>
{:else}
	<a
		style={sharedStyle}
		class={sharedClass}
		{...openInNewTab ? openInNewTabProps : {}}
		{href}
		{id}
		{type}
		tabIndex={0}
		on:click={handleClick}
		on:mousemove={storeRelativeCursorPosition(coords)}
		bind:this={element}
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

		@include size(2.5em);

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

		&.outlined {
			background-color: transparent;
			box-shadow: 0 0 0 0.05em $color;

			.shine {
				background-image: linear-gradient(-65deg, $colorAlpha 48%, transparent 52%);
			}

			&:not(.hover-disabled) {
				&:hover {
					box-shadow: 0 0 0 0.05em $color;
				}

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

			background-size: 300%;
		}

		.inner {
			display: flex;
			align-items: center;
			justify-content: center;

			width: 100%;
			height: 100%;

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
