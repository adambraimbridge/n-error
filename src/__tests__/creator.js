import nError, {
	ERROR_STATUS_TEXT_MAP,
	CustomError,
	errorCreatorOfStatus,
} from '../creator';

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

describe('CustomError', () => {
	it('create an Error with extended fields correctly', () => {
		const e = new CustomError({ message: 'some message', foo: 'bar' });
		expect(e instanceof Error).toBe(true);
		const { message, stack, ...custom } = e;
		expect(stack).toBeDefined();
		expect(message).toBe('some message');
		expect(custom).toMatchSnapshot();
	});

	// it('create an ExtendedError with action setter', () => {
	// 	const e = new CustomError({ message: 'some message' });
	// 	e.setAction('SOME_ACTION_TYPE');
	// 	expect(e.action).toBe('SOME_ACTION_TYPE');
	// });

	// it('maintains the prototype with Object rest spread', () => {
	// 	const e = new CustomError({ message: 'some message' });
	// 	const ee = { ...e, action: 'SOME_ACTION_TYPE' };
	// 	expect(ee instanceof Error).toBe(true);
	// });
});

describe('errorCreatorOfStatus', () => {
	it('create the correct error of number status code', () => {
		const e = errorCreatorOfStatus(404)({ message: 'some error message' });
		expect(e.status).toBe(404);
		expect(e).toMatchSnapshot();
	});

	it('create the correct error of status code string', () => {
		const e = errorCreatorOfStatus('404')({ message: 'some error message' });
		expect(e.status).toBe(404);
		expect(e).toMatchSnapshot();
	});

	it('create error with UNCOMMON_ERROR_TYPE in case of uncommon status code', () => {
		const e = errorCreatorOfStatus(442)({ message: 'some error message' });
		expect(e.status).toBe(442);
		expect(e).toMatchSnapshot();
	});
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
