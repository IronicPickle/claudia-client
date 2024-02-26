<script lang="ts">
	import colors from "$constants/colors";
	import { openInNewTabProps } from "$constants/generic";
	import type { Color, JustifyContent } from "$ts/generic";
	import { alphaColor, classNames, offsetColor, styles } from "$utils/generic";
	import storeRelativeCursorPosition from "$utils/storeRelativeCursorPosition";
	import { type CursorCoords } from "$utils/storeRelativeCursorPosition";
	import { createEventDispatcher } from "svelte";
	import { Circle2, DoubleBounce, Jumper, Moon, Shadow, Wave } from "svelte-loading-spinners";
	import { writable } from "svelte/store";

	type Variant = "contained" | "outlined" | "flat";

	let clazz: string | undefined = undefined;
	let id: string | undefined = undefined;
	let style: string | undefined = undefined;
	export { clazz as class, id, style };

	export let fontSize: string = "24px";
	export let variant: Variant = "contained";

	export let color: Color = "blue-1";
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

	export let type: "button" | "submit" | "reset" = "button";
	export let name: string | undefined = undefined;

	let element: HTMLButtonElement | HTMLAnchorElement | undefined = undefined;

	const hasStartIcon = $$slots["start"];
	const hasEndIcon = $$slots["end"];

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
	let width: number = 0;

	let sharedStyle = "";
	let sharedClass = "";

	$: {
		let xOffset = Math.floor($coords.x / (width / 100));
		xOffset /= 2;
		xOffset += 25;
		sharedStyle = `${styles({
			"--font-size": fontSize,

			"--color": colors[color],
			"--color-offset-1": offsetColor(color, 0.1),
			"--color-offset-2": offsetColor(color, 0.25),
			"--color-alpha": alphaColor(color, 0.15),

			"--text-color": colors[textColor],
			"--icon-color": colors[iconColor],

			"--justify-content": justifyContent,

			"--x-offset": `${xOffset}%`
		})} ${style}`;
	}

	$: {
		sharedClass = classNames(
			"button",
			readOnly && "read-only",
			disableHover && "hover-disabled",
			wrap && "wrap",
			(hasStartIcon || hasEndIcon || justifyContent !== "space-between") && "do-justify",
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
		bind:clientWidth={width}
		bind:this={element}
	>
		<div class="inner">
			<slot name="start" />
			<span><slot /></span>
			{#if isLoading}
				<Moon color={colors[iconColor]} size={parseInt(fontSize)} />
			{:else}
				<slot name="end" />
			{/if}
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
		bind:clientWidth={width}
		bind:this={element}
	>
		<div class="inner">
			<slot name="start" />
			<span><slot /></span>
			<slot name="end" />
		</div>

		<div class="shine" />
	</a>
{/if}

<style lang="scss">
	$fontSize: var(--font-size);

	$color: var(--color);
	$colorAlpha: var(--color-alpha);

	$textColor: var(--text-color);
	$iconColor: var(--icon-color);

	$justifyContent: var(--justify-content);

	$xOffset: var(--x-offset);

	button,
	a {
		position: relative;

		border-radius: 0.4em;
		border: none;

		@include quantico(700);
		font-size: $fontSize;
		color: $textColor;
		text-transform: uppercase;

		cursor: pointer;
		transition:
			background-color 200ms ease,
			box-shadow 300ms ease;

		&:disabled,
		&.disabled {
			@include disabled;
		}

		&.is-loading {
			pointer-events: none;
		}

		&.rounded {
			border-radius: 50em;
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

		&.contained {
			background-color: $color;
			box-shadow: 0 0 0 0.05em $color;

			.shine {
				background-image: linear-gradient(-65deg, rgba(255, 255, 255, 0.2) 48%, transparent 52%);
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
			}

			&:not(.hover-disabled) {
				&:hover {
					box-shadow: 0 0 0 0.05em $colorAlpha;
				}

				&:active,
				&.active {
					box-shadow: 0 0 0 0.1em $colorAlpha;
				}
			}
		}

		&:not(.hover-disabled) {
			&:hover {
				.shine {
					background-position: calc(100% - $xOffset);

					opacity: 1;
				}
			}

			&:active,
			&.active {
				.shine {
					background-position: 100% 100%;

					opacity: 1;
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

			border-radius: 0.4em;

			background-size: 300%;

			opacity: 1;
		}

		.inner {
			display: flex;
			align-items: center;

			padding: 0.6em 1em;

			:global(> *:not(span):not(.not-icon)) {
				color: $iconColor;

				&:not(.wrapper) {
					@include size(1.2em);
				}

				&:first-child {
					margin-right: 0.6em;
				}

				&:last-child {
					margin-left: 0.6em;
				}
			}
		}
	}
</style>
