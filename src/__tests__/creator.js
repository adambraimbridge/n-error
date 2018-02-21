import nError, { ERROR_STATUS_TEXT_MAP } from '../creator';
import { assertError } from '../utils';

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
	describe('has methods', () => {
		it('to create error with status named after error type in camelCase', () => {
			const e = nError.notFound({ message: 'some error message' });
			expect(e.status).toBe(404);
			expect(e).toMatchSnapshot();
		});

		it('for all status defined in ERROR_STATUS_TEXT_MAP', () => {
			const methods = Object.keys(nError);
			expect(methods).toHaveLength(Object.keys(ERROR_STATUS_TEXT_MAP).length);
		});
	});

	describe('create NError', () => {
		it('create an Error with extended fields correctly', () => {
			const e = nError({ message: 'some message', foo: 'bar' });
			assertError(e);
		});

		it('create an ExtendedError with extend()', () => {
			const e = nError({ message: 'some message' });
			e.extend({ next: 'TEST' });
			expect(e.next).toBe('TEST');
		});

		it('create an ExtendedError with toUser()', () => {
			const e = nError({ message: 'some message' });
			e.toUser({ message: 'some other message' });
			expect(e.user).toEqual({ message: 'some other message' });
		});

		it('create an ExtendedError with setHandler()', () => {
			const e = nError({ message: 'some message' });
			e.setHandler('REDIRECT_TO_INDEX');
			expect(e.handler).toBe('REDIRECT_TO_INDEX');
		});

		// it('maintains native Error fields with rest spread', () => {
		// 	const e = new NError({ message: 'some message' });
		// 	const ee = new NError({ ...e, action: 'SOME_ACTION_TYPE' });
		// 	expect(ee.message).toBe('some message');
		// });
	});
});
