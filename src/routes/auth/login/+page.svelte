<script lang="ts">
	import Button from "$lib/components/common/generic/Button.svelte";

	const CLIENT_ID = "1124008138811646134";
	const SCOPE = "identify";
	const REDIRECT_URI = "http://localhost:5173/";

	const params = [
		`response_type=code`,
		`client_id=${CLIENT_ID}`,
		`scope=${SCOPE}`,
		`state=15773059ghq9183habn`,
		`redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
		`prompt=consent`
	];

	const authUrl = `https://discord.com/oauth2/authorize?${params.join("&")}`;
</script>

<Button
	><div slot="start-icon" let:class={className} class={className}></div>
	Auth</Button
>
