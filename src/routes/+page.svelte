<script lang="ts">
	import rect_blue from '$lib/assets/rect_blue.svg';
	import rect_brown from '$lib/assets/rect_brown.svg';
	import rect_green from '$lib/assets/rect_green.svg';
	import rect_yellow from '$lib/assets/rect_yellow.svg';
	import Calendar from '$lib/components/Calendar.svelte';
	import { parse } from 'date-fns';
	import { de } from 'date-fns/locale';
	import lodash from 'lodash';
	const { range } = lodash;

	const { data } = $props();

	const mapDates = (dates: string[], color: string) =>
		dates
			.map((date) => parse(date, 'EEEEEE. dd.MM.yyyy', new Date(), { locale: de }))
			.map((d) => [d, color] as const);

	const restmüll = mapDates(data.dates.restmüll, '#8B4513'); // Updated brown
	const bio = mapDates(data.dates.bio, '#228B22'); // Updated green
	const papier = mapDates(data.dates.papier, '#1E90FF'); // Updated blue
	const gelberSack = mapDates(data.dates.gelberSack, '#FFD700'); // Updated yellow
</script>

<h1>Abfuhrtermine für</h1>
<h2>Stand: {data.dates.stand}</h2>

<div class="grid grid-cols-2 gap-8">
	{#each range(4) as monthOffset}
		<div class="rounded-xl border border-gray-500/5 p-4 shadow-lg">
			<Calendar {monthOffset} marks={[...restmüll, ...bio, ...papier, ...gelberSack]} />
		</div>
	{/each}
</div>
<div>
	<div class="text-center">
		<img src={rect_brown} alt="" class="inline-block h-4" /> <span>Restmüll</span>
		<img src={rect_green} alt="" class="inline-block h-4" /> <span>Biomüll</span>
		<img src={rect_blue} alt="" class="inline-block h-4" /> <span>Papiermüll</span>
		<img src={rect_yellow} alt="" class="inline-block h-4" /> <span>Gelber Sack</span>
	</div>
</div>
<p>
	Daten ohne freundliche Genehmigung von <a
		href="https://www.stadt.bamberg.de/B%C3%BCrgerservice/%C3%84mter/Bamberg-Service-/Abfallwirtschaft/Abfuhrtermine/"
		>Bamberg Service</a
	>.
</p>

<style>
</style>
