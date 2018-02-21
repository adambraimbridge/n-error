import nError, { parseFetchError, isFetchError, createNError } from '../index';

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

describe('createNError', () => {
	it('exported correctly', () => {
		expect(typeof createNError).toBe('function');
	});
});
