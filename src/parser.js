import { isFetchResponseError, isFetchNetworkError } from './checker';
import nError from './creator';
import { CATEGORIES } from './constants';

// parse the response error based on content-type text/html, text/plain or application/json
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// https://msdn.microsoft.com/en-us/library/ms526971(v=exchg.10).aspx
export const parseFetchResponseError = async response => {
	if (response.ok) {
		return {
			category: CATEGORIES.FETCH_RESPONSE_OK,
			status: response.status,
			message: "it shouldn't be caught as exception, please check the code",
		};
	}

	const { status, headers } = response;
	const contentType = headers.get('content-type');
	const parseMethod =
		contentType && contentType.includes('application/json') ? 'json' : 'text';
	const message = await response[parseMethod](); // system Error would be thrown if it fails
	return nError({
		category: CATEGORIES.FETCH_RESPONSE_ERROR,
		contentType,
		status,
		message,
	});
};

export const parseFetchNetworkError = e =>
	nError({
		category: CATEGORIES.FETCH_NETWORK_ERROR,
		message: e.message,
		code: e.code,
	});

export const parseFetchError = async e => {
	if (isFetchResponseError(e)) {
		const parsedError = await parseFetchResponseError(e);
		return parsedError;
	}
	if (isFetchNetworkError(e)) {
		return parseFetchNetworkError(e);
	}
	return e; // uncaught exception
};
