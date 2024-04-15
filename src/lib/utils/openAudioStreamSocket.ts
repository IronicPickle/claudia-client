import config from "$config/config";
import StorageItem from "$objects/StorageItem";
import SocketClient from "$shared/lib/objects/SocketClient";
import type { ApiTokens } from "$shared/lib/ts/api/generic";
import { get, writable, type Writable } from "svelte/store";

import { OpusDecoder } from "opus-decoder";

const CHANNELS = 2;

const opusDecoder = new OpusDecoder({
	channels: CHANNELS
});

const sessionItem = new StorageItem<ApiTokens>("session");

export default async (guildId: string) => {
	return new Promise<{
		socket: SocketClient;
		audioContextStore: Writable<AudioContext | undefined>;
		audioAnalyserStore: Writable<AnalyserNode | undefined>;
		cleanUp: () => void;
	}>(async (resolve) => {
		await opusDecoder.ready;

		const sessionToken = sessionItem.get().data?.sessionToken;

		if (sessionToken) {
			let audioContextStore = writable<AudioContext | undefined>();
			let audioAnalyserStore = writable<AnalyserNode | undefined>();
			let nextTime = 0;

			const reset = () => {
				const audioContext = get(audioContextStore);

				if (audioContext) {
					audioContext.suspend();
					audioContext.close();
				}
				audioContextStore.set(undefined);
				audioAnalyserStore.set(undefined);
				nextTime = 0;
			};

			const socket = new SocketClient(
				`${config.socketUrl}/guilds/${guildId}/audioStream`,
				sessionToken
			);

			const cleanUp = () => {
				socket.destroy();
				reset();
			};

			socket.addEventListener("authenticated", () => console.log("authed"));

			socket.addEventListener("open", () => {
				reset();
			});

			const playPacket = async (streamPacket: Uint8Array) => {
				try {
					const { channelData, samplesDecoded, sampleRate } = opusDecoder.decodeFrame(streamPacket);

					let audioContext = get(audioContextStore);
					let audioAnalyser = get(audioAnalyserStore);

					if (!audioContext || !audioAnalyser) {
						audioContext = new AudioContext();
						audioAnalyser = audioContext.createAnalyser();

						audioContextStore.set(audioContext);
						audioAnalyserStore.set(audioAnalyser);
					}

					const audioSource = audioContext.createBufferSource();

					const audioBuffer = audioContext.createBuffer(
						channelData.length,
						samplesDecoded,
						sampleRate
					);

					for (const i in channelData) {
						const data = channelData[i];
						audioBuffer.copyToChannel(data, parseInt(i));
					}

					audioSource.buffer = audioBuffer;

					audioSource.connect(audioAnalyser);

					audioAnalyser.connect(audioContext.destination);

					nextTime += audioBuffer.duration;
					audioSource.start(nextTime);
				} catch (err) {
					return;
				}
			};

			socket.addEventListener("messageRaw", (async (data: Blob) => {
				if (!data?.stream) return reset();

				const stream = data.stream();
				const reader = stream.getReader();

				const streamPacket = (await reader.read()).value;

				if (!streamPacket) return;

				playPacket(streamPacket);
			}) as any);

			resolve({ socket, audioContextStore, audioAnalyserStore, cleanUp });
		}
	});
};
