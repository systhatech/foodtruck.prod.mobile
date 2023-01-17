<template>
    <v-row justify="center">
        <v-dialog
        v-model="modalLocationBookingView"
        persistent
        scrollable
        max-width="800px"
        >
        <v-card scrollable>
            <v-card-title>
                <div class="w-100 justify-space-between d-flex">
                    <h3 class="text-capitalize">{{ booking && booking.location && booking.location.company ? booking.location.company.neighbourhood_name : '' }}</h3>
                    <div @click="handleClose"> <v-icon> {{ iconClose }} </v-icon></div>
                </div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <div>
                  <v-card flat>
                      <div>
                          <v-simple-table>
                            <template v-slot:default>
                            <thead>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Start Date</th>
                                    <td>{{ moment(booking.start_date).format('MM/DD/YY LT')}}</td>
                                    <th>End Date</th>
                                    <td>{{ moment(booking.end_date).format('MM/DD/YY LT')}}</td>
                                </tr>
                                <tr>
                                    <th>Address</th>
                                    <td style="width:200px">{{ (booking && booking.location) ? booking.location.add1 : '' }}</td>
                                    <th>City</th>
                                    <td>{{ (booking && booking.location) ? booking.location.city : '' }}</td>
                                </tr>
                                <tr>
                                    <th>State</th>
                                    <td>{{ (booking && booking.location) ? booking.location.state :'' }}</td>
                                    <th>ZIP Code</th>
                                    <td>{{ (booking && booking.location) ? booking.location.zip :'' }}</td>
                                </tr>
                                <tr>
                                    <th>Available Spaces</th>
                                    <td>{{ booking && booking.location ? booking.location.available_space :'' }}</td>
                                    <th>Booked Spaces</th>
                                    <td>Spot-{{ booking.spot }} @ {{ formatAmount(parseInt(booking.rate))}}</td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <td class="text-primary text-uppercase">{{ booking && booking.status ? booking.status:'No status' }}</td>
                                     <th>Booked Date</th>
                                    <td>{{ moment(booking.updated_at).format('MM/DD/YY LT') }}</td>
                                </tr>
                               
                            </tbody>
                            </template>
                        </v-simple-table>
                      </div>
                  </v-card>
              </div>
            </v-card-text>
            <v-card-actions class="d-flex justify-space-between pt-4 pb-4 card-actions">
                <v-btn tile text color="secondary" @click="handleClose">Close </v-btn>
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
        modalLocationBookingView:{},
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

    methods: {
        handleClose(){
            this.$emit('closeModal');
            this.quantity = 1;
        },
        handleNext(){
        },
        handleBookSpot(spot){
            ApiService.post('/admin/location-bookings/book-spot',{
                spot_id : spot.id, 
                vendor_id: this.currentUser.vendor.id
            })
            .then(() => {
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
            return "not-booked";
        },
    },
    
}
</script>
<style lang="scss" scoped>
</style>