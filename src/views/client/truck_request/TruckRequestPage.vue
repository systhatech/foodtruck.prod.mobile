<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container class="mg56">
            <div class="">
                <h3 class="primary--text">Food Truck Request</h3>
                <p>Select Event Type</p>
                <div class="custom-bs pa-8 text-center mb-6" >
                    <h2 class="mb-4 primary--text">Catering</h2>
                    <p class="">I will pay for all the meals</p>
                    <v-btn large rounded color="primary" block @click="handleClick('c')">Select</v-btn>
                </div>
                <div class="custom-bs pa-8 text-center mb-6" >
                    <h2 class="mb-4 primary--text">Event</h2>
                    <p class="">My Guests will be paying their own meals</p>
                    <v-btn large rounded color="primary" block @click="handleClick('e')">Select</v-btn>
                </div>
                <!-- <div class="custom-bs pa-8 text-center" >
                    <h2 class="mb-4 primary--text">Regular Event</h2>
                    <p class="">I would like to book truck daily, weekly or monthly basis</p>
                    <v-btn large rounded color="primary" block @click="handleClick('re')">Select</v-btn>
                </div> -->
            </div>
        </v-container>
         <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import Bottomnavbar from '@/components/layout/NavbarBottomClient'

// import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
    name:'OrdersPage',
    data() {
        return {
            title:'',
            start_request:false,
        }
    },
    methods: {

        handleBack(){
            this.$router.back();
        },
        handleClick(param){
            this.$router.push({ 'name':'clientTruckRequestFormPage', 'query': { type: param}});
        }
    },
    components: {
        Topnavbar,
        Bottomnavbar,
    },
    computed: {
        ...mapGetters({currentUser:'auth/user'}),
    }
}
</script>
<style lang="scss" scoped>

</style>