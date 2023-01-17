<template>
    <v-container class="ma-0 pa-0 h-100">
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container>
            <div class="form-container custom-bs">
            <v-form>
                <v-row>
                    <v-col
                    cols="12"
                    md="12"
                    >
                        <InputAddress id="pickup-address" :default-value="defaultValue" 
                        @selectAddr="addressSelected"/>
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
                        v-mask="'#########'"
                        label="ZIP"
                        required
                    ></v-text-field>
                    </v-col>
                    <v-col
                    cols="12"
                    >
                    <v-checkbox
                        v-model="address.is_default"
                        label="Make default address"
                        ></v-checkbox>
                    </v-col>
                    <v-col cols="12" class="text-center">
                        <v-btn color="primary" block rounded @click="handleSubmit">Submit</v-btn>
                    </v-col>
                </v-row>
            </v-form>
            </div>
        </v-container>
        <Bottomnavbar v-if="utype=='client'" :items="items" :value="indexValue"/>
         <Bottomnavbar v-if="utype=='service_provider'" :items="technicalDashboardItems" :value="indexValue"/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import InputAddress from '@/components/form-element/InputAddress'
import Bottomnavbar from '@/components/layout/Bottomnavbar'
import { ApiService } from '@/core/services/api.service'
import  JwtService from '@/core/services/jwt.service';
export default {
    name:'ProfileAddressPage',
    data() {
        return {
            title:'Edit Address',
            address: {
                add1:'',
                city:'',
                state:'',
                zip:'',
                is_default:false,
            },
            requiredRules: [
                v => !!v || 'Required',
            ],
            defaultValue:'',
            utype:'',
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
        }
    },
    mounted() {
        this.utype = JwtService.getUtype();
    },
    methods: {
        handleBack() {
            this.$router.back();
        },
        async loadAddress() {
            // await ApiService.get('/csrf-cookie');
            // await ApiService.get()
        },
        async handleSubmit(){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            this.address.add1 = this.address.locality;
            await ApiService.post('/address/add',this.address)
            .then(( resp ) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageSuccess(resp.message);
                this.$router.push('/address-list');
            })  
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError('Failed to update address');
            })
        },
        addressSelected(addr) {
            this.address = addr;
            this.address.zip = addr.zip_code;
            setTimeout(() => {
                this.defaultValue = addr.locality;
            },200);
        },
        async updateAddress() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            this.address.add1 = this.address.locality;
            await ApiService.post('/update-address',this.address)
            // await ApiService.post('/update-address',this.address)
            .then(( resp ) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageSuccess(resp.message);
            })  
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError('Failed to update address');
            })
        }
    },
    components: {
        Topnavbar,
        InputAddress,
        Bottomnavbar
    }
}
</script>
<style lang="scss" scoped>
.form-container{
    background: #fff;
    padding: 24px;
    // border-radius: 10px;
    margin-top: 30px;
}
</style>