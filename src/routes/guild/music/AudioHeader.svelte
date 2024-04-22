<script lang="ts">
	import Button from "$components/common/generic/Button.svelte";
	import { audioSourceIcons } from "$constants/audio";
	import { audioSourceTypeColors } from "$shared/lib/constants/audio";
	import { styles } from "$utils/generic";
	import { getAudioPlayerContext } from "./audioPlayerContext";

	import IoEye from "~icons/ion/eye";
	import IoEyeOff from "~icons/ion/eye-off";

	const { queueStore, playerActiveStore } = getAudioPlayerContext();

	let currentTrack = $queueStore[0];
	$: currentTrack = $queueStore[0];
</script>

<div class="audio-header">
	<h1>Music</h1>

	<div class="current-track">
		<h2>
			{currentTrack?.title ?? "Nothing Playing"}
		</h2>
		{#if currentTrack}
			<h3>
				<svelte:component
					this={audioSourceIcons[currentTrack.type]}
					style={styles({
						color: audioSourceTypeColors[currentTrack.type].split("x")[1]
					})}
				/>
				{currentTrack.artist}
			</h3>
		{/if}
	</div>

	<Button fontSize="16px" on:click={() => playerActiveStore.set(!$playerActiveStore)} rounded>
		Player
		<svelte:fragment slot="start">
			{#if $playerActiveStore}
				<IoEyeOff />
			{:else}
				<IoEye />
			{/if}
		</svelte:fragment>
	</Button>
</div>

<style lang="scss">
	.audio-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 48px;

		padding: 24px 32px;

		h1 {
			@include quantico(700);
			font-size: 32px;
			color: $white;
		}

		.current-track {
			display: flex;
			flex-direction: column;
			align-items: center;
			flex-wrap: nowrap;

			h2 {
				@include quantico(700);
				font-size: 18px;
				color: $white;
				text-align: center;

				@include lineClamp(1);
			}

			h3 {
				@include lineClamp(1);
				display: inline-flex;
				align-items: center;
				gap: 8px;

				@include inter(700);
				font-size: 14px;
				color: $gray-3;
				text-align: center;
			}
		}
	}
</style>
