<script lang="ts" context="module">
	export interface TableColumn<K extends string | number | symbol> {
		key: K;
		label: string;
		sortable?: boolean;
		searchable?: boolean;
		dateFormat?: string;
	}

	export interface TableRow<
		K extends string | number | symbol,
		RK extends string | number | symbol,
		DC extends SvelteComponent = any
	> {
		key: RK;
		cells: TableCells<K>;
		dropdownContent?: ComponentSpawn<DC>;
		actions?: ComponentSpawn<DC> | ComponentSpawn<DC>[];
	}

	export type CellValueComponent<C extends SvelteComponent = any> = {
		value?: any;
	} & ComponentSpawn<C>;

	export type CellValue<C extends SvelteComponent = any> =
		| string
		| number
		| boolean
		| undefined
		| null
		| CellValueComponent<C>;

	export const isCellComponent = <C extends SvelteComponent = any>(
		cell: CellValue<C>
	): cell is CellValueComponent<C> => !!(cell as any)?.Component;

	export type TableCells<K extends string | number | symbol> = Partial<Record<K, CellValue>>;
</script>

<script
	lang="ts"
	generics="K extends string | number | symbol, RK extends string | number | symbol"
>
	import { linear } from "svelte/easing";
	import { fly, slide } from "svelte/transition";
	import { isEmpty } from "$shared/lib/constants/generic";
	import Button from "../generic/Button.svelte";
	import colors from "$constants/colors";
	import { SortDirection } from "$shared/lib/enums/generic";
	import { SvelteComponent, createEventDispatcher, type ComponentProps } from "svelte";
	import type { Color, ComponentSpawn } from "$ts/generic";
	import { classNames, offsetColor, stopPropagation, styles } from "$utils/generic";
	import Loading from "../generic/Loading.svelte";
	import Error from "../generic/Error.svelte";
	import Empty from "../generic/Empty.svelte";

	import IoArrowUp from "~icons/ion/arrow-up";
	import IoArrowDown from "~icons/ion/arrow-down";

	export let color: Color = "black-3";
	export let textColor: Color = "white";

	export let headerColor: Color = "black-4";
	export let headerTextColor: Color = textColor;

	export let columns: TableColumn<K>[];
	export let rows: TableRow<K, RK>[];

	export let isLoading: boolean | undefined = undefined;
	export let error: string | undefined = undefined;

	const dispatch = createEventDispatcher<{
		sort: { sortKey: K; sortDirection: SortDirection };
	}>();

	let sortKey: K | undefined = undefined;
	let sortDirection: SortDirection | undefined = undefined;

	let dropdownOpenKeys: RK[] = [];

	const handleSort = (sortKey: K, sortDirection: SortDirection) => {
		dispatch("sort", {
			sortKey,
			sortDirection
		});
	};

	$: {
		if (sortKey && sortDirection) handleSort(sortKey, sortDirection);
	}

	let rowsHaveActions = false;
	$: rowsHaveActions = !!rows.find(({ actions }) => !!actions);
</script>

<table
	style={styles({
		"--color": colors[color],
		"--color-offset-1": offsetColor(color, 0.3),
		"--color-offset-2": offsetColor(color, 0.5),

		"--text-color": colors[textColor],

		"--header-color": colors[headerColor],
		"--header-text-color": colors[headerTextColor]
	})}
	cellSpacing={0}
>
	<thead>
		<tr>
			{#each columns as { key, label, sortable }}
				{@const isSorted = key === sortKey}
				{@const canSort = sortable}

				<th>
					<div>
						<Button
							fontSize="16px"
							color={headerColor}
							textColor={headerTextColor}
							justifyContent="flex-start"
							disableHover={!canSort}
							on:click={() => {
								if (!canSort) return;
								sortKey = key;
								sortDirection = isSorted
									? sortDirection === SortDirection.Descending
										? SortDirection.Ascending
										: SortDirection.Descending
									: SortDirection.Descending;
							}}
						>
							{label}
							<svelte:fragment slot="end">
								{#if canSort && isSorted}
									{#if sortDirection === SortDirection.Ascending}
										<IoArrowUp />
									{:else}
										<IoArrowDown />
									{/if}
								{/if}
							</svelte:fragment>
						</Button>
					</div>
				</th>
			{/each}
			{#if rowsHaveActions}
				<th>
					<div>
						<Button color={headerColor} textColor={headerTextColor} disableHover>&nbsp;</Button>
					</div>
				</th>
			{/if}
		</tr>
	</thead>

	<tbody class={classNames(isLoading && "is-loading", isEmpty(rows) && "is-empty")}>
		{#if isLoading || isEmpty(rows) || error}
			<tr>
				<td>
					{#if isLoading}
						<Loading />
					{:else if error}
						<Error>{error}</Error>
					{:else if isEmpty(rows)}
						<Empty>We couldn't find anything</Empty>
					{/if}
				</td>
			</tr>
		{:else}
			{#each rows as { key, cells, dropdownContent, actions }}
				{@const isDropdownOpen =
					!!dropdownOpenKeys.find((currKey) => currKey === key) && !!dropdownContent}

				<tr
					class={classNames(dropdownContent && "has-dropdown")}
					on:click={dropdownContent
						? () => {
								const keyIndex = dropdownOpenKeys.indexOf(key);
								if (keyIndex >= 0) {
									dropdownOpenKeys = [
										...dropdownOpenKeys.slice(0, keyIndex),
										...dropdownOpenKeys.slice(keyIndex + 1)
									];
								} else {
									dropdownOpenKeys = [...dropdownOpenKeys, key];
								}
							}
						: undefined}
				>
					{#each columns as { key }}
						{@const cell = cells[key]}
						<td>
							{#if isCellComponent(cell)}
								<svelte:component this={cell.Component} {...cell.props}>
									{cell.content}
								</svelte:component>
							{:else}
								{cell}
							{/if}
						</td>
					{/each}
					{#if rowsHaveActions}
						<td class="actions-cell">
							<div class="actions-wrapper">
								<div on:click={stopPropagation} role="none">
									{#if actions}
										{#each Array.isArray(actions) ? actions : [actions] as action}
											<svelte:component this={action.Component} {...action.props}>
												{action.content}
											</svelte:component>
										{/each}
									{/if}
								</div>
							</div>
						</td>
					{/if}
				</tr>
				{#if dropdownContent}
					<tr class="dropdown-row">
						<td class="dropdown-cell" colSpan={columns.length + 1}>
							{#if isDropdownOpen}
								<div
									transition:slide={{
										duration: 100,
										easing: linear
									}}
								>
									<div class="dropdown-content">
										<svelte:component this={dropdownContent.Component} {...dropdownContent.props}>
											{dropdownContent.content}
										</svelte:component>
									</div>
								</div>
							{/if}
						</td>
					</tr>
				{/if}
			{/each}
		{/if}
	</tbody>
</table>

<style lang="scss">
	$color: var(--color);
	$colorOffset1: var(--color-offset-1);
	$colorOffset2: var(--color-offset-2);
	$textColor: var(--text-color);

	$headerColor: var(--header-color);
	$headerTextColor: var(--header-text-color);

	table {
		background-color: $color;

		border-radius: 6px;

		overflow: hidden;

		thead {
			background-color: $headerColor;

			tr {
				th {
					div {
						:global(.button) {
							width: 100%;

							margin-bottom: 2px;

							border-radius: 0;

							:global(&.hover-disabled) {
								cursor: default;
							}
						}
					}
				}
			}
		}

		tbody {
			position: relative;

			margin: 0;
			padding: 0;

			&.is-loading,
			&.is-empty {
				height: 200px;

				.data-check {
					svg {
						@include size(40px);
						color: $gray-3;
					}
				}
			}

			tr {
				background-color: $color;
				box-shadow: 0 0 0 1px $color;

				&.has-dropdown {
					cursor: pointer;

					&:hover {
						background-color: $colorOffset1;
						box-shadow: 0 0 0 1px $colorOffset1;
					}

					&:active {
						background-color: $colorOffset1;
						box-shadow: 0 0 0 2px $colorOffset1;
					}
				}

				&.dropdown-row {
					background-color: $colorOffset2;
				}

				&:hover {
					td:not(.dropdown-cell) {
						&.actions-cell {
							opacity: 1;
						}
					}
				}

				td:not(.dropdown-cell) {
					min-width: 100px;

					padding: 12px 18px;

					@include inter(500);
					font-size: 14px;
					color: $white;

					&.actions-cell {
						opacity: 0;

						transition: 150ms opacity ease;

						.actions-wrapper {
							display: flex;
							justify-content: flex-end;
						}
					}
				}
			}
		}
	}
</style>
