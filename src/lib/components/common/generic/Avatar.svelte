<script lang="ts">
	import colors from "$constants/colors";
	import type { Color } from "$ts/generic";
	import { classNames, styles } from "$utils/generic";

	export let color: Color = "gray-1";
	export let src: string | undefined = undefined;
	export let alt: string | undefined = undefined;
	export let size: number | undefined = 64;

	export let variant: "square" | "curved" | "rounded" = "rounded";

	let hasErrored = false;
</script>

<div
	class={classNames("avatar-wrapper", variant)}
	style={styles({
		"--size": `${size}px`,
		"--color": colors[color]
	})}
>
	{#if hasErrored || !src}
		<p>{alt?.slice(0, 1).toUpperCase()}</p>
	{:else}
		<img
			{src}
			{alt}
			class="avatar"
			on:error={() => {
				hasErrored = true;
			}}
		/>
	{/if}
</div>

<style lang="scss">
	$size: var(--size);
	$color: var(--color);

	.avatar-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;

		@include size($size);

		background-color: $color;

		overflow: hidden;

		&.square {
			border-radius: 0;
		}

		&.curved {
			border-radius: 10%;
		}

		&.rounded {
			border-radius: 50%;
		}

		.avatar {
			@include size(100%);
		}

		p {
			@include inter(600);
			font-size: calc($size / 2.5);
		}
	}
</style>
