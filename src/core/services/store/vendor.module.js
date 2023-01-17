import {ApiService} from "@/core/services/api.service";
// import JwtService from "@/core/services/jwt.service";

// action types
export const VENDOR_LOCATIONS = "vendorLocations";
export const VENDOR_LOCATION_BOOKING = "vendorLocationBooking";
export const VENDOR_LOCATION_BOOKED = "vendorLocationBooked";
// export const LOGIN = "login";
// export const LOGOUT = "logout";
// export const REGISTER = "register";
// export const UPDATE_PASSWORD = "updateUser";

// mutation types
export const SET_LOCATIONS = "setLocation";
export const SET_LOCATION_BOOKING = "setLocationBooking";
export const SET_VENDOR_LOCATION_BOOKED = "setVendorLocationBooked";
// export const SET_AUTH = "setUser";
// export const SET_PASSWORD = "setPassword";
// export const SET_ERROR = "setError";

const state = {
  vendor_locations:[],
  vendor_location_booking:[],
  vendor_location_booked:[]
};

const getters = {
  vendorLocations(state) {
    return state.vendor_locations;
  },
  vendorLocationBooking(state) {
    return state.vendor_location_booking;
  },
  vendorLocationBooked(state) {
    return state.vendor_location_booked;
  },
};

const actions = {
    [VENDOR_LOCATIONS](context, payload) {
        return new Promise(resolve => {
            ApiService.get("vendor/locations/"+payload.vendor_id)
                .then((resp) => {
                    context.commit(SET_LOCATIONS, resp.data);
                    resolve(resp.data);
                })
                .catch(({ response }) => {
                    console.log(response);
                });
        });
    },
    [VENDOR_LOCATION_BOOKING](context, payload) {
        return new Promise(resolve => {
            try{
                ApiService.get(`vendor/location-bookings/all?vendor_id=3?start_date=${payload.start_date}&&end_date=${payload.end_date}&&zip=${payload.zip_code}&&city=${payload.city}&&vendor_id=${payload.vendor_id}`)
                .then((resp) => {
                    context.commit(SET_LOCATION_BOOKING, resp.data);
                    resolve(resp.data);
                })
                .catch(() => {
                    // console.log(response.data.message);
                })
            }catch (err) {
                console.log(err);
            }
        });
    },
    [VENDOR_LOCATION_BOOKED](context, payload) {
        return new Promise(resolve => {
            try{
                ApiService.post('vendor/location-booked',payload)
                .then((resp) => {
                    context.commit(SET_VENDOR_LOCATION_BOOKED, resp.data);
                    resolve(resp.data);
                })
                .catch(({ response }) => {
                    console.log(response.data.message);
                })
            }catch (err) {
                console.log(err);
            }
        });
    },
};

const mutations = {
  [SET_LOCATIONS](state, locations) {
    state.vendor_locations = locations;
  },
  [SET_LOCATION_BOOKING](state, data) {
    state.vendor_location_booking = data;
  },
  [SET_VENDOR_LOCATION_BOOKED](state, data) {
    state.vendor_location_booked = data;
  },
  
};

export default {
  state,
  actions,
  mutations,
  getters
};
