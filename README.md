# n-error [![npm version](https://badge.fury.io/js/%40financial-times%2Fn-error.svg)](https://badge.fury.io/js/%40financial-times%2Fn-error) [![CircleCI](https://circleci.com/gh/Financial-Times/n-error.svg?style=shield)](https://circleci.com/gh/Financial-Times/n-error) [![Coverage Status](https://coveralls.io/repos/github/Financial-Times/n-error/badge.svg?branch=master)](https://coveralls.io/github/Financial-Times/n-error?branch=master) [![Dependencies](https://david-dm.org/Financial-Times/n-error.svg)](https://david-dm.org/Financial-Times/n-error) [![Known Vulnerabilities](https://snyk.io/test/github/Financial-Times/n-error/badge.svg)](https://snyk.io/test/github/Financial-Times/n-error)

standardise custom Error object and error handling, logger compliant

## creator
```js
import nError, { createNError } from '@financial-times/n-error';

throw nError.notFound({ message: 'sessionId not found' });

catch (e) {
  throw createNError({ 
    ...e,
    user: { status: 403, message: 'You need to login.' },
    next: 'REDIRECT_TO_INDEX',
  });
}
```

## error handling patterns

### source of errors
* fetch response error (from API)
* fetch network error
* custom Error (threw by code intentionally)
* node Error (threw by Node)

### fetch error parser
> parse fetch error into NError object with Category label for further error handling
> node Error or custom Error would be thrown as it is
```js
/* api-service */
import { parseFetchError } from '@financial-times/n-error';

try{
  await fetch(url, options);
} catch (e) {
  throw parseFetchError(e);
}
```
```js
try {
  await APIService.call();
} catch (e) {
  if(e.catogary === 'FETCH_NETWORK_ERROR'){
    return next(createNError({
      status: 500,
      user: { message: e.message }
    }))
  }
  return next(e);
}
```

### error handling
```js
function(err, req, res, next){
    if(err.next && err.next === 'REDIRECT_TO_ORIGINAL'){
      return res.redirect(303, `${req.originalUrl}?${query}}`);
    }
    //...
}
```
