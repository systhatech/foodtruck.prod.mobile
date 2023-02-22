import { ApiService } from '@/core/services/api.service'
export default {
    namespaced:true,
    state: {
        token:null,
        user:null,
        profile:null,
    },
    getters: {
        authenticated(state) {
            return state.token && state.user && state.profile;
        },
        user(state) {
            return state.user;
        },
        profile(state) {
            return state.profile;
        },
        currentUser(state) {
            return state.user;
        }
    },
    mutations: {
        SET_TOKEN(state, token){
            state.token = token;
        },
        
        SET_USER(state, payload){
            state.user = payload;
        },
        SET_PROFILE(state, payload){
            state.profile = payload;
        },


    },
    actions: {
        async signIn({ dispatch }, credientials){
            let response = await ApiService.post('/login', credientials);
            if(response.verify){
                return response;
            }else{
                return dispatch('attempt', response.token);
            }
        },
        async signUpClient({ dispatch }, credientials){
            let response = await ApiService.post('/register/client', credientials);
            return dispatch('attempt', response.token);
        },

        async signUpVendor({ dispatch }, credientials){
            let response = await ApiService.post('/register/vendor', credientials);
            return dispatch('attempt', response.token);
        },
        async attempt({ commit, state }, token) {
            if(token){
                localStorage.setItem('id_token', token);
                commit('SET_TOKEN',token);
            }
            if(!state.token){
                return;
            }
            try{
                let response = await ApiService.post('/profile')
                commit('SET_USER', response.data);
                commit('SET_PROFILE', response.profile);
            }catch(e){
                console.log(e);
                commit('SET_USER', null);
                commit('SET_PROFILE', null);
                commit('SET_TOKEN', null);
            }
        },
        async fetchProfile({ commit }) {
            try{
                let response = await ApiService.post('/profile')
                commit('SET_USER', response.data);
                commit('SET_PROFILE', response.profile);
            }catch(e){
                console.log(e);
                commit('SET_USER', null);
                commit('SET_PROFILE', null);
                commit('SET_TOKEN', null);
            }
        },
        signOut({commit}) {
            return ApiService.post('/logout')
            .then(() => {
                commit('SET_USER', null);
                commit('SET_TOKEN', null);
                commit('SET_PROFILE', null);
            });
        }
    }
}