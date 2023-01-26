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
                        <v-col
                        cols="6"
                        sm="6"
                        >
                        <v-text-field
                            v-model="address.country"
                            :rules="requiredRules"
                            label="Country"
                            required
                        ></v-text-field>
                        </v-col>
                        <v-col
                        cols="6"
                        sm="6"
                        >
                        <v-text-field
                            v-model="address.country_code"
                            label="Country Code"
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
import Bottomnavbar from '@/components/layout/NavbarBottomVendor'
import GoogleAddress from '@/components/form-element/InputGoogleAddress'
import { mapGetters, mapActions } from 'vuex'
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
                lon:'',
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
        if(this.currentUser && this.currentUser.owner && this.currentUser.owner.address){
            this.address.id = this.currentUser.owner.address.id;
            this.address.add1 = this.currentUser.owner.address.add1;
            this.address.add2 = this.currentUser.owner.address.add2 ? this.currentUser.owner.address.add2 :'';
            this.address.city = this.currentUser.owner.address.city;
            this.address.state = this.currentUser.owner.address.state;
            this.address.zip = this.currentUser.owner.address.zip;
            this.address.country = this.currentUser.owner.address.country;
            this.address.country_code = this.currentUser.owner.address.country_code;
            this.defaultValue = this.currentUser.owner.address.add1;
        }
    },
    computed:{
        ...mapGetters({
            currentUser:'auth/user'
        })
    },  
    methods: {
        ...mapActions({
            fetchProfile:'auth/fetchProfile'
        }),
        addressSelected(addr) {
            this.address.add1 = addr.add1;
            this.address.city = addr.city;
            this.address.state = addr.state;
            this.address.lat = addr.lat;
            this.address.lon = addr.lng;
            this.address.zip = addr.zip_code;
            this.address.country = addr.country;
            this.address.country_code = addr.country_code;
            setTimeout(() => {
                this.defaultValue = addr.add1;
            },200);
        },
        handleBack() {
            this.$router.back();
        },
        async handleUpdate(){
            this.loaderShow();
            this.address.add1 = this.address.locality ? this.address.locality : this.address.add1;
            await ApiService.post('/self/profile/address',this.address)
            .then(() => {
                this.loaderHide();
                this.messageSuccess("Success");
                this.fetchProfile();
            })  
            .catch(() => {
                this.loaderHide();
                this.messageError('Failed to update address');
            })
        },
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