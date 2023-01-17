<template>
    <v-row justify="center">
        <v-dialog
        v-model="modalLocationBooking"
        persistent
        scrollable
        max-width="800px"
        >
        <v-card scrollable>
            <v-card-title>
                <div class="w-100 justify-space-between d-flex">
                    <h3 class="text-capitalize">{{ booking && booking.company ? booking.company.neighbourhood_name : (booking && booking.event ? booking.event.name : '') }}</h3>
                    <div @click="handleClose"> <v-icon> {{ iconClose }} </v-icon></div>
                </div>
            </v-card-title>
            <v-card-text>
              <div>
                    <div class="mb-5 mt-5">
                        <div class="d-flex ">
                            <v-icon color="secondary">mdi-calendar</v-icon>
                            <h4>{{ moment(booking.start_date).format('MM/DD/YY LT')}} - {{ moment(booking.end_date).format('MM/DD/YY LT')}}</h4>
                        </div>
                        <div class="d-flex ">
                            <v-icon color="secondary">mdi-map-marker</v-icon>
                            <h4>{{ booking.add1 }} {{ booking.city }} {{ booking.state }} {{ booking.zip }} {{ booking.available_space }}</h4>
                        </div>
                    </div>
                    <div>
                        <div>

                            <v-row>
                                <v-col cols="12" sm="12" md="6" lg="6" xl="4" v-for="(spot, index) in booking.spots" :key="index">
                                        <v-card class="custom-bs h-100 pa-4" style="background:#e3e3e3">
                                            <div class="d-flex align-center justify-space-between">
                                                <p class="ma-0 pa-0 text-primary" style="font-weight:600">Spot {{ index+1 }}</p>
                                                <p class="ma-0 pa-0 text-secondary">Rate : {{formatAmount(spot.rate)}}</p>
                                            </div>
                                            <div v-if="spot.vendor" class="pt-3 text-center">
                                                <h3>{{ spot.vendor.name }}</h3>
                                            </div>
                                            <div v-else class="text-center pt-2">
                                                <v-btn tile color="primary" small @click="handleBookSpot(spot)">Book Now</v-btn>
                                            </div>
                                        </v-card>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
              </div>
            </v-card-text>
            <v-card-actions class="d-flex justify-space-between pt-4 pb-4 card-actions">
                <v-btn color="secondary" @click="handleClose" tile>Close </v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
import { mdiPlus, mdiMinus, mdiClose } from '@mdi/js'
import  moment from 'moment'
import { mapGetters } from 'vuex'
import { ApiService } from '@/core/services/api.service'
export default {
    props:{
        modalLocationBooking:{},
        booking:{}
    },
    data(){
        return {
            moment,
            mdiPlus, 
            mdiMinus,
            iconClose: mdiClose,
            quantity:1,
            status:null,
        }
    },
    created(){
    },

    methods: {
        handleClose(){
            this.$emit('closeModal');
            this.quantity = 1;
        },
        handleNext(){
        },
        handleBookSpot(spot){
            ApiService.post('/location-bookings/book-spot',{
                spot_id : spot.id, 
                vendor_id: this.currentUser.vendor.id
            })
            .then((resp) => {
                console.log(resp);
                this.$bus.$emit('MODAL_LOCATION_BOOKING_SPOT_BOOKING');
                this.$emit('closeModal');
            })
            .catch((error) => {
                console.log({error});
            })
        }
    },
    computed: { 
        ...mapGetters({
            currentUser:'auth/user',
        }),
        checkBooked(){
            // let currentVendor =  this.booking.spots.filter((item,index) => {
            //     console.log(item);
            //     return item.vendor_id == this.currentUser.vendor.id;
            // });
            // if(currentVendor.length > 0){
            //     return currentVendor[0].status;
            // }else{
                return "not-booked";
            // }
        },
    },
    
}
</script>
<style lang="scss" scoped>
// .v-card__title{
//     -webkit-box-shadow: 0px 10px 10px -5px rgba(235,235,235,1);
//     -moz-box-shadow: 0px 10px 10px -5px rgba(235,235,235,1);
//     box-shadow: 0px 10px 10px -5px rgba(235,235,235,1);
// }
// .card-actions {
//     -webkit-box-shadow: 1px -9px 10px -5px rgba(235,235,235,1);
//     -moz-box-shadow: 1px -9px 10px -5px rgba(235,235,235,1);
//     box-shadow: 1px -9px 10px -5px rgba(235,235,235,1);
// }
// .quantity {
//     width: 60px;
//     border: 1px solid #dadada;
//     padding: 4px 10px;
//     text-align: center;
//     color: #eb1b52 !important;
//     &:focus,
//     &:active{
//         outline: 1px solid#eb1b52 !important
//     }
// }
// .cardBody{
//     display: flex;
//     flex-direction: column;
//     align-items: center;
// }
// h2{
//     padding: 20px;
//     color: #4caf50;
// }
</style>