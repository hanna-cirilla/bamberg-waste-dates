<script lang="ts">
	type Color = string;
	interface Props {
		colors: Color[];
		strokeWidth?: number;
	}
	let { colors, strokeWidth = 20 }: Props = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
	{#each colors as color, i}
		{@const radius = 40}
		{@const circumference = 2 * Math.PI * radius}
		{@const segmentLength = circumference / colors.length}
		<circle
			cx="50"
			cy="50"
			r={radius}
			fill="none"
			stroke={color}
			stroke-width={strokeWidth}
			stroke-dasharray="{segmentLength} {circumference - segmentLength}"
			stroke-dashoffset={i * segmentLength + circumference / 4}
		/>
	{/each}
</svg>
