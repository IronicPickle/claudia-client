<script lang="ts">
	import colors from "$constants/colors";
	import type { Color } from "$ts/generic";
	import { styles } from "$utils/generic";

	export let textColor: Color = "white";
	export let fontSize = "18px";
</script>

<div
	class="empty"
	style={styles({
		"--text-color": colors[textColor],
		"--font-color": fontSize
	})}
>
	<slot />
</div>

<style lang="scss">
	$textColor: var(--text-color);
	$fontSize: var(--font-color);

	.empty {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;

		inset: 0;

		@include inter(600);
		color: $textColor;
		font-size: $fontSize;
	}
</style>
