import Vue from 'vue'
import App from './App.vue'
// import AppDown from './AppDown.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import store from "@/store";
import toast from "@/core/services/toast.service";
import { VueMaskDirective } from 'v-mask'

import * as VueGoogleMaps from 'vue2-google-maps' // Import package
// import { StripePlugin } from '@vue-stripe/vue-stripe';
Vue.config.productionTip = false
let guestToken = localStorage.getItem('g_token');
if(!guestToken){
    localStorage.setItem('g_token',Math.floor(Date.now()));
}
Vue.component('google-map', VueGoogleMaps.Map);
Vue.use(VueGoogleMaps, {
  load: {
      key: 'AIzaSyA5G4DdRXdQ6i09DluONg1Su1zsE8W8p54',
      libraries: 'places,drawing,visualization'
  },
  installComponents: true
})
import 'vue-event-calendar/dist/style.css' //^1.1.10, CSS has been extracted as one file, so you can easily update it.
import vueEventCalendar from 'vue-event-calendar'
// locale can be 'zh' , 'en' , 'es', 'pt-br', 'ja', 'ko', 'fr', 'it', 'ru', 'de', 'vi', 'ua', 'no, 'no-nn'
Vue.use(vueEventCalendar, {
    locale: 'en',
    color: '#75ab26', //Set main color
    className: 'color-primary', //Set main color
})

import VCalendar from 'v-calendar'
import DatePicker from 'v-calendar/lib/components/date-picker.umd'
Vue.component('date-picker', DatePicker)
import VueSocialSharing from 'vue-social-sharing'
Vue.use(VueSocialSharing);
// Use v-calendar & v-date-picker components
Vue.use(VCalendar, {
    componentPrefix: 'vc', // Use <vc-calendar /> instead of <v-calendar />
});


Vue.directive('mask', VueMaskDirective);
Vue.mixin(toast);
const bus = new Vue();
Vue.prototype.$bus = bus;
Vue.config.productionTip = false
require('@/store/subscriber');
store.dispatch('auth/attempt', localStorage.getItem('id_token'))
.then(() => {
  new Vue({
    router,
    vuetify,
    store,
    render: h => h(App)
  }).$mount('#app')
})