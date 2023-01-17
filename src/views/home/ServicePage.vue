<template>
    <v-container class="ma-0 pa-0 bg-primary h-100">
        <TopnavbarBlank/>
        <v-container>
            <div class="mb-0 pb-0" >
            <h3 class="color-white">Services</h3>
            <div class="setting-list">
                    <ul>
                        <li v-for="(service, index) in services" :key="index" @click="navigatePage(service)">
                            <v-icon class="mr-3" color="secondary">mdi-clipboard-check</v-icon>
                            <span class="mb-4">{{ service.service_name }}</span>
                            <div>
                            <p class="f8">{{service.description ? service.description:'No description'}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </v-container>
        <!-- <v-container class="mt-14">
        </v-container> -->
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
import TopnavbarBlank from '@/components/layout/TopnavbarBlank'
import logo from './logo.png'
import background from './login_banner.png'
import bug from './bug.png'
// import axios from "axios"
// axios.defaults.withCredentials = true
// axios.defaults.baseURL = 'http://localhost:8000/'
// import User from '@/core/services/User'
// import { getCookie } from '@/core/services/cookie'
// import Csrf from '@/core/services/Csrf'
export default {
    data: () => ({
        background,
        logo,
        bug,
        customer: {
            fname:'',
            lname:'',
            phone_no:'',
            email:'',
            username:'',
            password:'',
            password_confirmation:''
        },
        indexValue:3,
        loading: false,
        nameErrors: "",
        emailErrors: "",
        checkboxErrors: "",
        show_password: false,
        valid: true,
        activateAccount: false,
        accountActivated: false,
        ruleRequired: [
            v => !!v || 'Required',
        ],
        rulesEmail: [
            v => !!v || 'E-mail is required',
            v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        items: [
            {id:1, name:'',route:'',icon:'mdi-home', showText:false},
            {id:2, name:'',route:'about',icon:'mdi-information'},
            {id:3, name:'',route:'contact', icon:'mdi-notebook-check'},
            {id:4, name:'',route:'login', icon:'mdi-login'},
        ],
         services: [
              // {name:'Interior General Pest Control'},
              // {name:'Exterior General Pest Control'},
              // {name:'Rodent Control'},
              // {name:'Bed Bug Service'},
            ],
        lazy: false,
        name:'Buglogic'
    }),
    components: {
        Bottomnavbar,
        TopnavbarBlank
    },
    mounted() {
      this.fetchSerivices();
    },
    methods: {
      async fetchSerivices() {
        this.$bus.$emit('SHOW_PAGE_LOADER');
        await ApiService.get('/services')
        .then((resp) => {
          this.$bus.$emit('HIDE_PAGE_LOADER');
          console.log(resp);
          this.services = resp.data;
        })
        .catch((error) => {
          this.$bus.$emit('HIDE_PAGE_LOADER');
          console.log(error);
        })
      },
      navigatePage() {
        console.log("test");
      },
        async handleSubmit() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.get('/csrf-cookie')
            await ApiService.post('/register', this.customer)
            .then((resp) => {
                 this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(resp);
                this.messageSuccess(resp.message);
                this.$router.push({name:'loginPage'});
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError(error.response.data.message);
            })
            // ApiService.get('/sanctum/csrf-cookie').then((resp) => {
            //     console.log(resp);
            //     ApiService.post('/api/register',this.customer,{
            //         headers: {
            //             'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
            //         }
            //     })
            //     .then((resp) => {
            //         console.log(resp);
            //     })
            //     .catch((error) => {
            //         console.log(error);
            //     })
            // });
            // Csrf.getCookie().then(()=> {
                // this.$bus.$emit('SHOW_PAGE_LOADER')
                // await ApiService.get('/sanctum/csrf-cookie');
                // await ApiService.post("register", this.customer)
                // .then((resp) => {
                //     console.log(resp);
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
                //     console.log(error);
                    // this.$bus.$emit('HIDE_PAGE_LOADER');
                    // this.messageError(error.response.data.message);
                // });
            // })
            // this.$router.push("/dashboard");
            // this.$router.push('/dashboard');
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
.setting-list{
    z-index:-1;
    margin-bottom:50px;
    ul{
        list-style: none;
        margin-top:25px;
        padding:0;
        li{
            background: #fff;
            margin-bottom: 12px;
            border-radius: 6px;
            padding: 16px;
            span{
                font-size: 0.9rem;
                font-weight: 500;
                color: #1a3d67;
            }
        }
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
