import developmentConfig from "./development.config";
import productionConfig from "./production.config";

export interface Config {
	discord: {
		clientId: string;
	};
}

const env = import.meta.env.MODE;

export const isDev = import.meta.env.DEV;
export const isProd = import.meta.env.PROD;

const config: Record<string, Config> = {
	development: developmentConfig,
	production: productionConfig
};

export default config[env];
