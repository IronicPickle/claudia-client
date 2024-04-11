<script lang="ts">
	import type { DbDiscordMember, WithDbId } from "$shared/lib/api/server/internal/discord/dbSpec";

	import IoClose from "~icons/ion/close";
	import IoCheckmark from "~icons/ion/checkmark";
	import colors from "$constants/colors";

	export let guildMember: WithDbId<DbDiscordMember>;
</script>

<div class="content">
	<div class="ids">
		<p>User ID: ({guildMember.user?.userId}) | Member ID: ({guildMember.memberId})</p>
	</div>
	<h1>
		{guildMember.user?.username}
		{#if guildMember.nick}
			({guildMember.nick})
		{/if}
	</h1>

	<div class="details">
		<p>
			Active {#if guildMember.active}
				<IoCheckmark color={colors["green"]} />
			{:else}
				<IoClose color={colors["red"]} />
			{/if}
		</p>
		<p>
			Muted {#if guildMember.communicationDisabledUntil}
				<IoCheckmark color={colors["green"]} />
			{:else}
				<IoClose color={colors["red"]} />
			{/if}
		</p>
		<p>
			Booster {#if guildMember.premiumSince}
				<IoCheckmark color={colors["green"]} />
			{:else}
				<IoClose color={colors["red"]} />
			{/if}
		</p>
	</div>
</div>

<style lang="scss">
	.content {
		padding: 16px 24px;

		.ids {
			p {
				@include inter(500);
				font-size: 12px;
				color: $gray-2;
			}
		}

		h1 {
			margin-top: 4px;

			@include quantico(700);
			font-size: 24px;
			color: $white;
		}

		.details {
			display: flex;
			flex-direction: column;
			gap: 4px;

			margin-top: 8px;

			p {
				display: inline-flex;
				align-items: center;
				gap: 4px;

				@include inter(500);
				font-size: 14px;
				color: $gray-3;
			}
		}
	}
</style>
