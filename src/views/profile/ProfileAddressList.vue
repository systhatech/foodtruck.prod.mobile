<template>
    <v-container class="ma-0 pa-0 h-100">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container>
            
            <div class="setting-list" v-if="currentUser && currentUser.addresses && currentUser.addresses.length">
                <ul>
                    <li class="custom-bs pa-5 mb-4 d-flex align-center justify-space-between" v-for="(addr, index) in currentUser.addresses" :key="index" 
                        @click="navigatePage(addr.id)">
                        <div class="">
                            <div>
                                <v-icon class="mr-3" color="secondary">{{ map }}</v-icon>
                                <span>{{ addr.add1 ? addr.add1 :'' }} {{ addr.city ?addr.city:'' }} {{ addr.state ? addr.state :''}} 
                                    {{ addr.zip ? addr.zip :'' }}</span>
                            </div>
                            <div class="pt-2">
                                <v-btn v-if="addr.is_default" small rounded outlined color="secondary">default</v-btn>
                                <!-- <v-btn v-else small rounded outlined color="primary">make default</v-btn> -->
                            </div>
                        </div>
                        <div>
                            <v-icon>{{navright}}</v-icon>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="mt-10">
                <v-btn rounded outlined color="primary" link to="address-add" block><v-icon>{{ plus }}</v-icon>Add Address</v-btn>
            </div>
           
        </v-container>
         <Bottomnavbar v-if="utype=='client'" :items="items" :value="indexValue"/>
         <Bottomnavbar v-if="utype=='service_provider'" :items="technicalDashboardItems" :value="indexValue"/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import Bottomnavbar from '@/components/layout/Bottomnavbar'
import { mdiChevronRight,mdiPlus, mdiMapMarker } from '@mdi/js'
import {  mapGetters } from 'vuex';
import  JwtService from '@/core/services/jwt.service';
export default {
    name:'InspectionPage',
    data() {
        return {
            navright: mdiChevronRight,
            map: mdiMapMarker,
            plus : mdiPlus,
            title:'',
            indexValue:3,
            usericon:'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png',
            menus: [
                {name:'Edit Personal Information',icon:'mdi-account-reactivate',route:'edit-profile'},
                {name:'Address',icon:'mdi-map-marker',route:'address-list'},
                {name:'Change Password',icon:'mdi-shield-key',route:'edit-password'},
                {name:'Card on File',icon:'mdi-clipboard-list',route:'edit-card-on-file'},
             ],
            technicalDashboardItems: [
                {id:2, name:'Dashboard',route:'dashboard',icon:'mdi-view-dashboard'},
                {id:3, name:'Calendar',route:'technical-calendar', icon:'mdi-calendar'},
                {id:4, name:'Profile',route:'profile', icon:'mdi-account'},
            ],
            items: [
                {id:1, name:'',route:'dashboard',icon:'mdi-view-dashboard'},
                {id:2, name:'',route:'inspection',icon:'mdi-clipboard-text-multiple'},
                {id:3, name:'',route:'pest-control', icon:'mdi-spider'},
                {id:4, name:'',route:'profile', icon:'mdi-account'},
            ],
            utype:''
        }
    },
    mounted() {
       this.utype = JwtService.getUtype();
    },
    components: {
        Topnavbar,
        Bottomnavbar
    },
    methods: {
        handleBack() {
            this.$router.back();
        },
        navigatePage(route) {
            this.$router.push('/address/'+route);
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
// .setting-list{
//     ul{
//         list-style: none;
//         margin-top:25px;
//         padding:0;
//         li{
//             background: #fff;
//             margin-bottom: 12px;
//             border-radius: 6px;
//             padding: 16px;
//             span{
//                 font-size: 0.9rem;
//                 font-weight: 500;
//                 color: #1a3d67;
//             }
//         }
//     }
// }
</style>