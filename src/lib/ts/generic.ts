import colors from "../constants/colors";

export type Color = keyof typeof colors;

export type JustifyContent =
	| "space-between"
	| "space-evenly"
	| "space-around"
	| "flex-start"
	| "center"
	| "flex-end";
