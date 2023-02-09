<template>
    <div class="mt-4">
        <div class="mt-4">
             <v-row v-if="locationBookings && Object.keys(locationBookings).length">
                <v-col cols="12" sm="6" md="6" lg="6" xl="3" v-for="(booking, index) in locationBookings " :key="index">
                    <div
                        class="custom-bs h-100 pa-4">
                       
                        <div class="address-wrapper">
                            <div>
                                <h5 class="text-uppercase primary--text mb-2">{{ booking && booking.company ? booking.company.neighbourhood_name : (booking.event ? booking.event.name :'') }}</h5>
                                <div class="d-flex">
                                    <div class="text-center mr-2">
                                        <v-icon color="primary">{{iconCalendar}}</v-icon>
                                    </div>
                                    <div>
                                        <p class="">{{ moment(booking.start_date).format('MMM DD, YYYY') }} - {{ moment(booking.end_date).format('MMM DD, YYYY')}}</p>
                                        <p class="">{{ formatTimeOnly(booking.start_date) }} - {{ formatTimeOnly(booking.end_date)}}</p>
                                    </div>
                                </div>
                                <div class="d-flex mt-2">
                                    <div class="text-center mr-2">
                                        <v-icon color="primary">{{ iconAddress }}</v-icon>
                                    </div>
                                    <div>
                                        <p class="">{{ booking ? booking.add1 :''}}</p>
                                        <p class="">{{ booking ? booking.city :''}} {{ booking && booking.state ? booking.state :''}}, {{booking &&  booking.zip ? booking.zip :''}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex justify-space-around">
                        <v-btn
                            color="primary"
                            rounded
                            block
                            large
                            class="mx-auto mt-4"
                            :to="'/spot/'+booking.id">
                            Book Now
                        </v-btn>
                        <!-- <v-btn
                            color="secondary"
                            tile
                            text
                            class="mx-auto"
                            link
                            @click="bookNow(booking)">
                            Book Now
                        </v-btn> -->
                        </div>
                    </div>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col cols="12">
                    <!-- <div class="unavailable">{{ message }}</div> -->
                    <div class="text-center">
                        <div v-if="loading">
                            <ComponentLoadingVue/>
                        </div>
                        <div class="unavailable" v-else>
                            <p>{{  message }}</p>
                        </div>
                    </div>
                </v-col>
            </v-row>
            <!-- <BookingFilter :modelBookingFilter="modelBookingFilter" @close="handleClose"/> -->
            <ModalLocationBooking :booking="bookingItem" :modalLocationBooking="modalLocationBooking" @closeModal="closeModal"/>
        </div>
    </div>
</template>
<script>
import ModalLocationBooking from './ModalLocationBooking'
// import InputDateRange from '@/components/form-element/InputDateRange'
// import InputDateLastPicker from '@/components/form-element/InputDateLastPicker'
// import InputAddress from '@/components/form-element/InputAddress'

import { ApiService } from '@/core/services/api.service'
import moment from 'moment'
import { mdiCalendarClock, mdiMapMarker, mdiCalendar } from '@mdi/js'
// import BookingFilter from './BookingFilter'
import { mapGetters } from 'vuex'
export default {
    data: () => ({
        modalLocationBooking:false,
        iconDate: mdiCalendarClock,
        iconAddress: mdiMapMarker,
        iconCalendar:mdiCalendar,
        moment,
        bookings:[],
        bookingItem:{},
        zip_code:'',
        city:'',
        start_date: "",
        end_date: "", 
        reset:false,
        loadingSearch:false,
        loadingReset:false,

        modelBookingFilter:false,
        locationBookings : [],
        message:'Loading...',
        loading:false,
    }),
     mounted() {
        this.fetchData();
    },
    methods:{
        async fetchData() {
            // this.$bus.$emit('SHOW_PAGE_LOADER');
            this.loading =true;
            ApiService.get(`/location-bookings/all?start_date=${this.start_date}&&end_date=${this.end_date}&&zip=${this.zip_code}&&city=${this.city}&&vendor_id=${this.currentUser.table_id}`)
			.then((resp) => {
                this.loading = false;
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.locationBookings = resp.data;
                if(!this.locationBookings.length) {
                    this.message = 'No spot available'
                }
			})
            .catch((error) => {
                this.loading = false;
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.message = 'Error on fetching data'
                console.log(error);
            });
        },
        showFilter() {
            this.modelBookingFilter = true;
        },
        startDate(startDate) {
            if(startDate.date){
                this.start_date = moment(startDate.date).format('YYYY-MM-DD');
            }
        },
        endDate(endDate) {
            if(endDate.date) {
                this.end_date =  moment(endDate.date).format('YYYY-MM-DD');
            }
        },
        handleClose() {
            this.modelBookingFilter = false;
        },
        async handleSearch(){
            this.loadingSearch = true;
            await this.$store.dispatch('locationBookings',{ 
                start_date: this.start_date,
                end_date: this.end_date,
                zip_code: this.zip_code,
                city: this.city,
                vendor_id: this.currentUser.table_id,
            });
            this.loadingSearch = false;
        },
        handleReset(){
            this.reset = true;
            this.city = "";
            this.zip_code = "";
        },
        selectedData(info){
            console.log(info);
        },
        bookNow(bookingItem){
            console.log(bookingItem);
            this.bookingItem = bookingItem;
            // this.modalLocationBooking = true;

        },
        closeModal(){
            this.modalLocationBooking = false;
        }
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
        })
    },
    components: {
        ModalLocationBooking,
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
    }
    
}
</script>
<style lang="scss" scoped>
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
    }
}
</style>