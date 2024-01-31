import type { Config } from "./config";

const config: Config = {
	discord: {
		clientId: import.meta.env["VITE_DISCORD_CLIENT_ID"] as string
	}
};

export default config;
