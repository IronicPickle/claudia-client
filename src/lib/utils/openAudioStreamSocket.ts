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
	return new Promise<SocketClient>((resolve) => {
		const sessionToken = sessionItem.get().data?.sessionToken;

		if (sessionToken) {
			const socket = new SocketClient(
				`${config.socketUrl}/guilds/${guildId}/audioStream`,
				sessionToken
			);

			socket.addEventListener("authenticated", () => console.log("authed"));

			let audioContext: AudioContext | undefined = undefined;
			let nextTime = 0;

			socket.addEventListener("open", () => {
				audioContext = new AudioContext();
				nextTime = 0;
			});

			socket.addEventListener("messageRaw", (async (data: Blob) => {
				const stream = data.stream();
				const reader = stream.getReader();

				const streamPacket = (await reader.read()).value;

				await opusDecoder.ready;

				if (!streamPacket) return;

				try {
					const { channelData, samplesDecoded, sampleRate } = opusDecoder.decodeFrame(streamPacket);

					if (!audioContext) {
						audioContext = new AudioContext();

						nextTime = 0;
					}

					const audioSource = audioContext.createBufferSource();
					audioSource.connect(audioContext.destination);

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
					audioSource?.start(nextTime);
				} catch (err) {
					return;
				}
			}) as any);

			resolve(socket);
		}
	});
};
