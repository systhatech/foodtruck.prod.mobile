<template>
    <v-row justify="center">
        <v-dialog
        v-model="modalBookingPayment"
        persistent
        width="400"
        scrollable
        >
        <v-card scrollable>
            <v-card-title>
                <div class="w-100 justify-space-between d-flex">
                    <h4 class="primary--text">SPOT {{ spot ? spot.spot:'n/a' }}</h4>
                    <div @click="handleClose"> <v-icon> {{ iconClose }} </v-icon></div>
                </div>
            </v-card-title>
            <v-card-text class="pt-4" v-if="spot && Object.keys(spot).length">
              <div>
                  <div class="mb-6">
                        <table class="w-100">
                                <div class="d-flex align-center justify-space-between">
                                    <p class="mb-2">Price</p>
                                    <p class="text-right mb-2">{{ formatAmount(spot.rate) }}</p>
                                </div>
                                <div v-if="convenienceFee" class="d-flex align-center justify-space-between pb-2">
                                    <p class="mb-2">Convenience Fee ({{ convenienceFee }} % )</p>
                                    <p class="text-right mb-2">{{ formatAmount(spot.rate * (convenienceFee/100))}}</p>
                                </div>
                                <v-divider></v-divider>
                                <div class="d-flex align-center justify-space-between primary--text pt-4">
                                    <p class="mb-2  primary--text">Total </p>
                                    <p class="text-right mb-2 primary--text">{{ formatAmount(spot.rate + (spot.rate * (convenienceFee/100)))}}</p>
                                </div>
                                <div>
                                    <p class="f8 error--text">*Note: Non-refundable </p>
                                </div>
                        </table>
                    <v-divider class="mt-4"></v-divider>
                    </div>
                     <CardStripe v-if="apikey" @proceed="handleBookSpot"  :publishablekey="apikey"/>
              </div>
            </v-card-text>
        </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
import { mdiPlus, mdiMinus, mdiClose, mdiMapMarker } from '@mdi/js'
import  moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
import { ApiService } from '@/core/services/api.service'
import CardStripe from '../cart/CardStripe'
export default {
    props:{
        modalBookingPayment:{},
        convenienceFee:{},
        apikey:{},
        spot:{},
    },
    data(){
        return {
            moment,
            mdiPlus, 
            mdiMinus,
            iconAddress: mdiMapMarker,
            iconClose: mdiClose,
            quantity:1,
            status:null,
            total:0,
        }
    },
    mounted(){
        console.log(this.apikey);
    },
    components: {
        CardStripe,
    },
    methods: {
        ...mapActions({
            fetchProfile:'auth/fetchProfile'
        }),
        handleProceedCard(param) {
            this.stripeToken = param.stripeToken;
        },
        handleClose(){
            this.$emit('handleClose');
        },
        handleNext(){
        },
        handleBookSpot(param){
            ApiService.post('/location-bookings/book-spot',{
                spot_id : this.spot.id, 
                stripeToken: param.stripeToken,
                vendor_id: this.currentUser.table_id,
                amount: this.spot.rate + (this.spot.rate * (this.convenienceFee/100)),
            })
            .then((resp) => {
                console.log(resp);
                this.$bus.$emit('MODAL_LOCATION_BOOKING_SPOT_BOOKING');
                this.messageSuccess('Spot booked successfully');
                this.fetchProfile();
                this.$router.replace({name:'bookings'});
                this.$emit('handleClose');
            })
            .catch((error) => {
                this.loaderHide();
                this.messageError('Failed to book spot');
                console.log({error});
            })
        }
    },
    computed: { 
          ...mapGetters({
            currentUser:'auth/user',
        })
    },
    
}
</script>
<style lang="scss" scoped>
p{
    font-size: 16px;
    color:#000;
}
</style>