import ColorCircle from '$lib/components/ColorCircle.svelte';
import { render } from 'svelte/server';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const colors = url.searchParams.get('colors')?.split(',') ?? ['red'];
	const html = render(ColorCircle, { props: { colors } });
	return new Response(html.body, { headers: { 'Content-Type': 'image/svg+xml' } });
};
