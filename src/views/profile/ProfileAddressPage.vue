<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container class="mg56">
            <div class="form-container custom-bs">
                <v-form v-model="valid" ref="formAddress">
                    <v-row>
                        <v-col
                        cols="12"
                        md="12"
                        >
                            <GoogleAddress 
                                :defaultValue="defaultValue" 
                                @selectedAddr="addressSelected"/>
                        </v-col>

                        <v-col
                        cols="12"
                        >
                        <v-text-field
                            v-model="address.add2"
                            label="House / Apartment No."
                        ></v-text-field>
                        </v-col>

                        <v-col
                        cols="12"
                        >
                        <v-text-field
                            v-model="address.state"
                            :rules="requiredRules"
                            label="State"
                            required
                        ></v-text-field>
                        </v-col>

                        <v-col
                        cols="6"
                        >
                        <v-text-field
                            v-model="address.city"
                            :rules="requiredRules"
                            label="City"
                            required
                        ></v-text-field>
                        </v-col>
                        <v-col
                        cols="6"
                        sm="6"
                        >
                        <v-text-field
                            v-model="address.zip"
                            :rules="requiredRules"
                            v-mask="'#########'"
                            label="ZIP"
                            required
                        ></v-text-field>
                        </v-col>
                    
                        <v-col cols="12" class="text-center">
                            <v-btn block color="primary" rounded @click="handleUpdate">update</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </div>
        </v-container>
        <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
// import InputAddress from '@/components/form-element/InputAddress'
import { ApiService } from '@/core/services/api.service'
import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
import GoogleAddress from '@/components/form-element/InputGoogleAddress'
// import  JwtService from '@/core/services/jwt.service';
export default {
    name:'ProfileAddressPage',
    data() {
        return {
            indexValue:0,
            title:'',
            valid:true,
            address: {
                add1:'',
                add2:'',
                city:'',
                state:'',
                zip:'',
                country:'',
                country_code:'',
                lat:'',
                lng:'',
            },
            requiredRules: [
                v => !!v || 'Required',
            ],
            defaultValue:'',
            addressId:'',
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
            utype:'',
            
        }
    },
    mounted() {
       this.fetchAddress();
    },
    methods: {
        addressSelected(addr) {
            // this.address = address.address;
            // this.address.zip = address.address.zip_code;
            this.address.add1 = addr.add1;
            this.address.city = addr.city;
            this.address.state = addr.state;
            this.address.lat = addr.lat;
            this.address.lng = addr.lng;
            this.address.zip = addr.zip_code;
            this.address.country = addr.country;
            this.address.country_code = addr.country_code;
            setTimeout(() => {
                this.defaultValue = addr.add1;
            },200);
        },
        fetchAddress(){
            this.loaderShow();
            ApiService.post('/self/profile')
            .then((resp) => {
                this.loaderHide();
                this.address.add1 = resp.address.add1;
                this.address.add2 = resp.address.add2;
                this.address.city = resp.address.city;
                this.address.state = resp.address.state;
                this.address.zip = resp.address.zip;
                this.address.is_default = resp.address.is_default;
                this.defaultValue = resp.address.add1;
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        },
        handleBack() {
            this.$router.back();
        },
        async loadAddress() {
            // await ApiService.get('/csrf-cookie');
            // await ApiService.get()
        },
        async handleUpdate(){

            this.loaderShow();
            this.address.add1 = this.address.locality ? this.address.locality : this.address.add1;
            await ApiService.post('/self/profile/address',this.address)
            .then(() => {
                this.loaderHide();
                this.messageSuccess("Success");
                this.$router.push('/profile');
            })  
            .catch(() => {
                this.loaderHide();
                this.messageError('Failed to update address');
            })
        },
        async updateAddress() {
            this.loaderShow();
            this.address.add1 = this.address.locality;
            await ApiService.post('/update-address',this.address)
            // await ApiService.post('/update-address',this.address)
            .then(( resp ) => {
                this.loaderHide();
                this.messageSuccess(resp.message);
            })  
            .catch(() => {
                this.loaderHide();
                this.messageError('Failed to update address');
            })
        }
    },
    components: {
        Topnavbar,
        // InputAddress,
        Bottomnavbar,
        GoogleAddress
    }
}
</script>
<style lang="scss" scoped>
.form-container{
    // background: #fff;
    // border-radius:10px;
    padding: 20px;
}
</style>