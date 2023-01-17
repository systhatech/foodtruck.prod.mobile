<template>
    <v-app>
        <v-container class="ma-0 pa-0 h-100 background-image ">
            <div class="main-container">
                <div>
                    <v-row>
                        <v-col cols="12">
                            <div class="text-center mb-2">
                                <img :src="logo" width="90"/>
                            </div>
                        </v-col>
                    </v-row>
                </div>
                <div class="message custom-bs">
                    <p>No internet connection or Server is down</p>
                </div>
            </div>
        </v-container>
    </v-app>
</template>
<script>
// import { SET_AUTH } from "@/core/services/store/auth.module";
// import { GET_LOGO } from "@/core/services/store/default_company.module";
// import { mapGetters } from 'vuex'
import { ApiService } from '@/core/services/api.service'
import JwtService from '@/core/services/jwt.service'
import { base_url } from '@/core/services/config'
// import Bottomnavbar from '@/components/layout/Bottomnavbar'
import logo from './views/auth/logo.png'
import { mdiTwitter, mdiFacebook,mdiChevronLeft} from '@mdi/js'
// import VueCordova from 'vue-cordova'
// import axios from "axios"
export default {
    data: () => ({

        iconFb: mdiFacebook,
        iconTw: mdiTwitter,
        iconBack: mdiChevronLeft,
        logo,
        base_url,
        valid:true,
        showServiceProvider:false,
        login_info: {
            email: "",
            password: "",
            lat:0,
            lng:0
        },
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
        location:{
            lat:0,
            lng:0,
            add1:'',
            city:'',
            state:'',
            zip_code:'',
            country:'',
        },
        destination:'signup-customer',
        // VueCordova
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
        // if(JwtService.getToken()){
        //     this.$router.push({name:'dashboardPage'});
        // }
        this.fetchLogo();
        this.locateGeoLocation();
        this.destination = localStorage.getItem('destination') ? localStorage.getItem('destination'):'signup-customer';
    },

    methods: {
        notify () {
            // console.log("Test");
            window.notification("test notification");
            // this.$notification.show('Hello World', {
            //     body: 'This is an example!'
            // }, {})
        },
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
                this.logo = this.base_url+"/image-show/"+resp.logo;
                this.name = resp.name;
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError('Sorry, Something goes wrong');
            });
        },

        async submit() {
            if(!this.$refs.formLogin.validate()) return;
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/login', this.login_info)
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                JwtService.saveToken(resp.token);
                JwtService.saveUtype(resp.user.table);
                this.fetchAddress();
                this.$router.push({name:'dashboardPage'});
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                if(error.response && error.response.data){
                    this.messageError(error.response.data.message);
                }else if(error.response.statusText){
                    this.messageError(error.response.statusText);
                }else{
                    this.messageError('Contact to support');
                }
            })
        },
        async fetchAddress() {
            this.$bus.$emit('SHOW_PAGE_LOADER');  
            ApiService.get('/getapikeys')
            .then( async (apiKeys) =>  {
                let googleApiKey = apiKeys.google;
                 await ApiService.post(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.location.lat},${this.location.lng}&key=${googleApiKey}`)
                .then((resp) => {
                    this.$bus.$emit('HIDE_PAGE_LOADER');
                    for(let addr of resp.results) {
                        let address = this.parseGoogleResponse(addr.address_components);
                        this.location.add1 = address.street_number+" "+address.route;
                        this.location.city = address.locality;
                        this.location.state = address.administrative_area_level_1;
                        this.location.zip_code = address.postal_code;
                        this.location.country = address.country;
                        break;
                    }
                    this.updateLocation();
                   
                })
                .catch(() => {
                    this.$bus.$emit('HIDE_PAGE_LOADER');
                })
            })
        },
        async updateLocation() {
             this.$bus.$emit('SHOW_PAGE_LOADER');
             await ApiService.post('/location/save-current', this.location)
            .then(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch((error) => {
                console.log(error);
                this.$bus.$emit('HIDE_PAGE_LOADER');
              
            })
        }
    },
};
</script>
<style lang="scss" scoped>
.main-container {
    position: absolute;
    top: 30%;
    transform: translate(0, -50%);
    width: 100%;
    .message{
        margin:20px;
        padding:20px;
        p {
            padding: 0;
            margin: 0;
            text-align: center;
            color: #818181;
        }
    }
}
</style>
