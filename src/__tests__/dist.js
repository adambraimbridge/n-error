import fetch from 'node-fetch';

import nError, { parseFetchError, isFetchError } from '../../dist';
import { ERROR_STATUS_TEXT_MAP } from '../creator';

/* eslint-disable jest/no-disabled-tests */
const release = (name, _test) =>
	process.env.RELEASE_TEST ? describe(name, _test) : describe.skip(name, _test);
/* eslint-enable jest/no-disabled-tests */

release('nError', () => {
	describe('is a constructor function creates nError instance', () => {
		it('with .stack to trace the callStack', () => {
			const e = nError({
				message: 'some message',
				type: 'SOME_TYPE',
			});
			expect(e instanceof nError).toBe(true);
			expect(e.stack.length).toBeGreaterThan(0);
			expect(e).toMatchSnapshot();
		});

		it('exposes all fileds including .stack in Object.assign', () => {
			const e = nError({ message: 'test', a: 'a', b: 'b' });
			const ee = Object.assign(e, { c: 'c' });
			expect(ee.stack.length).toBeGreaterThan(0);
			expect(ee.stack).toBe(e.stack);
			expect(ee instanceof nError).toBe(true);
			expect(ee).toMatchSnapshot();
		});

		it('with .extend() prototype method that creates new instance and maintains the stack', () => {
			const e = nError({ message: 'some message' });
			const ee = e.extend({ next: 'TEST' });
			expect(ee).not.toBe(e);
			expect(ee.stack.toString()).toContain('src/__tests__/dist.js:');
			expect(ee.stack.length).toBeGreaterThan(0);
			expect(ee).toMatchSnapshot();
		});

		it('with .remove() prototype method that creates new instance and maintains the stack', () => {
			const e = nError({
				message: 'some message',
				type: 'SOME_TYPE',
			});
			const ee = e.remove('type');
			expect(ee).not.toBe(e);
			expect(ee.stack.toString()).toContain('src/__tests__/dist.js:');
			expect(ee).toMatchSnapshot();
		});
	});

	describe('function has methods as nError creator', () => {
		it('of status named after error type in camelCase', () => {
			const e = nError.notFound({ message: 'some error message' });
			expect(e.status).toBe(404);
			expect(e).toMatchSnapshot();
		});

		it('for all status defined in ERROR_STATUS_TEXT_MAP', () => {
			const methods = Object.keys(nError);
			expect(methods).toHaveLength(Object.keys(ERROR_STATUS_TEXT_MAP).length);
		});
	});
});

release('parseFetchError', () => {
	it('format node-fetch response error correctly', async () => {
		const headers = new fetch.Headers();
		headers.append('content-type', 'text/plain; charset=utf-8');
		const e = new fetch.Response('403 Forbidden', { status: 403, headers });
		const parsed = await parseFetchError(e);
		expect(parsed).toMatchSnapshot();
	});

	it('format isomorphic-fetch response error correctly', async () => {
		const headers = new Headers();
		headers.append('content-type', 'text/plain; charset=utf-8');
		const e = new Response('403 Forbidden', { status: 403, headers });
		const parsed = await parseFetchError(e);
		expect(parsed).toMatchSnapshot();
	});

	it('format network error correctly', async () => {
		const e = new fetch.FetchError('mocked fetch network error');
		e.code = 'MOCKED_FETCH_NETWORK_ERROR_CODE';
		const parsed = await parseFetchError(e);
		expect(parsed).toMatchSnapshot();
	});

	it('does nothing on other error types e.g. System Error ', async () => {
		const e = new Error('some error message');
		const parsed = await parseFetchError(e);
		expect(parsed).toBe(e);
	});
});

release('isFetchError', () => {
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
