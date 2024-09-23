<script lang="ts">
	import Button from "$components/common/generic/Button.svelte";
	import Pane from "$components/common/generic/Pane.svelte";
	import Logo from "$components/media/Logo.svelte";

	import IonMusicNote from "~icons/ion/music-note";
	import IonArrowForward from "~icons/ion/arrow-forward";
	import Divider from "$components/common/generic/Divider.svelte";
</script>

<main>
	<Pane>
		<div class="pane-inner">
			<h1>
				<Logo />Welcome to Claudia
			</h1>

			<div class="sub-title-wrapper">
				<h2>
					Clauida is a multipurpose Discord Bot...
					<br />
					But right now, it mainly just plays music. <IonMusicNote />
				</h2>

				<Divider color="blue-3" />
			</div>

			<h3>Here's some things you can do:</h3>

			<div class="buttons">
				<Button variant="flat" href="/guild/members" color="blue-4" textColor="blue-5"
					>View Members <IonArrowForward slot="end" /></Button
				>
				<Button variant="flat" href="/guild/music" color="blue-4" textColor="blue-5"
					>Listen to Music <IonArrowForward slot="end" /></Button
				>
			</div>
		</div>
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
			gap: 16px;

			width: 425px;

			h1 {
				display: inline-flex;
				align-items: center;
				gap: 12px;

				@include quantico(700);
				font-size: 32px;
				color: $white;

				:global(svg) {
					color: $white;
					@include size(100px);
				}
			}

			.sub-title-wrapper {
				display: flex;
				flex-direction: column;
				gap: 8px;

				h2 {
					@include inter(600);
					font-size: 16px;
					color: $blue-3;

					:global(svg) {
						color: $blue-3;
						@include size(16px);
					}
				}
			}

			h3 {
				@include inter(500);
				font-size: 14px;
				color: $white;
			}

			.buttons {
				display: flex;
				flex-direction: column;
				gap: 8px;

				margin-top: 12px;
			}
		}
	}
</style>
