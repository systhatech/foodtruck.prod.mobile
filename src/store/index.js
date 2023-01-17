import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import truck from './truck'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 
    },

    mutations: {
        // 
    },

    actions: {
        //
    },

    modules: {
        auth,
        truck,
    }
})