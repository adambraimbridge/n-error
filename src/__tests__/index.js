import nError, {
	formatFetchError,
	isFetchError,
	createCustomError,
} from '../index';

describe('nError', () => {
	it('exported correctly', () => {
		expect(typeof nError.notFound).toBe('function');
	});
});

describe('formatFetchError', () => {
	it('exported correctly', () => {
		expect(typeof formatFetchError).toBe('function');
	});
});

describe('isFetchError', () => {
	it('exported correctly', () => {
		expect(typeof isFetchError).toBe('function');
	});
});

describe('createCustomError', () => {
	it('exported correctly', () => {
		expect(typeof createCustomError).toBe('function');
	});
});
