import type Button from "$components/common/generic/Button.svelte";
import type { ComponentProps, ComponentType } from "svelte";
import IonPeople from "~icons/ion/people";

interface NavOption extends ComponentProps<Button> {
	label: string;
	Icon: ComponentType;
}

export default [
	{
		label: "Members",
		Icon: IonPeople,
		href: "/guild/members"
	}
] as NavOption[];
