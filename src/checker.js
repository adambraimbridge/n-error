import 'isomorphic-fetch';
import fetch from 'node-fetch';

export const isFetchResponseError = e =>
	e instanceof fetch.Response || e instanceof Response;

export const isFetchNetworkError = e => e instanceof fetch.FetchError;

export const isFetchError = e =>
	isFetchResponseError(e) || isFetchNetworkError(e);
