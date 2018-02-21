import nError, { ERROR_STATUS_TEXT_MAP, NError } from '../creator';
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

describe('NError', () => {
	it('create an Error with extended fields correctly', () => {
		const e = new NError({ message: 'some message', foo: 'bar' });
		assertError(e);
	});

	// it('create an ExtendedError with action setter', () => {
	// 	const e = new NError({ message: 'some message' });
	// 	e.setAction('SOME_ACTION_TYPE');
	// 	expect(e.action).toBe('SOME_ACTION_TYPE');
	// });

	// it('maintains the prototype with Object rest spread', () => {
	// 	const e = new NError({ message: 'some message' });
	// 	const ee = { ...e, action: 'SOME_ACTION_TYPE' };
	// 	expect(ee instanceof Error).toBe(true);
	// });
});

describe('nError', () => {
	it('create the correct error by its method named after error type in camelCase', () => {
		const e = nError.notFound({ message: 'some error message' });
		expect(e.status).toBe(404);
		expect(e).toMatchSnapshot();
	});

	it('create methods for all status defined in ERROR_STATUS_TEXT_MAP', () => {
		const methods = Object.keys(nError);
		expect(methods).toHaveLength(Object.keys(ERROR_STATUS_TEXT_MAP).length);
	});
});
