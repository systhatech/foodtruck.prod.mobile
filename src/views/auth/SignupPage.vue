<template>
    <v-container class="ma-0 pa-0 h-100 background-image">
        <v-container>
            <div>
                <div class="mt-10">
                    <v-btn tile text @click="handleBack"><v-icon class="mr-0 pr-0">{{iconBack}}</v-icon></v-btn>
                </div>
                <v-row>
                    <v-col cols="12">
                        <div class="text-center mb-2">
                            <img :src="logo" width="90"/>
                        </div>
                        <!-- <p class="f9-bold text-center">Select your role in {{ name }}</p> -->
                    </v-col>
                </v-row>
            </div>
            <div>
                <div v-for="(item,index) in items" :key="index">
                    <div class="types" @click="handleType(item,index)" :class="index==activeItem?'activeItem':''">
                        <img :src="cream" height="60" v-if="item.name=='customer'"/>
                        <img :src="driver" height="60" v-else/>
                        <p class="ma-0 text-capitalize">{{ item.name }}</p>
                    </div>
                </div>
                <div>
                    <v-btn color="primary" block  :disabled="!destination" @click="handleRoute" rounded>Proceed</v-btn>
                </div>
            </div>       
        </v-container>
    </v-container>
</template>
<script>
// import { SET_AUTH } from "@/core/services/store/auth.module";
// import { GET_LOGO } from "@/core/services/store/default_company.module";
// import { mapGetters } from 'vuex'
import { ApiService } from '@/core/services/api.service'
import JwtService from '@/core/services/jwt.service'
import { base_url } from '@/core/services/config'
// import Bottomnavbar from '@/components/layout/Bottomnavbar'
import logo from './logo.png'
import cream from './ice-cream.png'
import driver from './truck-driver.png'
import background from './login_banner.png'
import bug from './bug.png'
import { mdiTwitter, mdiFacebook,mdiChevronLeft} from '@mdi/js'
// import axios from "axios"
export default {
    data: () => ({
        iconFb: mdiFacebook,
        iconTw: mdiTwitter,
        iconBack:mdiChevronLeft,
        background,
        base_url,
        logo,
        name:'',
        driver,
        cream,
        bug,
        showServiceProvider:false,
        login_info: {
            email: "",
            password: "",
            client:1,
        },
        serviceProvider:false,
        indexValue:3,
        loading: false,
        nameErrors: "",
        emailErrors: "",
        checkboxErrors: "",
        show_password: false,
        valid: true,
        activateAccount: false,
        accountActivated: false,
        rulesEmail: [
             v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
        items: [
            {id:1, name:'customer',route:'dashboard',image:'cream','type':'c'},
            {id:2, name:'Truck Driver',route:'signup-truck',image:'driver', 'type': 't'},
        ],
        lazy: false,
        activeItem:'',
        destination:'dashboard',
        stype: 'c',
    }),
    components: {
        // Bottomnavbar,
    },
    watch: {
        serviceProvider(newval) {
            newval ? this.login_info.client = 0 : this.login_info.client = 1;
            if(newval) {
                localStorage.removeItem('destination');
            }
        }
    },
    mounted() {
        this.fetchLogo();
        if(JwtService.getToken()){
            setTimeout(() => {
                this.$router.push({name:'dashboardPage'});
            },1000);
        }
    },

    methods: {
        handleBack() {
            this.$router.back();
        },
        handleType(item,index) {
            this.destination = item.route;
            this.activeItem = index;
            this.stype = item.type;
        },
        handleServiceProvider() {
            this.showServiceProvider = true;
            this.serviceProvider = true;
        },
        async fetchLogo() {
            this.$bus.$emit('SHOW_PAGE_LOADER')
            await ApiService.get("default-company/logo")
            .then((resp) => {
                this.logo = this.base_url+"/image-show/"+resp.logo;
                this.name = resp.name;
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError('Sorry, Something goes wrong');
            });
        },
        handleRoute(){
            localStorage.setItem('s_type',this.stype);
            if(this.stype =='c'){
                this.$router.push({name:'dashboardPage'})
            }else{
                this.$router.push({name:'loginPage'});
            }
        }

     
    },
};
</script>
<style lang="scss" scoped>
.types{
    width: 150px;
    height: 150px;
    border-radius: 50%;
    text-align: center;
    margin: 0 auto;
    margin-bottom: 40px;
    padding: 30px;
    border:2px solid #a10000;
    P{
        font-weight: 600;
        font-size:0.9rem;
    }
}
.activeItem{
    background: #fff;
    p{
        color:#a10000;
    }
}
</style>
