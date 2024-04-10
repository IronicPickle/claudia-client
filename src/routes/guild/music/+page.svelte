<script lang="ts">
	import config from "$config/config";
	import getSelectedDiscordGuild from "$stores/getSelectedDiscordGuild";
	import SocketClient from "$shared/lib/objects/SocketClient";
	import storageItem from "$utils/storageItem";
	import type { ApiTokens } from "$shared/lib/ts/api/generic";

	// import { OpusDecoder } from "opus-decoder";

	// const CHANNELS = 2;

	// const opusDecoder = new OpusDecoder({
	// 	channels: CHANNELS
	// });

	// let audioContext: AudioContext | undefined = undefined;
	// let nextTime = 0;

	// fetch("http://localhost:8081/test").then(async ({ body }) => {
	// 	const stream = body as ReadableStream<Uint8Array>;
	// 	const reader = stream.getReader();

	// 	while (true) {
	// 		const streamPacket = (await reader.read()).value;

	// 		await opusDecoder.ready;

	// 		if (!streamPacket) continue;

	// 		try {
	// 			const { channelData, samplesDecoded, sampleRate } = opusDecoder.decodeFrame(streamPacket);

	// 			if (!audioContext) {
	// 				audioContext = new AudioContext();

	// 				nextTime = 0;
	// 			}

	// 			const audioSource = audioContext.createBufferSource();
	// 			audioSource.connect(audioContext.destination);

	// 			const audioBuffer = audioContext.createBuffer(
	// 				channelData.length,
	// 				samplesDecoded,
	// 				sampleRate
	// 			);

	// 			for (const i in channelData) {
	// 				const data = channelData[i];
	// 				audioBuffer.copyToChannel(data, parseInt(i));
	// 			}

	// 			audioSource.buffer = audioBuffer;

	// 			nextTime += audioBuffer.duration;
	// 			audioSource?.start(nextTime);
	// 		} catch (err) {
	// 			continue;
	// 		}
	// 	}
	// });

	const { store: selectedDiscordGuild } = getSelectedDiscordGuild();

	const { item: sessionItem } = storageItem<ApiTokens>("session");

	$: {
		if ($selectedDiscordGuild && $sessionItem.data?.sessionToken) {
			const socket = new SocketClient(
				`${config.socketUrl}/guilds/${$selectedDiscordGuild?.guildId}/audioStream`,
				$sessionItem.data.sessionToken
			);

			socket.addEventListener("authenticated", () => console.log("authed"));
		}
	}
</script>

<div class="">
	<h1>Music</h1>
</div>

<style lang="scss"></style>
