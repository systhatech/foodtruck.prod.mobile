<template>
    <v-container class="ma-0 pa-0 background-image h-100">
        <v-container>
            <div class="mt-10">
                <div class="mt-4">
                    <v-btn icon text color="primary" 
                        :to="{
                            name:'loginPage'
                        }">
                        <v-icon class="mr-0 pr-0">{{iconBack}}</v-icon>
                    </v-btn>
                </div>
            </div>
            <div>
                <v-row>
                    <v-col cols="12">
                        <div class="text-center mb-2">
                            <img :src="base_url+'/default-company/logo'" width="190" />
                        </div>
                    </v-col>
                </v-row>
            </div>
            <div class="custom-bs pa-4 mt-4">
                <v-form ref="formSignupTruck">
                    <v-row>
                        <v-col cols="6" md="6" class="pb-2 pt-2">
                            <v-text-field class="text-center" :rules="rulesRequired" v-model="truck_info.name" label="Truck Name"></v-text-field>
                        </v-col>
                        <v-col cols="6" class="pb-2 pt-2">
                            <v-text-field class="text-center" :rules="rulesRequired" v-model="truck_info.vechicle_no" label="Truck Plate No."></v-text-field>
                        </v-col>
                        <!-- <v-col cols="6" class="pb-2 pt-2">
                            <v-text-field class="text-center" :rules="rulesRequired" v-model="truck_info.model_no" label="Truck Model"></v-text-field>
                        </v-col> -->
                        <!-- <v-col cols="6" class="pb-2 pt-2">
                            <InputAutocomplete @selected="selectedAnswers" label="Truck Type" :items="truck_types"/>
                        </v-col> -->
                        <v-col cols="6" class="pb-2 pt-2">
                            <v-text-field class="text-center" :rules="rulesRequired" v-model="truck_info.fname" label="First Name"></v-text-field>
                        </v-col>
                        <v-col cols="6" class="pb-2 pt-2">
                            <v-text-field class="text-center" :rules="rulesRequired" v-model="truck_info.lname" label="Last Name"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-2 pt-2">
                            <v-text-field class="text-center" :rules="emailRules" v-model="truck_info.email" @blur="onCheckEmail()" label="Email"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pb-2 pt-2">
                            <v-text-field class="text-center" :rules="rulesRequired" v-model="truck_info.phone_no" label="Phone No." v-mask="'(###) ###-####'"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pb-2 pt-2">
                            <v-text-field class="text-center" :rules="rulesRequired" type="password" v-model="truck_info.password" label="Password"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pb-6">
                            <div class="text-center">
                                <v-btn color="primary" block large rounded @click="handleSubmit()">Submit</v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-form>
               
                <DialogError :dialogError="modal_error" :message="message_error" @close="handleClose"/>
            </div>
        </v-container>
        <!-- <Bottomnavbar/> -->
    </v-container>
</template>
<script>
import { mapActions } from 'vuex'
import { ApiService } from '@/core/services/api.service'
import JwtService from '@/core/services/jwt.service'
// import InputAutocomplete from '@/components/layout/InputAutocompleteSingleTextValue'
import { base_url } from '@/core/services/config'

import { mdiHome,mdiChevronLeft } from '@mdi/js'

export default {
    data: () => ({
      
        base_url,
        modal_error:false,
        iconBack: mdiChevronLeft,
        iconHome: mdiHome,

        show_password: false,
        valid: true,
        emailRules: [
            (v) => !!v || "E-mail is required",
            (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
        ],
        rulesRequired: [(v) => !!v || "Required"],

        truck_info:{
            name:'',
            vechicle_no:'',
            model_no:'default',
            truck_type_id:'',
            fname:'',
            lname:'',
            phone_no:'',
            email:'',
            password:'',
        },
        message_error:'Error',
        truck_types:[],
        location:{
            lat:0,
            lng:0,
            add1:'',
            city:'',
            state:'',
            zip_code:'',
            country:'',
        },
    }),
    components: {
        // InputAutocomplete,
        DialogError :()=> import('@/components/layout/DialogError.vue')
    },
    mounted() {
        // this.fetchLogo();
        this.fetchVendorTypes();
        // this.locateGeoLocation();

    },

    methods: {
        ...mapActions({
			registerVendor:'auth/signUpVendor'
		}),
        onCheckEmail(){
            if(!this.truck_info.email) return;

            this.loaderShow();
            ApiService.post("/check/email",{ 'email': this.truck_info.email})
            .then(()=>{
                this.loaderHide();
                // console.log(resp);
            })
            .catch((error)=>{
                this.loaderHide();
                this.message_error = error.response.data.message;
                this.modal_error = true;
            })
        },
        handleClose(){
            this.truck_info.email = "";
            this.modal_error = false;
        },
        locateGeoLocation: function() {
            navigator.geolocation.getCurrentPosition(res => {
                this.location.lat = res.coords.latitude,
                this.location.lng = res.coords.longitude
            });
        },
        fetchVendorTypes() {
            ApiService.get('vendor/lookup/types')
            .then((resp) => {
                this.truck_types = resp.data;
            })
            .catch((error) => {
                console.log(error);
            })
        },
       
        selectedAnswers(data) {
            this.truck_info.truck_type_id = data.selected_data;
        },
        async handleSubmit(){
            if(!this.$refs.formSignupTruck.validate()) return;
            this.loaderShow();
            await ApiService.post('/register/vendor', this.truck_info)
            .then(() => {
                this.loaderHide();
                this.$router.push({ name:'VerifyEmailPage', query:{ email: this.truck_info.email, type:'vendors'}});
            })
            .catch((error) => {
                this.loaderHide();
                console.log({error});
            })
        },
      
     
        async fetchLogo() {
            this.loaderShow();
            await ApiService.get("default-company/logo")
            .then((resp) => {
                this.logo = this.base_url+"/image-show/"+resp.logo;
                this.name = resp.name;
                this.loaderHide();
            })
            .catch(() => {
                this.loaderHide();
                this.messageError('Sorry, Something goes wrong');
            });
        },

        async submitted() {
            this.loaderShow();
            await ApiService.post('/register/vendor', this.truck_info)
            .then((resp) => {
                // this.messageSuccess("Registered successfully")
                JwtService.saveToken(resp.token);
                JwtService.saveUtype(resp.user.table);
                this.fetchAddress();
            })
            .catch((error) => {
                this.loaderHide();
                if(error.response.data){
                    this.messageError(error.response.data.message);
                }else{
                    this.messageError(error.response.statusText);
                }
            })
        },

         async fetchAddress() {
           this.loaderShow();
            ApiService.get('/getapikeys')
            .then( async (apiKeys) =>  {
                let googleApiKey = apiKeys.google;
                 await ApiService.post(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.location.lat},${this.location.lng}&key=${googleApiKey}`)
                .then((resp) => {
                    this.loaderHide();
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
                    this.updateLocation();
                })
            })
        },
        async updateLocation() {
             await ApiService.post('/location/save-current', this.location)
            .then(() => {
                this.loaderHide();
                this.$router.replace({
                    name: 'home',
                })
            })
            .catch((error) => {
                console.log(error);
                this.loaderHide();
                this.$router.replace({
                    name: 'home',
                })
            })
        }
        
    },
};
</script>
<style lang="scss" scoped>
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
