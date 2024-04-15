<script lang="ts">
	import Logo from "$components/media/Logo.svelte";
	import { alphaColor, styles } from "$utils/generic";
	import { resizeObserver } from "$utils/resizeObserver";

	export let frequencyData: Uint8Array | undefined;

	const FPS = 40;
	const CENTER_SIZE = 100;
	const LINE_OVERLAP = 0.2;

	let width = 0;
	let height = 0;

	let size = 0;
	$: size = (width > height ? width : height) - CENTER_SIZE;

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

		const freqeuncyData = frequencyData;

		if (!canvasContext) return;

		setTimeout(() => requestAnimationFrame(draw), 1000 / FPS);

		greatestFrequency = 0;

		canvasContext.clearRect(0, 0, width, height);

		if (freqeuncyData) {
			const lineWidth = size / lines;
			let x = CENTER_SIZE;

			for (let i = 0; i < lines; i++) {
				const freqeuncy = freqeuncyData[i];

				if (freqeuncy > greatestFrequency) greatestFrequency = freqeuncy;

				const percent = freqeuncy / (255 / 100);

				let opacity = percent / 50;
				if (opacity < 0.05) opacity = 0.05;

				canvasContext.strokeStyle = alphaColor("blue-2", opacity);
				canvasContext.lineWidth = lineWidth;
				canvasContext.beginPath();
				canvasContext.arc(width / 2, height / 2, x, 0, Math.PI * 2);
				canvasContext.stroke();

				x += lineWidth - LINE_OVERLAP;
			}
		}
	};

	$: {
		const canvasContext = canvasElement?.getContext("2d");
		if (canvasContext) {
			canvasContext.clearRect(0, 0, width, height);
			draw();
		}
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
