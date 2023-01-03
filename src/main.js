// Transpiler for older browsers
import 'core-js';
// optional but required for transforming generator fns.
import 'regenerator-runtime/runtime';

import Vue from 'vue';
import ElementUI from 'element-ui';
import localeEn from 'element-ui/lib/locale/lang/en';
import localeUa from 'element-ui/lib/locale/lang/ua';
import locale from 'element-ui/lib/locale';
import VueI18n from 'vue-i18n';
import VueTheMask from 'vue-the-mask';
import Calendar from 'v-calendar/lib/components/calendar.umd';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';

import VueMasonry from 'vue-masonry-css';

import 'normalize.css';
import 'element-ui/lib/theme-chalk/index.css';

import App from './App.vue';
import store from './store';
import router from './router';
import { messages } from './i18n';
import './plugins/axios';
import appConfig from './config';
import './filters';
import appHttp from './helpers/AppHttp';
import appCurLang from './helpers/AppCurLang';

import AppSidebar from './components/common/AppSidebar';
import AppSteps from './components/common/AppSteps';
import AppSortArrows from './components/common/AppSortArrows';
import AppSurDisableMess from './components/surTopBtns/AppSurDisableMess';
import AppSurePopup from './components/common/AppSurePopup';

if (!Element.prototype.matches) {
 Element.prototype.matches = Element.prototype.msMatchesSelector;
}

if (!Element.prototype.closest) {
 // fix closest
 Element.prototype.closest = function (css) {
  var node = this;

  while (node) {
   if (node.matches(css)) return node;
   else node = node.parentElement;
  }
  return null;
 };
}

Vue.component('app-sidebar', AppSidebar);
Vue.component('app-steps', AppSteps);
Vue.component('app-sort-arrows', AppSortArrows);
Vue.component('app-sur-disable-mess', AppSurDisableMess);
Vue.component('app-sure-popup', AppSurePopup);
Vue.component('v-calendar', Calendar);
Vue.component('v-date-picker', DatePicker);

const ElementMultilang = {
 ua: localeUa,
 en: localeEn,
};

let curLang = appCurLang;

Vue.use(VueMasonry);
Vue.use(ElementUI);
Vue.use(VueI18n);
Vue.use(VueTheMask);
locale.use(ElementMultilang[curLang]);

const i18n = new VueI18n({
 locale: curLang,
 messages,
 silentTranslationWarn: true,
 pluralizationRules: {
  /**
   * @param choice {number} индекс выбора, переданный в $tc: `$tc('path.to.rule', choiceIndex)`
   * @param choicesLength {number} общее количество доступных вариантов
   * @returns финальный индекс для выбора соответственного варианта слова
   */
  ua: function (choice, choicesLength) {
   // this === VueI18n экземпляра, так что свойство locale также существует здесь

   if (choice === 0) {
    return 0;
   }

   const teen = choice > 10 && choice < 20;
   const endsWithOne = choice % 10 === 1;

   if (choicesLength < 4) {
    return !teen && endsWithOne ? 1 : 2;
   }
   if (!teen && endsWithOne) {
    return 1;
   }
   if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2;
   }

   return choicesLength < 4 ? 2 : 3;
  },
 },
});

Vue.config.productionTip = false;
Vue.prototype.$appConf = appConfig;
Vue.prototype.$mess = messages;

const vm = new Vue({
 store,
 router,
 i18n,
 render: (h) => h(App),
}).$mount('#app');

export default vm;
