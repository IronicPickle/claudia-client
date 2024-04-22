import SocketClient from "$shared/lib/objects/SocketClient";
import { logWs } from "$utils/generic";
import type { AudioStreamSocketMessage } from "$shared/lib/ts/audioStreamSockets";

export default class AudioStreamSocketClient extends SocketClient<AudioStreamSocketMessage> {
	private guildId: string;

	constructor(url: string, guildId: string, token: string) {
		super(url, token);

		this.guildId = guildId;

		this.addEventListener("message", ({ name, data }) => {
			if (name.includes("authenticate")) return;
			this.logEvent("MESSAGE", "-", name, data);
		});

		this.addEventListener("authenticated", () => {
			this.logEvent("AUTHENTICATED");
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
