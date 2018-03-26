# n-error 

[![npm version](https://badge.fury.io/js/%40financial-times%2Fn-error.svg)](https://badge.fury.io/js/%40financial-times%2Fn-error)
![npm download](https://img.shields.io/npm/dm/@financial-times/n-error.svg)
![node version](https://img.shields.io/node/v/@financial-times/n-error.svg)

[![CircleCI](https://circleci.com/gh/Financial-Times/n-error.svg?style=shield)](https://circleci.com/gh/Financial-Times/workflows/n-error)
[![Coverage Status](https://coveralls.io/repos/github/Financial-Times/n-error/badge.svg?branch=master)](https://coveralls.io/github/Financial-Times/n-error?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/Financial-Times/n-error/badge.svg)](https://snyk.io/test/github/Financial-Times/n-error)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/Financial-Times/n-error/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/Financial-Times/n-error/?branch=master)
[![Dependencies](https://david-dm.org/Financial-Times/n-error.svg)](https://david-dm.org/Financial-Times/n-error)
[![devDependencies](https://david-dm.org/Financial-Times/n-error/dev-status.svg)](https://david-dm.org/Financial-Times/n-error?type=dev)

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
  + [reserved fields](#reserved-fields)

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
    handler: 'REDIRECT_TO_INDEX',
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
console.log(e instanceof nError); // true
console.log(e.stack);  // built-in .stack for stack tracing like Error
```
### manipulation
use `.extend()` and `.remove()` to create new copy of the error that maintains the stack trace if you want the manipulation to be pure to avoid unclear behaviour, e.g. async failure logger attached on a lower level 
```js
throw e.extend({ handler: 'SOME_ACTION' }).remove('message');
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
  throw await parseFetchError(e); // use `await`
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
    return next(e.extend({
      user: { message: errorCodesToUserMessage(errorCodes) }
    }));
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
  handler: 'REDIRECT_TO_INDEX', // describe error handling behaviour
  user: { message: 'Authentification Failed' } // override the default message from the server for UI
});
```

### universal error handler
```js
function(err, req, res, next) {
  const e = Object.assign({}, err); // to avoid mutate input via res.render
  if(e.handler && e.handler === 'REDIRECT_TO_ORIGINAL'){
    return res.redirect(303, `${req.originalUrl}?${query}}`);
  }
  return res.render('errors', message: e.user.message || e.message );
}
```

### reserved fields
`operation`, `action`, `category`, `result` (if you use [n-auto-logger](//github.com/financial-times/n-auto-logger)) are reserved fields that can be overriden, be cautious if you really want to override the default. `handler` is recommended to specify the error handler behaviour, which would be filtered by `n-auto-logger`.
