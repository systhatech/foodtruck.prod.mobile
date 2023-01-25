<template>
        <v-toolbar 
            color="primary" 
            style="position: sticky;top: 0;px;z-index: 4;">
                <v-avatar size="32" @click="viewProfile" v-if="currentUser && currentUser.profile_pic">
                <img
                :src="currentUser.profile_pic? base_url+'/image-show/'+currentUser.profile_pic:base_url+'/image-show/default.jpg'"
                alt="Profile Pic">
                </v-avatar>
                <v-avatar v-else size="32">
                    <v-icon dark>
                    {{iconAccount}}
                    </v-icon>
                </v-avatar>
            <v-toolbar-title style="font-size: 0.9rem;font-weight: 500;color:#fff; margin-left:10px;">Hi, <span class="text-capitalize">{{ currentUser? currentUser.fname :'welcome' }}</span></v-toolbar-title>
            <v-spacer></v-spacer>
             <div @click="handleRouteCart" v-if="currentUser && cartItems && cartItems.length && (currentUser.table == 'clients')">
                    <v-icon color="white">{{ iconCart }}</v-icon>
                    <span style="color:#fff;">{{ cartItems.length }}</span>
            </div>
            <!-- <v-menu offset-y v-if="currentUser">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                    text
                    color="white"
                    v-bind="attrs"
                    v-on="on"
                    icon
                    >
                    <v-icon>{{iconDot}}</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                    v-for="(item, index) in items"
                    :key="index"
                    @click="handleAction(item.action)"
                    >
                    <v-list-item-title><v-icon>{{ item.icon }}</v-icon> &nbsp; {{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu> -->
        </v-toolbar>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { mdiAccountCircle, mdiLogout,mdiCart, mdiDotsVertical } from '@mdi/js'
import {ApiService} from '@/core/services/api.service'
import {base_url} from '@/core/services/config'
// import JwtService from '@/core/services/jwt.service'
// import {PURGE_AUTH} from '@/core/services/store/auth.module';
import {socketHandler} from '@/core/services/socketio/socket';

export default {
    props:{
        src:{},
    },
    data() {
        return {
            title:'Dashboard',
            base_url,
            iconAccount: mdiAccountCircle,
            iconLogout: mdiLogout,
            iconDot: mdiDotsVertical,
            iconCart: mdiCart,
            usericon:'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png',
            items: [
                {id:1, icon:'mdi-account', title: 'Profile', action:'profile' },
                {id:2, icon:'mdi-logout', title: 'Logout', action:'logout' },
            ],
            general:{},
            isLoggedin:0,
            count:0,
            utype:'clients',
        }
    },
    mounted() {
        // this.utype = localStorage.getItem('utype') ?localStorage.getItem('utype'):'clients';
       
        // this.$bus.$on('loginStatus', (status) => {
        //     if(status.status) {
        //         this.isLoggedin = 1;
        //     }else{
        //          this.isLoggedin = 0;
        //     }
        //     this.isLoggedin = status.status;
        //     this.profileData();
        // });
        //     this.profileData();
        // if(JwtService.getToken()){
        //     this.isLoggedin = 1;
        //     this.fetchCount();
        // }else{
        //     this.isLoggedin = 0;
        // }
    },
    // created() {
        // if(JwtService.getToken()){
        //     this.isLoggedin = 1;
        //     this.fetchCount();
        // }else{
        //     this.isLoggedin = 0;
        // }
    // },
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
                    name:'loginPage',
                })
            });
        },
        fetchCount() {
            ApiService.post('cart-list/fetch',{email: this.currentUser.email})
            .then((resp) => {
                this.count = resp.data.length;
            })
            .catch((error) => {
                console.log(error);
            })
        },
        handleRouteCart() {
            this.$router.push({name:'CartsPage'});
        },
        viewProfile() {
            // if(this.$router.currentRoute.name !=='profilepage'){
            //     this.$router.push({ name: 'profilepage'});
            // }
            console.log(this.$router.currentRoute);
        },
        async profileData() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/self/profile').then((resp) => {
                this.general = resp.general;
                this.isLoggedin = 1;
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch(() => {
                this.isLoggedin = 0;
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
        },
        handleAction(action) {
            switch(action) {
                case 'logout':
                    this.signOut();
                    break;
                case 'profile':
                    this.viewProfile();
                    break;
            }
        },
        // async handleLogouts(){
        //     // this.isLoggedin = !this.isLoggedin;
        //       this.$bus.$emit('loginStatus',{status: this.isLoggedin});
        //         this.$bus.$emit('SHOW_PAGE_LOADER');
        //         await ApiService.post('/logout')
        //         .then(() => {
        //             socketHandler.disconnect();
        //             this.$store.commit(PURGE_AUTH);
        //             this.$bus.$emit('HIDE_PAGE_LOADER');
        //             this.isLoggedin = 0;
        //             if(this.$router.currentRoute.name == 'homePage'){
        //                 // location.reload();
        //                 this.$bus.$emit('loginStatus',{status: this.isLoggedin});
        //             }else{
        //                 this.$router.push({name: 'homePage'});
        //             }
        //             this.$bus.$emit('loginStatus',{status: this.isLoggedin});
        //         })
        //         .catch(() => {
        //             socketHandler.disconnect();
        //             this.$bus.$emit('HIDE_PAGE_LOADER');
        //             this.$store.commit(PURGE_AUTH);
        //             this.$bus.$emit('HIDE_PAGE_LOADER');
        //             this.isLoggedin = 0;
        //             if(this.$router.currentRoute.name == 'homePage'){
        //                 // console.log('test');
        //             }else{
        //                 this.$router.push({name: 'homePage'});
        //             }
        //             this.$bus.$emit('loginStatus',{status: this.isLoggedin});
        //         })
        // }
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
            cartItems: 'truck/cartItems',
            authenticated:'auth/authenticated',
        })
    }

}
</script>
<style lang="scss" scoped>
$colorprimary : #19477e !important;
$colorsecondary : #75ab26;
.section-top-navbar{
    background:$colorprimary;
    padding: 6px 24px;
    height: 52px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .page-title{
        margin: 0;
        font-weight: 500;
    }
    i{
        color:#fff !important;
    }
}