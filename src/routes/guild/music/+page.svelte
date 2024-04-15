<script lang="ts">
	import getSelectedDiscordGuild from "$stores/getSelectedDiscordGuild";
	import analyseAudioStream from "$utils/analyseAudioStream";
	import openAudioStreamSocket from "$utils/openAudioStreamSocket";
	import { onDestroy } from "svelte";
	import { writable } from "svelte/store";
	import AudioVisualiser from "$components/common/audio/AudioVisualiser.svelte";

	const { store: selectedDiscordGuild } = getSelectedDiscordGuild();

	let audioStream: Awaited<ReturnType<typeof openAudioStreamSocket>> | undefined;
	let freqeuncyDataStore = writable<Uint8Array | undefined>();

	const openSocket = async () => {
		audioStream?.cleanUp();

		if (!$selectedDiscordGuild) return;
		audioStream = await openAudioStreamSocket($selectedDiscordGuild?.guildId);
		analyseAudioStream(audioStream.audioAnalyserStore).subscribe(freqeuncyDataStore.set);
	};

	selectedDiscordGuild.subscribe(openSocket);

	onDestroy(() => {
		audioStream?.cleanUp();
	});
</script>

<main>
	<div class="header">
		<h1>Music</h1>
	</div>

	<div class="visualiser-wrapper">
		<AudioVisualiser frequencyData={$freqeuncyDataStore} />
	</div>
</main>

<style lang="scss">
	main {
		position: relative;

		display: flex;
		flex-direction: column;

		min-height: inherit;

		.header {
			padding: 24px 32px;

			h1 {
				@include quantico(700);
				color: $white;
			}
		}

		.visualiser-wrapper {
			position: absolute;

			inset: 0;

			z-index: -100;
		}
	}
</style>
