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

// TODO: .stack rest spread support from babel
export function NError(fields) {
	if (!(this instanceof NError)) {
		return new NError(fields);
	}
	Object.keys(fields).forEach(key => {
		this[key] = fields[key];
	});
	Error.captureStackTrace(this, NError);
	return this;
}

NError.prototype.extend = function extend(input) {
	return Object.assign(this, input);
};
NError.prototype.remove = function remove(input) {
	return removeObjectKeys(this)(input);
};

Object.keys(ERROR_STATUS_TEXT_MAP).forEach(status => {
	const methodName = camelcase(ERROR_STATUS_TEXT_MAP[status]);
	NError[methodName] = meta =>
		NError({
			status: Number(status),
			...meta,
		});
});

export default NError;
