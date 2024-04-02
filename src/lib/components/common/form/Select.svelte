<script lang="ts">
	import type { ChangeData, Color, JustifyContent, Option } from "$ts/generic";
	import { classNames, styles } from "$utils/generic";
	import { createEventDispatcher } from "svelte";
	import Button from "../generic/Button.svelte";
	import Options from "./Options.svelte";

	import IoChevronDown from "~icons/ion/chevron-down";
	import IoChevronUp from "~icons/ion/chevron-up";
	import ComponentSpawn from "../generic/ComponentSpawn.svelte";

	type Variant = "contained" | "outlined" | "flat";

	let clazz: string | undefined = undefined;
	let id: string | undefined = undefined;
	let style: string | undefined = undefined;
	export { clazz as class, id, style };

	export let buttonClassName: string | undefined = undefined;

	export let fontSize: string = "20px";
	export let variant: Variant = "contained";

	export let color: Color = "blue-1";
	export let textColor: Color = "white";
	export let iconColor: Color = textColor;

	export let optionsColor: Color = color;
	export let optionsTextColor: Color = textColor;

	export let name: string | undefined = undefined;
	export let value: string | number | undefined = undefined;
	let rawOptions: Option[];
	export { rawOptions as options };
	export let useEmptyOption: boolean = false;
	export let emptyOptionProps: Partial<Option> | undefined = undefined;

	export let optionsHeight: string = "200px";
	export let optionsPosition: "bottom" | "top" = "bottom";
	export let justifyContent: JustifyContent = "space-between";
	export let wrap: boolean = false;

	export let rounded: boolean = false;
	export let disabled: boolean = false;
	export let readOnly: boolean = false;
	export let disableHover: boolean = false;
	export let isLoading: boolean = false;
	export let active: boolean = false;

	let element: HTMLDivElement | undefined = undefined;
	let buttonElement: Button | undefined = undefined;

	let open = false;

	let selectedOption: Option | undefined = undefined;

	let optionsMinWidth = 0;

	const hasEndIcon = $$slots["end"];

	const dispatch = createEventDispatcher<{
		change: ChangeData<any, any>;
		blur: ChangeData<any, any>;
	}>();

	const handleChange = (data: ChangeData<any, any>) => {
		value = data.value;
		dispatch("change", data);
	};
	const handleBlur = () => dispatch("blur", { name: name ?? "", value });

	let options = rawOptions;

	$: {
		if (useEmptyOption) {
			options = [{ value: "", label: "None", ...emptyOptionProps }, ...(rawOptions ?? [])];
		}
	}

	$: {
		if (!options.find((option) => option.value === value)) {
			handleChange({ value: options[0]?.value, name: name ?? "" });
		}
	}

	$: selectedOption = options.find((option) => option.value === value);
</script>

<div
	bind:this={element}
	class={classNames("select-wrapper", open ? "open" : "closed", clazz)}
	{id}
	{style}
>
	<Button
		{color}
		{textColor}
		{iconColor}
		{variant}
		{fontSize}
		{isLoading}
		{justifyContent}
		{wrap}
		{readOnly}
		rounded={rounded && !open}
		active={open || active}
		class={classNames(
			"select",
			color,
			variant,
			optionsPosition,
			open ? "open" : "closed",
			buttonClassName
		)}
		{name}
		type="button"
		bind:this={buttonElement}
		on:click={() => {
			if (readOnly) return;
			buttonElement?.element?.focus();
			open = !open;
		}}
		on:blur={() => {
			open = false;
			handleBlur();
		}}
		{disabled}
		{disableHover}
		style={styles({
			"min-width": `${optionsMinWidth}px`
		})}
	>
		<svelte:fragment slot="start">
			{#if selectedOption?.startIcon}
				<ComponentSpawn options={selectedOption.startIcon} />
			{:else}
				<slot name="start" />
			{/if}
		</svelte:fragment>
		{selectedOption?.label ?? "None"}
		<svelte:fragment slot="end">
			{#if hasEndIcon}
				<slot name="end" />
			{:else if optionsPosition === "bottom"}
				<IoChevronDown class="chevron" />
			{:else}
				<IoChevronUp class="chevron" />
			{/if}
		</svelte:fragment>
	</Button>
	<Options
		in={open}
		color={optionsColor}
		{textColor}
		optionColor={optionsColor}
		optionTextColor={optionsTextColor}
		{justifyContent}
		{fontSize}
		{name}
		height={optionsHeight}
		{disabled}
		{value}
		{options}
		position={optionsPosition}
		bind:minWidth={optionsMinWidth}
		on:select={({ detail: { value, ...data } }) => {
			handleChange({ ...data, value: value.value });
			open = false;
		}}
	/>
</div>

<style lang="scss">
	.select-wrapper {
		position: relative;

		:global(.select) {
			width: 100%;
			height: 100%;

			:global(.chevron) {
				transition: transform 150ms ease;
			}
		}

		:global(.select.top.open) {
			border-top-left-radius: 0 !important;
			border-top-right-radius: 0 !important;

			:global(.chevron) {
				transform: rotate(-90deg);
			}
		}

		:global(.select.bottom.open) {
			border-bottom-left-radius: 0 !important;
			border-bottom-right-radius: 0 !important;

			:global(.chevron) {
				transform: rotate(90deg);
			}
		}
	}
</style>
