<script lang="ts">
	import Input from "$components/common/form/Input.svelte";
	import ButtonGroup from "$components/common/generic/ButtonGroup.svelte";
	import IconButton from "$components/common/generic/IconButton.svelte";
	import { audioSourceIcons } from "$constants/audio";
	import { openInNewTabProps } from "$constants/generic";
	import { audioSourceTypeColors } from "$shared/lib/constants/audio";
	import { parseTime } from "$shared/lib/utils/generic";
	import { styles } from "$utils/generic";
	import { cubicInOut } from "svelte/easing";
	import { fly } from "svelte/transition";
	import { getAudioPlayerContext } from "./audioPlayerContext";

	import IoArrowForward from "~icons/ion/arrow-forward";
	import Form from "$components/common/form/Form.svelte";

	const { playerActiveStore, queueStore, playTrack, playTrackIsLoading } = getAudioPlayerContext();

	let query = "";

	const handlePlay = () => {
		playTrack(query);
		query = "";
	};
</script>

{#if $playerActiveStore}
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
			<Form on:submit={handlePlay}>
				<ButtonGroup flexGrowButtons>
					<Input
						variant="outlined"
						color="blue-3"
						value={query}
						placeholder="Play something..."
						disabled={$playTrackIsLoading}
						on:change={({ detail }) => (query = detail.value)}
					/>
					<IconButton type="submit" variant="flat" color="blue-3" isLoading={$playTrackIsLoading}>
						<IoArrowForward />
					</IconButton>
				</ButtonGroup>
			</Form>

			<div class="queue">
				<h1>Queue</h1>
				<div class="tracks">
					{#each $queueStore as track}
						{@const { hours, minutes, seconds, hoursPadded, minutesPadded, secondsPadded } =
							parseTime(track.duration ?? 0)}

						{#key track.id}
							<div
								class="track"
								transition:fly={{
									duration: 300,
									easing: cubicInOut,
									x: 100
								}}
							>
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
									{#if hours > 0}{hoursPadded}:{/if}{#if minutes > 0}{minutesPadded}:{/if}{secondsPadded}
								</h3>
							</div>
						{/key}
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.audio-player {
		flex-grow: 1;

		position: relative;

		display: flex;
		flex-direction: column;

		margin: 0 64px 0 64px;

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
			flex-grow: 1;

			display: flex;
			flex-direction: column;

			min-height: 0;

			margin: 32px;

			& > * {
				z-index: 100;
			}

			:global(.input-wrapper) {
				box-sizing: border-box;
			}

			.queue {
				flex-grow: 1;

				display: flex;
				flex-direction: column;

				min-height: 0;

				margin: 24px 16px;

				h1 {
					@include quantico(700);
					font-size: 24px;
					color: $white;
				}

				.tracks {
					flex-grow: 1;

					display: flex;
					flex-direction: column;
					gap: 16px;

					min-height: 0;

					margin-top: 16px;

					overflow: hidden auto;

					.track {
						padding: 8px 12px;

						border-radius: 8px;

						transition: background-color 200ms ease;

						&:hover {
							background-color: rgba($blue-5, 0.05);
						}

						a {
							width: fit-content;

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
