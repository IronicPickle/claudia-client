import type Button from "$components/common/generic/Button.svelte";
import type { ComponentProps, ComponentType } from "svelte";

import IoPeople from "~icons/ion/people";
import IoMusicalNotes from "~icons/ion/musical-notes";

interface NavOption extends ComponentProps<Button> {
	label: string;
	Icon: ComponentType;
}

export default [
	{
		label: "Members",
		Icon: IoPeople,
		href: "/guild/members"
	},
	{
		label: "Music",
		Icon: IoMusicalNotes,
		href: "/guild/music"
	}
] as NavOption[];
