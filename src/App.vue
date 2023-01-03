<template>
  <div class="main-wrap" :class="{ 'ie-brwsr': isIE, scrolled: scrolled }">
    <div
      class="main-wrap__inner"
      :class="{ 'main-wrap': $store.state.common.blur }"
      :data-sitelang="$i18n.locale"
    >
      <app-header></app-header>
      <main
        class="main"
        :class="{
          'vertical-center': $route.meta.verticalCenter,
          'main_sidebar-open': !$store.state.common.sidebarCollapsed,
        }"
      >
        <transition name="fade" mode="out-in">
          <router-view :key="key"></router-view>
        </transition>
      </main>
    </div>
    <app-footer></app-footer>
    <app-session-popup></app-session-popup>
  </div>
</template>

<script>
import AppHeader from "@/components/common/AppHeader";
import AppFooter from "@/components/common/AppFooter";
import AppSessionPopup from "@/components/common/AppSessionPopup";

export default {
  name: "App",
  data() {
    return {
      key: 1,
      scrolled: false,
    };
  },
  components: {
    AppHeader,
    AppFooter,
    AppSessionPopup,
  },
  computed: {
    isIE() {
      let ua = navigator.userAgent;
      /* MSIE used to detect old browsers and Trident used to newer ones*/
      let is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;

      return is_ie;
    },
  },
};
</script>
