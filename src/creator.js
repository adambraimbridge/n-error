import camelcase from 'camelcase';

// http://www.restapitutorial.com/httpstatuscodes.html
// implement popular HTTP status code
export const ERROR_STATUS_TEXT_MAP = {
	'400': 'BAD_REQUEST',
	'401': 'UNAUTHORISED',
	// '402': 'PAYMENT_REQUIRED',
	'403': 'FORBIDDEN',
	'404': 'NOT_FOUND',
	// '405': 'METHOD_NOT_ALLOWED',
	// '406': 'NOT_ACCEPTABLE',
	// '407': 'PROXY_AUTHENTICATION_REQUIRED',
	'408': 'REQUEST_TIMEOUT',
	'409': 'CONFLICT',
	'500': 'INTERNAL_SERVER_ERROR',
	// '501': 'NOT_IMPLEMENTED',
	'502': 'BAD_GATEWAY',
	'503': 'SERVICE_UNAVAILABLE',
	'504': 'GATEWAY_TIMEOUT',
};

export class CustomError extends Error {
	constructor(fields) {
		super(fields.message);
		Object.keys(fields).forEach(key => {
			this[key] = fields[key];
		});
	}
}

export const createCustomError = fields => new CustomError(fields);

export const errorCreatorOfStatus = status => meta =>
	new CustomError({
		status: Number(status),
		...meta,
	});

export default Object.entries(ERROR_STATUS_TEXT_MAP).reduce(
	(errors, [status, statusText]) => ({
		...errors,
		[camelcase(statusText)]: errorCreatorOfStatus(status),
	}),
	{},
);
