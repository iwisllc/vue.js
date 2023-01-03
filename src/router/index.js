import Vue from 'vue';
import Router from 'vue-router';

import appHelper from '@/helpers/AppHelper';
import store from '../store';

import clientOther from './client/other';
import auth from './common/auth';
import admin from './admin/admin';
import interimCompany from './reports/company/interim';

Vue.use(Router);

let routes = [
 {
  path: '/',
  name: 'HomePage',
  component: () => import('../views/dash/HomePage'),
  meta: {
   // requiresAuth: true
  },
 },
 {
  path: '/contact-info',
  name: 'ContactInfoPage',
  component: () => import('../views/company/ContactInfoPage'),
  meta: {
   requiresAuth: true,
   roles: appHelper.likeClientRoles,
  },
 },
 {
  path: '/company-info',
  name: 'CompanyInfoPage',
  component: () => import('../views/company/CompanyInfoPage'),
  meta: {
   requiresAuth: true,
   roles: appHelper.likeClientRoles,
  },
 },
 {
  path: '/settings',
  name: 'ProfilePage',
  component: () => import('../views/settings/ProfilePage'),
  meta: {
   requiresAuth: true,
  },
 },
 {
  path: '/settings/assistant',
  name: 'AssistantPage',
  component: () => import('../views/settings/AssistantPage'),
  meta: {
   requiresAuth: true,
   roles: ['ROLE_CLIENT'],
  },
 },
];

routes = routes.concat(auth, clientOther, admin, interimCompany);

routes.push({
 path: '*',
 component: () => import('@/views/dash/NotFoundPage'),
});

const router = new Router({
 // mode: 'history',
 routes,
});

function checkAccess(item) {
 if (item.roles) {
  let result = 0;
  item.roles.forEach((el) => {
   result += store.getters.getUserRole.includes(el);
  });
  return result;
 }
 return true;
}

router.beforeEach((to, from, next) => {

 if (to.matched.some((record) => record.meta.requiresAuth)) {
  const { user } = store.state;
  let token = user.token || localStorage.getItem('token');

  if (token || user.resetExpToken || user.tempToken) {
   if (checkAccess(to.meta)) {
    next();
   } else {
    next({ name: 'HomePage' });
   }
  } else {
   next({ name: 'LoginPage' });
  }
 } else {
  next();
 }
});

export default router;
