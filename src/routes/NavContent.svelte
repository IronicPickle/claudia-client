<script lang="ts">
	import IconButton from "$components/common/generic/IconButton.svelte";
	import Logo from "$components/media/Logo.svelte";
	import { classNames } from "$utils/generic";
	import { createEventDispatcher } from "svelte";

	import TbArrowBarToLeft from "~icons/tabler/arrow-bar-to-left";

	export let expanded: boolean | undefined = undefined;

	const dispatch = createEventDispatcher<{
		expand: undefined;
		collapse: undefined;
	}>();

	const handleExpand = () => dispatch("expand");
	const handleCollapse = () => dispatch("collapse");
</script>

<div class={classNames("nav-content", expanded && "expanded")}>
	<div class="header">
		<Logo />
		<h1>Claudia</h1>
	</div>
	<div class="sub-header">
		<h2>Navigation</h2>
		{#if expanded !== undefined}
			<IconButton
				class="expand-button"
				variant="flat"
				color="white"
				iconColor="white"
				fontSize="16px"
				rounded
				on:click={expanded ? handleCollapse : handleExpand}
			>
				<TbArrowBarToLeft />
			</IconButton>
		{/if}
	</div>
</div>

<style lang="scss">
	.nav-content {
		display: flex;
		flex-direction: column;
		align-items: center;

		height: 100%;

		border-width: 2px;
		border-color: $black-4;
		border-right-style: solid;

		transition: width 300ms ease;

		&.expanded {
			width: 280px;
		}

		&:not(.expanded) {
			width: 70px;

			:global(.expand-button) {
				:global(.inner) {
					:global(svg) {
						transform: rotate(180deg);
					}
				}
			}

			.header {
				gap: 0;

				h1 {
					width: 0;
				}
			}

			.sub-header {
				justify-content: center;
				gap: 0;

				padding: 12px 0;

				h2 {
					width: 0;
				}
			}
		}

		.header {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 16px;

			width: 100%;
			height: 80px;

			padding: 16px;

			border-style: none none solid none;
			border-color: $black-2;
			border-width: 2px;

			box-sizing: border-box;
			transition:
				gap 300ms ease,
				padding 300ms ease;

			:global(svg) {
				@include size(48px);
				color: $white;

				transition: all 300ms ease;
			}

			h1 {
				@include quantico(700);
				font-size: 28px;
				color: $white;

				overflow: hidden;
			}
		}

		.sub-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;

			width: 100%;
			padding: 12px 24px;

			box-sizing: border-box;
			transition:
				gap 300ms ease,
				padding 300ms ease;

			h2 {
				@include inter(500);
				font-size: 16px;
				color: $white;

				overflow: hidden;
			}
		}
	}
</style>
