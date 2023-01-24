import {ApiService} from "@/core/services/api.service";
// import JwtService from "@/core/services/jwt.service";

// action types
export const GET_LOGO = "getLogo";

// mutation types
export const SET_LOGO = "setLogo";

const state = {
  logo:'',
};

const getters = {
  logo(state) {
    return state.logo;
  },
};

const actions = {
	[GET_LOGO](context) {
		return new Promise(resolve => {
		ApiService.get("default-company/logo")
			.then((resp) => {
			console.log({resp});
			context.commit(SET_LOGO, resp.data);
			resolve(resp);
			})
			.catch((err) => {
			console.log("error ", {err});
			});
		});
	},
};

const mutations = {
	[SET_LOGO](state, payload) {
		state.logo = payload;
	}
};

export default {
	state,
	actions,
	mutations,
	getters
};
