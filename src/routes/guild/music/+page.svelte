<script lang="ts">
	import getSelectedDiscordGuild from "$stores/getSelectedDiscordGuild";
	import openAudioStreamSocket from "$utils/openAudioStreamSocket";
	import { onDestroy, onMount } from "svelte";

	const { store: selectedDiscordGuild } = getSelectedDiscordGuild();

	let socket: Awaited<ReturnType<typeof openAudioStreamSocket>>;

	const openSocket = async () => {
		if (!$selectedDiscordGuild) return;
		socket = await openAudioStreamSocket($selectedDiscordGuild?.guildId);
	};

	selectedDiscordGuild.subscribe(openSocket);

	onDestroy(() => {
		socket.destroy();
	});
</script>

<div class="">
	<h1>Music</h1>
</div>

<style lang="scss"></style>
