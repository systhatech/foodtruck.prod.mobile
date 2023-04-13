<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container class="mg56">
            <div class="custom-bs pa-4 mb-4" v-if="detail.conversation">

                <div class="d-flex justify-space-between align-center">
                    <div>
                        <h4 class="primary--text">{{ detail.conversation && detail.conversation.client ? detail.conversation.client.fullName :''}}</h4>
                        <p class="mb-0">{{detail.email}}</p>
                        <p class="mb-0">{{detail.phone}}</p>
                    </div>
                    <div v-if="detail.conversation && detail.conversation.client">
                        <div v-if="detail.conversation.unread_vendor_messages.length" class="mr-4">
                            <v-badge
                                small
                                color="error"
                                :content="detail.conversation.unread_vendor_messages.length">
                                <v-btn fab small color="primary" :to="'/client/truck/conversation/clients/'+detail.conversation.client.id+'/'+detail.conversation.id+'/'+detail.id"><v-icon>mdi-chat</v-icon></v-btn>
                            </v-badge>
                        </div>
                        <div v-else>
                            <v-btn fab small color="primary" :to="'/client/truck/conversation/clients/'+detail.conversation.client.id+'/'+detail.conversation.id+'/'+detail.id"><v-icon>mdi-chat</v-icon></v-btn>
                        </div>
                    </div>
                </div>
                <div class="mt-4">
                    <div v-if="event_response && Object.keys(event_response).length && event_response.status=='confirmed'">
                        <v-btn block rounded color="error" large @click="cancelConfirmation()">Cancel Confirmation</v-btn>
                    </div>
                    <div v-else>
                        <v-btn block rounded color="primary" large @click="sendConfirmation()">Send confirmation</v-btn>
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
                    <div class="">
                        <p class="error--text mb-1">{{ detail.credit }} Credits</p>
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
                    <p class="primary--text mb-1">Status</p>
                    <p class="mb-1 text-capitalize">{{detail.status}}</p>
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
           <DialogConfirm 
            @close="closeConfirmation"
            @handleConfirm="handleSendConfirmation"
            :dialogConfirm="modal_confirm"/>
          
            <DialogConfirm 
            @close="closeCancelConfirmation"
            @handleConfirm="handleSendConfirmationCancel"
            :dialogConfirm="modal_confirm_cancel"/>
          
        </v-container>
         <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import Bottomnavbar from '@/components/layout/NavbarBottomVendor'
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
            modal_confirm:false,
            modal_confirm_cancel:false,
            event_response:{},
        }
    },
    mounted(){
        this.fetchData();
    },
    methods: {
        fetchData(){
            ApiService.post("/event_request_detail",{
                'id': this.$router.currentRoute.params.requestId
            })
            .then((resp) =>{
                this.detail = resp.data;
                this.event_response = resp.event_response;
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
        },
        sendConfirmation(){
            this.modal_confirm = true;
        },
        cancelConfirmation(){
            this.modal_confirm_cancel = true;
        },
        closeConfirmation(){
            this.modal_confirm = false;
        },
        closeCancelConfirmation(){
            this.modal_confirm_cancel = false;
        },
        handleCancelConfirmation(){
            console.log("test");
        },
        handleSendConfirmation(){
            this.loaderShow();
            ApiService.post("/event_request_confirmation",{ 
                'id': this.detail.id,
            })
            .then((resp)=>{
                this.loaderHide();
                this.closeConfirmation();
                this.fetchData();
                this.messageSuccess(resp.message);
            })
            .catch((error)=>{
                this.loaderHide();
                this.messageError(error.response.data.message);
            })
        },
        handleSendConfirmationCancel(){
            this.loaderShow();
            ApiService.post("/event_request_cancel_confirmation",{ 
                'id': this.detail.id,
            })
            .then((resp)=>{
                this.loaderHide();
                this.closeCancelConfirmation();
                this.fetchData();
                this.messageSuccess(resp.message);
            })
            .catch((error)=>{
                this.loaderHide();
                this.messageError(error.response.data.message);
            })
        },
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        DialogConfirm: ()=> import('@/components/layout/DialogConfirm'),
    },
    computed: {
        ...mapGetters({currentUser:'auth/user'}),
    }
}
</script>
<style lang="scss" scoped>

</style>