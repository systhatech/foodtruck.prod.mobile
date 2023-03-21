<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mg56">
            <div>
                <div>
                    <v-tabs v-model="active_tab">
                        <v-tab v-for="(t,i) in tabs" :key="i">{{ t.name }}</v-tab>
                    </v-tabs>
                </div>
                <div class="mt-4">
                    <div v-if="active_tab==0">
                        <div class="pa-4 custom-bs mt-4">
                            <p class="mb-1">Austin TX</p>
                            <p class="mb-1">No of attendies 100</p>
                            <p class="">Minimum Guerantee sale</p>
                            <v-btn rounded large color="primary" to="/vendor-truck-request/1">contact</v-btn>
                        </div>
                        <div class="pa-4 custom-bs mt-4">
                            <p class="mb-1">Austin TX</p>
                            <p class="mb-1">No of attendies 100</p>
                            <p class="">Minimum Guerantee sale</p>
                            <v-btn rounded large color="primary" to="/vendor-truck-request/2">contact</v-btn>
                        </div>
                    </div>
                    <div v-else-if="active_tab==1">
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perferendis, earum!</p>
                        <p>Lorem.</p>
                    </div>
                    <div v-if="active_tab==2">
                        <div class="custom-bs pa-4 mb-4">
                            <p class="mb-1">Available Credits</p>
                            <p class="green--text mb-0">60 Credits</p>
                        </div>
                        <div class="custom-bs pa-4 mb-4">
                            <p class="mb-1">Credit Credits</p>
                            <p class="green--text">60 Credits</p>
                            <v-btn rounded large color="primary">buy credit</v-btn>
                        </div>
                        <div>
                            <p>Transaction Log</p>
                            <div class="custom-bs pa-4">
                                <div class="">
                                    <p>300 Credits</p>
                                    <p class="mb-0">Transaction ID</p>
                                    <p>2342342342342342323423</p>
                                    <div class="d-flex align-center justify-space-between">
                                        <p>VISA 111******</p>
                                        <p>Jan 12, 2023</p>
                                    </div>
                                    <v-divider class="mb-4"></v-divider>
                                    <p>300 Credits</p>
                                    <p class="mb-0">Transaction ID</p>
                                    <p>2342342342342342323423</p>
                                    <div class="d-flex align-center justify-space-between">
                                        <p>VISA 111******</p>
                                        <p>Jan 12, 2023</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
            base_url,
            active_tab:0,
            iconNavigate: mdiChevronRight,
            icon_account: mdiAccount,
            indexValue:3,
            usericon:'',
            tabs:[
                {"name":"Lead","value":'lead'},
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
            items: [
                // {name:'Support',icon:'mdi-headphones',route:'support'},
                {name:'Truck Profile',icon:'mdi-truck-check',route:'vendor-profile-truck'},
                {name:'User Profile',icon:'mdi-account',route:'vendor-profile-update'},
                {name:'Address',icon:'mdi-map-marker',route:'vendor-profile-address'},
                {name:'Gallery',icon:'mdi-camera-image',route:'profile-files'},
                {name:'Schedules',icon:'mdi-map-marker',route:'vendor-profile-schedule'},
                {name:'Menus',icon:'mdi-food-variant',route:'vendor-profile-menu'},
                {name:'Leads',icon:'mdi-food-variant',route:'vendor-truck-request-list'},
                // {name:'Spot Booking',icon:'mdi-clipboard-edit-outline',route:'bookings'},
                {name:'Subscription',icon:'mdi-credit-card',route:'subscriptions'},
                {name:'Payment Credientials',icon:'mdi-shield-key',route:'payments'},
                {name:'Daily Settlement',icon:'mdi-cash-multiple',route:'payouts'},
                {name:'Reports',icon:'mdi-file-document-multiple',route:'reports'},
                {name:'Sales Summary',icon:'mdi-file-document-multiple',route:'sales-summary'},
                {name:'Change Password',icon:'mdi-key',route:'change-password'},
                {name:'Terms & Conditions',icon:'mdi-notebook-check',route:'terms-condition'},
                {name:'About Us',icon:'mdi-clipboard-list',route:'about-us'},
                // {name:'Social Media Account',icon:'mdi-facebook',route:'vendor-social-media-account'},
                // {name:'Logout',icon:'mdi-logout',route:'logout'},
             ],
            utype:'',
            general:{},
            others:{},
            contact:{},
            message:'Loading...',
            render:false,
        }
    },
    components: {
        Topnavbar,
        Bottomnavbar
    },
    mounted() {
        console.log("test");
        this.fetchSetting();
    },
    methods: {
        ...mapActions({
            signOutAction: 'auth/signOut',
            fetchCarts: 'truck/fetchCarts',
        }),
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
                console.log("here");
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