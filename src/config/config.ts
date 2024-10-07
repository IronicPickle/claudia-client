import developmentConfig from "./development.config";
import productionConfig from "./production.config";

export interface Config {
	apiUrl: string;
	socketUrl: string;

	discord: {
		clientId: string;
	};
}

const env = import.meta.env.MODE;

export const isDev = env === "development";
export const isProd = env === "production";

const config: Record<string, Config> = {
	development: developmentConfig,
	production: productionConfig
};

export default config[env];
