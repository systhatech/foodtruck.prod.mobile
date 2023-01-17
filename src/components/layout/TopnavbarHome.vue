<template>
        <v-toolbar fixed flat color="primary" style="position: sticky;top: 0;z-index: 1;">
           <v-img
            lazy-src="https://picsum.photos/id/11/10/6"
            max-width="100"
            :src="logo"
            ></v-img>
            <v-spacer></v-spacer>
            <div>
                <v-icon color="white" class="mr-2 fs-32">mdi-facebook</v-icon>
                <v-icon color="white" class="fs-32">mdi-instagram</v-icon>
            </div>
        </v-toolbar>
</template>
<script>
import { mapGetters } from 'vuex'
import { mdiAccountCircle, mdiLogout } from '@mdi/js'
// import {ApiService} from '@/core/services/api.service'
// import JwtService from '@/core/services/jwt.service'
// import {PURGE_AUTH} from '@/core/services/store/auth.module'
import logo from '@/assets/static/logo1.jpg'
export default {
    data() {
        return {
            title:'Dashboard',
            iconAccount: mdiAccountCircle,
            iconLogout: mdiLogout,
            logo,
            // logo: "https://www.mintformations.co.uk/blog/wp-content/uploads/2020/05/shutterstock_583717939.jpg",
        }
    },
    methods: {
        viewProfile() {
            this.$router.push('/profile');
        },
        handleLogout(){
            this.$router.push('/login');
            // ApiService.defaults.headers.common['Authorization'] = `Bearer ${JwtService.getToken()}`;
            // this.$bus.$emit('SHOW_PAGE_LOADER');
            // ApiService.post("logout",{
            //     access_token: JwtService.getToken(),
            // })
            // .then(() => {
            //     this.$store.commit(PURGE_AUTH);
            //     this.$router.push('/login');
            //     this.$bus.$emit('HIDE_PAGE_LOADER');
            // })
            // .catch(() => {
            //     this.$bus.$emit('HIDE_PAGE_LOADER');
            //     this.$store.commit(PURGE_AUTH);
            //     this.messageError('error',"Failed to logout");
            // });
        }
    },
    computed: {
          ...mapGetters({
            currentUser:'auth/user',
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