<template>
    <v-container class="ma-0 pa-0 abc bg-primary">
        <v-container class="pb-0">
            <div>
                <v-row>
                    <v-col cols="12">
                        <div>
                            <img :src="logo" width="120"/>
                        </div>
                    </v-col>
                </v-row>
                <div>
                  <div class="text-center">
                      <img :src="background" class="background-image"/>
                  </div>
                </div>
            </div>
        </v-container>
        <v-container class="ma-0 pa-0" style="height:100%;position:relative;">
            <div class="text-center">
                <img :src="bug" height="310"/>
            </div>
            <v-card class="custom-bs1 border-radius-20 pa-6" style="opacity: 0.8;height: 100%;position: absolute;width: 100%;top: 0;">
                <div class="wrapper border-radius-10" v-for="(item,index) in dashboardItems" :key="index" @click="handleRoute(item)">
                    <div class="item-container">
                        <div class="icon-wrapper">
                            <v-icon class="mb-2">{{ item.icon }}</v-icon>
                            <p class="pa-0 ma-0 text-heading text-uppercase">{{ item.name }}</p>
                        </div>
                    </div>
                </div>
            </v-card>
        </v-container>
        <Bottomnavbar :items="items" :value="indexValue"/>
    </v-container>
</template>
<script>
// import { SET_AUTH } from "@/core/services/store/auth.module";
// import { GET_LOGO } from "@/core/services/store/default_company.module";
// import { mapGetters } from 'vuex'
import { ApiService } from '@/core/services/api.service'
import JwtService from '@/core/services/jwt.service'
import Bottomnavbar from '@/components/layout/Bottomnavbar'
import logo from '@/assets/static/logo.png'
import background from '@/assets/static/home_banner.png'
import bug from '@/assets/static/bug.png'
// import axios from "axios"
export default {
    data: () => ({
        background,
        logo,
        bug,
        login_info: {
            email: "",
            password: "",
            pos_id: 12345,
        },
        indexValue:0,
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
            {id:1, name:'',route:'',icon:'mdi-home', showText:false},
            // {id:2, name:'',route:'dashboard-customer',icon:'mdi-view-dashboard'},
            {id:2, name:'',route:'about',icon:'mdi-information'},
            {id:3, name:'',route:'contact', icon:'mdi-notebook-check'},
            {id:4, name:'',route:'login', icon:'mdi-login'},
        ],
        lazy: false,
        // logo:'https://www.mintformations.co.uk/blog/wp-content/uploads/2020/05/shutterstock_583717939.jpg',
        name:'Buglogic',
        dashboardItems:[
            {id:1, name:'Pest Control',route:'login', destination:'pest-control',icon:'mdi-spider'},
            {id:2, name:'Inspection',route:'login', destination:'inspection', icon:'mdi-clipboard-text-multiple'},
            {id:2, name:'Services',route:'services', destination:'dashboard', icon:'mdi-clipboard-text-multiple'},
        ]
    }),
    components: {
        Bottomnavbar,
    },
    mounted() {
        // this.fetchLogo();
        // var navigator_info = window.navigator;
        // var screen_info = window.screen;
        // var uid = navigator_info.mimeTypes.length;
        // uid += navigator_info.userAgent.replace(/\D+/g, '');
        // uid += navigator_info.plugins.length;
        // uid += screen_info.height || '';
        // uid += screen_info.width || '';
        // uid += screen_info.pixelDepth || '';
        // console.log(uid);
    },

    methods: {
      handleRoute(route) {
            if(route.destination) {
                localStorage.setItem('destination',route.destination);
            }
            this.$router.push("/" + route.route).catch(()=>{});
        },
    async fetchLogo() {
            this.$bus.$emit('SHOW_PAGE_LOADER')
            await ApiService.get("default-company/logo")
            .then((resp) => {
                this.logo = resp.logo;
                this.name = resp.name;
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError('Sorry, Something goes wrong');
            });
        },
        async submitAdmin() {
            JwtService.saveToken('admin');
            this.$router.push('/dashboard');
        },
        async submitTechnical() {
            JwtService.saveToken('technical');
            this.$router.push('/dashboard');
        },
        async submit() {
            await JwtService.saveToken('customer');
            // this.$bus.$emit('SHOW_PAGE_LOADER')
            // ApiService.post("staff/login", this.login_info)
            // .then((resp) => {
            //     let user = resp.user;
            //     resp.token ? user.token = resp.token :'';
            //     resp.pos_id ?JwtService.savePosId(resp.pos_id) :'';
            //     resp.pos_location_id ?JwtService.savePosLocationId(resp.pos_location_id) :'';
            //     resp.pos_reader_id ?JwtService.savePosReaderId(resp.pos_reader_id) :'';
            //     this.$store.commit(SET_AUTH, user);
            //     this.$router.push('/');
            //     this.$bus.$emit('HIDE_PAGE_LOADER')
            // })
            // .catch((error) => {
            //     this.$bus.$emit('HIDE_PAGE_LOADER');
            //     this.messageError(error.response.data.message);
            // });
            // this.$router.push("/dashboard");
            if(localStorage.getItem('destination')){
                localStorage.setItem('login',true);
                this.$router.push('/'+localStorage.getItem('destination'));
            }else{
                localStorage.setItem('login',true);
                this.$router.push('/dashboard-customer');
            }
        },
        reset() {
            this.$refs.formLogin.reset();
        },
        resetValidation() {
            this.$refs.formLogin.resetValidation();
        },
        encryptPassword(event) {
            this.login_info.password = window.btoa(event.target.value);
        }
    },
    computed: {
        // ...mapGetters(['logo'])
    }
};
</script>
<style lang="scss" scoped>
.background-image{
    max-width:100%;
    min-height:200px;
}
.wrapper{
  text-align: center;
  display: flex;
  justify-content: space-around;
}
.item-container {
      border-radius: 10px;
      background: #9bce17;
      width: 220px;
      margin-bottom: 20px;
      text-align: center;
      color: #fff;
    .icon-wrapper {
      padding: 10px;
      border-radius: 9px;
      i {
        color: #fff;
      }
    }
}
.follow-us{
    color:#fff;
    font-weight: 300;
    font-size: 0.9rem;
    // text-align: right;
    i{
        -webkit-transform: scaleX(-1);
        transform: scaleX(-1);
        color:#fff;
        margin-right: 4px;
        font-size:0.8rem;
    }

}
.social-links{
    // text-align:right;
    i{
        color:#fff;
        &:not(:last-child){
            margin-right: 12px;
        }
    }
}
.abc {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}
.footer-copyright{
    padding: 40px;
    bottom: 0;
    p{
        text-align: center;
        color: #4caf50;
        margin: 0;
        font-size: 0.9rem;
        bottom: 0;
        padding: 30px;
        font-weight: 500;
    }
}
</style>
