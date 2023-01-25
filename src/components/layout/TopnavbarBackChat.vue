<template>
        <v-toolbar color="primary" style="position: sticky; color:#fff; top: 0;px;z-index: 2;">
           <!-- <v-btn color="white" class="pl-0"  tile text> -->
            <v-icon color="white" @click="handleBack">mdi-chevron-left</v-icon> 
            <!-- </v-btn>  -->
            <v-toolbar-title class="text-capitalize" style="font-size: 0.9rem;font-weight: 500; margin-left:10px; color:#fff;">{{ receiver.name }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                    text
                    v-bind="attrs"
                    v-on="on"
                    small
                    class="pr-0"
                    >
                    <v-icon color="white">mdi-dots-vertical</v-icon>
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
import { mapGetters } from 'vuex'
import { mdiAccountCircle, mdiLogout } from '@mdi/js'
import {ApiService} from '@/core/services/api.service'
// import JwtService from '@/core/services/jwt.service'
import {PURGE_AUTH} from '@/core/services/store/auth.module'
import {socketHandler} from '@/core/services/socketio/socket';
export default {
    props:{
        receiver:{
            required:true,
        }
    },
    data() {
        return {
            iconAccount: mdiAccountCircle,
            iconLogout: mdiLogout,
            items: [
                {id:1, icon:'mdi-account', title: 'Profile', action:'profile' },
                {id:2, icon:'mdi-logout', title: 'Logout', action:'logout' },
            ],
        }
    },
    methods: {
        viewProfile() {
            this.$router.push('/profile').catch(() => {});
        },
        handleBack() {
            this.$emit('back');
        },
        handleAction(action) {
            switch(action) {
                case 'logout':
                    this.handleLogouts();
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
                this.$store.commit(PURGE_AUTH);
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.$router.push({name: 'loginPage'});
            })
            .catch(() => {
                this.$store.commit(PURGE_AUTH);
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.$router.push({name: 'loginPage'});
            })
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