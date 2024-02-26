<script lang="ts">
	import Pane from "$components/common/generic/Pane.svelte";
</script>

<main>
	<Pane>
		<div class="pane-inner"></div>
	</Pane>
</main>

<style lang="scss">
	main {
		display: flex;
		align-items: center;
		justify-content: center;

		min-height: inherit;

		.pane-inner {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 24px;

			width: 280px;
			min-height: 300px;

			h1 {
				@include quantico(700);
				font-size: 32px;
				color: $white;
			}

			.guilds {
				display: flex;
				flex-direction: column;
				align-self: stretch;
				gap: 16px;
			}

			.selected-guild {
				flex-grow: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-self: stretch;
				gap: 16px;

				p {
					@include inter(600);
					font-size: 18px;
					color: $white;
					text-align: center;
				}

				:global(.button) {
					align-self: center;
				}
			}
		}
	}
</style>
