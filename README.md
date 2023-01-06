# vue.js
Part of a [vue 2](https://v2.vuejs.org/) project<br>
The code shows an example of authorization using the Berear token<br>
Routing is described. Routing takes into account, in addition to authorization, user roles<br>
[Vuex](http://vuex.vuejs.org/) is used as storage<br>
The project created with [Vue CLI](https://cli.vuejs.org/)

## HTTP helper
src/helpers/AppHttp.js<br>
Wrap over [Axios](https://axios-http.com/)

### `appHttp.get(url)`
Send a GET request<br>
Method returns a Promise
#### Params
- url {string} - requred
### `appHttp.post(url[, payload[, headers]])`
Send a POST request<br>
Method returns a Promise
#### Params
- url {string} - requred
- payload {object} - optional, request body
- headers {object} - optional, headers config
### `appHttp.put(url[, payload])`
Send a PUT request<br>
Method returns a Promise
#### Params
- url {string} - requred
- payload {object} - optional, request body
### `appHttp.delete(url[, payload])`
Send a DELETE request<br>
Method returns a Promise
#### Params
- url {string} - requred
- payload {object} - optional, request body
### `appHttp.request(options)`
Send a request<br>
It's like axios(config)<br>
Method returns a Promise
#### Params
- options {object} - requred, axios config
### `appHttp.patch(url[, payload])`
Send a PATCH request<br>
Method returns a Promise
#### Params
- url {string} - requred
- payload {object} - optional, request body

## Store structure
```
store/
    ├── modules/
    │    ├── active.js
    │    ├── pagin.js
    │    └── user.js
    │    ...
    │  
    ├── index.js
    └── mutation-types.js
```
Full project contains more modules