<script lang="ts">
	import Logo from "$components/media/Logo.svelte";
	import { sleep } from "$shared/lib/utils/generic";
	import { alphaColor, styles } from "$utils/generic";
	import { resizeObserver } from "$utils/resizeObserver";
	import { getAudioPlayerContext } from "./audioPlayerContext";

	const { frequencyDataStore } = getAudioPlayerContext();

	let passiveFrequencyData = new Uint8Array();
	let passiveFrequencyInterval: any;

	const FPS = 40;
	const CENTER_SIZE = 100;
	const LINE_OVERLAP = 0.2;

	let width = 0;
	let height = 0;

	let size = 0;
	$: size = (width > height ? width : height) - CENTER_SIZE;
	$: if (size < 0) size = 0;

	let lines = 0;
	$: lines = size / 2;

	let canvasElement: HTMLCanvasElement | undefined;

	let greatestFrequency = 0;
	let logoOpacity = 0;

	$: {
		logoOpacity = greatestFrequency / (255 / 100) / 100;
		if (logoOpacity < 0.2) logoOpacity = 0.2;
	}

	const draw = () => {
		const canvasContext = canvasElement?.getContext("2d");

		const data = $frequencyDataStore ?? passiveFrequencyData;

		if (!canvasContext || !data) return;

		setTimeout(() => requestAnimationFrame(draw), 1000 / FPS);

		greatestFrequency = 0;

		canvasContext.clearRect(0, 0, width, height);

		const lineWidth = size / 1.4 / lines;
		let x = CENTER_SIZE;

		for (let i = 0; i < lines; i++) {
			const freqeuncy = data[i];

			if (freqeuncy > greatestFrequency) greatestFrequency = freqeuncy;

			const percent = freqeuncy / (255 / 100);

			let opacity = percent / 50;

			canvasContext.strokeStyle = alphaColor("blue-2", opacity);
			canvasContext.lineWidth = lineWidth;
			canvasContext.beginPath();
			canvasContext.arc(width / 2, height / 2, x, 0, Math.PI * 2);
			canvasContext.stroke();

			x += lineWidth - LINE_OVERLAP;
		}
	};

	$: {
		const canvasContext = canvasElement?.getContext("2d");
		if (canvasContext) {
			canvasContext.clearRect(0, 0, width, height);
			draw();
		}
	}

	const PASSIVE_PROGRESSION_MULTIPLIER = 8;
	const PASSIVE_PULSE_SLEEP_MULTIPLIER = 1.25;

	const pulse = async () => {
		for (
			let offset = -(lines / 2);
			offset < lines * 1.5;
			offset += PASSIVE_PROGRESSION_MULTIPLIER
		) {
			passiveFrequencyData = new Uint8Array(lines);

			for (let i = 0; i < lines; i++) {
				let percent = Math.abs(offset - i) / (128 / 100);
				if (percent > 100) percent = 100;
				passiveFrequencyData[i] = 100 - percent;
			}

			await sleep(1000 / FPS);
		}
	};

	$: {
		clearInterval(passiveFrequencyInterval);
		if (!$frequencyDataStore) {
			const intervalMs = ((lines * 2) / PASSIVE_PROGRESSION_MULTIPLIER) * (1000 / FPS);
			pulse();
			passiveFrequencyInterval = setInterval(pulse, intervalMs * PASSIVE_PULSE_SLEEP_MULTIPLIER);
		}
		size;
	}
</script>

<div
	class="visualiser-wrapper"
	use:resizeObserver={({ clientWidth, clientHeight }) => {
		width = clientWidth;
		height = clientHeight;
	}}
>
	<canvas bind:this={canvasElement} {width} {height}></canvas>
	<Logo
		class="logo"
		style={styles({
			opacity: logoOpacity
		})}
	/>
</div>

<style lang="scss">
	.visualiser-wrapper {
		@include size(100%);

		:global(.logo) {
			position: absolute;

			@include size(100px);

			inset: 0;
			margin: auto;

			color: $white;
		}
	}
</style>
