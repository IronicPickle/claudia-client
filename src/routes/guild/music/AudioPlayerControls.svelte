<script lang="ts">
	import IconButton from "$components/common/generic/IconButton.svelte";
	import { getAudioPlayerContext } from "./audioPlayerContext";
	import ButtonGroup from "$components/common/generic/ButtonGroup.svelte";

	import IoPlaySkipBack from "~icons/ion/play-skip-back";
	import IoPlaySkipForward from "~icons/ion/play-skip-forward";
	import IoStop from "~icons/ion/stop";
	import IoPause from "~icons/ion/pause";
	import IoPlay from "~icons/ion/play";
	import { parseTime } from "$shared/lib/utils/generic";
	import { classNames } from "$utils/generic";

	const {
		playerActiveStore,
		trackPositionStore,
		queueStore,
		filtersStore,
		isPausedStore,
		skipTrack,
		skipTrackIsLoading,
		stopTrack,
		stopTrackIsLoading,
		pauseTrack,
		pauseTrackIsLoading,
		resumeTrack,
		resumeTrackIsLoading,
		seek,
		seekIsLoading,
		setFilters,
		setFiltersIsLoading
	} = getAudioPlayerContext();

	let duration = 0;
	$: duration = $queueStore[0]?.duration ?? 0;

	let percent = 0;
	$: percent = $trackPositionStore / (duration / 100);
</script>

<div class={classNames("audio-player-controls", $playerActiveStore && "player-active")}>
	<div class="glass" />

	<div class="inner">
		<div>
			<ButtonGroup mergeCorners>
				<IconButton
					fontSize="14px"
					on:click={() => seek(0)}
					isLoading={$seekIsLoading}
					disabled={!$queueStore[0]}
				>
					<IoPlaySkipBack />
				</IconButton>
				<IconButton
					fontSize="14px"
					on:click={stopTrack}
					isLoading={$stopTrackIsLoading}
					disabled={!$queueStore[0]}
				>
					<IoStop />
				</IconButton>
				{#if $isPausedStore}
					<IconButton
						fontSize="14px"
						on:click={resumeTrack}
						isLoading={$resumeTrackIsLoading}
						disabled={!$queueStore[0]}
					>
						<IoPlay />
					</IconButton>
				{:else}
					<IconButton
						fontSize="14px"
						on:click={pauseTrack}
						isLoading={$pauseTrackIsLoading}
						disabled={!$queueStore[0]}
					>
						<IoPause />
					</IconButton>
				{/if}
				<IconButton
					fontSize="14px"
					on:click={skipTrack}
					isLoading={$skipTrackIsLoading}
					disabled={!$queueStore[0]}
				>
					<IoPlaySkipForward />
				</IconButton>
			</ButtonGroup>
		</div>

		<div class="track-position">
			<p>
				{#if $queueStore[0]}
					{@const { hours: durationHours, minutes: durationMinutes } = parseTime(
						$queueStore[0].duration ?? 0
					)}
					{@const { hoursPadded, minutesPadded, secondsPadded } = parseTime($trackPositionStore)}
					{#if durationHours > 0}{hoursPadded}:{/if}{#if durationMinutes > 0}{minutesPadded}:{/if}{secondsPadded}
				{:else}
					00:00
				{/if}
			</p>

			<input
				type="range"
				value={percent}
				on:change={({ currentTarget: { value } }) => {
					const position = (duration / 100) * parseInt(value);
					seek(position);
				}}
				disabled={$seekIsLoading}
				step={0.01}
			/>
		</div>

		<div class="volume">
			<p>
				{#if $filtersStore}
					{$filtersStore.volume}
				{:else}
					0
				{/if}
			</p>

			<input
				type="range"
				value={$filtersStore?.volume ?? 0}
				on:change={({ currentTarget: { value } }) => {
					if (!$filtersStore) return;
					setFilters({ ...$filtersStore, volume: parseInt(value) });
				}}
				disabled={$setFiltersIsLoading}
				step={1}
			/>
		</div>
	</div>
</div>

<style lang="scss">
	.audio-player-controls {
		position: relative;

		margin: auto 64px 16px 64px;

		border-radius: 20px;

		overflow: hidden;
		transition:
			margin 300ms ease,
			border-radius 300ms ease;

		&:not(.player-active) {
			margin: auto 0 0 0;

			border-radius: 0;

			.inner {
				margin: 24px 24px;
			}
		}

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
			align-items: center;
			gap: 20px;

			margin: 24px 32px;

			transition: margin 300ms ease;

			p {
				@include quantico(700);
				font-size: 16px;
				color: $white;
			}

			.track-position {
				flex-grow: 1;

				display: flex;
				align-items: center;
				gap: 20px;

				input {
					flex-grow: 1;
				}
			}

			.volume {
				display: flex;
				align-items: center;
				gap: 20px;

				input {
					flex-grow: 1;
				}
			}

			& > * {
				z-index: 100;
			}
		}
	}
</style>
