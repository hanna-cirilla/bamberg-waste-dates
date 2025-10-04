<script lang="ts">
	import { getDaysInMonth, getDay, isSameDay } from 'date-fns';

	const today = new Date();
	let { year = today.getFullYear(), month: _month = today.getMonth() } = $props();

	const month = new Date(year, _month, 1);
	const isToday = (day: number) => isSameDay(new Date(year, _month, day), today);

	const days = Array.from({ length: getDaysInMonth(month) }, (_, i) => i + 1);
</script>

<div class="grid grid-cols-7 gap-2">
	<!-- Pad until first day of month -->
	{#each Array(getDay(month) - 1)}
		<div></div>
	{/each}
	{#each days as day}
		<div
			class="relative aspect-square rounded-full"
			class:bg-black={isToday(day)}
			class:text-white={isToday(day)}
		>
			<div class="absolute top-1/2 left-1/2 -translate-1/2 font-medium">{day}</div>
		</div>
	{/each}
</div>
