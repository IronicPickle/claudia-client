<script lang="ts">
	import colors from "$constants/colors";
	import type { ChangeData, Color, JustifyContent, Option } from "$ts/generic";
	import { classNames, offsetColor, preventAndStop, styles } from "$utils/generic";
	import { createEventDispatcher } from "svelte";
	import Button from "../generic/Button.svelte";
	import { fade } from "svelte/transition";
	import { linear } from "svelte/easing";
	import ComponentSpawn from "../generic/ComponentSpawn.svelte";
	import { resizeObserver } from "$utils/resizeObserver";

	let clazz: string | undefined = undefined;
	let id: string | undefined = undefined;
	let style: string | undefined = undefined;
	export { clazz as class, id, style };

	let _in: boolean = false;
	export { _in as in };

	export let fontSize: string = "24px";

	export let color: Color = "blue-1";
	export let textColor: Color = "white";
	export let iconColor: Color = textColor;

	export let optionColor: Color = color;
	export let optionTextColor: Color = textColor;
	export let optionIconColor: Color = iconColor;

	export let height: string = "200px";

	export let name: string | undefined = undefined;
	export let value: string | number | undefined = undefined;
	export let options: Option[];

	export let position: "bottom" | "top" = "bottom";

	export let justifyContent: JustifyContent = "space-between";

	export let disabled = false;

	export let minWidth = 0;

	let element: HTMLDivElement | undefined = undefined;

	const dispatch = createEventDispatcher<{
		select: ChangeData<any, Option>;
	}>();

	const handleSelect = (select: ChangeData<any, Option>) => dispatch("select", select);
</script>

{#if _in}
	<div
		in:fade={{
			easing: linear,
			duration: 200
		}}
		on:mousedown={preventAndStop}
		bind:this={element}
		role="button"
		tabindex="0"
		class={classNames("options", color, position, clazz)}
		style={`${styles({
			"--color": colors[color],
			"--color-offset": offsetColor(color, 0.3),
			"--height": height
		})} ${style}`}
		{id}
	>
		<div class="options-inner">
			{#each options as option}
				<Button
					color={option.color ?? optionColor}
					textColor={option.textColor ?? optionTextColor}
					iconColor={option.iconColor ?? optionIconColor}
					variant="contained"
					{fontSize}
					justifyContent={option.justifyContent ?? justifyContent}
					disabled={disabled || option.disabled}
					active={value === option.value}
					href={option.href}
					class="option"
					on:click={() => handleSelect({ name: name ?? "", value: option })}
				>
					<svelte:fragment slot="start">
						{#if option.startIcon}
							<ComponentSpawn options={option.startIcon} />
						{/if}
					</svelte:fragment>
					{option.label}
					<svelte:fragment slot="end">
						{#if option.endIcon}
							<ComponentSpawn options={option.endIcon} />
						{/if}
					</svelte:fragment>
				</Button>
			{/each}
		</div>
	</div>
{/if}
<div
	class={classNames("options", "measurer")}
	style={styles({
		"--height": height
	})}
	use:resizeObserver={(element) => (minWidth = element.offsetWidth)}
>
	<div class="options-inner">
		{#each options as option}
			<Button {fontSize} class="option">
				<svelte:fragment slot="start">
					{#if option.startIcon}
						<ComponentSpawn options={option.startIcon} />
					{/if}
				</svelte:fragment>
				{option.label}
				<svelte:fragment slot="end">
					{#if option.endIcon}
						<ComponentSpawn options={option.endIcon} />
					{/if}
				</svelte:fragment>
			</Button>
		{/each}
	</div>
</div>

<style lang="scss">
	$color: var(--color);
	$colorOffset: var(--color-offset);
	$height: var(--height);

	.options {
		position: absolute;

		max-height: $height;

		box-shadow: 0 0 0 0.1em $colorOffset;

		box-sizing: border-box;
		overflow: hidden;

		z-index: 100;

		&:not(.measurer) {
			min-width: 100%;
		}

		&.measurer {
			visibility: hidden;
		}

		&.bottom {
			top: 100%;
			border-radius: 0 0 0.4em 0.4em;
		}

		&.top {
			bottom: 100%;

			border-radius: 0.4em 0.4em 0 0;
		}

		.options-inner {
			display: flex;
			flex-direction: column;

			max-height: inherit;
			min-height: 0;

			overflow: auto;

			@include scrollbar($color, $colorOffset);

			:global(.option) {
				width: 100%;
				box-shadow: none !important;
				opacity: 1 !important;

				border-radius: 0;

				& :global(.shine) {
					border-radius: 0;
				}
			}
		}
	}
</style>
