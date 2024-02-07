import StorageItem, { type ItemResponse } from "$objects/StorageItem";
import { onMount } from "svelte";
import { writable } from "svelte/store";

export type StorageManager<I> = ReturnType<typeof storageItem<I>>;

const storageItem = <D>(key: string, initial?: D) => {
	const storageItem = new StorageItem<D>(key);

	const prevItem = storageItem.get();

	const initialValue = prevItem.data != null ? prevItem.data : initial ?? null;

	const item = writable<ItemResponse<D>>({
		...prevItem,
		data: initialValue
	});

	const set = (data: D | null) => {
		item.set(storageItem.set(data));
		window.dispatchEvent(new Event(`storage_${key}`));
	};
	const remove = () => {
		item.set(storageItem.remove());
	};

	const handleStorageChange = () => item.set(storageItem.get());

	onMount(() => {
		window.addEventListener(`storage_${key}`, handleStorageChange);
		return () => window.removeEventListener(`storage_${key}`, handleStorageChange);
	});

	onMount(() => {
		if (initial != null && prevItem.data == null) set(initial);
	});

	return { item, set, remove };
};

export default storageItem;
