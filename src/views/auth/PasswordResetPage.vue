<template>
    <v-container class="ma-0 pa-0 h-100 background-image">
        <v-container>
            <div class="mt-10">
                <v-btn icon text color="primary" :to="{
                    name: 'loginPage'
                }"><v-icon class="mr-0 pr-0">{{ icon_back }}</v-icon></v-btn>
            </div>
            <div>
                <v-row>
                    <v-col cols="12">
                        <div class="text-center">
                            <img :src="logo" width="90"/>
                        </div>
                    </v-col>
                </v-row>
            </div>
            <div class="pa-4 ma-4 custom-bs">
                <v-form v-model="valid" ref="resetPassword">
                    <v-row>
                        <!-- <v-col cols="12" class="pt-0">
                            <p>Enter your email</p>
                        </v-col> -->
                        <v-col cols="12" class="pt-0">
                            <v-text-field label="Your Email" :rules="emailRules" v-model="email"></v-text-field>
                        </v-col>
                        <v-col cols="12" >
                            <v-btn
                                rounded
                                color="primary"
                                block
                                @click="submit">
                                Submit
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </div>
            <div class="text-center pa-6 ma-4">
                <!-- <p class="f8-bold" style="color:#4a4a4a;text-transform: uppercase;">Dont have an account ?</p> -->
                <v-btn link to="/Login"  rounded color="primary" outlined><v-icon>{{ iconBack }}</v-icon>Login</v-btn>
            </div>
           
        </v-container>
   
    </v-container>
</template>
<script>
// import { SET_AUTH } from "@/core/services/store/auth.module";
// import { GET_LOGO } from "@/core/services/store/default_company.module";
// import { mapGetters } from 'vuex'
import { ApiService } from '@/core/services/api.service'
// import JwtService from '@/core/services/jwt.service'
// import Bottomnavbar from '@/components/layout/Bottomnavbar'
import logo from './logo.png'
import bg from '@/assets/static/bg.png'
import background from './login_banner.png'
import bug from './bug.png'
import { mdiTwitter, mdiFacebook, mdiArrowLeft, mdiChevronLeft} from '@mdi/js'
// import axios from "axios"
export default {
    data: () => ({
        bg,
        icon_back: mdiChevronLeft,
        iconFb: mdiFacebook,
        iconTw: mdiTwitter,
        iconBack: mdiArrowLeft,
        background,
        logo,
        valid:true,
        bug,
        showServiceProvider:false,
        email:'',
        serviceProvider:false,
        indexValue:3,
        loading: false,
        nameErrors: "",
        emailErrors: "",
        checkboxErrors: "",
        show_password: false,
        activateAccount: false,
        accountActivated: false,
        emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        rulesRequired: [
            v => !!v || 'Required',
        ],
        items: [
            {id:1, name:'',route:'',icon:'mdi-home', showText:false},
            {id:2, name:'',route:'about',icon:'mdi-information'},
            {id:3, name:'',route:'contact', icon:'mdi-notebook-check'},
            {id:4, name:'',route:'login', icon:'mdi-login'},
        ],
        lazy: false,
        name:'Buglogic',
        location:{
            lat:0,
            lng:0,
            add1:'',
            city:'',
            state:'',
            zip_code:'',
            country:'',
        }
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
        this.locateGeoLocation();
        // this.updateLocation();
    },

    methods: {
        locateGeoLocation: function() {

            navigator.geolocation.getCurrentPosition(res => {
                this.location.lat = res.coords.latitude;
                this.location.lng = res.coords.longitude;
            });

        },

        handleServiceProvider() {
            this.showServiceProvider = true;
            this.serviceProvider = true;
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

        async submit() {
            if(!this.$refs.resetPassword.validate()) return;
            this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.post('/password/reset', { email : this.email})
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageSuccess(resp.message);
                this.$router.push("/login");
            })
            .catch((error) => {
                 this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError(error.response.data.message);
            })
        },
    },
};
</script>
<style lang="scss" scoped>
// .background-image{
//     background-image:
//     linear-gradient(to bottom, #ff716673, #edededb0),
//     url('../../assets/static/bg.png');
//     -webkit-background-size: cover;
//     -moz-background-size: cover;
//     -o-background-size: cover;
//     background-size: cover;
// }
.login-container{
    // background: #acfa95;
    border-radius: 10px;
    margin-top: 27px !important;
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
