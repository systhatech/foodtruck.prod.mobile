<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar/>
        <v-container class="mg56">
            <div v-if="currentUser">
                <div class="d-flex aling-center custom-bs pa-4">
                    <div>
                    </div>
                    <v-avatar size="60">
                        <img
                        :src="currentUser.profile_pic? base_url+'/image-show/'+currentUser.profile_pic:base_url+'/image-show/default.jpg'"
                        alt="Profile Pic">
                    </v-avatar>
                    <div class="mt-1 ml-3">
                        <h3 class="text-capitalize">{{ currentUser.owner.name }}</h3>
                        <p class="f8-bold">{{ currentUser.fname}} {{currentUser.lname}}</p>
                    </div>
                    {{currentUser.owner.truck_type}}
                  
                </div>
             
                <div class="setting-list custom-bs  pa-4 mt-4">
                    <ul>
                        <li v-for="(menu, index) in menusVendor" class="" :key="index" @click="navigatePage(menu.route)">
                            <div>
                                <v-icon class="mr-3" color="primary">{{menu.icon}}</v-icon>
                                <span class="f8-bold">{{ menu.name }}</span>
                            </div>
                            <v-icon color="primary">{{ iconNavigate }}</v-icon>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-else class="unavailable">
                <p>{{message}}</p>
            </div>
        </v-container>
        <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/Topnavbar'
import Bottomnavbar from '@/components/layout/NavbarBottomVendor'
import { mapGetters, mapActions } from 'vuex';
import { base_url } from '@/core/services/config'
import { mdiChevronRight } from '@mdi/js'
import {socketHandler} from '@/core/services/socketio/socket';
export default {
    name:'ProfilePage',
    data() {
        return {
            title:'',
            base_url,
            iconNavigate: mdiChevronRight,
            indexValue:3,
            usericon:'',
            menusVendor: [
                {name:'Support',icon:'mdi-headphones',route:'support'},
                {name:'Truck Profile',icon:'mdi-truck-check',route:'profile-truck'},
                {name:'User Profile',icon:'mdi-account',route:'vendor-profile-update'},
                {name:'Address',icon:'mdi-map-marker',route:'vendor-profile-address'},
                {name:'Pictures',icon:'mdi-camera-image',route:'profile-files'},
                {name:'Schedules',icon:'mdi-map-marker',route:'profile-schedule'},
                {name:'Menus',icon:'mdi-food-variant',route:'vendor-profile-menu'},
                {name:'Spot Booking',icon:'mdi-clipboard-edit-outline',route:'bookings'},
                {name:'Subscription',icon:'mdi-credit-card',route:'subscriptions'},
                {name:'Payment Credientials',icon:'mdi-shield-key',route:'payments'},
                {name:'Daily Settlement',icon:'mdi-cash-multiple',route:'payouts'},
                {name:'Reports',icon:'mdi-file-document-multiple',route:'reports'},
                {name:'Change Password',icon:'mdi-key',route:'change-password'},
                // {name:'Setting',icon:'mdi-cog',route:'change-password'},
                {name:'Terms & Conditions',icon:'mdi-notebook-check',route:'terms-condition'},
                {name:'About Us',icon:'mdi-clipboard-list',route:'about-us'},
                // {name:'Other',icon:'mdi-segment',route:'profile-update'},
                {name:'Logout',icon:'mdi-logout',route:'logout'},
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
    methods: {
        ...mapActions({
            signOutAction: 'auth/signOut',
            fetchCarts: 'truck/fetchCarts',
        }),
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