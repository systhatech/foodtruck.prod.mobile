<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container class="mg56">
            <div class="custom-bs pa-4 mb-4">
                <div class="d-flex justify-space-between mb-4">
                    <h4 class="primary--text">Birthday Party</h4>
                    <v-chip small color="primary">Event</v-chip>
                </div>
                <div class="mb-4">
                    <h4 class="primary--text">Event Date</h4>
                    <p class="mb-2">June 17th 2023, 4:00 PM to 5:00 PM</p>
                </div>
                
                <div class="mb-4">
                    <h4 class="primary--text">Address</h4>
                    <p>3221 Pale Rider Pass, Leander TX, 78641</p>
                </div>

                <!-- <div class="mb-4">
                    <v-btn rounded large class="mr-2">cancel</v-btn>
                    <v-btn rounded large>close</v-btn>
                </div> -->
           </div>
           <div class="custom-bs pa-4 mb-4">
                <v-row>
                    <v-col cols="6">
                        <div>
                            <h4 class="primary--text">Budget</h4>
                            <p>$500.00</p>
                            <h4 class="primary--text">Cuisine Type</h4>
                            <p>Indian, Maxcian</p>
                        </div>
                    </v-col>
                    <v-col cols="6">
                        <div>
                            <h4 class="primary--text">Attendies</h4>
                            <p>100</p>
                            <h4 class="primary--text">Frequency</h4>
                            <p>Once a month</p>
                        </div>
                    </v-col>
                </v-row>
           </div>
           <div class="custom-bs pa-4 mb-4">
                <p>Customer will pay Themselfs</p>
                <v-divider></v-divider>
                <p class="pt-4">Minimum guerantee message</p>
           </div>
           <div class="custom-bs pa-4 mb-4">
                <div class="d-flex justify-space-between">
                    <div>
                        <h4 class="primary--text">ABC Trck</h4>
                        <p>new message</p>
                    </div>
    
                    <div>
                        <v-btn fab color="primary"><v-icon large>mdi-chat</v-icon></v-btn>
                    </div>
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