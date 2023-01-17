import {ApiService} from "@/core/services/api.service";
import JwtService from "@/core/services/jwt.service";
import {socketHandler} from '@/core/services/socketio/socket';
// action types
export const VERIFY_AUTH = "verifyAuth";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const REGISTER = "register";
export const UPDATE_PASSWORD = "updateUser";

// mutation types
export const PURGE_AUTH = "logOut";
export const SET_AUTH = "setUser";
export const SET_PASSWORD = "setPassword";
export const SET_ERROR = "setError";

const state = {
  errors: null,
  user: {},
  isAuthenticated: !!JwtService.getToken(),
  location_booking:[],
  location_booked:[],
};

const getters = {
  currentUser(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  },
	locationSpotBooked: state => {
		return state.location_booked;
	},
	locationBookings: state => {
		return state.location_booking;
	},
};

const actions = {
	[LOGIN](context, credentials) {
		return new Promise(resolve => {
		ApiService.post("login", credentials)
			.then((resp) => {
			console.log(resp);
			let user = resp.user;
			if(resp.token){
				user.token = resp.token;
			}
			context.commit(SET_AUTH, {});
			resolve({});
			})
			.catch(() => {
				// this.$bus.$emit('HIDE_PAGE_LOADER');
				// this.messageError('error',"Failed to login");
			// console.log(response.data.message);
			});
		});
	},
	async [LOGOUT](context) {
		await ApiService.post('/logout')
		.then(()=> {
			socketHandler.disconnect();
			context.commit(PURGE_AUTH);
			this.isAuthenticated = false;
		})
	},
	[REGISTER](context, credentials) {
		return new Promise(resolve => {
		ApiService.post("login", credentials)
			.then(({ data }) => {
			context.commit(SET_AUTH, data);
			resolve(data);
			})
			.catch(({ response }) => {
			context.commit(SET_ERROR, response.data.errors);
			});
		});
	},
	async [VERIFY_AUTH](context) {
		if (JwtService.getToken()) {
		// return ApiService.post("profile");
			try {
				let response = await ApiService.post("profile");
				return context.commit(SET_AUTH, response.data);
			} catch (error) {
				context.commit(PURGE_AUTH);
			}
			// .then((response) => {
			// })
			// .catch(() => {
			// context.commit(PURGE_AUTH);
			// })
		} else {
			context.commit(PURGE_AUTH);
		}
	},
	[UPDATE_PASSWORD](context, payload) {
		const password = payload;

		return ApiService.put("password", password).then(({ data }) => {
		context.commit(SET_PASSWORD, data);
		return data;
		});
	},
	async locationBookings({ commit }, payload) {
		try{
			await ApiService.get(`/location-bookings/all?start_date=${payload.start_date}&&end_date=${payload.end_date}&&zip=${payload.zip_code}&&city=${payload.city}&&vendor_id=${payload.vendor_id}`)
			.then((resp) => {
				commit("SET_LOCATION_BOOKING", resp.data);
			})
		}catch (err) {
			console.log({err});
		}
	},
	async locationSpotBooked({ commit }, payload) {
		try{
			await ApiService.post("/location-bookings/booked", payload)
			.then((resp) => {
				commit("SET_LOCATION_BOOKED", resp.data);
			})
		}catch (err) {
			console.log(err);
		}
	},
};

const mutations = {
	[SET_ERROR](state, error) {
		state.errors = error;
	},
	SET_LOCATION_BOOKING(state, payload){
		state.location_booking = payload;
	},
	SET_LOCATION_BOOKED(state, payload){
		state.location_booked = payload;
	},
	[SET_AUTH](state, user) {
		state.isAuthenticated = true;
		state.user = user;
		state.errors = {};
		if(user && user.token){
		JwtService.saveToken(user.token);
		}
	},
	[SET_PASSWORD](state, password) {
		state.user.password = password;
	},
	[PURGE_AUTH](state) {
		state.isAuthenticated = false;
		state.user = {};
		state.errors = {};
		JwtService.destroyToken();
	}
};

export default {
  state,
  actions,
  mutations,
  getters
};
