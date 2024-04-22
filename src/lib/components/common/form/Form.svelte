<script lang="ts">
	import { preventAndStop, styles } from "$utils/generic";
	import { createEventDispatcher } from "svelte";

	let clazz: string | undefined = undefined;
	let id: string | undefined = undefined;
	let style: string | undefined = undefined;
	export { clazz as class, id, style };

	export let gap = "12px";

	const dispatch = createEventDispatcher<{ submit: undefined }>();

	const handleSubmit = () => dispatch("submit");
</script>

<form
	class={clazz}
	{id}
	on:submit={preventAndStop}
	style={`${styles({
		"--gap": gap
	})}${style}`}
	on:submit={handleSubmit}
>
	<slot />
</form>

<style lang="scss">
	$gap: var(--gap);

	form {
		display: flex;
		flex-direction: column;
		gap: $gap;
	}
</style>
