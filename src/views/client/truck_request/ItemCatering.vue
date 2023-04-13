<template>
    <div class="">
        <div class="">  
            <div class="w-100">
                <div class="mb-4">
                    <h4 class="mb-0 text-capitalize">{{item.event_name}}</h4>
                    <div class="" v-if="item.response_count">
                        <p class="mb-0 error--text">{{ item.response_count }} Truck Responded</p>
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
                   
                </div>
                <div class="mb-4">
                    <p class="primary--text mb-1">Address</p>
                    <p class="mb-1">{{item.address}}</p>
                </div> 
                <div class="d-flex justify-space-between">
                    <div>
                        <p class="primary--text mb-1">Budget</p>
                        <p>{{ formatAmount(item.budget)}}</p>
                    </div>
                    <div>
                        <p class="primary--text mb-1">Minimum</p>
                        <p>{{ item.people_minimum}} People</p>
                    </div>
                </div>
            </div>
            <v-divider class="mb-4"></v-divider>
            <div v-if="item.email && item.phone">
                <div>
                    <p class="primary--text mb-1">Contact</p>
                    <p class="mb-1"><v-icon color="primary">mdi-email</v-icon> {{ item.email}}</p>
                    <p> <v-icon color="primary">mdi-phone</v-icon> {{ item.phone}}</p>
                </div>
            </div>
            <div class="d-flex align-center justify-space-between">
                <!-- <v-btn rounded  large color="primary" to="/client-truck-request/1">view</v-btn> -->
                <v-btn rounded  large color="primary" :to="'/client-truck-request/'+item.id">view</v-btn>
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
        handleClick(){
            this.$emit('MODAL_OPEN');
        }
    },

    components: {
 
    }
}
</script>
<style scoped lang="scss">

</style>