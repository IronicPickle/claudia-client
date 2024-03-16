<script lang="ts">
	import Endpoints from "$api/Endpoints";
	import Error from "$components/common/generic/Error.svelte";
	import Loading from "$components/common/generic/Loading.svelte";
	import Pane from "$components/common/generic/Pane.svelte";
	import getMe from "$stores/getMe";
	import getSelectedDiscordGuild from "$stores/getSelectedDiscordGuild";

	const { store: guildMembersStore, ...guildMembers } =
		Endpoints.users.guilds.members.getAll.manager(undefined);

	const { store: selectedDiscordGuild } = getSelectedDiscordGuild();

	const { store: meStore } = getMe();

	$: {
		if ($meStore.data && $selectedDiscordGuild) {
			guildMembers.send({
				params: {
					userId: $meStore.data.discordUser.userId,
					guildId: $selectedDiscordGuild.guildId
				}
			});
		}
	}
</script>

<main>
	<Pane>
		<div class="pane-inner">
			{#await $guildMembersStore.promise}
				<Loading />
			{:then members}
				{#each members.guildMembers as member}
					<p>{member.user?.username}</p>
				{/each}
			{:catch err}
				<Error>{err}</Error>
			{/await}
		</div>
	</Pane>
</main>

<style lang="scss">
	main {
		p {
			@include inter(500);
			font-size: 24px;
			color: $white;
		}
	}
</style>
