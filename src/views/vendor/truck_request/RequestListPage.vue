<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mg56">
            <div>
                <div class="pa-6">
                    <p class="text-center" style="text-decoration: underline;" @click="handleClick('tutorial_vendor_truck_request')">Video tutorial</p>
                    <div>
                        <div class="d-flex align-center justify-space-around">
                            <div class="share-icon">
                                <ShareNetwork
                                    network="facebook"
                                    :url="link_url"
                                    :title="post_title"
                                    description=""
                                    quote=""
                                    hashtags=""
                                >
                                    <v-btn fab text color="blue"><v-icon large>mdi-facebook</v-icon></v-btn>
                                </ShareNetwork>
                                <ShareNetwork
                                    network="twitter"
                                    :url="link_url"
                                    :title="post_title"
                                    description=""
                                    quote=""
                                    hashtags=""
                                >
                                    <v-btn fab text color="primary"><v-icon large>mdi-twitter</v-icon></v-btn>
                                </ShareNetwork>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <v-tabs v-model="active_tab">
                        <v-tab v-for="(t,i) in tabs" :key="i">{{ t.name }}</v-tab>
                    </v-tabs>
                </div>
                <div class="mt-4">
                    <div v-if="active_tab==0">
                        <div v-if="leads && Object.keys(leads).length">
                            <!-- <TabLead :leads="leads" :availableCredit="available_credit"/> -->
                            <div v-for="(item,index) in leads" :key="index">
                                <div v-if="item.type =='catering'">
                                    <div class="custom-bs pa-4 mb-4">
                                        <ItemCatering :item="item" 
                                            :availableCredit="available_credit" 
                                            @buyEvent="handleBuyEvent"
                                            />
                                    </div>
                                </div>
                                <div v-if="item.type == 'event'">
                                    <div class="custom-bs pa-4 mb-4">
                                        <ItemEvent :item="item" 
                                        @buyEvent="handleBuyEvent"
                                        :availableCredit="available_credit"/>
                                    </div>
                                </div>
                                <div v-if="item.type =='regular_event'">
                                    <div class="custom-bs pa-4 mb-4">
                                        <ItemRegularEvent :item="item" 
                                        @buyEvent="handleBuyEvent"
                                        :availableCredit="available_credit"/>
                                    </div>
                                </div>
                            </div>
                            <div v-if="this.last_page >= this.next_page" class="pa-4 text-center">
                                <v-btn :disabled="fetching_data" outlined large color="primary" rounded @click="loadMore()">{{fetching_data ?'Loading...':'load more'}}</v-btn>
                            </div>
                        </div>
                        <div v-else class="unavailable">
                            <p>No event found</p>
                        </div>
                    </div>
                    <div v-else-if="active_tab==1">
                        <TabResponse/>
                    </div>
                    <div v-if="active_tab==2">
                        <TabPayment/>
                    </div>
                    <ModalBuy @refreshData="fetchRequestList()" :available_credit="available_credit"/>
                    <ModalBuyCredit/>
                    <ModalVideoPlayer/>
                </div>
            </div>
        </v-container>
        <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import Bottomnavbar from '@/components/layout/NavbarBottomVendor'
import { mapGetters, mapActions } from 'vuex';
import { base_url } from '@/core/services/config'
import { mdiAccount, mdiChevronRight } from '@mdi/js'
import {socketHandler} from '@/core/services/socketio/socket';
import { ApiService } from "@/core/services/api.service";
export default {
    name:'RequestListPage',
    data() {
        return {
            title:'',
            link_url:'',
            post_title:'',
            base_url,
            active_tab:0,
            iconNavigate: mdiChevronRight,
            icon_account: mdiAccount,
            indexValue:3,
            usericon:'',
            tabs:[
                {"name":"Events","value":'lead'},
                {"name":"Response","value":'response'},
                {"name":"Payments","value":'Payments'},
            ],
            desserts: [
                {
                    name: '2/22/23',
                    requested_id: 159,
                    credits: 159,
                },
                {
                    name: '2/22/23',
                    requested_id: 237,
                    credits: 237,
                }
                ],
           
            utype:'',
            general:{},
            others:{},
            contact:{},
            message:'Loading...',
            render:false,
            leads:[],
            active_component:'',
            available_credit:0,

            next_page:1,
            last_page:0,
            fetching_data: false,
        }
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        // TabLead:() => import('@/views/vendor/truck_request/TabLeads.vue'),
        TabPayment:() => import('@/views/vendor/truck_request/TabPayments.vue'),
        TabResponse:() => import('@/views/vendor/truck_request/TabResponse.vue'),
        ModalBuy:()=>import("@/views/vendor/truck_request/ModalBuy.vue"),
        ModalBuyCredit:()=>import("@/views/vendor/truck_request/ModalBuyCredit.vue"),
        ModalVideoPlayer:()=>import('@/views/vendor/profile/modal/ModalVideoPlayer.vue'),

        ItemCatering:() => import('@/views/vendor/truck_request/ItemCatering.vue'),
        ItemEvent:() => import('@/views/vendor/truck_request/ItemEvent.vue'),
        ItemRegularEvent:() => import('@/views/vendor/truck_request/ItemRegularEvent.vue'),
    },
    mounted() {
        this.fetchSetting();
        this.fetchRequestList();
    },
    methods: {
        ...mapActions({
            signOutAction: 'auth/signOut',
            fetchCarts: 'truck/fetchCarts',
        }),
        loadMore(){
            if(this.last_page >= this.next_page){
                if(!this.fetching_data)
                this.fetchRequestList();
            }
        },
        handleBuyEvent(param){
            this.loaderShow();
            ApiService.post("/event_buy",{
                "id": param.item.id
            })
            .then(() =>{
                this.loaderHide();
                this.next_page = 1;
                this.fetchRequestList();
                // console.log({response});
            })
            .catch((error)=>{
                this.loaderHide();
                console.log(error);
            })
        },
        handleClick(param){
            this.$bus.$emit('MODAL_VIDEO_PLAYER_OPEN',{param});
        },
        fetchRequestList(){
            ApiService.post("/event_leads?page="+this.next_page)
            .then((resp) =>{
                this.available_credit = resp.credit_available;
                this.leads = [];
                resp.data.data.forEach(element => {
                    this.leads.push(element);
                });
 
                this.last_page  = resp.data.last_page;
				if(this.next_page <= this.last_page){
					this.next_page += 1
				}
  
                if(!this.leads.length) {
                    this.message="No items";
                }
                this.loaderHide();
                this.fetching_data = false;
            })
            .catch((error) =>{
                console.log({error});
            })
        },
        fetchSetting() {
            // show_spot_booking
            ApiService.post("/site-setting-video-link",{'code':'show_spot_booking'})
            .then((resp)=>{
                // this.video = resp.data.value;
                // this.video_description = resp.data.description;
                if(parseInt(resp.data.value)){
                    // console.log("here", resp.data.value);
                    this.menusVendor.push({name:'Spot Booking',icon:'mdi-clipboard-edit-outline',route:'bookings'});
                }else{
                    console.log("failed", resp.data.value);
                }
                // console.log({resp});
            })            
            .catch((error)=>{
                console.log({error});
            })
        },
        signOut() {
            this.loaderShow();
            this.signOutAction()
            .then(() => {
                // console.log("here");
                this.loaderHide();
                socketHandler.disconnect();
                this.$router.replace({
                    name:'loginPage',
                })
            })
            .catch((error)=>{
                console.log({error});
            })
        },
     

        handleBack() {
            this.$router.back();
        },
        navigatePage(route) {
            if(route == 'logout') {
                this.signOut();
            }else{
                this.$router.push('/'+route).catch(()=>{});
            }
        }
    },
    computed: {
        ...mapGetters({currentUser:'auth/user'}),
    }
}
</script>
<style lang="scss" scoped>
.share-icon{
    display: flex;
    a{
        text-decoration: none;
    }
}
</style>