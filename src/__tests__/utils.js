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

	describe('mutates the original input object', () => {
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
			expect(result).toMatchSnapshot();
		});

		it('non-empty string input', () => {
			const e = new Test({ status: 400, type: 'SOME_TYPE' });
			const result = removeObjectKeys(e)('status');
			expect(result).toMatchSnapshot();
		});
	});

	// describe('undefined reserved fields in Error or extended Error', () => {
	// 	it('with [string] input', () => {
	// 		const e = new Error('t');
	// 		e.type = 'SOME_TYPE';
	// 		const result = removeObjectKeys(e)(['message']);
	// 		expect(e.message).toBe('t');
	// 		expect(result.message).toBeUndefined();
	// 		expect(result.type).toBe('SOME_TYPE');
	// 	});

	// 	it('non-empty string input', () => {
	// 		const e = new Error('t');
	// 		e.type = 'SOME_TYPE';
	// 		const result = removeObjectKeys(e)('message');
	// 		expect(e.message).toBe('t');
	// 		expect(result.message).toBeUndefined();
	// 		expect(result.type).toBe('SOME_TYPE');
	// 	});
	// });

	it('throw error if keys input is not an array or string', () => {
		const obj = { a: 1, b: 2, c: 'test', 'more-complex': 'test' };
		const removeKeyList = '';
		const wrongInput = () => removeObjectKeys(obj)(removeKeyList);
		expect(wrongInput).toThrowErrorMatchingSnapshot();
	});
});
