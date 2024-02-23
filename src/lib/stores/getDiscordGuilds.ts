import Endpoints from "$api/Endpoints";

const discordGuilds = Endpoints.users.guilds.getAll.manager(null);

export default () => discordGuilds;
