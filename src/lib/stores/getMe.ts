import Endpoints from "$api/Endpoints";

const me = Endpoints.users.me.get.manager(null);

export default () => me;
