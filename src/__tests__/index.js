import { formatFetchError } from '../index';

describe('formatFetchError', () => {
	it('exported correctly', () => {
		expect(typeof formatFetchError).toBe('function');
	});
});
