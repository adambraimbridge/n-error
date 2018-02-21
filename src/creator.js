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

export class NError extends Error {
	constructor(fields) {
		super(fields.message);
		Object.keys(fields).forEach(key => {
			this[key] = fields[key];
		});

		this.extend = input => {
			Object.keys(input).forEach(key => {
				this[key] = input[key];
			});
		};

		this.toUser = input => {
			this.user = input;
		};

		this.setHandler = input => {
			this.handler = input;
		};
	}
}

// TODO: a creator that maintains instanceof Error, and .stack
// but of an independent constructor that can be rest spreaded
const nError = fields => new NError(fields);

Object.keys(ERROR_STATUS_TEXT_MAP).forEach(status => {
	const methodName = camelcase(ERROR_STATUS_TEXT_MAP[status]);
	nError[methodName] = meta =>
		nError({
			status: Number(status),
			...meta,
		});
});

export default nError;
