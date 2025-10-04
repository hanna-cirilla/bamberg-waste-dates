<script lang="ts">
	import { addMonths, format, getDay, getDaysInMonth, isSameDay, setDate } from 'date-fns';
	import { de } from 'date-fns/locale';
	type Month = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
	interface Props {
		year?: number;
		month?: Month;
		monthOffset?: number;
		marks: (readonly [Date, string])[];
	}

	const today = new Date();
	let {
		year = today.getFullYear(),
		month: _month = today.getMonth() as Month,
		monthOffset = 0,
		marks = []
	}: Props = $props();

	const month = addMonths(new Date(year, _month, 1), monthOffset);

	const isToday = (day: number) => isSameDay(setDate(month, day), today);

	const days = Array.from({ length: getDaysInMonth(month) }, (_, i) => i + 1);

	const getBackground = (day: number) => {
		const todaysMarks = marks.filter(([date]) => isSameDay(date, setDate(month, day)));
		return todaysMarks.length === 0
			? ''
			: "background-image: url('/assets/segmented_circle.svg?colors=" +
					todaysMarks.map(([, color]) => encodeURIComponent(color)).join(',') +
					"');";
	};
</script>

<div class="space-y-2">
	<p class="text-center text-lg">{format(month, 'MMMM', { locale: de })}</p>
	<div class="grid grid-cols-7 gap-2" role="table">
		{#each ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as day}
			<div class="text-center font-medium" role="columnheader">{day}</div>
		{/each}
		<!-- Pad until first day of month -->
		{#each Array(getDay(month) - 1)}
			<div></div>
		{/each}
		{#each days as day}
			<div
				class="relative aspect-square rounded-full bg-cover"
				class:bg-black={isToday(day)}
				class:text-white={isToday(day)}
				class:font-medium={isToday(day)}
				style={getBackground(day)}
			>
				<div class="absolute top-1/2 left-1/2 -translate-1/2">{day}</div>
			</div>
		{/each}
	</div>
</div>
