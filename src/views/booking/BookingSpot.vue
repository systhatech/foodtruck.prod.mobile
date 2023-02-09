<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mb80">
            <div>
                <div>
                    <div v-if="booking">
                        <v-row>
                            <v-col cols="6" sm="4" md="4" v-for="(spot, index) in booking.spots" :key="index">
                                    <v-card class="custom-bs h-100 pa-4">
                                        <div class="text-center">
                                            <h5 class="ma-0 pa-0 primary--text">SPOT {{ index+1 }}</h5>
                                            <h4 class="ma-0 pa-0 text-secondary">{{formatAmount(spot.rate)}}</h4>
                                        </div>
                                        <div v-if="spot.vendor" class="pt-3 text-center">
                                            <h5 class="text-uppercase" :class="spot.status=='cancelled'?'error--text':'primary--text'">{{spot.status}}</h5>
                                        </div>
                                        <div v-else class="text-center pt-2">
                                            <v-btn color="primary" @click="handleBookSpot(spot)" rounded>Book Now</v-btn>
                                        </div>
                                    </v-card>
                            </v-col>
                        </v-row>
                    </div>
                    <div class="unavailable" v-else>
                        <p>{{ message }}</p>
                    </div>
                </div>
            </div>
            <BookingPayment :modalBookingPayment="modalPaymentBooking" :spot="spot" 
            :apikey="publishablekey"
            :convenienceFee="convenience_fee"
            @handleClose="closePayment"/>
        </v-container>
        <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { mapGetters } from 'vuex'
import { ApiService } from '@/core/services/api.service'
import Bottomnavbar from '@/components/layout/NavbarBottomVendor'
import BookingPayment from './ModalPaymentBooking'
import moment from 'moment'
export default {
    data: () => ({
        title:'',
        moment,
        booking:null,
        bookingId:null,
        modalPaymentBooking:false,
        spot:null,

        publishablekey:'',
        convenience_fee:0,
        message:'Loading...'
    }),
    mounted() {
        this.bookingId = this.$router.currentRoute.params.spotId;
        this.fetchData();
    },
    methods: {
      
        handleClose() {
        },
        closePayment() {
            this.modalPaymentBooking = false;
            this.loaderHide();
        },
        async handleBookSpot(spot){
            this.spot = spot;
            await ApiService.get('/getapikeys')
            .then((resp) => {
                this.publishablekey = resp.stripe;
                this.convenience_fee = Number(resp.convenience_fee);
                this.modalPaymentBooking = true;
            })
            .catch((error) => {
                console.log(error);
            })
        },
        fetchData() {
            this.loaderShow();
            ApiService.post('/location-bookings/booking-spot-find',{
                id: this.bookingId,
                vendorId: this.currentUser.table_id,
            })
            .then((resp) => {
                this.loaderHide();
                this.booking = resp.data;
                if(!this.booking.length) {
                    this.message = 'No spots';
                }
            })
            .catch((error) => {
                this.loaderHide();
                this.message = 'Error on fetching spots';
                console.log(error);
            });
        },
        handleBack() {
            this.$router.back();
        },
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        BookingPayment
    },
    computed: {
         ...mapGetters({
            currentUser:'auth/user',
        })
    }
}
</script>
<style lang="scss" scoped>

</style>