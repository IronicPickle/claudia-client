import Endpoints from "$api/Endpoints";
import { derived } from "svelte/store";

const me = Endpoints.users.me.get.manager(null);

export default () => me;
