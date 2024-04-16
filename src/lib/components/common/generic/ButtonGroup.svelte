<script lang="ts">
	import type { FlexDirection } from "$ts/generic";
	import { classNames, styles } from "$utils/generic";

	let clazz: string | undefined = undefined;
	let id: string | undefined = undefined;
	let style: string | undefined = undefined;
	export { clazz as class, id, style };

	export let gap = "12px";
	export let flexDirection: FlexDirection = "row";
	export let flexGrowButtons = false;
	export let mergeCorners = false;
	export let hasDividers = false;
</script>

<div
	class={classNames(
		"button-group",
		flexGrowButtons && "flex-grow-buttons",
		mergeCorners && "merge-corners",
		hasDividers && "has-dividers",
		clazz
	)}
	{id}
	style={`${styles({
		"--gap": gap,
		"--flex-direction": flexDirection
	})}${style}`}
>
	<slot />
</div>

<style lang="scss">
	$gap: var(--gap);
	$flexDirection: var(--flex-direction);

	.button-group {
		display: flex;
		flex-direction: $flexDirection;
		justify-content: center;
		align-items: stretch;
		flex-wrap: wrap;
		gap: $gap;

		width: 100%;
		height: min-content;

		&.flex-grow-buttons {
			:global(> *) {
				flex-grow: 1;
				width: auto;
			}
		}

		&.merge-corners {
			--gap: 2px !important;

			&.has-dividers {
				--gap: 1px !important;
			}

			:global(> *:first-child) {
				border-top-right-radius: 0 !important;
				border-bottom-right-radius: 0 !important;

				:global(.input-overflow-wrapper),
				:global(.button),
				:global(.shine) {
					border-top-right-radius: 0 !important;
					border-bottom-right-radius: 0 !important;
				}
			}

			:global(> *:last-child) {
				border-top-left-radius: 0 !important;
				border-bottom-left-radius: 0 !important;

				:global(.input-overflow-wrapper),
				:global(.button),
				:global(.shine) {
					border-top-left-radius: 0 !important;
					border-bottom-left-radius: 0 !important;
				}
			}

			:global(> *:not(:first-child):not(:last-child)) {
				border-radius: 0 !important;

				:global(.input-overflow-wrapper),
				:global(.button),
				:global(.shine) {
					border-radius: 0 !important;
				}
			}
		}

		:global(.divider) {
			align-self: stretch !important;

			height: auto !important;
		}
	}
</style>
