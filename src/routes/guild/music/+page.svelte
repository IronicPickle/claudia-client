<script lang="ts">
	import AudioVisualiser from "./AudioVisualiser.svelte";
	import AudioPlayer from "./AudioPlayer.svelte";
	import AudioHeader from "./AudioHeader.svelte";
	import { setAudioPlayerContext } from "./audioPlayerContext";
	import AudioPlayerControls from "./AudioPlayerControls.svelte";

	setAudioPlayerContext();
</script>

<main>
	<AudioHeader />

	<AudioPlayer />
	<AudioPlayerControls />

	<div class="visualiser-wrapper">
		<AudioVisualiser />
	</div>
</main>

<style lang="scss">
	main {
		flex-grow: 1;

		position: relative;

		display: flex;
		flex-direction: column;
		gap: 16px;

		.visualiser-wrapper {
			position: absolute;

			inset: 0;

			z-index: -100;
		}
	}
</style>
