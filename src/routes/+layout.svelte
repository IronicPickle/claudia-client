<script>
	import Endpoints from "$api/Endpoints";
	import { onMount } from "svelte";

	onMount(async () => {
		const { data, error } = await Endpoints.users.me.get.call({});

		console.log({ data, error });
	});
</script>

<div class="root">
	<div class="viewport-wrapper">
		<div class="page-wrapper">
			<header><h1>Claudia</h1></header>
			<slot />
		</div>
	</div>
</div>

<style lang="scss">
	@import "$lib/styles/generic.scss";

	.root {
		display: flex;
		flex-direction: column;

		min-height: 100vh;

		.viewport-wrapper {
			display: flex;
			flex-direction: row;

			min-height: inherit;

			.page-wrapper {
				flex-grow: 1;

				display: flex;
				flex-direction: column;

				min-height: inherit;
				min-width: 0;

				header {
					padding: 16px 32px;

					background-color: $white;
					h1 {
						@include inter(700);
					}
				}
			}
		}
	}
</style>
