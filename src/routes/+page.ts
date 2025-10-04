import type { PageLoad } from './$types';

interface DateApiResponse {
	stand: string;
	restmüll: string[];
	bio: string[];
	papier: string[];
	gelberSack: string[];
}

export const load = (async ({ fetch }) => {
	const response = await fetch('/api/dates');
	if (!response.ok) {
		throw new Error('Failed to fetch dates');
	}
	const dates = (await response.json()) as DateApiResponse;
	return { dates };
}) satisfies PageLoad;
