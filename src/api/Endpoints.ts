import authLogin from "./auth/login.ts";

export default abstract class Endpoints {
	static auth = {
		login: authLogin
	};
}
