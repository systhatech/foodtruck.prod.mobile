<template>
    <v-row justify="center">
        <v-dialog
        v-model="dialogPaymentAdd"
        persistent
        max-width="600"
        scrollable
        >
        <v-card>
            <v-card-title class="menu-card-title">
                <div class="w-100 justify-space-between d-flex">
                    <h3 class="text-primary w-100 text-capitalize">Payment Gateway</h3>
                    <div @click="handleClose" style="width:10px;" class="mx-auto"> <v-icon> {{ iconClose }} </v-icon></div>
                </div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-3">
                 <v-form  ref="formLocationValidate">
                    <v-row>
                        <v-col cols="12" md="6" lg="6" xl="6">
                            <InputAutocompleteSingle 
                                :items="items" 
                                :default-clear="defaultClear"
                                :default-value="defaultValue"
                                @selectedDate="selectedData" 
                                label="Type" 
                                model="document_type"/>
                        </v-col>
                        <v-col cols="12" md="6" lg="6" xl="6">
                           <v-checkbox
                            v-model="info.is_default"
                            label="Make Default"
                            ></v-checkbox>
                        </v-col>
                    </v-row>
                    <v-row v-if="gateway == 'authourize.net'">
                        <v-col
                        cols="12"
                        md="12"
                        >
                            <v-text-field 
                            label="Authorize.net Name"
                            v-model="info.val1"
                            ></v-text-field>
                        </v-col>  
                        <v-col
                        cols="12"
                        md="12"
                        >
                            <v-text-field 
                            label="Transaction Key"
                            v-model="info.val2"
                            ></v-text-field>
                        </v-col>  
                         <v-col
                        cols="6"
                        md="6"
                        >
                            <v-text-field 
                            label="Convenience Fee"
                            type="number"
                            v-model="info.convenience_fee"
                            ></v-text-field>
                        </v-col>  
                         <v-col
                        cols="6"
                        md="6"
                        >
                            <v-text-field 
                            label="Transaction Fee"
                            type="number"
                            v-model="info.transaction_fee"
                            ></v-text-field>
                        </v-col>    
                    </v-row>
                    <v-row v-else-if="gateway == 'square'">
                        <v-col
                        cols="12"
                        md="12"
                        >
                            <v-text-field 
                            label="Application ID"
                            v-model="info.val1"
                            ></v-text-field>
                        </v-col>  
                        <v-col
                        cols="12"
                        md="12"
                        >
                            <v-text-field 
                            label="Square Access Token"
                            v-model="info.val2"
                            ></v-text-field>
                        </v-col>  
                        <v-col
                        cols="12"
                        md="12"
                        >
                            <v-text-field 
                            label="Location ID"
                            v-model="info.val3"
                            ></v-text-field>
                        </v-col>  
                         <v-col
                        cols="6"
                        md="6"
                        >
                            <v-text-field 
                            label="Convenience Fee"
                            type="number"
                            v-model="info.convenience_fee"
                            ></v-text-field>
                        </v-col>  
                         <v-col
                        cols="6"
                        md="6"
                        >
                            <v-text-field 
                            label="Transaction Fee"
                            type="number"
                            v-model="info.transaction_fee"
                            ></v-text-field>
                        </v-col>  
                    </v-row>
                    <v-row v-else-if="gateway == 'stripe'">
                        <v-col
                        cols="12"
                        md="12"
                        >
                            <v-text-field label="API Key"
                            v-model="info.val1"
                            ></v-text-field>
                        </v-col>  
                        <v-col
                        cols="12"
                        md="12"
                        >
                            <v-text-field label="Secret Key"
                            v-model="info.val2"
                            ></v-text-field>
                        </v-col>  
                         <v-col
                        cols="6"
                        md="6"
                        >
                            <v-text-field 
                            label="Convenience Fee"
                            type="number"
                            v-model="info.convenience_fee"
                            ></v-text-field>
                        </v-col>  
                         <v-col
                        cols="6"
                        md="6"
                        >
                            <v-text-field 
                            label="Transaction Fee"
                            type="number"
                            v-model="info.transaction_fee"
                            ></v-text-field>
                        </v-col>  
                    </v-row>
                    <v-row v-else-if="gateway == 'paypal'">
                        <v-col
                        cols="12"
                        md="12"
                        >
                            <v-text-field label="API Key"
                            v-model="info.val1"
                            ></v-text-field>
                        </v-col>  
                         <v-col
                        cols="6"
                        md="6"
                        >
                            <v-text-field 
                            label="Convenience Fee"
                            type="number"
                            v-model="info.convenience_fee"
                            ></v-text-field>
                        </v-col>  
                         <v-col
                        cols="6"
                        md="6"
                        >
                            <v-text-field 
                            label="Transaction Fee"
                            type="number"
                            v-model="info.transaction_fee"
                            ></v-text-field>
                        </v-col>  
                    </v-row>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="d-flex justify-space-between pt-4 pb-4 card-actions">
                <v-btn tile text @click="handleClose">Close</v-btn>
                <v-btn color="primary" tile text @click="handleSubmit" 
                    :disabled="submitDisabled"
                    :loading="submitLoading">Submit</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
import InputUpload from '../../../components/InputUpload'
import InputAutocompleteSingle from '../../../components/InputAutocompleteSingleTextValue'
import { mdiPlus, mdiMinus, mdiClose } from '@mdi/js'
import { axiosWeb } from '../../../../utils/axios-web' 
import { axios } from '../../../../utils/axios' 
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
    props:{
        dialogPaymentAdd: {
            required:true,
        },
        loadingPaymentAdd:{},
        paymentInfo:{
            required:true,
        }
    },
    components: {
        InputUpload,
        InputAutocompleteSingle
    },
    
    data(){
        return {
            moment,
            iconClose: mdiClose,
            submitLoading:false,
            submitDisabled:true,
            ruleRequired:[
               v => !!v || 'Required',
            ],
            defaultClear:false,
            defaultValue:'',
            gateway:'',
            info:{
                name:'',
                vendor_id:'',
                val1:'',
                val2:'',
                val3:'',
                val4:'',
                val5:'',
                val6:'',
                convenience_fee:'',
                transaction_fee:'',
                is_default:false,
            },
            items:[
                    {text:"Authorize.net", value:'authourize.net'},
                    {text:'Square',value:'square'},
                    {text:'Stripe', value:'stripe'},
                    {text:'Paypal', value:'paypal'}
                ],

        }
    },
    watch:{
        dialogPaymentAdd: function(newVal, oldVal){
            if(newVal){
                this.defaultClear = false;
                this.info = this.paymentInfo;
                this.defaultValue = this.paymentInfo.name;
                this.gateway = this.paymentInfo.name;
            }else{
                this.gateway = "";
                if(this.info.id){
                    this.defaultClear = false;
                }else{
                    this.defaultClear = true;
                }
                this.info ={
                    name:'',
                    vendor_id:'',
                    val1:'',
                    val2:'',
                    val3:'',
                    val4:'',
                    val5:'',
                    val6:'',
                    is_default:false,
                }
            }
        },
        loadingPaymentAdd:function(newVal) {
            this.submitLoading = false;
        },
        gateway:function(newVal) {
            if(newVal == "" || newVal == undefined || newVal == null || newVal == ''){
                this.submitDisabled = true;
            }else{
                this.submitDisabled = false;
            }
        }
       
    },
    methods: {
        async handleSubmit(){
            if(this.info.name == "" || this.info.name == undefined || this.info.name == null || this.info.name == '') return;
            this.submitLoading = true;
            this.$emit('handleOk',this.info);
        },
        handleClose(){
            this.$emit('close');
        },
        selectedData(data){
            this.info = {
                name:'',
                val1:'',
                val2:'',
                val3:'',
                val4:'',
                val5:'',
                val6:'',
            };
            this.gateway = data.selected_data;
            this.info.name = data.selected_data;
        },
    },
    computed: {
          ...mapGetters({
            currentUser:'auth/user',
        })
    },
}
</script>
<style lang="scss" scoped>
</style>