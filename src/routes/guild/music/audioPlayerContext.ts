import { getContext, onDestroy, setContext } from "svelte";
import { get, writable, type Writable } from "svelte/store";
import type { AudioSourceDetails, AudioStreamFilters } from "$shared/lib/ts/audio";
import openAudioStreamSocket from "$utils/openAudioStreamSocket";
import { AudioStreamSocketMessageNames } from "$shared/lib/ts/audioStreamSockets";
import { pushError } from "$utils/generic";
import getSelectedDiscordGuild from "$stores/getSelectedDiscordGuild";
import analyseAudioStream from "$utils/analyseAudioStream";

export type AudioPlayerContext = {
	playerActiveStore: Writable<boolean>;

	queueStore: Writable<AudioSourceDetails[]>;
	trackPositionStore: Writable<0>;
	filtersStore: Writable<AudioStreamFilters | undefined>;
	isPausedStore: Writable<boolean>;

	frequencyDataStore: Writable<Uint8Array | undefined>;

	socketIsLoadingStore: Writable<boolean>;

	playTrackIsLoading: Writable<boolean>;
	skipTrackIsLoading: Writable<boolean>;
	stopTrackIsLoading: Writable<boolean>;

	pauseTrackIsLoading: Writable<boolean>;
	resumeTrackIsLoading: Writable<boolean>;

	seekIsLoading: Writable<boolean>;
	setFiltersIsLoading: Writable<boolean>;

	fetchState: () => void;

	playTrack: (query: string) => void;
	skipTrack: () => void;
	stopTrack: () => void;

	pauseTrack: () => void;
	resumeTrack: () => void;

	seek: (position: number) => void;
	setFilters: (filters: AudioStreamFilters) => void;
};

export const setAudioPlayerContext = () => {
	const audioStreamStore = writable<
		Awaited<ReturnType<typeof openAudioStreamSocket>> | undefined
	>();

	const playerActiveStore = writable(true);

	const queueStore = writable<AudioSourceDetails[]>([]);
	const trackPositionStore = writable(0);
	const filtersStore = writable<AudioStreamFilters | undefined>();
	const isPausedStore = writable(false);

	const frequencyDataStore = writable<Uint8Array | undefined>();

	const socketIsLoadingStore = writable(true);

	const playTrackIsLoading = writable(false);
	const skipTrackIsLoading = writable(false);
	const stopTrackIsLoading = writable(false);

	const pauseTrackIsLoading = writable(false);
	const resumeTrackIsLoading = writable(false);

	const seekIsLoading = writable(false);
	const setFiltersIsLoading = writable(false);

	let trackPositionInterval: any;

	const { store: selectedDiscordGuildStore } = getSelectedDiscordGuild();

	selectedDiscordGuildStore.subscribe(async (selectedDiscordGuild) => {
		get(audioStreamStore)?.cleanUp();

		if (!selectedDiscordGuild) return;
		const audioStream = await openAudioStreamSocket(selectedDiscordGuild?.guildId, isPausedStore);
		audioStreamStore.set(audioStream);
		analyseAudioStream(audioStream.audioAnalyserStore).subscribe(frequencyDataStore.set);
	});

	audioStreamStore.subscribe((audioStream) => {
		if (!audioStream) return;

		const { socket } = audioStream;

		socket?.addEventListener("message", ({ name, data }) => {
			if (name.includes("authenticate")) {
				socketIsLoadingStore.set(true);

				return;
			}

			switch (name) {
				case AudioStreamSocketMessageNames.StateRes: {
					if (!data.success) return pushError("Failed to fetch state!");
					queueStore.set(data.queue);
					trackPositionStore.set(data.trackTime ?? 0);
					filtersStore.set(data.filters);
					isPausedStore.set(data.isPaused);

					break;
				}

				case AudioStreamSocketMessageNames.PlayRes: {
					playTrackIsLoading.set(false);
					if (!data.success) return pushError("Failed to play track!");
					break;
				}
				case AudioStreamSocketMessageNames.SkipRes: {
					skipTrackIsLoading.set(false);
					if (!data.success) return pushError("Failed to skip track!");
					break;
				}
				case AudioStreamSocketMessageNames.StopRes: {
					stopTrackIsLoading.set(false);
					if (!data.success) return pushError("Failed to stop track!");
					break;
				}

				case AudioStreamSocketMessageNames.PauseRes: {
					pauseTrackIsLoading.set(false);
					if (!data.success) return pushError("Failed to pause track!");
					break;
				}
				case AudioStreamSocketMessageNames.ResumeRes: {
					resumeTrackIsLoading.set(false);
					if (!data.success) return pushError("Failed to resume track!");
					break;
				}

				case AudioStreamSocketMessageNames.SeekRes: {
					seekIsLoading.set(false);
					if (!data.success) return pushError("Failed to seek!");
					break;
				}
				case AudioStreamSocketMessageNames.SetFiltersRes: {
					setFiltersIsLoading.set(false);
					if (!data.success) return pushError("Failed to set filters!");
					break;
				}

				case AudioStreamSocketMessageNames.TrackStartEvent: {
					trackPositionStore.set(0);
					break;
				}
				case AudioStreamSocketMessageNames.TrackNextEvent: {
					queueStore.set(get(queueStore).slice(1));
					trackPositionStore.set(0);
					break;
				}
				case AudioStreamSocketMessageNames.TrackPauseEvent: {
					isPausedStore.set(true);
					break;
				}
				case AudioStreamSocketMessageNames.TrackResumeEvent: {
					isPausedStore.set(false);
					break;
				}
				case AudioStreamSocketMessageNames.TrackSeekEvent: {
					trackPositionStore.set(data.trackPosition);
					break;
				}
				case AudioStreamSocketMessageNames.TrackStopEvent: {
					queueStore.set([]);
					break;
				}
				case AudioStreamSocketMessageNames.QueueAddEvent: {
					queueStore.set([...get(queueStore), data.track]);
					break;
				}
				case AudioStreamSocketMessageNames.QueueSkipEvent: {
					break;
				}
				case AudioStreamSocketMessageNames.FilterChangeEvent: {
					filtersStore.set(data.filters);
					break;
				}
				case AudioStreamSocketMessageNames.FilterResetEvent: {
					break;
				}
			}
		});

		socket?.addEventListener("authenticated", () => {
			fetchState();
		});
	});

	const startInterval = () => {
		clearInterval(trackPositionInterval);

		if (!get(queueStore)[0] || get(isPausedStore)) return;

		trackPositionInterval = setInterval(() => {
			trackPositionStore.set(get(trackPositionStore) + 0.01);
		}, 10);
	};

	queueStore.subscribe(startInterval);
	isPausedStore.subscribe(startInterval);

	onDestroy(() => {
		clearInterval(trackPositionInterval);

		const audioStream = get(audioStreamStore);
		if (!audioStream) return;
		audioStream.cleanUp();
	});

	const fetchState = () => {
		const audioStream = get(audioStreamStore);
		if (!audioStream) return;
		audioStream.socket.send(AudioStreamSocketMessageNames.StateReq, {});
	};

	const playTrack = (query: string) => {
		const audioStream = get(audioStreamStore);
		if (!audioStream) return;
		playTrackIsLoading.set(true);
		audioStream.socket.send(AudioStreamSocketMessageNames.PlayReq, {
			query
		});
	};

	const skipTrack = () => {
		const audioStream = get(audioStreamStore);
		if (!audioStream) return;
		skipTrackIsLoading.set(true);
		audioStream.socket.send(AudioStreamSocketMessageNames.SkipReq, {});
	};

	const stopTrack = () => {
		const audioStream = get(audioStreamStore);
		if (!audioStream) return;
		stopTrackIsLoading.set(true);
		audioStream.socket.send(AudioStreamSocketMessageNames.StopReq, {});
	};

	const pauseTrack = () => {
		const audioStream = get(audioStreamStore);
		if (!audioStream) return;
		pauseTrackIsLoading.set(true);
		audioStream.socket.send(AudioStreamSocketMessageNames.PauseReq, {});
	};

	const resumeTrack = () => {
		const audioStream = get(audioStreamStore);
		if (!audioStream) return;
		resumeTrackIsLoading.set(true);
		audioStream.socket.send(AudioStreamSocketMessageNames.ResumeReq, {});
	};

	const seek = (position: number) => {
		const audioStream = get(audioStreamStore);
		if (!audioStream) return;
		seekIsLoading.set(true);
		audioStream.socket.send(AudioStreamSocketMessageNames.SeekReq, {
			position
		});
	};

	const setFilters = (filters: AudioStreamFilters) => {
		const audioStream = get(audioStreamStore);
		if (!audioStream) return;
		setFiltersIsLoading.set(true);
		audioStream.socket.send(AudioStreamSocketMessageNames.SetFiltersReq, {
			filters
		});
	};

	setContext("audio-player", {
		playerActiveStore,

		queueStore,
		trackPositionStore,
		filtersStore,
		isPausedStore,

		frequencyDataStore,

		socketIsLoadingStore,
		playTrackIsLoading,
		skipTrackIsLoading,

		pauseTrackIsLoading,
		resumeTrackIsLoading,

		seekIsLoading,
		setFiltersIsLoading,

		fetchState,

		playTrack,
		skipTrack,
		stopTrack,

		pauseTrack,
		resumeTrack,

		seek,
		setFilters
	});
};

export const getAudioPlayerContext = () => getContext<AudioPlayerContext>("audio-player");
