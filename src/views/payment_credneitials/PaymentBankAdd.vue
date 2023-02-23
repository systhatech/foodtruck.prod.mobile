<template>
     <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mb80">
            <div class="custom-bs pa-6">
                <h4 class="mb-4">Bank Account Detail</h4>
                <v-divider></v-divider>
                <v-form class="" ref="formPayout">
                    <v-row>
                        <v-col cols="12" class="pb-0">
                            <v-text-field 
                                :rules="rulesRequired" 
                                v-model="detail.account_holder_name" 
                                label="Account Holder Name">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" class="ma-0 pt-0">
                            <v-text-field 
                                :rules="rulesRequired" 
                                v-model="detail.bank_name" 
                                label="Bank Name">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" class="ma-0 pt-0 pb-0">
                            <v-text-field 
                                :rules="rulesRequired" 
                                v-model="detail.account_number" 
                                
                                label="Account Number">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" class="ma-0 pt-0 pb-0">
                            <v-text-field 
                                :rules="rulesRequired" 
                                v-model="detail.routing_number" 
                                label="Routing Number">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" class="ma-0 pt-0 pb-0">
                            <v-text-field 
                                :rules="rulesRequired" 
                                v-model="ssn" 
                                type="password"
                                label="Social Security Number (SSN)">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" class="ma-0 pt-0 pb-0">
                            <Select :items="document_types" 
                                @selected="handleSelected"
                                label="Document Type"/>
                        </v-col>
                        <v-col cols="12" class="ma-0 pt-0 pb-0">
                            <v-file-input
                            show-size
                            truncate-length="20"
                            :rules="rules"
                            v-model="document"
                            prepend-icon=""
                            label="Upload Document"
                            ></v-file-input>
                        </v-col>
                        <v-col cols="12" class="ma-0 pt-0 pb-0">
                            <v-checkbox
                                v-model="detail.default"
                                label="Default"
                            ></v-checkbox>
                        </v-col>
                        <v-col cols="12" class="ma-0 pt-0">
                            <v-btn color="primary" large block rounded @click="handleSubmit">Submit</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </div>
            <DialogConform 
            :dialogConfirm="modalConfirm" 
            @close="handleClose" 
            @handleConfirm="handleConfirm"/>

            <DialogUpdateAddress 
            :message="addressMessage"
            :dialogConfirm="modalAddAddress" 
            @close="handleClose" 
            @handleConfirm="handleAddAddress"/>

        </v-container>
         <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
import Bottomnavbar from '@/components/layout/NavbarBottomFixed'

import DialogConform from '@/components/layout/DialogConfirm'
import DialogUpdateAddress from './DialogAddressAdd'
import Select from '@/components/layout/InputAutocompleteSingleTextValue'
import { mapGetters } from 'vuex'
import CryptoJS from "crypto-js";
export default {
    name:'PayoutPageAdd',
    data() {
        return {
            title:'',
            detail : {
                account_holder_name:'',
                account_number:'',
                routing_number:'',
                bank_name:'',
                vendor_id:'',
                default:true,
                document_type:'',
                document:'',
            },
            ssn:'',
            modalConfirm:false,
            modalAddAddress:false,
            rulesRequired: [
                v => !!v || 'Required',
            ],
            rules: [
                value => !value || value.size < 10000000 || 'Avatar size should be less than 2 MB!',
            ],
            document_types:[],
            document:[],
            addressMessage:'Please update your address before you proceed.',
            
        }
    },
    mounted() {
        this.checkAddress();
        this.fetchDocumentTypes();
        this.detail.account_holder_name =  this.currentUser.fname + " " + this.currentUser.lname;
    },
    watch: {
        document(file) {
            console.log({file});
            this.loaderShow();
            let formData = new FormData();
            formData.append("file",file);
            ApiService.post('/store-image', formData)
            .then((resp) => {
                 this.loaderHide();
                 this.detail.document = resp.file_name;
                 console.log(this.detail);
            })
            .catch((error) => {
                console.log(error.response.data);
                this.messageError("Failed ! choose image less than size 2mb");
                this.loaderHide();
            });
        }
    },
    methods: {
         async checkAddress() {
             this.loaderShow();
            await ApiService.post("/payout/truck/address-check").then(() => {
                this.loaderHide();
			})
			.catch((error) => {
                this.loaderHide();
                this.message = error.response.data.message; 
                this.modalAddAddress = true;
			})
        },
        async fetchDocumentTypes() {
            this.loaderShow();
            await ApiService.get('/lookup/document-types')
            .then((resp) => {
                this.loaderHide();
                this.document_types  = resp.data;
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            });
        },
        handleSelected(type) {
            this.detail.document_type = type.selected_data;
            console.log(this.detail);
            // console.log(type);
        },
        handlechange(param) {
            console.log({param});
        },
        handleClose() {
            this.modalConfirm = false;
            this.handleAddAddress = false;
        },
        handleSubmit(){
            let validForm = this.$refs.formPayout.validate();
            if(!validForm) return;
            if(!this.detail.document_type) {
                this.messageError('Select Document Type');
                return;
            }
            this.modalConfirm = true;
        },
        handleAddAddress(){
            this.$router.push("/vendor-profile-address");
        },
        handleConfirm(){
            let validForm = this.$refs.formPayout.validate();
            if(!validForm) return;

            if(!this.detail.document_type) {
                this.messageError('Select Document Type');
                return;
            }
            this.loaderShow();

            this.detail.default = this.detail.default == true?1:0;
             let key="yummy_truck";
            // Encrypt
            var ciphertext = CryptoJS.AES.encrypt(this.ssn, key).toString();
            // this.ssn = ciphertext;
            this.detail.ssn = ciphertext;
            // console.log(this.detail);
            ApiService.post('/payout/create', this.detail)
            .then((resp) => {
                this.messageSuccess(resp.message);
                this.$router.push("/payments");
            })
            .catch((error) => {
                this.loaderHide();
                this.messageError(error.response.data.message);
            })
        },
        selectedCountry(country){
            console.log({country});
        },
        selectedCurrency(currency) {
            console.log({currency});
        },
        async fetchOrders() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post("/order-list",{
                'status': this.status
            })
            .then((resp) => {
                this.orders = resp.data;
                console.log(this.orders);
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(error);
            })
        },
        handleBack(){
            this.$router.back();
        }
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        DialogConform,
        DialogUpdateAddress,
        Select,
        // InputUpload,
    },
    computed: {
          ...mapGetters({
            currentUser:'auth/user',
        })
    }
}
</script>
<style lang="scss" scoped>
.subscription {
    text-align: center;
    padding: 10px;
    color: #b5b5b5;
    background: #fff;
    height: 180px;
    border-radius: 20px;
    align-items: center;
    justify-content: space-around;
    display: flex;
}
.price{
    font-size: 1.2rem;
    font-weight: 600;
    color: #000000;
}
.package-container{
    background: #acfa95;
    border-radius: 10px;
    padding: 18px;
    text-align: center;
}
.form-container{
    // .login-container{
    background: #acfa95;
    border-radius: 10px;
    margin-top: 27px !important;
    padding:20px;
// }
}
</style>