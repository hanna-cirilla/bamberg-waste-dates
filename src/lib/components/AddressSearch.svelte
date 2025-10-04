<script lang="ts">
	import streets from '$lib/streets';
	import DOMPurify from 'dompurify';

	let address: string = $state('');
	let filteredStreets: string[] = $state([]);
	let search = $derived(new RegExp(`(${address})`, 'i'));
	let input: HTMLInputElement;

	$effect(() => {
		if (address.length > 0) {
			filteredStreets = streets
				.filter((street) => street.toLowerCase().includes(address.toLowerCase()))
				.sort()
				.slice(0, 10);
		} else {
			filteredStreets = [];
		}
	});

	const sanitize = (text: string) => DOMPurify.sanitize(text, { ALLOWED_TAGS: ['b'] });
</script>

<div class="relative w-xl">
	<input name="address" type="text" bind:value={address} bind:this={input} class="w-full" />
	<div class="absolute z-50 w-full bg-white">
		<ul>
			{#each filteredStreets as street}
				<button
					class="block w-full text-start hover:bg-amber-300"
					onclick={(e) => {
						address = e.currentTarget.textContent + ' ';
						input.focus();
					}}
				>
					{@html sanitize(street.replace(search, '<b>$1</b>'))}
				</button>
			{/each}
		</ul>
	</div>
</div>

<style>
</style>
