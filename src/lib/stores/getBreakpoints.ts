import { writable } from "svelte/store";

export const defaultBreakpoints = {
	xs: false,
	sm: false,
	md: false,
	lg: false,
	xl: false,
	sl: false,
	ul: false
};

export type Breakpoints = typeof defaultBreakpoints;

const breakpoints = writable<Breakpoints>(defaultBreakpoints);

export default () => breakpoints;
