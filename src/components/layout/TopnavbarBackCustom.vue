<template>
       <v-toolbar 
            color="primary" 
            style="position: sticky;top: 0;px;z-index: 4;">
           <v-btn color="white" class="pl-0" @click="handleBack" tile text>
            <v-icon color="white">mdi-chevron-left</v-icon>Back 
            </v-btn> 
            <v-toolbar-title style="font-size: 0.9rem;font-weight: 500; margin-left:10px; color:#fff;">{{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <div @click="handleRouteCart" v-if="currentUser && cartItems && cartItems.length && (currentUser.table == 'clients')" class="pt-3 pr-4">
                <v-badge
                    small
                    color="error"
                    :content="Object.keys(cartItems).length"
                    >
                    <v-icon color="white">{{ iconCart }}</v-icon>
                </v-badge>
            </div>
            </v-toolbar>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { mdiAccountCircle, mdiLogout,mdiCart, mdiDotsVertical } from '@mdi/js'
import {ApiService} from '@/core/services/api.service'
import {socketHandler} from '@/core/services/socketio/socket';
export default {
    props:{
        title:{
            type:String,
            required:true,
        }
    },
    data() {
        return {
            isLoggedin:0,
            iconAccount: mdiAccountCircle,
            iconLogout: mdiLogout,
            iconDot: mdiDotsVertical,
            iconCart: mdiCart,
            items: [
                {id:1, icon:'mdi-account', title: 'Profile', action:'profile' },
                {id:2, icon:'mdi-logout', title: 'Logout', action:'logout' },
            ],
            count:0,
            utype:'clients'
        }
    },
    methods: {
        ...mapActions({
            signOutAction: 'auth/signOut',
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
                // console.log("count",this.count);
            })
            .catch((error) => {
                console.log(error);
            })
        },
        handleRouteCart() {
            if(this.$router.currentRoute.name == 'CartsPage') return;
            this.$router.push({name:'CartsPage'});
        },
        
        viewProfile() {
            this.$router.push('/profile').catch(() => {});
        },
        handleBack() {
            this.$emit('back');
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
        async handleLogouts(){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/logout')
            .then(() => {
                socketHandler.disconnect();
                this.$router.push({name: 'homePage'});
                 this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch(() => {
                this.$router.push({name: 'home'});
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
        }
    },
    computed: {
        ...mapGetters({
            currentUser: 'auth/user',
            carts: 'truck/fetchCarts',
            fetchCarts: 'truck/fetchCarts',
            cartItems: 'truck/cartItems',
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
</style>