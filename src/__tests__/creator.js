import errorCreator, { errorOfStatus } from '../creator';

describe('errorCreator', () => {
	it('create the correct error by its method', () => {
		const e = errorCreator.notFound({ message: 'some error message' });
		expect(e).toMatchSnapshot();
	});
});

describe('errorOfStatus', () => {
	it('create the correct error of status', () => {
		const e = errorOfStatus(404)({ message: 'some error message' });
		expect(e).toMatchSnapshot();
	});
});
