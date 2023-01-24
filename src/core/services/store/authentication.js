import { ApiService } from '@/core/services/api.service'
export default {
    namespaced: true,
    state: {
        token:null,
        user:null,
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token;
        },
        SET_USER(state, user) {
            state.user = user;
        }
    },

    actions: {
        async signIn({ dispatch }, credientials) {
            let response = ApiService.post('signin',credientials);
            console.log(response);
            return dispatch('attempt', response.token);
        },
        async attempt({commit}, token) {
            commit('SET_TOKEN',token);
            try {
                let resp = ApiService.post('profile');
                commit('SET_USER',resp.data);
            } catch (error) {
                console.log("failed");
            }
        },
        fetchProfile() {
            try {
                let resp = ApiService.post('profile');
                commit('SET_USER',resp.data);
            } catch (error) {
                console.log("failed");
            }
        }
    }
}