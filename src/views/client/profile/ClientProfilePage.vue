<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar/>
        <v-container class="mg56">
            <div v-if="currentUser">
                <div class="custom-bs pa-4 pt-8">
                    <div class="text-center">
                        <v-avatar size="90" tile v-if="currentUser.profile_pic=='null' || currentUser.profile_pic==null">
                            <img
                            rounded
                            :src="currentUser.profile_pic? base_url+'/avatar/'+currentUser.profile_pic:base_url+'/avatar/default.jpg'"
                            alt="Profile Pic">
                        </v-avatar>
                        <v-avatar size="90" v-else tile>
                            <img
                            style="object-fit:cover"
                            :src="currentUser.profile_pic? base_url+'/avatar/'+currentUser.profile_pic:base_url+'/avatar/default.jpg'"
                            alt="Profile Pic">
                        </v-avatar>
                        <div class="pt-2 mb-4">
                            <h4 class="text-capitalize primary--text">{{currentUser.fname}} {{ currentUser.lname}}</h4>
                        </div>
                    </div>
                    <div class="mt-1 ml-3">
                        <div class="d-flex align-center justify-space-between">
                            <h5 class="mb-1 text-uppercase primary--text">Contact</h5>
                        </div>
                        <div class="d-flex">
                            <div style="width:30px">
                                <v-icon color="primary f9">mdi-phone</v-icon>
                            </div>
                            <div>
                                <p class="mb-2">{{currentUser.phone_no? formatPhoneNumber(currentUser.phone_no):'n/a'}} </p>
                            </div>
                        </div>
                        <div class="d-flex">
                            <div style="width:30px">
                                <v-icon color="primary f9">mdi-email</v-icon>
                            </div>
                            <div>
                                <p class="mb-2">{{currentUser.email ? currentUser.email:'n/a'}}</p>
                            </div>
                        </div>
                        <div class="mt-4">
                            <div class="d-flex align-center justify-space-between">
                                <h5 class="mb-1 text-uppercase primary--text">Address</h5>
                            </div>
                            <div class="d-flex">
                                <div style="width:30px">
                                    <v-icon color="primary f9">mdi-map-marker</v-icon>
                                </div>
                                <div>
                                    <p v-if="currentUser.owner.address">
                                        {{currentUser.owner.address && currentUser.owner.address.add1 && currentUser.owner.address.add1 !='undefined'? currentUser.owner.address.add1:''}} {{currentUser.owner.address && currentUser.owner.address.add2 && currentUser.owner.address.add2!='undefined'? currentUser.owner.address.add2:''}} <br>
                                        {{currentUser.owner.address && currentUser.owner.address.city && currentUser.owner.address.city !='undefined' ? currentUser.owner.address.city:''}} {{currentUser.owner.address && currentUser.owner.address.state && currentUser.owner.address.state!='undefined'? currentUser.owner.address.state:''}} <br>
                                        {{currentUser.owner.address && currentUser.owner.address.zip && currentUser.owner.address.zip !='undefined' ? currentUser.owner.address.zip:''}} {{currentUser.owner.address && currentUser.owner.address.country && currentUser.owner.address.country!='undefined'? currentUser.owner.address.country:''}} <br>
                                    </p>
                                    <p v-else>n/a</p>
                                </div>
                            </div>
                        </div>
                        <div class="text-center" v-if="getProfile && getProfile.general && getProfile.general.delete_account">
                            <v-btn small text color="error" @click="handleDeleteAccount()">delete account</v-btn>
                        </div>
                    </div>
                </div>
                <div class="setting-list custom-bs  pa-4 mt-4">
                    <ul>
                        <li v-for="(menu, index) in menusClient" class="" :key="index" @click="navigatePage(menu.route)">
                            <div class="d-flex align-center">
                                <v-icon class="mr-3" color="primary">{{menu.icon}}</v-icon>
                                <p class="text-capitalize mb-0">{{ menu.name }}</p>
                            </div>
                            <v-icon color="primary">{{ iconNavigate }}</v-icon>
                        </li>
                    </ul>
                </div>
             
            </div>
            <div v-else class="unavailable">
                <p>{{message}}</p>
            </div>
            <DialogConfirm :dialogConfirm="modal_confirm" @close="handleclose()" @handleConfirm="handleConfirm()"/>
        </v-container>
        <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/Topnavbar'
import Bottomnavbar from '@/components/layout/NavbarBottomClient'
import { mapGetters, mapActions } from 'vuex';
import { base_url } from '@/core/services/config'
import {PURGE_AUTH} from '@/core/services/store/auth.module'
import  {ApiService} from '@/core/services/api.service';
import { mdiAccount, mdiChevronRight } from '@mdi/js'
import {socketHandler} from '@/core/services/socketio/socket';
export default {
    name:'ProfilePage',
    data() {
        return {
            title:'',
            base_url,
            iconNavigate: mdiChevronRight,
            icon_account: mdiAccount,
            indexValue:3,
            usericon:'',
            menusClient: [
                {name:'Update Profile',icon:'mdi-account-reactivate',route:'client-profile-update'},
                {name:'Address',icon:'mdi-map-marker',route:'client-profile-address'},
                {name:'Change Password',icon:'mdi-cog',route:'change-password'},
                {name:'Truck Request',icon:'mdi-truck',route:'client-truck-request-list'},
                {name:'Logout',icon:'mdi-logout',route:'logout'},
             ],
        
            utype:'',
            general:{},
            others:{},
            contact:{},
            message:'Loading...',
            render:false,
            modal_confirm:false,
        
        }
    },
    mounted() {
        // console.log(this.getProfile);
        // if(this.getProfile){
        //     if(this.getProfile.general.delete_account){
        //         console.log(this.getProfile.delete_account);
        //     }

        // }
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        DialogConfirm: ()=> import('@/components/layout/DialogConfirm'),
    },
    methods: {
        ...mapActions({
            signOutAction: 'auth/signOut',
            fetchCarts: 'truck/fetchCarts',
            fetchProfile: 'auth/fetchProfile',
        }),
        handleDeleteAccount(){
            this.modal_confirm = true;
        },
        handleConfirm(){
            console.log("test");
            this.loaderShow();
            ApiService.post("/profile/delete")
            .then((resp) =>{
                this.loaderHide();
                this.messageSuccess(resp.message);
                this.fetchProfile();
                setTimeout(() => {
                    this.$router.push({
                        name:'loginPage',
                    })
                }, 500);
            })
            .catch((error) =>{
                this.loaderHide();
                console.log(error);
            })
        },
        handleclose(){
            this.modal_confirm = false;
        },
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
                this.signOut();
            }else{
                this.$router.push('/'+route).catch(()=>{});
            }
        }
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
            getProfile:'auth/profile'
        }),
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