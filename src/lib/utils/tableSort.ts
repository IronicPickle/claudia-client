import {
	isCellComponent,
	type TableColumn,
	type TableRow
} from "$components/common/table/Table.svelte";
import type { SortDirection } from "$shared/lib/enums/generic";
import { isString, sort } from "$shared/lib/utils/generic";
import dayjs from "dayjs";
import { get, writable, type Readable } from "svelte/store";

const tableSort = <
	K extends string | number | symbol = string,
	RK extends string | number | symbol = string
>(
	columns: Readable<TableColumn<K>[]>,
	rows: Readable<TableRow<K, RK>[]>,
	searchQuery?: Readable<string>,
	page?: Readable<number>,
	pageSize?: Readable<number>
) => {
	const sortKey = writable<K>();
	const sortDirection = writable<SortDirection>();

	const handleSort = (newSortKey: K, newSortDirection: SortDirection) => {
		sortKey.set(newSortKey);
		sortDirection.set(newSortDirection);
	};

	const sortedRows = writable(get(rows));

	const totalRows = writable(get(rows).length);

	const applyFilters = () => {
		let newSortedRows = get(rows);

		if (searchQuery) {
			newSortedRows = newSortedRows.filter((row) => {
				return Object.values(row.cells).some((cell, i) => {
					if (!get(columns)[i]?.searchable) return false;
					return String(cell).toLowerCase().includes(get(searchQuery).toLowerCase());
				});
			});
		}
		if (sortKey && sortDirection) {
			const sortColumn = get(columns).find((column) => column.key === get(sortKey));

			newSortedRows = newSortedRows.sort((...cells) => {
				let a = cells[0].cells[get(sortKey)];
				let b = cells[1].cells[get(sortKey)];

				if (isCellComponent(a)) a = a.value;
				if (isCellComponent(b)) b = b.value;

				if (sortColumn?.dateFormat && isString(a) && isString(b)) {
					return sort(get(sortDirection))(
						dayjs(a, sortColumn.dateFormat).toISOString(),
						dayjs(b, sortColumn.dateFormat).toISOString()
					);
				} else {
					return sort(get(sortDirection))(a, b);
				}
			});
		}

		totalRows.set(newSortedRows.length);
		if (page != null && pageSize != null) {
			const offset = get(page) * get(pageSize);
			newSortedRows = newSortedRows.slice(offset, offset + get(pageSize));
		}

		sortedRows.set(newSortedRows);
	};

	rows.subscribe(applyFilters);
	columns.subscribe(applyFilters);

	searchQuery?.subscribe(applyFilters);

	sortKey.subscribe(applyFilters);
	sortDirection.subscribe(applyFilters);

	page?.subscribe(applyFilters);
	pageSize?.subscribe(applyFilters);

	return { columns, sortedRows, totalRows, handleSort };
};

export default tableSort;
