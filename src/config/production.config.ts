import type { Config } from "./config";

const config: Config = {
	apiUrl: "http://localhost:80",
	socketUrl: "ws://localhost:8080",

	discord: {
		clientId: import.meta.env["VITE_DISCORD_CLIENT_ID"] as string
	}
};

export default config;
