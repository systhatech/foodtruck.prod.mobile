<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container class="mg56">
            <div class="custom-bs pa-4 mb-6">
                <h4 class="mb-2">Contact Person</h4>
                <v-divider></v-divider>
                <div class="mt-2">
                    <p class="mb-1">John Doe</p>
                    <p class="mb-1">john@gmail.com</p>
                    <p class="mb-1">+1(123)-999-9999</p>
                    <p class="mb-1">3221 pale rider TX, 78654, US</p>
                </div>
            </div>
            <div class="custom-bs pa-4">
                <h4 class="mb-2">Event Detail</h4>
                <v-divider></v-divider>
                <div class="mb-4 mt-4">
                    <p class="mb-0">Event Name</p>
                    <h4>new event name</h4>
                </div>
                <div class="mb-4">
                    <p class="mb-0">Address</p>
                    <h4>new event name</h4>
                </div>
                <div class="mb-4">
                    <p class="mb-0">Event Type</p>
                    <h4>Conference</h4>
                </div>
                <div class="mb-4">
                    <p class="mb-0">Minimum People</p>
                    <h4>34</h4>
                </div>
                <div class="mb-4">
                    <p class="mb-0">Event Date</p>
                    <h4>Mar 23, 2023</h4>
                </div>
                <div class="mb-4">
                    <p class="mb-0">Start Time</p>
                    <h4>10:00 AM</h4>
                </div>
                <div class="mb-4">
                    <p class="mb-0">End Time</p>
                    <h4>03:00 PM</h4>
                </div>
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