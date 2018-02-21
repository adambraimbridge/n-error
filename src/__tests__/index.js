import nError, { parseFetchError, isFetchError } from '../index';

describe('nError', () => {
	it('exported correctly', () => {
		expect(typeof nError.notFound).toBe('function');
	});
});

describe('parseFetchError', () => {
	it('exported correctly', () => {
		expect(typeof parseFetchError).toBe('function');
	});
});

describe('isFetchError', () => {
	it('exported correctly', () => {
		expect(typeof isFetchError).toBe('function');
	});
});
