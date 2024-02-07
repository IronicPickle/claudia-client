import authLogin from "./auth/login.ts";
import authRefresh from "./auth/refresh.ts";

import usersMeGet from "./users/me/get.ts";

export default abstract class Endpoints {
	static auth = {
		login: authLogin,
		refresh: authRefresh
	};

	static users = {
		me: {
			get: usersMeGet
		}
	};
}
