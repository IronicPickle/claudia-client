<script lang="ts">
	import { page } from "$app/stores";
	import Button from "$components/common/generic/Button.svelte";
	import IconButton from "$components/common/generic/IconButton.svelte";
	import Logo from "$components/media/Logo.svelte";
	import navOptions from "$constants/navOptions";
	import getBreakpoints from "$stores/getBreakpoints";
	import getSelectedDiscordGuild from "$stores/getSelectedDiscordGuild";
	import { classNames } from "$utils/generic";
	import { createEventDispatcher } from "svelte";

	import TbArrowBarToLeft from "~icons/tabler/arrow-bar-to-left";

	export let expanded: boolean | undefined = true;

	const dispatch = createEventDispatcher<{
		expand: undefined;
		collapse: undefined;
	}>();

	const breakpoints = getBreakpoints();

	const { store: selectedDiscordGuildStore } = getSelectedDiscordGuild();

	const handleExpand = () => dispatch("expand");
	const handleCollapse = () => dispatch("collapse");
</script>

<div class={classNames("nav-content", expanded && "expanded")}>
	<a class="header" href="/">
		<Logo />
		<h1>Claudia</h1>
	</a>
	<div class="sub-header">
		<h2>
			{$selectedDiscordGuildStore?.name ?? "No server selected"}
		</h2>
		{#if !$breakpoints.md}
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

	<div class="nav-options">
		{#each navOptions as { label, Icon, ...buttonProps }}
			<Button
				fontSize="16px"
				variant="flat"
				color="blue-4"
				active={$page.route.id?.startsWith(buttonProps.href ?? "")}
				{...buttonProps}
			>
				{label}
				<svelte:fragment slot="end">
					<svelte:component this={Icon} />
				</svelte:fragment>
			</Button>
		{/each}
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

			@include maxScreen($md) {
				width: 100%;
			}
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

			.nav-options {
				:global(.button .inner) {
					padding: 0.6em;

					:global(:not(span)) {
						margin: 0;
					}

					:global(span) {
						width: 0;
					}
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

				@include textOverflow;
			}

			:global(button) {
				flex-shrink: 0;
			}
		}

		.nav-options {
			display: flex;
			flex-direction: column;

			width: 100%;

			margin-top: 8px;
			padding: 0 16px;

			box-sizing: border-box;
		}
	}
</style>
