import type { Config } from "./config";

const config: Config = {
	apiUrl: "https://api.staging.claudia.ironicpickle.uk",
	socketUrl: "wss://api.staging.claudia.ironicpickle.uk",

	discord: {
		clientId: import.meta.env["VITE_DISCORD_CLIENT_ID"] as string
	}
};

export default config;
