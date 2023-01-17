<template>
    <v-row justify="center">
        <v-dialog
        v-model="modalBookingPayment"
        persistent
        scrollable
        >
        <v-card scrollable>
            <v-card-title>
                <div class="w-100 justify-space-between d-flex">
                    <h3>Book Now</h3>
                    <div @click="handleClose"> <v-icon> {{ iconClose }} </v-icon></div>
                </div>
            </v-card-title>
            <v-card-text class="pt-4" v-if="spot && Object.keys(spot).length">
              <div>
                  <div class="mb-6">
                        <table class="w-100">
                                <tr>
                                    <td>Price</td>
                                    <td class="text-right">{{ formatAmount(spot.rate) }}</td>
                                </tr>
                                <tr v-if="convenienceFee">
                                    <td>Convenience Fee ({{ convenienceFee }} % )</td>
                                    <td class="text-right">{{ formatAmount(spot.rate * (convenienceFee/100))}}</td>
                                </tr>
                                <tr>
                                    <td class="f9-bold">Total </td>
                                    <td class="text-right f9-bold">{{ formatAmount(spot.rate + (spot.rate * (convenienceFee/100)))}}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" class="f8">* note: non-refundable </td>
                                </tr>
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
import { mapGetters } from 'vuex'
import { ApiService } from '@/core/services/api.service'
// import CardStripe from '../cart/CardStripeElements'
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
            // pulishableKey :'pk_test_HWXJvemu3UMjLToQMuQXdVHf00hbtPgsPF',
            status:null,
            total:0,
        }
    },
    watch:{
        apikey(newval) {
            console.log({newval});
        }
    },
    mounted(){
        console.log(this.apikey);
    },
    components: {
        CardStripe,
    },
    methods: {
        handleProceedCard(param) {
            this.stripeToken = param.stripeToken;
        },
        handleClose(){
            this.$emit('handleClose');
        },
        handleNext(){
        },
        handleBookSpot(param){
            // console.log({
            //     spot_id : this.spot.id, 
            //     stripeToken: param.stripeToken,
            //     vendor_id: this.currentUser.vendor.id,
            //     amount: this.spot.rate,
            // });
            // return;
            ApiService.post('/location-bookings/book-spot',{
                spot_id : this.spot.id, 
                stripeToken: param.stripeToken,
                vendor_id: this.currentUser.vendor.id,
                amount: this.spot.rate + (this.spot.rate * (this.convenienceFee/100)),
            })
            .then((resp) => {
                console.log(resp);
                this.$bus.$emit('MODAL_LOCATION_BOOKING_SPOT_BOOKING');
                this.messageSuccess('Spot booked successfully');
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
</style>