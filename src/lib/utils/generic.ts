import config from "../../config/config";
import colors, { darkColors } from "../constants/colors";
import type { Color } from "../ts/generic";
import pSBC from "./pSBC";

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

export const discordAuthCallbackUrl = `${window.location.origin}/auth/callback`;

export const generateDiscordAuthUrl = () =>
	`https://discord.com/oauth2/authorize?${[
		`response_type=code`,
		`client_id=${config.discord.clientId}`,
		`scope=identify`,
		`state=15773059ghq9183habn`,
		`redirect_uri=${encodeURIComponent(discordAuthCallbackUrl)}`,
		`prompt=consent`
	].join("&")}`;
