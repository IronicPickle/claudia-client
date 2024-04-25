<script lang="ts">
	import colors from "$constants/colors";
	import { ConsoleColor } from "$shared/lib/enums/generic";
	import type { ChangeData, Color } from "$ts/generic";
	import { classNames, offsetColor, styles } from "$utils/generic";
	import { createEventDispatcher } from "svelte";

	let clazz: string | undefined = undefined;
	let id: string | undefined = undefined;
	let style: string | undefined = undefined;
	export { clazz as class, id, style };

	export let size: string = "16px";

	export let trackColor: Color = "blue-3";
	export let filledTrackColor: Color = "blue-1";
	export let thumbColor: Color = "blue-1";
	export let name: string | undefined = undefined;
	export let value: number = 50;
	export let min = 0;
	export let max = 100;
	export let step: number = 1;

	export let disabled = false;
	export let readOnly = false;
	export let disableHover = false;
	export let active = false;

	type InputChangeEvent = Event & {
		currentTarget: EventTarget & (HTMLTextAreaElement | HTMLInputElement);
	};
	type InputFocusEvent = FocusEvent & {
		currentTarget: EventTarget & (HTMLTextAreaElement | HTMLInputElement);
	};

	const dispatch = createEventDispatcher<{
		change: ChangeData<any, number>;
		blur: InputFocusEvent;
		focus: InputFocusEvent;
	}>();

	const handleChange = ({ currentTarget }: InputChangeEvent) =>
		dispatch("change", {
			name: currentTarget.name ?? "",
			value: parseInt(currentTarget.value)
		});
	const handleBlur = (event: InputFocusEvent) => dispatch("blur", event);
	const handleFocus = (event: InputFocusEvent) => dispatch("focus", event);

	const getGradient = (value: number, min: number, max: number) => {
		const percent = ((value - min) / (max - min)) * 100;
		return `linear-gradient(to right, ${colors[filledTrackColor]} 0%, ${colors[filledTrackColor]} ${percent}%, ${colors[trackColor]} ${percent}%, ${colors[trackColor]} 100%)`;
	};

	let gradient = getGradient(value, min, max);
	$: gradient = getGradient(value, min, max);
</script>

<input
	type="range"
	class={classNames(
		"slider",
		active && "active",
		disableHover && "hover-disabled",
		disabled && "disabled",
		clazz
	)}
	style={`${styles({
		"--size": size,

		"--track-color": colors[trackColor],

		"--filled-track-color": colors[filledTrackColor],

		"--thumb-color": colors[thumbColor],
		"--thumb-color-offset": offsetColor(thumbColor, 0.3),

		"background-image": gradient
	})}${style}`}
	{id}
	{name}
	{value}
	{min}
	{max}
	{step}
	{disabled}
	readonly={readOnly}
	on:change={handleChange}
	on:blur={handleBlur}
	on:focus={handleFocus}
	on:input={({ currentTarget: { min, max, value } }) => {
		gradient = getGradient(parseInt(value), parseInt(min), parseInt(max));
	}}
/>

<style lang="scss">
	$size: var(--size);

	$trackColor: var(--track-color);
	$filledTrackColor: var(--fileld-track-color);
	$thumbColor: var(--thumb-color);
	$thumbColorOffset: var(--thumb-color-offset);

	.slider {
		height: 0.6em;
		width: 100%;

		appearance: none;
		border: none;
		outline: none;

		border-radius: 0.4em;

		font-size: $size;

		&:disabled,
		&.disabled {
			@include disabled;
		}

		&:not(.hover-disabled) {
			&:hover {
				&::-webkit-slider-thumb {
					background-color: $thumbColorOffset;
				}

				&::-moz-range-thumb {
					background-color: $thumbColorOffset;
				}
			}

			&:active,
			&.active {
				&::-webkit-slider-thumb {
					box-shadow: 0 0 0 0.1em $thumbColor;
				}

				&::-moz-range-thumb {
					box-shadow: 0 0 0 0.1em $thumbColor;
				}
			}
		}

		&::-webkit-slider-thumb {
			appearance: none;
			border: none;
			outline: none;

			@include size(1em);

			font-size: inherit;

			border-radius: 50%;

			cursor: pointer;

			background-color: $thumbColor;
			box-shadow: 0 0 0 0.05em $thumbColor;

			transition:
				background-color 200ms ease,
				box-shadow 300ms ease;
		}

		&::-moz-range-thumb {
			border: none;
			outline: none;

			@include size(1em);

			font-size: inherit;

			border-radius: 50%;

			cursor: pointer;

			background-color: $thumbColor;
			box-shadow: 0 0 0 0.05em $thumbColor;

			transition:
				background-color 200ms ease,
				box-shadow 300ms ease;
		}
	}
</style>
