import type { PageServerLoad } from './$types';

interface DateApiResponse {
	stand: string;
	restmüll: string[];
	bio: string[];
	papier: string[];
	gelberSack: string[];
}

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

import type { Actions } from './$types';

export const actions = {
	default: async ({ fetch, request }) => {
		const formData = await request.formData();
		const address = formData.get('address')?.toString() ?? '';
		const matches = address.match(/^(.+?)\s+(\d+)(\s*(\w+))?$/);
		if (matches === null) {
			return { address, dates: null, error: 'Invalid address format' };
		}

		const searchParams = new URLSearchParams({
			straße: matches[1],
			hausnummer: matches[2]
		});
		if (matches[3]) searchParams.append('hausnummerzusatz', matches[3]);

		const endpoint = '/api/dates?' + searchParams;
		const response = await fetch(endpoint);
		if (!response.ok) {
			return { address, dates: null, error: 'No data found for this address' };
		}
		const dates = (await response.json()) as DateApiResponse;
		return { address, dates };
	}
} satisfies Actions;
