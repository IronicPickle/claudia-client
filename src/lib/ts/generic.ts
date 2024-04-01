import colors from "$constants/colors";
import type { ComponentEvents, ComponentProps, SvelteComponent } from "svelte";

export type Color = keyof typeof colors;

export type JustifyContent =
	| "space-between"
	| "space-evenly"
	| "space-around"
	| "flex-start"
	| "center"
	| "flex-end";

export type DiscordAvatarType = "jpg" | "jpeg" | "png" | "webp" | "gif";
export type DiscordAvatarSize = number;

export type Option = {
	value: string | number;
	label: any;
	color?: Color;
	textColor?: Color;
	iconColor?: Color;
	startIcon?: ComponentSpawnOptions;
	endIcon?: ComponentSpawnOptions;
	disabled?: boolean;
	justifyContent?: JustifyContent;
	href?: string;
};

export interface ChangeData<N, V> {
	name?: N;
	value: V;
}

export interface ComponentSpawnOptions<
	C extends SvelteComponent<P, E> = any,
	P extends Record<string, any> = ComponentProps<C>,
	E extends Record<string, any> = ComponentEvents<C>,
	S extends Record<string, ComponentSpawnOptions> = any
> {
	Component: any;
	props?: P;
	slots?: S;
	content?: any | ComponentSpawnOptions;
}
