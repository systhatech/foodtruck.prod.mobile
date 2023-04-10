<template>
      <div class="">
        <div class="">  
            <div class="w-100">
                <div class="">
                    <div class="">
                        <div class="mb-4">
                            <h4 class="mb-0 text-capitalize">{{item.event_name}}</h4>
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
                        <div class="mb-4" v-if="item.cuisines">
                            <p class="primary--text mb-1">Cuisine Types</p>
                            <p class="mb-1 text-capitalize">{{item.cuisines}}</p>
                        </div> 
                        <div class="mb-4">
                            <p class="primary--text mb-1">Who Pays?</p>
                            <p class="mb-1">{{item.event_payer}}</p>
                        </div> 
                        <div class="mb-4">
                            <p class="primary--text mb-1">Event Frequency</p>
                            <p class="mb-1">{{item.event_frequency}}</p>
                        </div> 
                    </div>
                </div>
            </div>
            <v-divider class="mb-4"></v-divider>
            <div class="pb-4" v-if="item.response_count">
                <p class="mb-0 green--text">{{ item.response_count }} Truck Responded</p>
                <!-- <h5>3 Unread message</h5> -->
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

    },

    components: {
 
    }
}
</script>
<style scoped lang="scss">

</style>