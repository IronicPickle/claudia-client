import config from "$config/config";
import StorageItem from "$objects/StorageItem";
import SocketClient from "$shared/lib/objects/SocketClient";
import type { ApiTokens } from "$shared/lib/ts/api/generic";

import { OpusDecoder } from "opus-decoder";

const CHANNELS = 2;

const opusDecoder = new OpusDecoder({
	channels: CHANNELS
});

const sessionItem = new StorageItem<ApiTokens>("session");

export default async (guildId: string) => {
	return new Promise<{
		socket: SocketClient;
		audioContext: AudioBuffer | undefined;
		audioAnalyser: AnalyserNode | undefined;
		cleanUp: () => void;
	}>(async (resolve) => {
		await opusDecoder.ready;

		const sessionToken = sessionItem.get().data?.sessionToken;

		if (sessionToken) {
			let audioContext: AudioContext | undefined = undefined;
			let audioAnalyser: AnalyserNode | undefined = undefined;
			let nextTime = 0;

			setInterval(() => {
				if (!audioAnalyser) return;

				const bufferLength = audioAnalyser.frequencyBinCount;
				const dataArray = new Uint8Array(bufferLength);
				audioAnalyser.getByteFrequencyData(dataArray);

				// console.log(dataArray);

				// for (let i = 0; i < bufferLength; i++) {
				// 	console.log(dataArray[i]);
				// }
			}, 623);

			const reset = () => {
				if (audioContext) {
					audioContext.suspend();
					audioContext.close();
				}
				audioContext = undefined;
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

			const playPacket = (streamPacket: Uint8Array) => {
				try {
					const { channelData, samplesDecoded, sampleRate } = opusDecoder.decodeFrame(streamPacket);

					if (!audioContext || !audioAnalyser) {
						audioContext = new AudioContext();
					}

					audioAnalyser = audioContext.createAnalyser();
					audioAnalyser.fftSize = 128;
					audioAnalyser.minDecibels = -90;
					audioAnalyser.maxDecibels = -10;

					const audioSource = audioContext.createBufferSource();

					audioSource.connect(audioAnalyser);

					audioAnalyser.connect(audioContext.destination);

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

					nextTime += audioBuffer.duration;
					audioSource.start(nextTime);

					setTimeout(() => {
						if (!audioAnalyser) return;
						const bufferLength = audioAnalyser.frequencyBinCount;
						const dataArray = new Uint8Array(bufferLength);
						audioAnalyser.getByteFrequencyData(dataArray);
						console.log(dataArray);
					}, 10);
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

			resolve({ socket, audioContext, audioAnalyser, cleanUp });
		}
	});
};
