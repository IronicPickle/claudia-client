<script lang="ts"></script>

<div class="pane" {...$$restProps}>
	<div class="bg"></div>
	<slot />
</div>

<style lang="scss">
	.pane {
		position: relative;

		padding: 48px 64px;

		border-radius: 10px;
		border: 2px solid $black-4;

		.bg {
			position: absolute;
			inset: 0;

			@include frostedGlass;

			z-index: -100;
		}
	}
</style>
