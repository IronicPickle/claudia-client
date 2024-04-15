import { writable, type Writable } from "svelte/store";

export default (audioAnalyserStore: Writable<AnalyserNode | undefined>, intervalMs = 10) => {
	let interval: any;
	let frequencyData = writable<Uint8Array | undefined>();

	audioAnalyserStore.subscribe((audioAnalyser) => {
		if (interval) clearInterval(interval);
		interval = setInterval(() => {
			if (!audioAnalyser) return frequencyData.set(undefined);

			const bufferLength = audioAnalyser.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);
			audioAnalyser.fftSize = 4096;
			audioAnalyser.minDecibels = -62;
			audioAnalyser.maxDecibels = -10;
			audioAnalyser.smoothingTimeConstant = 0.95;
			audioAnalyser.getByteFrequencyData(dataArray);

			frequencyData.set(dataArray);
		}, intervalMs);
	});

	return frequencyData;
};
