<script lang="ts">
	import getSelectedDiscordGuild from "$stores/getSelectedDiscordGuild";
	import openAudioStreamSocket from "$utils/openAudioStreamSocket";
	import { onDestroy } from "svelte";

	const { store: selectedDiscordGuild } = getSelectedDiscordGuild();

	let audioStream: Awaited<ReturnType<typeof openAudioStreamSocket>> | undefined;

	const openSocket = async () => {
		audioStream?.cleanUp();

		if (!$selectedDiscordGuild) return;
		audioStream = await openAudioStreamSocket($selectedDiscordGuild?.guildId);
	};

	selectedDiscordGuild.subscribe(openSocket);

	onDestroy(() => {
		audioStream?.cleanUp();
	});
</script>

<main>
	<div class="header">
		<h1>Music</h1>
	</div>
</main>

<style lang="scss">
	main {
		min-height: inherit;

		.header {
			padding: 24px 32px;

			h1 {
				@include quantico(700);
				color: $white;
			}
		}
	}
</style>
