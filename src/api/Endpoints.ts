import authLogin from "./auth/login.ts";
import authRefresh from "./auth/refresh.ts";

import usersMeGet from "./users/me/get.ts";

import usersGuildsGetAll from "./users/[userId]/guilds/getAll.ts";

import usersGuildsMembersGetAll from "./users/[userId]/guilds/[guildId]/members/getAll.ts";

export default abstract class Endpoints {
	static auth = {
		login: authLogin,
		refresh: authRefresh
	};

	static users = {
		me: {
			get: usersMeGet
		},
		guilds: {
			getAll: usersGuildsGetAll,

			members: {
				getAll: usersGuildsMembersGetAll
			}
		}
	};
}
