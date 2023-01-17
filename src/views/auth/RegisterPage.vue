<template>
    <v-container class="ma-0 pa-0 abc bg-primary">
        <v-container>
            <div>
                <v-row>
                    <v-col cols="7">
                        <div>
                            <img :src="logo" width="120"/>
                        </div>
                    </v-col>
                </v-row>
            </div>
        </v-container>
        <v-container class="ma-0 pa-0" style="height:100%;position:relative;">
            <div class="text-center">
                <img :src="bug" height="310"/>
            </div>
            <v-card class="custom-bs1 pa-6" style="border-radius: 0px;border-top-left-radius: 20px;border-top-right-radius: 20px;opacity: 0.8;height: 100%;position: absolute;width: 100%;top: 0;">
                <v-form ref="formCheckoutCash" v-model="valid">
                    <v-row>
                        <v-col
                        class="mb-0 mt-0 pb-0 pt-0"
                        cols="6"
                        sm="6"
                        >
                        <v-text-field
                            v-model="customer.fname"
                            :rules="ruleRequired"
                            label="First name"
                            required
                        ></v-text-field>
                        </v-col>

                        <v-col
                        class="mb-0 mt-0 pb-0 pt-0"
                        cols="6"
                        sm="6"
                        >
                        <v-text-field
                            v-model="customer.lname"
                            :rules="ruleRequired"
                            label="Last name"
                            required
                        ></v-text-field>
                        </v-col>
                        <v-col
                        class="mb-0 mt-0 pb-0 pt-0"
                        cols="12"
                        md="6"
                        >
                        <v-text-field
                            v-model="customer.email"
                            :rules="rulesEmail"
                            label="E-mail"
                            :error-messages="errorEmail"
                            required
                        ></v-text-field>
                        </v-col>
                        <v-col
                        class="mb-0 mt-0 pb-0 pt-0"
                        cols="12"
                        md="12"
                        >
                        <v-text-field
                            v-model="customer.phone_no"
                            v-mask="'(###) ###-####'"
                            label="Phone"
                            :rules="ruleRequired"
                            required
                        ></v-text-field>
                        </v-col>
                    </v-row>
                    
                    <v-row>
                            <v-col
                            class="mb-0 mt-0 pb-0 pt-0"
                        cols="12"
                        md="6"
                        >
                            <v-text-field
                                v-model="customer.password"
                                :rules="ruleRequired"
                                label="Password"
                                type="password"
                                required
                                autocomplete="false"
                            ></v-text-field>
                        </v-col>

                        <v-col
                        class="mb-0 mt-0 pb-0 pt-0"
                        cols="12"
                        md="6"
                        >
                        <v-text-field
                                v-model="customer.password_confirmation"
                                :rules="ruleRequired"
                                label="Re-Password"
                                type="password"
                                :error-messages="errorPassword"
                                autocomplete="false"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" class="text-center">
                            <v-btn rounded color="primary" block @click="handleSubmit">Submit</v-btn>
                            <div class="reset-wrapper mt-4 text-center">
                                <span class="text-md">Already have an account ?</span><router-link to="/login" class="mb-4"> Sign In</router-link>
                            </div>
                        </v-col>
                    </v-row>
                </v-form>      
            </v-card>
        </v-container>
        <!-- <Bottomnavbar :items="items" :value="indexValue"/> -->
    </v-container>
</template>
<script>
// import { SET_AUTH } from "@/core/services/store/auth.module";
// import { GET_LOGO } from "@/core/services/store/default_company.module";
// import { mapGetters } from 'vuex'
import { ApiService } from '@/core/services/api.service'
import JwtService from '@/core/services/jwt.service'
// import Bottomnavbar from '@/components/layout/Bottomnavbar'
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
        lazy: false,
        name:'Buglogic',
        errorEmail:'',
        errorPassword:''
    }),
    components: {
        // Bottomnavbar,
    },

    methods: {
        async handleSubmit() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/register', this.customer)
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageSuccess(resp.message);
                this.$router.replace({name:'home'});
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(error.response.data);
                if(error.response.data.errors.email){
                    this.errorEmail = "Email already exists";
                }
                if(error.response.data.errors.password){
                    this.errorPassword = "Password does not match";
                }
                this.valid = !this.valid;
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
