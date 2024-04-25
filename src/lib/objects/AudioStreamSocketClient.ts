import SocketClient from "$shared/lib/objects/SocketClient";
import { logWs } from "$utils/generic";
import type { AudioStreamSocketMessage } from "$shared/lib/ts/audioStreamSockets";

const HEARTBEAT_INTERVAL_MS = 1000 * 60 * 2;

export default class AudioStreamSocketClient extends SocketClient<AudioStreamSocketMessage> {
	private guildId: string;

	constructor(url: string, guildId: string, token: string) {
		super(url, token, HEARTBEAT_INTERVAL_MS);

		this.guildId = guildId;

		this.addEventListener("message", ({ name, data }) => {
			if (name.includes("authenticate") || name.includes("heartbeat")) return;

			this.logEvent("MESSAGE", "-", name, data);
		});

		this.addEventListener("authenticated", () => {
			this.logEvent("AUTHENTICATED");
		});

		this.addEventListener("heartbeat", () => {
			this.logEvent("HEARTBEAT");
		});

		this.addEventListener("open", () => {
			this.logEvent("OPEN");
		});

		this.addEventListener("close", (code, wasClean) => {
			this.logEvent("CLOSE", "-", code, "-", wasClean ? "clean" : "unclean");
		});
	}

	private logEvent(event: string, ...text: any[]) {
		logWs("Web server", "-", event, ...text, "-", this.guildId);
	}
}
