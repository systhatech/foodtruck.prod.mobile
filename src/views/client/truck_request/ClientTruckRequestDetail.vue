<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image" fluid>
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container class="mg56">
            <div v-if="detail && Object.keys(detail).length">
                <div class="custom-bs pa-4 mb-4" v-if="detail.vendors && detail.vendors.length">
                    <div class="mb-2">
                        <p class="mb-0">Truck Responses</p>
                    </div>
                    <v-divider></v-divider>
                    <div class="mt-4">
                        <div  v-for="(vendor,index) in detail.vendors" :key="index">
                            <!-- {{ vendor }} -->
                            <div class="d-flex justify-space-between align-center">
                                <div>
                                    <h4 class="primary--text text-capitalize" style="text-decoration: underline;" @click="handleProfile(vendor)">{{vendor.name}}</h4>
                                    <!-- <p class="error--text mb-0" v-if="vendor.unread_messages.length">{{vendor.unread_messages.length}} unread message</p> -->
                                    <p class="mb-0">{{vendor.email}}</p>
                                    <p>{{ formatPhoneNumber(vendor.phone_no)}}</p>
                                </div>
                                <div>
                                    <div v-if="vendor.unread_messages.length" class="mr-4">
                                        <v-badge
                                            small
                                            color="error"
                                            :content="vendor.unread_messages.length">
                                            <!-- <v-btn fab small color="primary" :to="'/client/truck/conversation/clients/'+detail.conversation.client.id+'/'+detail.conversation.id+'/'+detail.id"><v-icon>mdi-chat</v-icon></v-btn> -->
                                            <v-btn fab small color="primary" :to="'/client/truck/conversation/vendors/'+vendor.id+'/'+vendor.conversation_id+'/'+detail.id"><v-icon>mdi-chat</v-icon></v-btn>
                                        </v-badge>
                                    </div>
                                    <div v-else>
                                        <!-- <v-btn fab small color="primary" :to="'/client/truck/conversation/clients/'+detail.conversation.client.id+'/'+detail.conversation.id+'/'+detail.id"><v-icon>mdi-chat</v-icon></v-btn> -->
                                        <v-btn fab small color="primary" :to="'/client/truck/conversation/vendors/'+vendor.id+'/'+vendor.conversation_id+'/'+detail.id"><v-icon>mdi-chat</v-icon></v-btn>
                                    </div>
                                </div>
                            </div>
                            <v-divider v-if="index<detail.vendors.length-1" class="mb-4 mt-4"></v-divider>
                        </div>
                    </div>
               </div>
                <div class="custom-bs pa-4 mb-4">
                    <div class="mb-2">
                        <h5 class="text-uppercase">{{ detail.event_name }}</h5>
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
                        <p class="text-capitalize">{{ detail.event_type}}</p>
                    </div>
                    <div class="mb-4">
                        <p class="primary--text mb-1">Address</p>
                        <p class="mb-1">{{detail.address}}</p>
                    </div> 
                    <div class="mb-4">
                        <p class="primary--text mb-0">Current Status</p>
                        <v-row>
                            <v-col cols="6">
                                <v-select
                                v-model="selected_status"
                                :items="items"
                                class="mt-0 pt-0"
                                density="compact"
                                >
                                <template v-slot:selection="data">
                                        <span class="text-capitalize">{{ data.item }}</span>
                                    </template>
                                    <template v-slot:item="data">
                                        <template>
                                        <v-list-item-content>
                                            <v-list-item-title v-html="data.item" class="text-capitalize"></v-list-item-title>
                                        </v-list-item-content>
                                        </template>
                                    </template>   
                                </v-select>
                            </v-col>
                        </v-row>
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
                                <p class="text-capitalize">{{detail.cuisines?detail.cuisines.split(",").join(", "):'n/a'}}</p>
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
                        <!-- <v-col cols="6" v-if="detail.cuisines">
                            <div>
                                <h4 class="primary--text">Preferred Cuisines</h4>
                                <p class="text-capitalize">{{ detail.cuisines}}</p>
                            </div>
                        </v-col> -->
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
            </div>
            <div v-else class="mt-10 text-center">
                <div v-if="loading">
                    <ComponentLoadingVue/>
                </div>
                <div v-else class="unavailable">
                    <p>No orders</p>
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
            selected_status : "pending",
            items: ['pending', 'hired', 'archived'],
            loading:false,
        }
    },
    mounted(){
        this.fetchData();
        this.event_request_id = this.$router.currentRoute.params.requestId;
    },
    watch:{
        selected_status(val) {
            this.updateStatus(val);
        }   
    },
    methods: {
        handleProfile(truck){
            this.$router.push("/truck-profile/"+truck.id);
        },
        updateStatus(param){
            ApiService.post("/event_request_update",{
                'id': this.$router.currentRoute.params.requestId,
                "status": param,
            })
            .then(() =>{
                // this.messageSuccess(resp.message);
            })
            .catch((error) =>{
                console.log(error);
            })
        },
        fetchData(){
            this.loading = true;
            ApiService.post("/event_request_detail",{
                'id': this.$router.currentRoute.params.requestId
            })
            .then((resp) =>{
                this.loading = false;
                this.detail = resp.data;
                this.selected_status = this.detail.status;
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
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
    },
    computed: {
        ...mapGetters({currentUser:'auth/user'}),
    }
}
</script>
<style lang="scss" scoped>

</style>