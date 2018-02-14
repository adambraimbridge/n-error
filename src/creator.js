import { ERROR_STATUS_TEXT_MAP } from './constants';

const errorObjectCreator = status => (meta = {}) => ({
	status,
	type: ERROR_STATUS_TEXT_MAP[status],
	...meta,
});

const badRequest = errorObjectCreator(400);
const unauthorised = errorObjectCreator(401);
const forbidden = errorObjectCreator(403);
const notFound = errorObjectCreator(404);
const requestTimeout = errorObjectCreator(408);
const conflict = errorObjectCreator(409);
const internalServerError = errorObjectCreator(500);
const badGateway = errorObjectCreator(502);
const serviceUnavailable = errorObjectCreator(503);
const gatewayTimeout = errorObjectCreator(504);

export const errorOfStatus = status => meta => {
	const statusString = parseInt(status, 10);
	if (
		Object.prototype.hasOwnProperty.call(ERROR_STATUS_TEXT_MAP, statusString)
	) {
		return errorObjectCreator(status)(meta);
	}
	return errorObjectCreator(500)(meta);
};

export default {
	badRequest,
	unauthorised,
	forbidden,
	notFound,
	requestTimeout,
	conflict,
	internalServerError,
	badGateway,
	serviceUnavailable,
	gatewayTimeout,
};
