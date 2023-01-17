import Vue from 'vue'
import App from './App.vue'
import AppDown from './AppDown.vue'
import router from './router'
import vuetify from './plugins/vuetify';
// import './plugins/socketio';
// import './plugins/socket';
import store from "@/core/services/store";
import toast from "@/core/services/toast.service";
import { VueMaskDirective } from 'v-mask'
import JwtService from "@/core/services/jwt.service";
import VuetifyGoogleAutocomplete from "vuetify-google-autocomplete"
import { VERIFY_AUTH } from "@/core/services/store/auth.module";
// import { VERIFY_AUTH, SET_AUTH, PURGE_AUTH } from "@/core/services/store/auth.module";
import { ApiService } from "@/core/services/api.service";

import * as VueGoogleMaps from 'vue2-google-maps' // Import package
// import { StripePlugin } from '@vue-stripe/vue-stripe';
Vue.config.productionTip = false
Vue.component('google-map', VueGoogleMaps.Map);
// Vue.component('google-map', VueGoogleMaps.Map);
let guestToken = localStorage.getItem('g_token');
if(!guestToken){
    localStorage.setItem('g_token',Math.floor(Date.now()));
}
// let apiKeys = {};


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

// Use v-calendar & v-date-picker components
Vue.use(VCalendar, {
    componentPrefix: 'vc', // Use <vc-calendar /> instead of <v-calendar />
});

import VueNativeNotification from 'vue-native-notification'
 
Vue.use(VueNativeNotification, {
  // Automatic permission request before
  // showing notification (default: true)
  requestOnNotify: true
})
Vue.directive('mask', VueMaskDirective);
Vue.mixin(toast);
const bus = new Vue();
Vue.prototype.$bus = bus;
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
    // console.log(store.getters('isAuthenticated'));
    // this.loaderShow();
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!JwtService.getToken()) {
            next({name:'loginPage'});
        } else {
            store.dispatch(VERIFY_AUTH)
            .then(() => {
                next()
                // this.loaderHide();
            })
            .catch(() => {
                // this.loaderHide();
                next({name:'loginPage'});
            })
        }
    }
    next();
});

(async function() {
    await ApiService.get('/getapikeys')
    .then((apiKeys) => {
        // console.log({apiKeys});
        // let stripeApiKey = apiKeys.stripe;
        let googleApiKey = apiKeys.google;

        Vue.use(VuetifyGoogleAutocomplete, {
            apiKey: googleApiKey // Can also be an object. E.g, for Google Maps Premium API, pass `{ client: <YOUR-CLIENT-ID> }`
        });

        Vue.use(VueGoogleMaps, {
            load: {
                key: googleApiKey,
                libraries: 'places,drawing,visualization'
            },
            installComponents: true
        });
        Vue.component('google-map', VueGoogleMaps.Map);
        // Vue.use(StripePlugin, options);
        store.dispatch(VERIFY_AUTH)
        .then(() => {
            new Vue({
                router,
                vuetify,
                store,
                render: h => h(App)
            }).$mount('#app')
        })
        .catch(() => {
            
        })
    })
    .catch((error) => {
        console.log({error});
        if(error.toJSON().message === 'Network Error'){
            new Vue({
                router,
                vuetify,
                store,
                render: h => h(AppDown)
            }).$mount('#appDown')
        }
    });
    
})();