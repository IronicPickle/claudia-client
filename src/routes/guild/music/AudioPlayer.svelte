<script lang="ts">
	import Input from "$components/common/form/Input.svelte";
	import ButtonGroup from "$components/common/generic/ButtonGroup.svelte";
	import IconButton from "$components/common/generic/IconButton.svelte";
	import { audioSourceIcons } from "$constants/audio";
	import { openInNewTabProps } from "$constants/generic";
	import { audioSourceTypeColors } from "$shared/lib/constants/audio";
	import type { AudioSourceDetails } from "$shared/lib/ts/audio";
	import { parseTime } from "$shared/lib/utils/generic";
	import getMe from "$stores/getMe";
	import { styles } from "$utils/generic";
	import { createEventDispatcher } from "svelte";
	import { cubicInOut } from "svelte/easing";
	import { fly } from "svelte/transition";

	import IoArrowForward from "~icons/ion/arrow-forward";

	const dispatch = createEventDispatcher<{
		queue: string;
	}>();

	export let queue: AudioSourceDetails[] = [];
	export let isLoading: boolean;

	let userId: string | undefined;
	getMe().store.subscribe(({ data }) => (userId = data?.discordUser.userId));

	let query = "";

	const handleQueue = () => {
		dispatch("queue", query);
		query = "";
	};
</script>

<div
	class="audio-player"
	transition:fly={{
		duration: 300,
		easing: cubicInOut,
		y: 100
	}}
>
	<div class="glass"></div>

	<div class="inner">
		<ButtonGroup flexGrowButtons>
			<Input
				variant="outlined"
				color="blue-3"
				value={query}
				placeholder="Play something..."
				on:change={({ detail }) => (query = detail.value)}
				disabled={isLoading}
			/>
			<IconButton variant="flat" color="blue-3" on:click={handleQueue} {isLoading}>
				<IoArrowForward />
			</IconButton>
		</ButtonGroup>

		<div class="queue">
			<h1>Queue</h1>
			<div class="tracks">
				{#each queue as track}
					{@const { hours, minutes, seconds } = parseTime(track.duration ?? 0)}

					<div class="track">
						<a href={track.url} {...openInNewTabProps}>{track.title}</a>
						<h2>
							<svelte:component
								this={audioSourceIcons[track.type]}
								style={styles({
									color: audioSourceTypeColors[track.type].split("x")[1]
								})}
							/>
							{track.artist}
							{#if track.album}
								- ({track.album})
							{/if}
						</h2>
						<h3>
							{#if hours > 0}{hours}:{/if}{#if minutes > 0}{minutes}:{/if}{seconds}
						</h3>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.audio-player {
		flex-grow: 1;

		position: relative;

		display: flex;
		flex-direction: column;

		margin: 0 64px 64px 64px;

		border-radius: 20px;

		overflow: hidden;

		.glass {
			position: absolute;

			inset: 0;

			background-color: $black-2;
			opacity: 0.75;
			@include frostedGlass(1000px, 1px);

			pointer-events: none;
		}

		.inner {
			display: flex;
			flex-direction: column;

			margin: 32px;

			& > * {
				z-index: 100;
			}

			:global(.input-wrapper) {
				box-sizing: border-box;
			}

			.queue {
				margin: 24px 16px;

				h1 {
					@include quantico(700);
					font-size: 24px;
					color: $white;
				}

				.tracks {
					display: flex;
					flex-direction: column;
					gap: 16px;

					margin-top: 16px;

					.track {
						a {
							@include quantico(700);
							font-size: 18px;

							@include lineClamp(1);
						}

						h2 {
							@include lineClamp(1);

							display: inline-flex;
							align-items: center;
							gap: 8px;

							@include quantico(600);
							font-size: 16px;
							color: $white;
						}

						h3 {
							@include inter(500);
							font-size: 12px;
							color: $white;
						}
					}
				}
			}
		}
	}
</style>
