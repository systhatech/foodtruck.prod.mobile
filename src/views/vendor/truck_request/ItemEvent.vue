<template>
      <div class="">
        <div class="">  
            <div class="w-100">
                <div class="">
                    <div class="">
                        <div class="mb-4">
                            <h4 class="mb-0 text-capitalize">{{item.event_name}}</h4>
                            <div v-if="item.status!='pending'">
                                <div class="pt-2">
                                    <p class="mb-0 green--text" v-if="item.response_count">{{item.response_count}} Truck Responded</p>
                                </div>
                            </div>
                            <!-- <v-chip v-if="item.event_type" small class="text-capitalize" color="primary">{{ item.event_type }}</v-chip> -->
                        </div>
                        <v-divider></v-divider>
                        <div class="mt-4" v-if="item.event_type">
                            <p class="primary--text mb-1">Event Type</p>
                            <p class="text-capitalize mb-0">{{item.event_type}}</p>
                        </div> 
                        <div class="d-flex justify-space-between">
                            <div class="pt-4">
                                <p class="primary--text mb-1">Date and Time</p>
                                <p class="mb-0">{{ formatStandardUSDate(item.event_date) }} </p>
                                <p>{{ formatT(item.start_time) }} - {{ formatT(item.end_time) }}</p>
                            </div>
                            <div class="pt-4">
                                <p class="error--text mb-1">{{ item.credit }} Credits</p>
                            </div>
                        </div>
                        <div class="mb-4">
                            <p class="primary--text mb-1">Address</p>
                            <p class="mb-1">{{item.address}}</p>
                        </div> 
                        <div class="d-flex justify-space-between">
                            <div>
                                <p class="primary--text mb-1">Expected</p>
                                <p>{{ numberWithCommas(item.people_expected)}} People</p>
                            </div>
                            <div>
                                <p class="primary--text mb-1">Guaranteed Sales</p>
                                <p>{{ item.min_guerantee_sales ? item.min_guerantee_sales:'n/a'}}</p>
                            </div>
                        </div>
                        <div>
                            <p class="primary--text mb-1">Additional Info</p>
                            <p>{{ item.additional_info}}</p>
                        </div>
                       
                    </div>
                </div>
            </div>
            <v-divider class="mb-4"></v-divider>
            <div v-if="item.email && item.phone && item.status!='pending'">
                <div>
                    <p class="primary--text mb-1">Contact</p>
                    <p class="mb-1"><v-icon color="primary">mdi-email</v-icon> {{ item.email}}</p>
                    <p> <v-icon color="primary">mdi-phone</v-icon> {{ item.phone}}</p>
                </div>
            </div>
           
            <div class="d-flex align-center justify-space-between">
                <v-btn v-if="item.is_responded" rounded  large color="primary" :to="'/vendor-truck-request/'+item.id">view</v-btn>
                <v-btn v-else rounded  large color="primary" @click="handleClick(item)">buy</v-btn>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters} from'vuex'
import moment from 'moment'

export default {
    props:{
        item:{},
        availableCredit:{}
    },
    data() {
        return {
            moment,
        }
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
        }),
    },
    created() {

    },
    mounted() {
      
    },
    methods: {
        handleClick(item){
            if(this.availableCredit==0 || (item.credit > this.availableCredit)){
                this.$router.push("/vendor-credit-packages");
            }else{
                // this.$bus.$emit('MODAL_OPEN',{item});
                this.$emit("buyEvent",{item});
            }
        }
    },

    components: {
 
    }
}
</script>
<style scoped lang="scss">

</style>