import colors, { darkColors } from "../constants/colors.ts";
import type { Color } from "../ts/generic.ts";
import pSBC from "./pSBC.ts";

export const styles = (styles: Record<string, any> = {}) =>
	Object.entries(styles)
		.map(([key, value]) => `${key}: ${value};`)
		.join(" ");

export const classNames = (...classNames: Array<any>) =>
	classNames.filter((className) => !!className).join(" ");

export const offsetColor = (color: Color, offset: number) =>
	pSBC(darkColors.includes(color) ? offset / 4 : -offset, colors[color]);

const extractRgb = (rgb: string) => {
	const [_, r, g, b] = /\((\d{1,3}), *(\d{1,3}), *(\d{1,3})/g.exec(rgb) ?? [];

	return [r, g, b];
};

export const alphaColor = (color: Color, alpha: number) => {
	const [r, g, b] = extractRgb(colors[color]);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
