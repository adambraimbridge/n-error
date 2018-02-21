import camelcase from 'camelcase';

import { removeObjectKeys } from './utils';

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

		this.remove = input => {
			removeObjectKeys(this)(input);
		};

		this.toUser = input => {
			this.user = input;
		};

		this.setHandler = input => {
			this.handler = input;
		};
	}
}

const nError = fields => new NError(fields);

// TODO: .stack rest spread support from babel
// export function LoggerStandardError(fields) {
// 	if (!(this instanceof LoggerStandardError)) {
// 		return new LoggerStandardError(fields);
// 	}
// 	Object.keys(fields).forEach(key => {
// 		this[key] = fields[key];
// 	});
// 	Error.captureStackTrace(this, LoggerStandardError);
// 	return this;
// }

// LoggerStandardError.prototype = Error.prototype;

Object.keys(ERROR_STATUS_TEXT_MAP).forEach(status => {
	const methodName = camelcase(ERROR_STATUS_TEXT_MAP[status]);
	nError[methodName] = meta =>
		nError({
			status: Number(status),
			...meta,
		});
});

export default nError;
