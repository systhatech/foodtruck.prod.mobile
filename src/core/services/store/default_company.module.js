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
          // this.messageError('Unable to fetch logo');
        });
    });
  },
//   [LOGOUT](context) {
//     context.commit(PURGE_AUTH);
//   },
//   [REGISTER](context, credentials) {
//     return new Promise(resolve => {
//       ApiService.post("login", credentials)
//         .then(({ data }) => {
//           context.commit(SET_AUTH, data);
//           resolve(data);
//         })
//         .catch(({ response }) => {
//           context.commit(SET_ERROR, response.data.errors);
//         });
//     });
//   },
//   [VERIFY_AUTH](context) {
//     if (JwtService.getToken()) {
//       ApiService.setHeader();
//       ApiService.get("verify")
//         .then(({ data }) => {
//           context.commit(SET_AUTH, data);
//         })
//         .catch(({ response }) => {
//           context.commit(SET_ERROR, response.data.errors);
//         });
//     } else {
//       context.commit(PURGE_AUTH);
//     }
//   },
//   [UPDATE_PASSWORD](context, payload) {
//     const password = payload;

//     return ApiService.put("password", password).then(({ data }) => {
//       context.commit(SET_PASSWORD, data);
//       return data;
//     });
//   }
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
