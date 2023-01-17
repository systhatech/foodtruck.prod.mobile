import { ApiService } from '@/core/services/api.service'
export default {
    namespaced:true,
    state: {
        cart:null,
        cartItems: [],
        cartAmount: {
            'sub_total':0,
            'tax':0,
            'tax_amount':0,
            'total':0,
        },
        cartVendor:null,
        vendorPaymentGateway:null,
        vendor_locations:[],
        truck_menus:[],
        location_booked:[],
        location_booking:[],
        vendor_attachments:[],
        baseURL: "",
        trucks:[],
    },
    getters: {
        trucks: state => {
            return state.trucks;
        },
        cart: state => {
            return state.cart;
        },
        cartVendor: state => {
            return state.cartVendor;
        },
        cartItems: state => {
            return state.cartItems;
        },
        cartAmount: state => {
            return state.cartAmount;
        },
        vendorPaymentGateway: state => {
            return state.vendorPaymentGateway;
        },
        vendorLocations: state => {
            return state.vendor_locations;
        },
        truckMenus: state => {
            return state.truck_menus;
        },
        locationSpotBooked: state => {
            return state.location_booked;
        },
        locationBookings: state => {
            return state.location_booking;
        },
        vendorAttachments: state => {
            return state.vendor_attachments;
        },
        baseURL: state => {
            return state.baseURL;
        },
    },
    mutations: {
        SET_TRUCKS: (state, payload) => {
            state.trucks = payload.map((location) => ({
                ...location, position: {
                    lat: Number(location.lat),
                    lng: Number(location.lng)
                }
            }));
        },
        SET_CART: (state, payload) => {
            if(payload){
                state.cart = payload;
                state.cartItems = payload.items;
            }else{
                state.cart = null;
                state.cartItems = [];
            }
        },
        // SET_CART: (state, payload) => {
        //     state.cart = payload;
        //      state.cartItems = payload.items;
        // },

        SET_CART_AMOUNT: ( state, payload) => {
            state.cartAmount = payload;
        },
        SET_CART_VENDOR: ( state, payload) => {
            state.cartVendor = payload;
        },

        SET_VENDOR_CREDIENTIALS: ( state, payload) => {
            state.vendorPaymentGateway = payload;
        },

        SET_VENDOR_LOCATION(state, payload) {
            state.vendor_locations = payload;
        },

        SET_TRUCK_MENU(state, payload) {
            state.truck_menus = payload;
        },

        SET_LOCATION_BOOKED(state, payload){
            state.location_booked = payload;
        },

        SET_LOCATION_BOOKING(state, payload){
            state.location_booking = payload;
        },

        SET_VENDOR_ATTACHMENTS(state, payload){
            state.vendor_attachments = payload.data;
            state.baseURL = payload.base_url;
        },


    },
    actions: {
        async fetchTrucks({commit}, payload) {
            try {
               await ApiService.post("/location/all",payload)
               .then((resp) => {
                    commit("SET_TRUCKS", resp);
               }) 
               .catch((error) => {
                   console.log(error);
               })
            } catch (error) {
                console.log(error);
            }
        },
        async fetchCarts({ commit }) {
            // if()
            let cartId = localStorage.getItem('pcid') ? localStorage.getItem('pcid'):'';
            if(!cartId){
                commit("SET_CART", null);
                commit("SET_CART_VENDOR", null);
                commit("SET_CART_AMOUNT", null);
                commit("SET_VENDOR_CREDIENTIALS", null);
                return;
            }
            try {
                await ApiService.post("/carts",{
                    cart_id: localStorage.getItem('pcid') ? localStorage.getItem('pcid') :''
                })
                .then((resp) => {
                    commit("SET_CART", resp.data);
                    commit("SET_CART_VENDOR", resp.data.vendor);
                    commit("SET_CART_AMOUNT", resp.total);
                    commit("SET_VENDOR_CREDIENTIALS", resp.gateway);
                })
            } catch (error) {
                console.log(error);
                localStorage.removeItem('pcid');
                commit("SET_CART", null);
                commit("SET_CART_VENDOR", null);
                commit("SET_CART_AMOUNT", null);
                commit("SET_VENDOR_CREDIENTIALS", null);
            }
        },
        // async fetchCarts({ commit }, payload) {
        //     try {
        //         await ApiService.post("/cart-list/fetch",{
        //             email: payload.email,
        //         })
        //         // await ApiService.post("/carts",{
        //         //     cart_id: localStorage.getItem('pcid') ? localStorage.getItem('pcid') :''
        //         // })
                
        //         .then((resp) => {
        //             commit("SET_CART", resp);
        //             commit("SET_CART_AMOUNT", resp.total);
        //             commit("SET_VENDOR_CREDIENTIALS", resp.vendor.payment_credneitial);
        //         })
        //     } catch (err) {
        //         console.log({err});
        //     }
        // },
        async vendorLocations({ commit }, payload){
            try{
                await ApiService.get("vendor/locations/"+ payload.vendor_id)
                .then((resp) => {
                    commit("SET_VENDOR_LOCATION", resp.data);
                })
            }catch(err) {
                console.log(err);
            }
        },
        async truckMenus({ commit }, payload){
            try{
                await ApiService.get("vendor/menus/"+ payload.vendor_id)
                .then((resp) => {
                    commit("SET_TRUCK_MENU", resp.data);
                })
            }catch(err) {
                console.log(err);
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

        async truckBooking({ commit }, payload) {
            try{
                await ApiService.get(`/location-bookings/all?start_date=${payload.start_date}&&end_date=${payload.end_date}&&zip=${payload.zip_code}&&city=${payload.city}&&vendor_id=${payload.vendor_id}`)
                .then((resp) => {
                    commit("SET_LOCATION_BOOKING", resp.data);
                })
            }catch (err) {
                console.log(err);
            }
        },

        async vendorAttachments({ commit }, payload) {
            try{
                await ApiService.post("/vendor/getdocuments", payload)
                .then((resp) => {
                    commit("SET_VENDOR_ATTACHMENTS", resp);
                })
            }catch (err) {
                console.log(err);
            }
        },
    }
}