<script lang="ts">
	import Button from "$components/common/generic/Button.svelte";
	import Error from "$components/common/generic/Error.svelte";
	import Loading from "$components/common/generic/Loading.svelte";
	import Pane from "$components/common/generic/Pane.svelte";
	import getDiscordGuilds from "$stores/getDiscordGuilds";
	import getSelectedDiscordGuild from "$stores/getSelectedDiscordGuild";
	import IoArrowForward from "~icons/ion/arrow-forward";
	import IoClose from "~icons/ion/close";

	const { store: discordGuildsStore } = getDiscordGuilds();

	const { store: selectedDiscordGuildStore, set: setSelectedDiscordGuild } =
		getSelectedDiscordGuild();
</script>

<main>
	<Pane>
		<div class="pane-inner">
			{#await $discordGuildsStore.promise}
				<Loading />
			{:then data}
				{#if !$selectedDiscordGuildStore}
					<h1>Your Servers</h1>
					<div class="guilds">
						{#each data.discordGuilds as discordGuild}
							<Button
								variant="outlined"
								fontSize="20px"
								color="blue-1"
								textColor="white"
								on:click={() => setSelectedDiscordGuild(discordGuild._id)}
							>
								<IoArrowForward slot="end" />
								{discordGuild.name}
							</Button>
						{/each}
					</div>
				{:else}
					<h1>Selected Server</h1>
					<div class="selected-guild">
						<p>{$selectedDiscordGuildStore.name}</p>
						<Button
							fontSize="20px"
							variant="flat"
							color="red"
							textColor="red"
							on:click={() => setSelectedDiscordGuild(null)}
						>
							<IoClose slot="end" />
							Unselect</Button
						>
					</div>
				{/if}
			{:catch error}
				<Error>{error.error}</Error>
			{/await}
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
