<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar/>
        <v-container class="mg56">
            <div v-if="currentUser">
                <!-- <div class="custom-bs pa-4 pt-8">
                    <div class="text-center">
                        <v-avatar color="primary" size="90"  v-if="currentUser.profile_pic=='null' || currentUser.profile_pic==null">
                            <v-icon dark>
                                {{ iconAccount}}
                            </v-icon>
                        </v-avatar>
                        <v-avatar size="90" v-else>
                            <img
                            style="object-fit:cover"
                            :src="base_url+'/avatar/'+currentUser.owner.profile_pic"
                            alt="Profile Pic">
                        </v-avatar>
                        <div class="pt-2 mb-4 primary--text">
                            {{ currentUser.owner }}
                            <h4>{{currentUser.owner.fullName}}</h4>
                        </div>
                    </div>

                    <div class="mt-1 ml-3 primary--text">
                        <div class="d-flex align-center justify-space-between">
                            <h4 class="mb-1">Contact</h4>
                            <v-btn text small color="warning" to="/profile-update">
                                edit
                            </v-btn>
                        </div>
                        <div class="d-flex">
                            <div style="width:30px">
                                <v-icon color="primary f9">mdi-phone</v-icon>
                            </div>
                            <div>
                                <h5 class="mb-2">{{currentUser.phone_no? currentUser.phone_no:'n/a'}} </h5>
                            </div>
                        </div>
                        <div class="d-flex">
                            <div style="width:30px">
                                <v-icon color="primary f9">mdi-email</v-icon>
                            </div>
                            <div>
                                <h5 class="mb-2">{{currentUser.email ? currentUser.email:'n/a'}}</h5>
                            </div>
                        </div>
                        <div class="mt-4">
                            <div class="d-flex align-center justify-space-between">
                                <h4 class="mb-1">Address</h4>
                                <v-btn text small color="warning" :to="'/address/'+currentUser.address.id">
                                    edit
                                </v-btn>
                            </div>
                            <div class="d-flex">
                                <div style="width:30px">
                                    <v-icon color="primary f9">mdi-map-marker</v-icon>
                                </div>
                                <div>
                                    <h5 class="primary--text">
                                        {{currentUser.address && currentUser.address.add1 && currentUser.address.add1 !='undefined'? currentUser.address.add1:''}} {{currentUser.address && currentUser.address.add2 && currentUser.address.add2!='undefined'? currentUser.address.add2:''}} <br>
                                        {{currentUser.address && currentUser.address.city && currentUser.address.city !='undefined' ? currentUser.address.city:''}} {{currentUser.address && currentUser.address.state && currentUser.address.state!='undefined'? currentUser.address.state:''}} <br>
                                        {{currentUser.address && currentUser.address.zip && currentUser.address.zip !='undefined' ? currentUser.address.zip:''}} {{currentUser.address && currentUser.address.country && currentUser.address.country!='undefined'? currentUser.address.country:''}} <br>
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> -->
                <div class="d-flex aling-center custom-bs pa-4">
                    <div>
                        
                    </div>
                    <v-avatar size="60">
                        <img
                        :src="currentUser.profile_pic? base_url+'/image-show/'+currentUser.profile_pic:base_url+'/image-show/default.jpg'"
                        alt="Profile Pic">
                    </v-avatar>
                    <div class="mt-1 ml-3" v-if="currentUser.table=='vendors'">
                        <h3 class="text-capitalize">{{ currentUser.owner.name }}</h3>
                        <p class="f8-bold">{{ currentUser.fname}} {{currentUser.lname}}</p>
                    </div>
                    {{currentUser.owner.truck_type}}
                    <div class="mt-1 ml-3" v-if="currentUser.table=='clients'">
                        <h3>{{ currentUser.fname }}</h3>
                        <p class="f8-bold"> {{currentUser.email}}</p>
                    </div>
                </div>
                <div class="setting-list custom-bs  pa-4 mt-4" v-if="currentUser.table =='clients'">
                    <ul>
                        <li v-for="(menu, index) in menusClient" class="" :key="index" @click="navigatePage(menu.route)">
                            <div>
                                <v-icon class="mr-3" color="primary">{{menu.icon}}</v-icon>
                                <span class="f8-bold">{{ menu.name }}</span>
                            </div>
                            <v-icon color="primary">{{ iconNavigate }}</v-icon>
                        </li>
                    </ul>
                </div>
                <div class="setting-list custom-bs  pa-4 mt-4" v-if="currentUser.table =='vendors'">
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
        <Bottomnavbar :value="indexValue"/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/Topnavbar'
import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
import { mapGetters, mapActions } from 'vuex';
import { base_url } from '@/core/services/config'
import {PURGE_AUTH} from '@/core/services/store/auth.module'
import  {ApiService} from '@/core/services/api.service';
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
            menusClient: [
                {name:'Support',icon:'mdi-headphones',route:'support'},
                {name:'Update Profile',icon:'mdi-account-reactivate',route:'profile-update'},
                {name:'Address',icon:'mdi-map-marker',route:'profile-address'},
                {name:'Setting',icon:'mdi-cog',route:'change-password'},
                {name:'Terms & Conditions',icon:'mdi-shield-key',route:'terms-condition'},
                {name:'About Us',icon:'mdi-clipboard-list',route:'about-us'},
                {name:'Logout',icon:'mdi-logout',route:'logout'},
             ],
            menusVendor: [
                {name:'Support',icon:'mdi-headphones',route:'support'},
                {name:'Truck Profile',icon:'mdi-truck-check',route:'profile-truck'},
                {name:'User Profile',icon:'mdi-account',route:'profile-update'},
                {name:'Address',icon:'mdi-map-marker',route:'profile-address'},
                {name:'Pictures',icon:'mdi-camera-image',route:'profile-files'},
                {name:'Schedules',icon:'mdi-map-marker',route:'profile-schedule'},
                {name:'Menus',icon:'mdi-food-variant',route:'profile-menu'},
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
    mounted() {
    //    this.utype = JwtService.getUtype();
        // this.profileData();
        // if(this.currentUser){
            
        // }
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
                this.signOutAction().then(() => {
                this.loaderHide();
                socketHandler.disconnect();
                this.$router.replace({
                    name:'home',
                })
            });
        },
        async handleLogout() {
             this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/logout')
            .then(() => {
                socketHandler.disconnect();
                this.$store.commit(PURGE_AUTH);
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.$router.replace({
                    name:'home',
                })
                // this.messageSuccess(resp.message);
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.$store.commit(PURGE_AUTH);
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.$router.push('/');

                // this.messageError(error.response);
            })
        },
        async profileData() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/self/profile').then((resp) => {
                this.general = resp.general;
                this.others = resp.others;
                this.contact= resp.contact;
                this.render = true;
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch(() => {
                this.message = "Failed to fetch data";
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
        },
        handleBack() {
            this.$router.back();
        },
        navigatePage(route) {
            if(route == 'logout') {
                this.signOutAction();
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