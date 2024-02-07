import Endpoint from "$objects/Endpoint.ts";
import { api } from "$api/api.ts";

import { type RequestSpec } from "$shared/lib/api/server/users/me/get";

export default new Endpoint<RequestSpec>(
	async ({ body }) =>
		await api
			.get("users/me", {
				headers: {
					"content-type": "application/json"
				},
				json: body
			})
			.json<RequestSpec["res"]>()
);
