import { browser } from "$app/environment";
import config, { isDev } from "$config/config";
import colors, { darkColors } from "$constants/colors";
import { ConsoleColor } from "$shared/lib/enums/generic";
import type { Color, DiscordAvatarSize, DiscordAvatarType } from "$ts/generic";
import pSBC from "./pSBC";

export const devLog = (...text: any[]) => {
	if (isDev) console.log("[Dev]", ">", ...text);
};

export const logWs = (...text: Array<any>) =>
	devLog(ConsoleColor.Blue, "[WS]", ConsoleColor.Reset, ...text);

export const pushError = (...args: any[]) => {
	devLog(...args);

	// TODO
	// Push to snackbar store
	// Push to external error log (sanity maybe)
};

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

export const discordAuthCallbackUrl = browser ? `${window.location.origin}/auth/callback` : "";

export const generateDiscordAuthUrl = () =>
	`https://discord.com/oauth2/authorize?${[
		`response_type=code`,
		`client_id=${config.discord.clientId}`,
		`scope=identify`,
		`state=15773059ghq9183habn`,
		`redirect_uri=${encodeURIComponent(discordAuthCallbackUrl)}`,
		`prompt=consent`
	].join("&")}`;

export const generateDiscordAvatarUrl = (
	userId: string,
	avatarhash: string,
	size: DiscordAvatarSize = 80,
	format: DiscordAvatarType = "png"
) => `https://cdn.discordapp.com/avatars/${userId}/${avatarhash}.${format}?size=${size}`;

export const preventAndStop = (event: Event) => {
	event.preventDefault();
	event.stopPropagation();
	return event;
};

export const stopPropagation = (event: Event) => {
	event.stopPropagation();
	return event;
};
