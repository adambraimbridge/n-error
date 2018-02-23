# n-error [![npm version](https://badge.fury.io/js/%40financial-times%2Fn-error.svg)](https://badge.fury.io/js/%40financial-times%2Fn-error) [![CircleCI](https://circleci.com/gh/Financial-Times/n-error.svg?style=shield)](https://circleci.com/gh/Financial-Times/workflows/n-error) [![Coverage Status](https://coveralls.io/repos/github/Financial-Times/n-error/badge.svg?branch=master)](https://coveralls.io/github/Financial-Times/n-error?branch=master) [![Dependencies](https://david-dm.org/Financial-Times/n-error.svg)](https://david-dm.org/Financial-Times/n-error) [![Known Vulnerabilities](https://snyk.io/test/github/Financial-Times/n-error/badge.svg)](https://snyk.io/test/github/Financial-Times/n-error)

standardised error creation to be user, dev, logger friendly
> descriptitive error for handling, logging and analysis

* [quickstart](#quickstart)
* [install](#install)
* [usage](#usage)
  + [constructor](#constructor)
  + [manipulation](#manipulation)
  + [parse fetch error](#parse-fetch-error)
* [patterns](#patterns)
  + [error sources](#error-sources)
  + [descriptitive error objects](#descriptitive-error-objects)
  + [universal error handler](#universal-error-handler)

## quickstart
```js
import nError from '@financial-times/n-error';
```
```js
throw nError({ status: 404, message: 'sessionId not found', type: 'AUTH_FAILURE' });
throw nError.notFound({ message: 'sessionId not found', type: 'AUTH_FAILURE' });
```
```js
catch (e) {
  throw e.extend({
    action: 'REDIRECT_TO_INDEX',
    user: { message: 'Authentification Failed' },
  }).remove('message');
}
```

## install
```shell
npm install @financial-times/n-error
```

## usage

### constructor
```js
import nError from '@financial-times/n-error';

const e = nError({ status: 404 });
console.log(e instanceof nError);
console.log(e.stack);  // built-in .stack for stack tracing like Error
```
> true

### manipulation
use `.extend()` and `.remove()` to maintain the stack trace of the error
```js
throw e.extend({ action: 'SOME_ACTION' }).remove('message');
```

### parse fetch error
> parse fetch error into NError object with Category for further error handling

> Error or other objects would be thrown as it is

> parseFetchError() returns a `Promise`, recommended to use `await`

```js
/* api-service */
import { parseFetchError } from '@financial-times/n-error';

try{
  await fetch(url, options);
} catch (e) {
  throw await parseFetchError(e); // important to use `await` 
}
```
```js
/* controller/middleware */
import { CATEGORIES } from '@financial-times/n-error';

try {
  await APIService.call();
} catch (e) {
  // handle the error differently in case of network errors
  if(e.catogary === CATEGORIES.FETCH_NETWORK_ERROR){
    return next(e.extend({
      user: { message: `network error: ${e.code}` }
    }));
  }
  // handle fetch response error in grace 
  // parsed message according to content-type
  // stop `e.json() is not a function` error
  if(e.category === CATEGORIES.FETCH_RESPONSE_ERROR){
    const { errorCodes } = e.message;
  }
  return next(e);
}
```

## patterns

### error sources
* fetch response error
* fetch network error
* Error object
* other custom Error object

### descriptitive error objects
```js
const e = NError({
  status: 404,
  message: 'some type of message', // message from server to be logged
  action: 'REDIRECT_TO_INDEX', // describe error handling behaviour
  user: { message: 'Authentification Failed' } // override the default message from the server for UI
});
```

### universal error handler
```js
function(e, req, res, next) {
  if(e.next && e.next === 'REDIRECT_TO_ORIGINAL'){
    return res.redirect(303, `${req.originalUrl}?${query}}`);
  }
  return res.render('errors', message: e.user.message || e.message );
}
```
