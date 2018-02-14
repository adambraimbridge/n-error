import fetch from 'node-fetch';

import { isFetchError } from '../checker';

describe('isFetchError', () => {
	it('checks isomorphic-fetch Response Error correctly', () => {
		const e = new Response('', { status: 404 });
		const result = isFetchError(e);
		expect(result).toBe(true);
	});

	it('checks node-fetch Response Error correctly', () => {
		const e = new fetch.Response('', { status: 404 });
		const result = isFetchError(e);
		expect(result).toBe(true);
	});

	it('checks fetch Network Error correctly', () => {
		const e = new fetch.FetchError('some message');
		const result = isFetchError(e);
		expect(result).toBe(true);
	});

	it('check system error correctly', () => {
		const e = new Error('some message');
		const result = isFetchError(e);
		expect(result).toBe(false);
	});
});
