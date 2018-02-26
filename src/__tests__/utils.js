import { removeObjectKeys } from '../utils';

describe('removeObjectKeys', () => {
	describe('remove keys from object', () => {
		it('with [string] input', () => {
			const obj = { a: 1, b: 2, c: 'test', 'more-complex': 'test' };
			const removeKeyList = ['a', 'more-complex'];
			const result = removeObjectKeys(obj)(removeKeyList);
			expect(result).toEqual({ b: 2, c: 'test' });
		});

		it('non-empty string input', () => {
			const obj = { a: 1, b: 2, c: 'test', 'more-complex': 'test' };
			const result = removeObjectKeys(obj)('more-complex');
			expect(result).toEqual({ a: 1, b: 2, c: 'test' });
		});
	});

	describe('should work correctly for', () => {
		it('empty input array', () => {
			const obj = { a: 1, b: 2, c: 'test', 'more-complex': 'test' };
			const removeKeyList = [];
			const result = removeObjectKeys(obj)(removeKeyList);
			expect(result).toEqual(obj);
		});

		it('array construction with emtpy array rest spread ', () => {
			const obj = { a: 1, b: 2, c: 'test', 'more-complex': 'test' };
			const removeKeyList = [...[], 'test', 'more-complex'];
			const result = removeObjectKeys(obj)(removeKeyList);
			expect(result).toEqual({ a: 1, b: 2, c: 'test' });
		});

		it('input array with empty string', () => {
			const obj = { a: 1, b: 2, c: 'test', 'more-complex': 'test' };
			const removeKeyList = [''];
			const result = removeObjectKeys(obj)(removeKeyList);
			expect(result).toEqual(obj);
		});
	});

	describe('creates new instance and not mutate the original', () => {
		class Test {
			constructor(fields) {
				Object.keys(fields).forEach(key => {
					this[key] = fields[key];
				});
			}
		}

		it('with [string] input', () => {
			const e = new Test({ status: 400, type: 'SOME_TYPE' });
			const result = removeObjectKeys(e)(['status']);
			expect(result).not.toBe(e);
			expect(e.status).toBe(400);
			expect(result).toMatchSnapshot();
		});

		it('non-empty string input', () => {
			const e = new Test({ status: 400, type: 'SOME_TYPE' });
			const result = removeObjectKeys(e)('status');
			expect(result).not.toBe(e);
			expect(e.status).toBe(400);
			expect(result).toMatchSnapshot();
		});
	});

	it('throw error if keys input is not an array or string', () => {
		const obj = { a: 1, b: 2, c: 'test', 'more-complex': 'test' };
		const removeKeyList = '';
		const wrongInput = () => removeObjectKeys(obj)(removeKeyList);
		expect(wrongInput).toThrowErrorMatchingSnapshot();
	});
});
