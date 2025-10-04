import { json } from '@sveltejs/kit';
import * as cheerio from 'cheerio';
import { Cookie } from 'tough-cookie';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const straße = url.searchParams.get('straße') || '';
	const hausnummer = url.searchParams.get('hausnummer') || '';
	const hausnummerzusatz = url.searchParams.get('hausnummerzusatz') || '';

	console.log(`Fetching dates for ${straße} ${hausnummer}${hausnummerzusatz}`);

	const cookie = await retrieveCookie(fetch);
	const response = await getDates(straße, hausnummer, hausnummerzusatz, cookie!, fetch);
	const text = await response.text();
	try {
		const dates = parse(text);

		return json(
			{ straße, hausnummer, hausnummerzusatz, ...dates },
			{ headers: { 'Cache-Control': 'public, max-age=2592000' } }
		);
	} catch {
		return json(
			{
				straße,
				hausnummer,
				hausnummerzusatz,
				error: 'No data found for this address'
			},
			{
				status: 404,
				headers: { 'Cache-Control': 'public, max-age=3600' }
			}
		);
	}
};

function parse(text: string) {
	const $ = cheerio.load(text);
	const stand = $('#Zeitstempel').text().trim().replace('Stand: ', '');
	if (stand === '') {
		throw new Error('No data found');
	}
	const restmüll = $('ul#TermineRest')
		.children('li')
		.map((_, el) => $(el).text().trim())
		.get();
	const bio = $('ul#TermineBio')
		.children('li')
		.map((_, el) => $(el).text().trim())
		.get();
	const papier = $('ul#TerminePapier')
		.children('li')
		.map((_, el) => $(el).text().trim())
		.get();
	const gelberSack = $('ul#TermineGS')
		.children('li')
		.map((_, el) => $(el).text().trim())
		.get();
	return { stand, restmüll, bio, papier, gelberSack };
}

async function getDates(
	straße: string,
	hausnummer: string,
	hausnummerzusatz: string,
	cookie: Cookie,
	fetch: typeof globalThis.fetch
) {
	await setOrt(straße.charAt(0), cookie, fetch);

	const body = new FormData();
	body.append('Ajax', 'TRUE');
	body.append(
		'ApplicationName',
		'com.athos.nl.mvc.abfterm.CheckAbfuhrTermineParameterBusinessCase'
	);
	body.append('SubmitAction', 'forward');
	body.append('Ort', straße.charAt(0));
	body.append('Strasse', straße);
	body.append('Hausnummer', hausnummer);
	body.append('Hausnummerzusatz', hausnummerzusatz);
	body.append('ContainerGewaehlt_1', 'on');
	body.append('ContainerGewaehlt_2', 'on');
	body.append('ContainerGewaehlt_3', 'on');
	body.append('ContainerGewaehlt_4', 'on');
	body.append('JSESSIONID', cookie.value || '');
	const response = await fetch(
		'https://ebbweb.stadt.bamberg.de/WasteManagementBamberg/WasteManagementServlet',
		{
			body,
			method: 'POST',
			headers: {
				Cookie: cookie?.cookieString() || ''
			}
		}
	);
	return response;
}

async function setOrt(ort: string, cookie: Cookie, fetch: typeof globalThis.fetch) {
	const body = new FormData();
	body.append('Ajax', 'TRUE');
	body.append(
		'ApplicationName',
		'com.athos.nl.mvc.abfterm.CheckAbfuhrTermineParameterBusinessCase'
	);
	body.append('SubmitAction', 'CITYCHANGED');
	body.append('Ort', ort);
	body.append('JSESSIONID', cookie.value || '');

	await fetch('https://ebbweb.stadt.bamberg.de/WasteManagementBamberg/WasteManagementServlet', {
		body: body,
		method: 'POST',
		headers: {
			Cookie: cookie?.cookieString() || ''
		}
	});
}

async function retrieveCookie(fetch: typeof globalThis.fetch) {
	const response = await fetch(
		'https://ebbweb.stadt.bamberg.de/WasteManagementBamberg/WasteManagementServlet?SubmitAction=wasteDisposalServices'
	);
	return Cookie.parse(response.headers.get('Set-Cookie') || '');
}
