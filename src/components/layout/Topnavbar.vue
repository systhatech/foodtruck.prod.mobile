<template>
    <v-toolbar  color="primary" elevation="1" style="position: sticky;top: 0;px;z-index: 4;">
        <div class="pt-0" @click="handleRoute()">
            <!-- <img :src="base_url + '/isw?f=venndors&&fn=' + logo" height="36" /> -->
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
        </div>
        <v-toolbar-title style="font-size:16px; font-weight: 500;color:#fff; margin-left:10px;">Hi, 
            <span class="text-capitalize">{{ currentUser? currentUser.fname :'welcome' }}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div @click="handleRouteCart"
            v-if="currentUser && cartItems && cartItems.length && (currentUser.table == 'clients')" class="pt-3 pr-4">
            <v-badge small color="error" :content="Object.keys(cartItems).length">
                <v-icon color="white">{{ iconCart }}</v-icon>
            </v-badge>
        </div>
    </v-toolbar>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { mdiAccountCircle, mdiLogout, mdiCart, mdiChevronLeft } from '@mdi/js'
import { ApiService } from '@/core/services/api.service'
// import JwtService from '@/core/services/jwt.service'
import { PURGE_AUTH } from '@/core/services/store/auth.module'
import { socketHandler } from '@/core/services/socketio/socket';
import { base_url } from '@/core/services/config'
export default {
    props: {
        // title: {
        //     type: String,
        //     required: true,
        // }
    },
    data() {
        return {
            base_url,
            isLoggedin: 0,
            iconAccount: mdiAccountCircle,
            iconLogout: mdiLogout,
            iconCart: mdiCart,
            iconBack: mdiChevronLeft,
            items: [
                { id: 1, icon: 'mdi-account', title: 'Profile', action: 'profile' },
                { id: 2, icon: 'mdi-logout', title: 'Logout', action: 'logout' },
            ],
            count: 0,
            utype: 'clients',
        }
    },
    mounted() {
        this.dispatchCarts();
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
            cartItems: 'truck/cartItems',
            authenticated:'auth/authenticated',
        })
    },
    methods: {
        ...mapActions({
            signOutAction: 'auth/signOut',
            fetchCarts: 'truck/fetchCarts',
        }),
        dispatchCarts() {
            this.fetchCarts();
        },
        handleRoute() {
            if (this.$router.currentRoute.name !== 'homePage') {
                this.$router.push("/");
            }
        },
        handleRouteCart() {

            if (this.$router.currentRoute.name != 'CartsPage') {
                this.$router.push({ name: 'CartsPage' });
            }
        },
        viewProfile() {
            this.$router.push('/profile').catch(() => { });
        },
        handleBack() {
            this.$emit('back');
        },
        handleAction(action) {
            switch (action) {
                case 'logout':
                    this.handleLogouts();
                    break;
                case 'profile':
                    this.viewProfile();
                    break;
            }
        },
        async handleLogouts() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/logout')
                .then(() => {
                    socketHandler.disconnect();
                    this.isLoggedin = 0;
                    this.$store.commit(PURGE_AUTH);
                    if (this.$router.currentRoute.name == 'homePage') {
                        // location.reload();
                        this.$bus.$emit('loginStatus', { status: this.isLoggedin });
                    } else {
                        this.$router.push({ name: 'homePage' });
                    }
                    // this.$router.push({name: 'homePage'});
                    this.$bus.$emit('loginStatus', { status: this.isLoggedin });
                    this.$bus.$emit('HIDE_PAGE_LOADER');
                })
                .catch(() => {
                    this.$store.commit(PURGE_AUTH);
                    this.isLoggedin = 0;
                    if (this.$router.currentRoute.name == 'homePage') {
                        // location.reload();
                        this.$bus.$emit('loginStatus', { status: this.isLoggedin });
                    } else {
                        this.$router.push({ name: 'homePage' });
                    }
                    this.$bus.$emit('HIDE_PAGE_LOADER');
                    this.$bus.$emit('loginStatus', { status: this.isLoggedin });
                })
        }
    },

}
</script>
<style lang="scss" scoped>
$colorprimary : #19477e !important;
$colorsecondary : #75ab26;

.section-top-navbar {
    background: $colorprimary;
    padding: 6px 24px;
    height: 52px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .page-title {
        margin: 0;
        font-weight: 500;
    }

    i {
        color: #fff !important;
    }
}
</style>