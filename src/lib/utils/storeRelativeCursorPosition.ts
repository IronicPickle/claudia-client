import { type Writable } from "svelte/store";

export interface CursorCoords {
	x: number;
	y: number;
}

export default (writable: Writable<CursorCoords>) =>
	({ offsetX, offsetY }: MouseEvent) => {
		writable.set({
			x: offsetX,
			y: offsetY
		});
	};
