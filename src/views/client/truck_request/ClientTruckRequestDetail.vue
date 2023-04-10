<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container class="mg56">
            <div class="custom-bs pa-4 mb-4">
                <div class="mb-2">
                    <h5 class="text-uppercase">{{ detail.event_name }}</h5>
                    <!-- <v-chip small color="primary">Event</v-chip> -->
                </div>
                <v-divider></v-divider>
                <div class="mb-4 mt-4">
                    <div class="pt-4">
                        <p class="primary--text mb-1">Date and Time</p>
                        <p class="mb-0">{{ formatStandardUSDate(detail.event_date) }} </p>
                        <p>{{ formatT(detail.start_time) }} - {{ formatT(detail.end_time) }}</p>
                    </div>
                </div>
                
                <div class="mb-4" v-if="detail.event_type">
                    <p class="primary--text mb-1">Event Type</p>
                    <p>{{ detail.event_type}}</p>
                </div>
                <div class="mb-4">
                    <p class="primary--text mb-1">Address</p>
                    <p class="mb-1">{{detail.address}}</p>
                </div> 
           </div>
           <div class="custom-bs pa-4 mb-4">
                <v-row>
                    <v-col cols="6" v-if="detail.budget">
                        <div>
                            <h4 class="primary--text">Budget</h4>
                            <p>{{formatAmount(detail.budget)}}</p>
                        </div>
                    </v-col>
                    <v-col cols="6" v-if="detail.cuisines">
                        <div>
                            <h4 class="primary--text">Cuisine Type</h4>
                            <p>{{detail.cuisines?detail.cuisines:'n/a'}}</p>
                        </div>
                    </v-col>
                    <v-col cols="6" v-if="detail.event_frequency">
                        <div>
                            <h4 class="primary--text">Event Frequency</h4>
                            <p>{{detail.event_frequency}}</p>
                        </div>
                    </v-col>
                    <v-col cols="6" v-if="detail.people_expected">
                        <div>
                            <h4 class="primary--text">Expected</h4>
                            <p>{{ detail.people_expected}} People</p>
                        </div>
                    </v-col>
                    <v-col cols="6" v-if="detail.people_minimum">
                        <div>
                            <h4 class="primary--text">Minimum</h4>
                            <p>{{ detail.people_minimum}} People</p>
                        </div>
                    </v-col>
                    <v-col cols="6" v-if="detail.min_guerantee_sales">
                        <div>
                            <h4 class="primary--text">Guerantee Sale</h4>
                            <p>{{ detail.min_guerantee_sales}}</p>
                        </div>
                    </v-col>
                    <v-col cols="6" v-if="detail.cuisines">
                        <div>
                            <h4 class="primary--text">Preferred Cuisines</h4>
                            <p class="text-capitalize">{{ detail.cuisines}}</p>
                        </div>
                    </v-col>
                    <v-col cols="12" v-if="detail.event_payer">
                        <div>
                            <h4 class="primary--text">Who will pay?</h4>
                            <p>{{ detail.event_payer}}</p>
                        </div>
                    </v-col>
                </v-row>
           </div>
           <div class="custom-bs pa-4 mb-4" v-if="detail.description">
                <div>
                    <h4 class="primary--text">Additional Information</h4>
                    <p>{{ detail.description}}</p>
                </div>
           </div>
           <div class="custom-bs pa-4 mb-4" v-if="detail.vendors && detail.vendors.length">
                <div  v-for="(vendor,index) in detail.vendors" :key="index">
                    <div class="d-flex justify-space-between align-center">
                        <div>
                            <h4 class="primary--text text-capitalize">{{vendor.name}}</h4>
                            <p class="success--text">{{vendor.unread_messages.length}} unread message</p>
                        </div>
                        <div>
                            <v-btn fab small color="primary" :to="'/client/truck/conversation/vendors/'+vendor.id+'/'+vendor.conversation_id+'/'+detail.id"><v-icon>mdi-chat</v-icon></v-btn>
                        </div>
                    </div>
                    <v-divider v-if="index<detail.vendors.length-1" class="mb-4"></v-divider>
                </div>
           </div>
        </v-container>
         <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import Bottomnavbar from '@/components/layout/NavbarBottomClient'
import { ApiService } from '@/core/services/api.service'
// import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
    name:'OrdersPage',
    data() {
        return {
            title:'',
            start_request:false,
            detail:{},
            event_request_id:'',
        }
    },
    mounted(){
        this.fetchData();
        this.event_request_id = this.$router.currentRoute.params.requestId;
    },
    methods: {
        fetchData(){
            ApiService.post("/event_request_detail",{
                'id': this.$router.currentRoute.params.requestId
            })
            .then((resp) =>{
                console.log(resp);
                this.detail = resp.data;
            })
            .catch((error) =>{
                console.log(error);
            })
        },
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