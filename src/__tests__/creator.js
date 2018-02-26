import nError, { ERROR_STATUS_TEXT_MAP } from '../creator';

describe('ERROR_STATUS_TEXT_MAP', () => {
	it('accessible via key name as number', () => {
		const type = ERROR_STATUS_TEXT_MAP[404];
		expect(type).toBe('NOT_FOUND');
	});

	it('accessible via key name as string', () => {
		const type = ERROR_STATUS_TEXT_MAP['404'];
		expect(type).toBe('NOT_FOUND');
	});
});

describe('nError', () => {
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
			// expect(ee.stack.toString()).toContain('__tests__/creator.js:37');
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
			// expect(ee.stack.toString()).toContain('__tests__/creator.js:46');
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
