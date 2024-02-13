<script lang="ts">
	import { classNames, styles } from "$utils/generic";

	export let src: string | undefined = undefined;
	export let alt: string | undefined = undefined;
	export let size: number | undefined = 64;

	export let variant: "square" | "curved" | "rounded" = "rounded";
</script>

<div
	class={classNames("avatar-wrapper", variant)}
	style={styles({
		"--size": `${size}px`
	})}
>
	<img {src} {alt} class="avatar" />
</div>

<style lang="scss">
	$size: var(--size);

	.avatar-wrapper {
		@include size($size);

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
	}
</style>
