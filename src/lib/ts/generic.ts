import colors from "$constants/colors";

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
	startIcon?: any;
	endIcon?: any;
	disabled?: boolean;
	justifyContent?: JustifyContent;
	href?: string;
};

export interface ChangeData<N, V> {
	name?: N;
	value: V;
}
