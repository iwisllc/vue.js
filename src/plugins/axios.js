import Vue from 'vue';
import axios from 'axios';

import store from '@/store';
import appConf from '@/config';
import appCurLang from '@/helpers/AppCurLang';

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

axios.defaults.headers.common.Accept = 'application/json';
let lang = appCurLang;
if (lang == 'ua') {
 lang = 'uk';
}
axios.defaults.headers.common['Accept-Language'] = lang;
// axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

const config = {
 // baseURL: process.env.baseURL || process.env.apiUrl || ""
 // timeout: 60 * 1000, // Timeout
 // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
 (config) => {
  // Do something before request is sent
  let { token } = store.state.user;

  if (!token) {
   token = localStorage.getItem('token');
  }

  if (token) {
   config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
 },
 (error) =>
  // Do something with request error
  Promise.reject(error)
);

// Add a response interceptor
_axios.interceptors.response.use(
 (response) =>
  // Do something with response data
  response,
 (err) => {
  if (err.response) {
   const contactsNotExist =
    err.response.config.method == 'get' &&
    appConf.url.clientContact == err.response.config.url;
   const logoutError = appConf.url.logout == err.response.config.url;

   /**
    * conditions:
    * new user,
    * contact not exists
    * logoutError
    * */
   if (
    err.response.data.customCode === '001' ||
    contactsNotExist ||
    logoutError
   ) {
    return Promise.reject(err);
   }
  }

  store.dispatch('showError', err);
  return Promise.reject(err);
 }
);

Plugin.install = function (Vue) {
 Vue.axios = _axios;
 window.axios = _axios;
 Object.defineProperties(Vue.prototype, {
  axios: {
   get() {
    return _axios;
   },
  },
  $axios: {
   get() {
    return _axios;
   },
  },
 });
};

Vue.use(Plugin);

export default Plugin;
