<script lang="ts" context="module">
	export const isContentComponent = <C extends SvelteComponent = any>(
		content: ComponentSpawnOptions<C>["content"]
	): content is ComponentSpawnOptions<C> => !!(content as any)?.Component;
</script>

<script lang="ts">
	import type { ComponentSpawnOptions } from "$ts/generic";
	import type { SvelteComponent } from "svelte";

	export let options: ComponentSpawnOptions;
</script>

<svelte:component this={options.Component} {...options.props}>
	{#if isContentComponent(options.content)}
		<svelte:self options={options.content} />
	{:else}
		{options.content}
	{/if}
	{#if options.slots}
		{#each Object.entries(options.slots) as [name, slotOptions]}
			<div slot={name}>
				<svelte:self options={slotOptions} />
			</div>
		{/each}
	{/if}
</svelte:component>
