import { Notification } from 'element-ui';
import jwt_decode from 'jwt-decode';

import appConf from '@/config';
import router from '@/router';
import Person from '@/models/Person';
import appHelper from '@/helpers/AppHelper';
import {
  SET_STATE,
  CLEAR_ALL,
  CLEAR_MENU,
  SET_LANG,
  SET_CONTACT_PERSON,
  SET_EMAIL,
  UPDATE_PROFILE,
} from '../mutation-types';
import vm from '@/main';

export class initUserState {
  constructor(){
    this.profile = new Person(),
    this.contactPerson = new Person(),
    this.tempToken = '',
    this.token = '',
    this.timeLogin = 0,
    this.resetExpToken = '',
    this.lang = 'en'
  }
}

export default {
  state: new initUserState,
  mutations: {
    [SET_EMAIL](state, payload) {
      state.profile.email = payload;
    },
    [UPDATE_PROFILE](state, payload) {
      state.profile = {
        ...state.profile,
        ...payload,
      };
    },
    [SET_CONTACT_PERSON](state, payload) {
      state.contactPerson = {
        ...state.contactPerson,
        ...payload,
      };
    },
    [SET_LANG](state, payload) {
      state.lang = payload;
      appHelper.setCookie('lang', payload, { 'max-age': 365 * 24 * 3600, SameSite: 'Strict' });
    }
  },
  actions: {
    login({
      commit, state, dispatch, getters,
    }, payload) {
      return new Promise((resolve, reject) => {
        commit(CLEAR_MENU);
        vm.$appHttp.post(appConf.url.login, payload).then((res) => {
          appHelper.setCookie('active', window.btoa('true'), { 'max-age': 60 * 30, SameSite: 'Strict' });

          if (res.data.customCode === '001' || res.data.customCode === '008') {
            /* must change password */

            commit(SET_EMAIL, payload.login);
            commit(SET_STATE, { module: 'user', state: 'tempToken', data: res.data.token });
            router.push({ name: 'CreatePasswordPage' });
          } else {
            commit(SET_STATE, { module: 'user', state: 'tempToken', data: '' });
            commit(SET_STATE, { module: 'user', state: 'resetExpToken', data: '' });
            commit(SET_STATE, { module: 'user', state: 'token', data: res.data.access_token });

            
            localStorage.setItem('token', res.data.access_token);
            

            axios.defaults.headers.common.Authorization = `Bearer ${res.data.access_token}`;

            switch (getters.getUserRole) {
              case 'ROLE_PARTNER':
              case 'ROLE_MANAGER':
              case 'ROLE_CONSULTANT':
              case 'ROLE_SENIOR_CONSULTANT':
                /* for consultant */
                dispatch('getCurrentConsultant').finally(() => {
                  commit(SET_EMAIL, payload.login);
                  router.push({ name: 'CompanyListPage' });
                });
                break;
              case 'ROLE_ACCOUNT_ADMIN':
                commit(SET_EMAIL, payload.login);
                router.push({ name: 'ClientsPage' });
                break;
              case 'ROLE_SERVICE_ADMIN':
                commit(SET_EMAIL, payload.login);
                router.push({ name: 'AdminCompaniesPage' });
                break;
              default:
                /* for client and assistants */
                dispatch('getCurrentUser').finally(() => {
                  commit(SET_EMAIL, payload.login);

                  let redirectPage = 'SetContactInfoPage';

                  const checkKeys = [
                    'firstName',
                    'jobTitle',
                    'lastName',
                    'phoneNumber'];

                  for (let i = 0; i < checkKeys.length; i++) {
                    if (state.profile[checkKeys[i]]) {
                      redirectPage = 'HomePage';
                      break;
                    }
                  }

                  router.push({ name: redirectPage });
                });
                dispatch('checkMenu');
                dispatch('getJdmOptions');
            }

            commit(SET_STATE, { module: 'user', state: 'timeLogin', data: Date.now() });
          }
        }).catch((err) => {
          reject(err);
        });
      });
    },
    createPassword({ dispatch, state }, payload) {
      const data = {
        ...payload,
        token: state.tempToken,
      };

      vm.$appHttp.post(appConf.url.createPassword, data).then(() => {
        dispatch('login', {
          login: state.profile.email,
          secret: payload.newPassword,
        });
      });
    },
    saveProfile({ commit, state, dispatch }, payload) {
      return new Promise((resolve) => {
        vm.$appHttp.post(appConf.url.clientPersonal, payload).then((res) => {
          commit(UPDATE_PROFILE, payload);

          if (state.contactPerson.email === state.profile.email) {
            const contactPerson = payload;
            contactPerson.email = state.profile.email;

            dispatch('saveContactPerson', contactPerson).then(() => {
              commit(SET_CONTACT_PERSON, contactPerson);
            });
          }

          let lang = 'en';
          if(state.lang){
            lang = state.lang;
          }

          Notification.success({
            title: 'Success',
            message: vm.$mess[lang].message.saved,
          });

          resolve(res);
        });
      });
    },
    changePassword(cxt, payload) {
      return new Promise((resolve) => {
        vm.$appHttp.post(appConf.url.changePassword, payload).then((res) => {
          resolve(res);
        });
      });
    },
    getContactPerson({ commit }) {
      return new Promise((resolve, reject) => {
        vm.$appHttp.get(appConf.url.clientContact).then((res) => {
          commit(SET_CONTACT_PERSON, res.data);
          resolve(res);
        }).catch((err) => {
          if (err.response.status == 404) {
            commit(SET_CONTACT_PERSON, new Person());
          }
          reject(err);
        });
      });
    },

    saveContactPerson(cxt, payload) {
      return new Promise((resolve) => {
        vm.$appHttp.post(appConf.url.clientContact, payload).then((res) => {
          resolve(res);
        });
      });
    },

    getCurrentUser({ commit }) {
      return new Promise((resolve, reject) => {
        vm.$appHttp.get(appConf.url.clientPersonal).then((res) => {
          commit(UPDATE_PROFILE, res.data);

          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getCurrentConsultant({ commit, getters }) {
      return new Promise((resolve, reject) => {
        const id = getters.getTokenInfo.userId;

        vm.$appHttp.get(appConf.url.cons.get(id)).then((res) => {
          const cons = new Person(res.data.email, res.data.firstName, res.data.lastName);

          commit(UPDATE_PROFILE, cons);

          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    logout({ commit }) {
      vm.$appHttp.post(appConf.url.logout);
      commit(CLEAR_ALL);
      axios.defaults.headers.common.Authorization = '';
      appHelper.deleteCookie('active');
      commit(SET_STATE, { module: 'user', state: 'token', data: '' });
      localStorage.removeItem('token');
      setTimeout(() => {
        location.reload();
      }, 300);
      
    },
    logoutByExpTime({ state, commit }) {
      let token = state.token || localStorage.getItem('token');
      
      if (token) {
        vm.$appHttp.post(appConf.url.logout);
      }
      commit(CLEAR_ALL);
      axios.defaults.headers.common.Authorization = '';
      appHelper.deleteCookie('active');
      commit(SET_STATE, { module: 'user', state: 'token', data: '' });
      localStorage.removeItem('token');
    },
  },
  getters: {
    getEmailDomain: (state) => {
      const arrEmail = state.profile.email.split('@');
      return arrEmail[1];
    },
    getTokenInfo: (state) => {
      let token = state.token || localStorage.getItem('token');
      if (token) {
        return jwt_decode(token);
      }
      return {};
    },
    checkRole: (state) => (roles) => {
      let token = state.token || localStorage.getItem('token');
      if (!token) {
        return 0;
      }

      const tokenInfo = jwt_decode(token);

      let result = 0;
      let role = tokenInfo.authorities[0];

      if (tokenInfo.authorities.includes('ROLE_GRADING_ASSISTANT') && tokenInfo.authorities.includes('ROLE_SURVEY_ASSISTANT')) {
        role = 'ROLE_SURVEY_GRADING_ASSISTANT';
      }

      if (Array.isArray(roles)) {
        roles.forEach((el) => {
          result += role.includes(el);
        });
      } else {
        result += role.includes(roles);
      }

      return result;
    },
    getUserRole: (state) => {
      let token = state.token || localStorage.getItem('token');
      if (token) {
        const tokenInfo = jwt_decode(token);

        if (tokenInfo.authorities.includes('ROLE_GRADING_ASSISTANT') && tokenInfo.authorities.includes('ROLE_SURVEY_ASSISTANT')) {
          return 'ROLE_SURVEY_GRADING_ASSISTANT';
        }

        return tokenInfo.authorities[0];
      }
      return '';
    },
  },
};
