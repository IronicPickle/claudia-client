import Endpoint from "$objects/Endpoint.ts";
import { api } from "$api/api.ts";

import { validator, type RequestSpec } from "$shared/lib/api/server/auth/refresh.ts";

export default new Endpoint<RequestSpec>(
	async ({ body }) =>
		await api
			.post("auth/refresh", {
				headers: {
					"content-type": "application/json"
				},
				json: body
			})
			.json<RequestSpec["res"]>(),
	validator
);
