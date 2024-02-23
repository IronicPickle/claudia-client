<script lang="ts"></script>

<div class="pane" {...$$restProps}>
	<slot />
</div>

<style lang="scss">
	.pane {
		position: relative;

		padding: 48px 64px;

		background: linear-gradient(180deg, $black-2 30%, $black-1 100%);
		border-radius: 10px;
		border: 2px solid $black-4;
	}
</style>
