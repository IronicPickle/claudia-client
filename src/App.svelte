<script lang="ts">
  import { OpusDecoder } from "opus-decoder";

  const CHANNELS = 2;

  const opusDecoder = new OpusDecoder({
    channels: CHANNELS,
  });

  let audioContext: AudioContext | undefined = undefined;
  let nextTime = 0;

  fetch("http://localhost:8081/test").then(async ({ body }) => {
    const stream = body as ReadableStream<Uint8Array>;
    const reader = stream.getReader();

    while (true) {
      const streamPacket = (await reader.read()).value;

      await opusDecoder.ready;

      try {
        const { channelData, samplesDecoded, sampleRate } =
          opusDecoder.decodeFrame(streamPacket);

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
        continue;
      }
    }
  });
</script>

<main></main>

<style>
</style>
