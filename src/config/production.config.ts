import type { Config } from "./config";

const config: Config = {
	apiUrl: "https://api.claudia.ironicpickle.uk",
	socketUrl: "wss://api.claudia.ironicpickle.uk",

	discord: {
		clientId: import.meta.env["VITE_DISCORD_CLIENT_ID"] as string
	}
};

export default config;
