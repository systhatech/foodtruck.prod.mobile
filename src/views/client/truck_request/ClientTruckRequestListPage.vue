<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mg56">
            <div>
                <div class="custom-bs text-center pt-8 pb-8 mb-4">
                    <h4 class="primary--text">Need Food Trucks for your Event?</h4>
                    <div class="pt-6">
                        <v-btn large color="primary" rounded to="/client-truck-request"> Request Now</v-btn>
                    </div>
                </div>
                <div>
                    <v-tabs v-model="active_tab">
                        <v-tab v-for="(t,i) in tabs" :key="i">
                            <div v-if="t.count">
                                <v-badge color="error" :content="t.count">{{ t.name }}</v-badge>
                            </div>
                            <div v-else>{{ t.name }}</div>
                        </v-tab>
                    </v-tabs>
                </div>
                <div class="mt-4">
                    <div v-if="request_list && request_list.length">
                        <div class="pa-4 custom-bs mt-4" v-for="(item,index) in request_list" :key="index">
                            <div v-if="item.type =='catering'">
                                <ItemCatering :item="item"/>
                            </div>
                            <div v-if="item.type == 'event'">
                                <ItemEvent :item="item"/>
                            </div>
                            <div v-if="item.type =='regular_event'">
                                <ItemRegularEvent :item="item"/>
                            </div>
                        </div>
                        <div v-if="this.last_page >= this.next_page" class="pa-4 text-center">
                            <v-btn :disabled="fetching_data" outlined large color="primary" rounded @click="loadMore()">{{fetching_data ?'Loading...':'load more'}}</v-btn>
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

                </div>
            </div>
        </v-container>
        <Bottomnavbar/>
    </v-container>
</template>
<script>
// import Topnavbar from '@/components/layout/TopnavbarBackCustom'
// import Bottomnavbar from '@/components/layout/NavbarBottomClient'
import { mapGetters, mapActions } from 'vuex';
import { base_url } from '@/core/services/config'
import { mdiAccount, mdiChevronRight } from '@mdi/js'
import { ApiService } from '@/core/services/api.service'
export default {
    name:'RequestListPage',
    data() {
        return {
            title:'',
            base_url,
            active_tab:0,
            iconNavigate: mdiChevronRight,
            icon_account: mdiAccount,
            tabs:[
                {"name":"Pending","value":'pending'},
                {"name":"Response","value":'hired',"count":0},
                {"name":"Archived","value":'archived'},
            ],

            message: false,
            hints: true,
            request_list:[],

            next_page:1,
            last_page:0,
            fetching_data: false,
            status:'pending',
            loading:false,
        }
    },
    components: {
        Bottomnavbar:() => import('@/components/layout/NavbarBottomClient'),
        Topnavbar:() => import('@/components/layout/TopnavbarBackCustom'),
        ItemCatering:() => import('@/views/client/truck_request/ItemCatering.vue'),
        ItemEvent:() => import('@/views/client/truck_request/ItemEvent.vue'),
        ItemRegularEvent:() => import('@/views/client/truck_request/ItemRegularEvent.vue'),
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
    },
    mounted() {
        this.fetchRequestList();
    },
    watch:{
        active_tab(val){
            this.status = this.tabs[val].value;
            this.next_page = 1;
            this.request_list = [];
            this.fetchRequestList();
        },
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
        fetchRequestList(){
            this.loading = true;
            ApiService.post("/event_request_list?page="+this.next_page+'&status='+this.status)
            .then((resp) =>{
                this.loading = false;
                this.tabs[1].count = resp.responsed;
                resp.data.data.forEach(element => {
                    this.request_list.push(element);
                });
 
                this.last_page  = resp.data.last_page;
				if(this.next_page <= this.last_page){
					this.next_page += 1
				}
  
                if(!this.request_list.length) {
                    this.message="No items";
                }
                this.loaderHide();
                this.fetching_data = false;
            })
            .catch((error) =>{
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
.mb50{
    margin-bottom: 50px;
}
.name-wrapper{
    align-items: unset;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.setting-list{
    ul{
        list-style: none;
        // margin-top:25px;
        padding:0;
        li{
            // background: #fff;
            // color:#fff;
            padding: 20px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0;
            &:not(:last-child) {
                border-bottom:1px solid #d2d5d4
            }
            span{
                font-size: 0.9rem;
                font-weight: 400;
            }
        }
    }
}
</style>