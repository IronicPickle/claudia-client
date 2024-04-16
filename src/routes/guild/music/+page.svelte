<script lang="ts">
	import getSelectedDiscordGuild from "$stores/getSelectedDiscordGuild";
	import analyseAudioStream from "$utils/analyseAudioStream";
	import openAudioStreamSocket from "$utils/openAudioStreamSocket";
	import { onDestroy, onMount } from "svelte";
	import { writable } from "svelte/store";
	import AudioVisualiser from "$routes/guild/music/AudioVisualiser.svelte";
	import AudioPlayer from "./AudioPlayer.svelte";
	import AudioHeader from "./AudioHeader.svelte";
	import getMe from "$stores/getMe";
	import type { AudioSourceDetails } from "$shared/lib/ts/audio";
	import { AudioStreamSocketMessageNames } from "$shared/lib/ts/audioStreamSockets";
	import { pushError } from "$utils/generic";
	import type AudioStreamSocketClient from "$objects/AudioStreamSocketClient";

	const { store: selectedDiscordGuild } = getSelectedDiscordGuild();

	let userId: string | undefined;
	getMe().store.subscribe(({ data }) => (userId = data?.discordUser.userId));

	let audioStream: Awaited<ReturnType<typeof openAudioStreamSocket>> | undefined;
	let freqeuncyDataStore = writable<Uint8Array | undefined>();

	let playerActive = true;

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

	let isLoading = false;

	let queue: AudioSourceDetails[] = [];

	const fetchState = () => {
		if (!userId || !audioStream?.socket) return;
		isLoading = true;
		audioStream.socket.send(AudioStreamSocketMessageNames.StateReq, {});
	};

	const queueTrack = (query: string) => {
		if (!userId || !audioStream?.socket) return;
		isLoading = true;
		audioStream.socket.send(AudioStreamSocketMessageNames.PlayReq, {
			query
		});
	};

	const setup = (socket: AudioStreamSocketClient) => {
		queue = [];

		if (!socket) return;
		socket.addEventListener("message", ({ name, data }) => {
			if (name.includes("authenticate")) return;
			isLoading = false;

			switch (name) {
				case AudioStreamSocketMessageNames.StateRes: {
					if (!data.success) return pushError("Failed to fetch state!");
					queue = data.queue;

					break;
				}
				case AudioStreamSocketMessageNames.PlayRes: {
					if (!data.success) return pushError("Failed to queue track!");
					fetchState();

					break;
				}
				case AudioStreamSocketMessageNames.TrackStartEvent: {
					break;
				}
				case AudioStreamSocketMessageNames.TrackEndEvent: {
					queue = queue.slice(1);
					break;
				}
				case AudioStreamSocketMessageNames.TrackNextEvent: {
					break;
				}
				case AudioStreamSocketMessageNames.TrackPauseEvent: {
					break;
				}
				case AudioStreamSocketMessageNames.TrackResumeEvent: {
					break;
				}
				case AudioStreamSocketMessageNames.TrackSeekEvent: {
					break;
				}
				case AudioStreamSocketMessageNames.TrackStopEvent: {
					queue = [];
					break;
				}
				case AudioStreamSocketMessageNames.QueueAddEvent: {
					queue = [...queue, data.track];
					break;
				}
				case AudioStreamSocketMessageNames.QueueSkipEvent: {
					queue = queue.slice(1);
					break;
				}
				case AudioStreamSocketMessageNames.FilterChangeEvent: {
					break;
				}
				case AudioStreamSocketMessageNames.FilterResetEvent: {
					break;
				}
			}
		});

		socket.addEventListener("authenticated", () => {
			fetchState();
		});
	};

	$: if (audioStream?.socket) setup(audioStream?.socket);
</script>

<main>
	<AudioHeader currentTrack={queue[0]} bind:playerActive />

	{#if playerActive}
		<AudioPlayer {queue} {isLoading} on:queue={({ detail }) => queueTrack(detail)} />
	{/if}

	<div class="visualiser-wrapper">
		<AudioVisualiser frequencyData={$freqeuncyDataStore} />
	</div>
</main>

<style lang="scss">
	main {
		flex-grow: 1;

		position: relative;

		display: flex;
		flex-direction: column;

		.visualiser-wrapper {
			position: absolute;

			inset: 0;

			z-index: -100;
		}
	}
</style>
