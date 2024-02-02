import Endpoint from "$lib/objects/Endpoint.ts";
import { api } from "../api.ts";

import {
	validator,
	type RequestSpec
} from "../../../../claudia-shared/lib/api/server/auth/login.ts";
export default new Endpoint<RequestSpec>(
	async ({ body }) =>
		await api
			.post("auth/login", {
				headers: {
					"content-type": "application/json"
				},
				json: body
			})
			.json<RequestSpec["res"]>(),
	validator
);
