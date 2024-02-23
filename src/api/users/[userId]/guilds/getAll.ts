import Endpoint from "$objects/Endpoint.ts";
import { api } from "$api/api.ts";

import { type RequestSpec } from "$shared/lib/api/server/users/[userId]/guilds/getAll";

export default new Endpoint<RequestSpec>(
	async ({ params: { userId } }) =>
		await api
			.get(`users/${userId}/guilds`, {
				headers: {
					"content-type": "application/json"
				}
			})
			.json<RequestSpec["res"]>()
);
