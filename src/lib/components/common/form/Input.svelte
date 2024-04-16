<script lang="ts">
	import colors from "$constants/colors";
	import type { ChangeData, Color } from "$ts/generic";
	import { alphaColor, classNames, styles } from "$utils/generic";
	import { createEventDispatcher } from "svelte";
	import { Moon } from "svelte-loading-spinners";
	import IconButton from "../generic/IconButton.svelte";
	import { writable } from "svelte/store";
	import type { CursorCoords } from "$utils/storeRelativeCursorPosition";
	import storeRelativeCursorPosition from "$utils/storeRelativeCursorPosition";

	import IoEyeOffOutline from "~icons/ion/eye-off-outline";
	import IoEyeOutline from "~icons/ion/eye-outline";

	type Variant = "contained" | "outlined" | "flat";

	let clazz: string | undefined = undefined;
	let id: string | undefined = undefined;
	let style: string | undefined = undefined;
	export { clazz as class, id, style };

	let wrapperClass: string | undefined = undefined;
	let wrapperId: string | undefined = undefined;
	let wrapperStyle: string | undefined = undefined;
	export { wrapperClass, wrapperId, wrapperStyle };

	export let fontSize: string = "20px";
	export let variant: Variant = "contained";

	export let color: Color = "blue-1";
	export let textColor: Color = "white";
	export let iconColor: Color = textColor;

	export let name: string | undefined = undefined;
	export let value: string | number | undefined = undefined;
	export let type: "text" | "password" | "email" | "number" | "url" = "text";
	export let multiline = false;
	export let placeholder: string | undefined = undefined;
	export let autocomplete = false;
	export let requireShiftEnterForNewLine = false;

	export let rounded = false;
	export let disabled = false;
	export let readOnly = false;
	export let disableHover = false;
	export let isLoading = false;
	export let focussed = false;

	export let noError = false;

	let element: HTMLDivElement | undefined = undefined;

	const hasStartIcon = $$slots["start"];
	const hasEndIcon = $$slots["end"] || isLoading;

	let clicked = false;
	let clickedTimeout: any;

	let passwordOverride = false;

	type InputChangeEvent = Event & {
		currentTarget: EventTarget & (HTMLTextAreaElement | HTMLInputElement);
	};
	type InputFocusEvent = FocusEvent & {
		currentTarget: EventTarget & (HTMLTextAreaElement | HTMLInputElement);
	};
	type InputKeyboardEvent = KeyboardEvent & {
		currentTarget: EventTarget & (HTMLTextAreaElement | HTMLInputElement);
	};

	const dispatch = createEventDispatcher<{
		change: ChangeData<any, any>;
		blur: InputFocusEvent;
		focus: InputFocusEvent;
	}>();

	const handleClick = (_event: MouseEvent) => {
		clearTimeout(clickedTimeout);
		clicked = true;
		clickedTimeout = setTimeout(() => {
			clicked = false;
		}, 250);
	};

	const handleChange = ({ currentTarget }: InputChangeEvent) =>
		dispatch("change", {
			name: currentTarget.name ?? "",
			value: currentTarget.value
		});
	const handleBlur = (event: InputFocusEvent) => dispatch("blur", event);
	const handleFocus = (event: InputFocusEvent) => dispatch("focus", event);

	const handleKeyDown = (event: InputKeyboardEvent) => {
		if (!requireShiftEnterForNewLine) return;
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();

			event.currentTarget.form?.requestSubmit();
		}
	};

	const coords = writable<CursorCoords>({
		x: 0,
		y: 0
	});

	let xOffset = 0;

	$: {
		const width = element?.clientWidth ?? 0;
		xOffset = Math.floor($coords.x / (width / 100));
		xOffset /= 2;
		xOffset += 25;
	}
</script>

<div
	class={classNames(
		"input-wrapper",
		variant,
		hasStartIcon && "has-start-icon",
		hasEndIcon && "has-end-icon",
		multiline && "textarea",
		rounded && "rounded",
		(focussed || clicked) && "focus",
		disableHover && "hover-disabled",
		disabled && "disabled",
		noError && "no-error",
		wrapperClass
	)}
	id={wrapperId}
	style={`${styles({
		"--font-size": fontSize,

		"--color": colors[color],
		"--color-alpha": alphaColor(color, 0.1),

		"--text-color": colors[textColor],
		"--text-color-alpha": alphaColor(textColor, 0.4),
		"--icon-color": colors[iconColor],

		"--x-offset": `${xOffset}%`
	})}${wrapperStyle}`}
	on:click={handleClick}
	on:mousemove={storeRelativeCursorPosition(coords)}
	bind:this={element}
	role="none"
>
	<slot name="start" />
	<div class="input-overflow-wrapper">
		{#if multiline}
			<textarea
				{placeholder}
				{name}
				{value}
				on:change={handleChange}
				on:blur={handleBlur}
				on:focus={handleFocus}
				on:keydown={handleKeyDown}
				class={classNames("input", color, variant, clazz)}
				{id}
				{style}
				disabled={isLoading || disabled}
				readonly={readOnly}
				autoComplete={autocomplete ? "on" : "off"}
				{...passwordOverride ? { type: "text" } : { type }}
			></textarea>
		{:else}
			<input
				{placeholder}
				{name}
				{value}
				on:change={handleChange}
				on:blur={handleBlur}
				on:focus={handleFocus}
				on:keydown={handleKeyDown}
				class={classNames("input", color, variant, clazz)}
				{id}
				{style}
				disabled={isLoading || disabled}
				readonly={readOnly}
				autoComplete={autocomplete ? "on" : "off"}
				{...passwordOverride ? { type: "text" } : { type }}
			/>
		{/if}
	</div>

	<div class="shine" />

	{#if isLoading}
		<Moon color={colors[iconColor]} size={parseInt(fontSize)} />
	{:else if type === "password"}
		<IconButton
			variant="flat"
			fontSize={`${Math.floor(parseInt(fontSize) / 1.25)}px`}
			type="button"
			color={iconColor}
			{iconColor}
			rounded
			on:click={() => {
				passwordOverride = !passwordOverride;
			}}
		>
			{#if passwordOverride}
				<IoEyeOffOutline />
			{:else}
				<IoEyeOutline />
			{/if}
		</IconButton>
	{:else}
		<slot name="end" />
	{/if}
</div>

<style lang="scss">
	$fontSize: var(--font-size);

	$color: var(--color);
	$colorAlpha: var(--color-alpha);

	$textColor: var(--text-color);
	$textColorAlpha: var(--text-color-alpha);
	$iconColor: var(--icon-color);

	$xOffset: var(--x-offset);

	.input-wrapper {
		position: relative;
		display: flex;
		align-items: center;

		width: 100%;
		min-width: 0;

		font-size: $fontSize;

		&.textarea {
			height: 100%;
			min-height: 100px;
		}

		&.disabled {
			@include disabled;
		}

		&.has-start-icon {
			.input-overflow-wrapper {
				.input {
					padding-left: 2.6em;
				}
			}

			:global(> *:first-child) {
				left: 1em;
			}

			:global(> .button:first-child) {
				left: 0.75em;
			}
		}

		&.has-end-icon {
			.input-overflow-wrapper {
				.input {
					padding-right: 2.6em;
				}
			}

			:global(> *:last-child) {
				right: 1em;
			}

			:global(> .button:last-child) {
				right: 0.75em;
			}
		}

		:global(> *:not(span):not(.not-icon):not(.input-overflow-wrapper):not(.shine)) {
			position: absolute !important;

			z-index: 100;

			&:not(.button) {
				color: $iconColor;
				@include size($fontSize);

				pointer-events: none;
			}
		}

		&.contained {
			.input-overflow-wrapper {
				box-shadow: 0 0 0 0.05em $color;

				.input {
					background-color: $color;
				}
			}

			.shine {
				background-image: linear-gradient(-65deg, rgba(255, 255, 255, 0.2) 48%, transparent 52%);
			}

			&:not(.hover-disabled) {
				&:focus-within,
				&.focus {
					.input-overflow-wrapper {
						box-shadow: 0 0 0 0.1em $color;
					}
				}
			}
		}

		&.outlined {
			.input-overflow-wrapper {
				box-shadow: 0 0 0 0.05em $color;

				.input {
					background-color: transparent;
				}
			}

			.shine {
				background-image: linear-gradient(-65deg, $colorAlpha 48%, transparent 52%);
			}

			&:not(.hover-disabled) {
				&:hover {
					.input-overflow-wrapper {
						box-shadow: 0 0 0 0.05em $color;
					}
				}

				&:focus-within,
				&.focus {
					.input-overflow-wrapper {
						box-shadow: 0 0 0 0.1em $color;
					}
				}
			}
		}

		&.flat {
			.input-overflow-wrapper {
				box-shadow: 0 0 0 0.05em transparent;

				.input {
					background-color: transparent;
				}
			}

			.shine {
				background-image: linear-gradient(-65deg, $colorAlpha 45%, transparent 55%);
			}

			&:not(.hover-disabled) {
				&:hover {
					.input-overflow-wrapper {
						box-shadow: 0 0 0 0.05em $colorAlpha;
					}
				}

				&:focus-within,
				&.focus {
					.input-overflow-wrapper {
						box-shadow: 0 0 0 0.1em $colorAlpha;
					}
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

			&:focus-within,
			&.focus {
				.shine {
					background-position: 100% 100%;

					opacity: 1;
				}
			}

			&:not(:hover),
			&:focus-within {
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
			pointer-events: none;
		}

		.input-overflow-wrapper {
			display: flex;
			align-items: center;

			width: 100%;
			min-height: inherit;

			box-shadow: 0 0 0 1px transparent;
			border-radius: 0.4em;

			font-size: inherit;

			overflow: hidden;
			box-sizing: border-box;

			transition:
				border-radius 300ms ease,
				box-shadow 75ms ease-out;

			.input {
				width: 100%;
				height: 2.5em;
				min-height: inherit;
				min-width: 0;

				padding: 0 1em;

				outline: none;
				border: none;
				background-color: transparent;

				@include quantico(500);
				font-size: inherit;
				color: $textColor;

				-webkit-appearance: none;
				box-sizing: border-box;
				resize: none;

				transition: background-color 300ms ease;

				&::placeholder {
					color: $textColorAlpha;
				}

				&[type="number"] {
					-moz-appearance: textfield;

					&::-webkit-outer-spin-button,
					&::-webkit-inner-spin-button {
						-webkit-appearance: none;
						margin: 0;
					}
				}
			}
		}
	}
</style>
