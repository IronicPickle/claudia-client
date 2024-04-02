<script lang="ts">
	import Button from "$components/common/generic/Button.svelte";
	import ButtonGroup from "$components/common/generic/ButtonGroup.svelte";
	import Divider from "$components/common/generic/Divider.svelte";
	import IconButton from "$components/common/generic/IconButton.svelte";

	import IoTrash from "~icons/ion/trash";
	import IoPencil from "~icons/ion/pencil";
</script>

<ButtonGroup mergeCorners hasDividers>
	<Button color="blue-2" variant="contained" fontSize="14px" rounded>
		<IoPencil slot="start" />
		Edit</Button
	>
	<Divider opacity={0} orientation="vertical" />
	<IconButton color="red" variant="contained" fontSize="14px" rounded>
		<IoTrash />
	</IconButton>
</ButtonGroup>
