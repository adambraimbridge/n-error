import fetch from 'node-fetch';
import {
	parseFetchResponseError,
	parseFetchNetworkError,
	parseFetchError,
} from '../parser';
import { CATEGORIES } from '../constants';
import { assertError } from '../utils';

describe('parseFetchResponseError', () => {
	it('reports wrong response being threw to catch if response is ok', async () => {
		const headers = new Headers();
		headers.append('content-type', 'text/plain; charset=utf-8');
		const response = new Response('', { status: 200, headers });
		const parsed = await parseFetchResponseError(response);
		expect(parsed.category).toBe(CATEGORIES.FETCH_RESPONSE_OK);
		expect(parsed).toMatchSnapshot();
	});

	it('format error in text/html contentType correctly', async () => {
		const headers = new Headers();
		headers.append('content-type', 'text/html; charset=utf-8');
		const message = '<html></html>';
		const e = new Response(message, { status: 404, headers });
		const parsed = await parseFetchResponseError(e);
		expect(parsed.message).toBe(message);
		assertError(parsed);
	});

	it('format error in text/plain contentType correctly', async () => {
		const headers = new Headers();
		headers.append('content-type', 'text/plain; charset=utf-8');
		const message = '403 Forbidden';
		const e = new Response(message, { status: 403, headers });
		const parsed = await parseFetchResponseError(e);
		expect(parsed.message).toBe(message);
		assertError(parsed);
	});

	it('format error in application/json contentType correctly', async () => {
		const headers = new Headers();
		headers.append('content-type', 'application/json; charset=utf-8');
		const message = { message: 'some message', document: 'some url' };
		const e = new Response(JSON.stringify(message), { status: 404, headers });
		const parsed = await parseFetchResponseError(e);
		expect(parsed.message).toEqual(message);
		assertError(parsed);
	});
});

describe('parseFetchNetworkError', () => {
	it('format network error correctly', () => {
		const e = new fetch.FetchError('mocked fetch network error');
		e.code = 'MOCKED_FETCH_NETWORK_ERROR_CODE';
		const parsed = parseFetchNetworkError(e);
		expect(parsed.category).toBe(CATEGORIES.FETCH_NETWORK_ERROR);
		assertError(parsed);
	});
});

describe('parseFetchError', () => {
	it('format node-fetch response error correctly', async () => {
		const headers = new fetch.Headers();
		headers.append('content-type', 'text/plain; charset=utf-8');
		const e = new fetch.Response('403 Forbidden', { status: 403, headers });
		const parsed = await parseFetchError(e);
		expect(parsed.category).toBe(CATEGORIES.FETCH_RESPONSE_ERROR);
		assertError(parsed);
	});

	it('format isomorphic-fetch response error correctly', async () => {
		const headers = new Headers();
		headers.append('content-type', 'text/plain; charset=utf-8');
		const e = new Response('403 Forbidden', { status: 403, headers });
		const parsed = await parseFetchError(e);
		expect(parsed.category).toBe(CATEGORIES.FETCH_RESPONSE_ERROR);
		assertError(parsed);
	});

	it('format network error correctly', async () => {
		const e = new fetch.FetchError('mocked fetch network error');
		e.code = 'MOCKED_FETCH_NETWORK_ERROR_CODE';
		const parsed = await parseFetchError(e);
		expect(parsed.category).toBe(CATEGORIES.FETCH_NETWORK_ERROR);
		assertError(parsed);
	});

	it('does nothing on other error types e.g. System Error ', async () => {
		const e = new Error('some error message');
		const parsed = await parseFetchError(e);
		expect(parsed).toBe(e);
	});
});
