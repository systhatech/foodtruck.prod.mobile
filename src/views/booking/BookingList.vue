<template>
    <div class="mt-4">
           <v-row v-if="locationSpotBooked && Object.keys(locationSpotBooked).length">
                <v-col cols="12" sm="6" md="6" lg="6" xl="3" v-for="(booking, index) in locationSpotBooked " :key="index">
                    <div
                        class="custom-bs h-100 pa-4">
                        <div class="d-flex align-center justify-space-between mb-2" >
                            <h5 class="text-uppercase primary--text">{{ booking && booking.location.name ? booking.location.name : 'No name' }}</h5>
                            <span class="f8-bold primary--text">SPOT - {{ booking.spot }}</span>
                        </div>
                        <div class="address-wrapper">
                            <v-chip class="text-capitalize mb-4" :color="booking.status == 'booked' ? 'accent' :(booking.status == 'cancelled' ?'error':'warning')">{{ booking.status }}</v-chip>
                            <div class="d-flex mb-2">
                                <div class="mr-2">
                                    <v-icon color="primary">{{ iconDate }}</v-icon>
                                </div>
                                <div>
                                    <p class="">{{ moment(booking.start_date).format('MMM DD, YYYY') }} - {{ moment(booking.end_date).format('MMM DD, YYYY')}}</p>
                                    <p class="">{{ formatTimeOnly1(booking.start_date) }} - {{ formatTimeOnly1(booking.end_date)}}</p>
                                </div>
                            </div>
                            <div class="d-flex align-start">
                                <div class="mr-2">
                                    <v-icon color="primary">{{ iconAddress }}</v-icon>
                                </div>
                                <div class="">
                                    <p>{{ booking ? booking.location.add1 :''}}</p>
                                    <p>{{ booking ? booking.location.city :''}}</p>
                                    <p>{{ booking && booking.location.state ? booking.location.state :''}}, {{booking.location &&  booking.location.zip ? booking.location.zip :''}}</p>
                                </div>
                            </div>
                            <div class="pt-4">
                                <v-btn rounded large v-if="booking.status !=='cancelled'" block color="error" @click="handleRequestCancel(booking)">Cancel Spot</v-btn>
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>
            <v-row v-else>
            <v-col cols="12">
                <div v-if="loading" class="text-center">
                    <ComponentLoadingVue/>
                </div>
                <div class="unavailable" v-else>
                    <p>{{  message }}</p>
                </div>
                <!-- <div class="unavailable">{{ messageLoading }}</div> -->
            </v-col>
        </v-row>
        <DialogConfirm :dialogConfirm="modalConfirm" @handleConfirm="handleConfirm" @close="handleClose" :message="message"/>
        <ModalLocationBookingView :booking="bookingItem" :modalLocationBookingView="modalLocationBookingView" @closeModal="closeModal"/>
    </div>
</template>
<script>
import {mapGetters} from'vuex'
import moment from 'moment'
import ModalLocationBookingView from './ModalLocationBookingView'
import { mdiCalendarClock, mdiMapMarker } from '@mdi/js'
import { ApiService } from '@/core/services/api.service'
import DialogConfirm from '@/components/layout/DialogConfirm'
export default {
    data() {
        return {
            iconDate: mdiCalendarClock,
            iconAddress: mdiMapMarker,
            moment,
            modalLocationBookingView:false,
            bookingItem:{},
            modalConfirm:false,
            booking:null,
            loading:false,
            message:'Do you want to cancel it ? if you cancel, it is non refundable.',
            locationSpotBooked:[],
            messageLoading:'Loading...',
        }
    },
    created() {
        // this.$store.dispatch('locationSpotBooked',{vendor_id: this.currentUser.vendor.id});
        // this.fetchData();
        // this.fetchBookedSpot();
    },
    mounted() {
        this.$bus.$on('MODAL_LOCATION_BOOKING_SPOT_BOOKING', (payload) => {
            console.log(payload);
        //    this.$store.dispatch('locationSpotBooked',{vendor_id: this.currentUser.vendor.id});
            this.fetchBookedSpot();
        });
         this.fetchBookedSpot();
    },
    methods: {
        async fetchBookedSpot() {
            // this.loaderShow();
            this.loading = true;
            await ApiService.post("/location-bookings/booked", {vendor_id: this.currentUser.table_id})
			.then((resp) => {
                this.loading = false;
                this.locationSpotBooked = resp.data;
                if(!this.locationSpotBooked.lengtth){
                    this.messageLoading = 'No spot booked';
                }
                this.loaderHide();
				// commit("SET_LOCATION_BOOKED", resp.data);
			})
            .catch((error) => {
                this.loading = false;
                console.log({error});
                this.message = 'Error on fetching data'
                this.loaderHide();
            })
        },
        async handleConfirm() {
            this.loaderShow();
            await ApiService.post('/location-bookings/book-spot-cancel',{spot_id : this.booking.id})
            .then((resp) => {
                this.loaderHide();
                this.messageSuccess(resp.message);
                // this.$store.dispatch('locationSpotBooked',{vendor_id: this.currentUser.vendor.id});
                this.fetchBookedSpot();
                this.handleClose();
            })
            .catch((error) => {
                this.loaderHide();
                this.messageError(error.response.data.message);
            });
        },
        handleClose() {
            this.modalConfirm = false;
        },
        // fetchData() {
        //     await ApiService.get("/location-bookings/booked", payload)
		// 	.then((resp) => {
        //         console.log(resp);
		// 		// commit("SET_LOCATION_BOOKED", resp.data);
		// 	})
        //     .catch((error) => {
        //         console.log(error);
        //     })
        // },
         viewBook(bookingItem){
             console.log(bookingItem);
            this.bookingItem = bookingItem;
            this.modalLocationBookingView = true;
        },
        closeModal(){
            this.modalLocationBookingView = false;
        },
        handleRequestCancel(booking){
            this.booking = booking;
            this.modalConfirm = true;
        }
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
        })
    },
    components: {
        ModalLocationBookingView,
        DialogConfirm,
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
    }
}
</script>
<style scoped lang="scss">
.company-name{
    font-size: 1rem !important;
    font-weight: 500 !important;
    text-transform: capitalize;
}
.m2{
    margin-top:-2px;
}
.address-wrapper{
    p{
        padding: 0;
        margin: 0;
        // font-size: 14px;
        // font-weight: 500;
    }
}
</style>