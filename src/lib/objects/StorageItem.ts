import { browser } from "$app/environment";

export interface ItemResponse<D> {
	error: string | null;
	data: D | null;
}

export default class StorageItem<D> {
	private key: string;
	private storage: Storage | undefined;

	constructor(key: string, storage: Storage | undefined = browser ? localStorage : undefined) {
		this.key = key;
		this.storage = storage;
	}

	get() {
		const res: ItemResponse<D> = { data: null, error: null };
		try {
			let data = this.storage?.getItem(this.key);
			try {
				if (data != null) data = JSON.parse(data);
			} catch (err: any) {}
			res.data = data as any;
		} catch (err: any) {
			res.error = err.message;
		}
		return res;
	}

	set(data: D | null) {
		const res: ItemResponse<D> = { data, error: null };
		try {
			this.storage?.setItem(this.key, JSON.stringify(data));
		} catch (err: any) {
			res.error = err.message;
		}
		return res;
	}

	remove() {
		const res: ItemResponse<D> = { data: null, error: null };
		try {
			this.storage?.removeItem(this.key);
		} catch (err: any) {
			res.error = err.message;
		}
		return res;
	}
}
