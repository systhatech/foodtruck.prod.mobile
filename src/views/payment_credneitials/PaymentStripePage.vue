<template>
    <div>
        
        <div class="custom-bs" v-if="render">
            <!-- <div class="header-stripe bg-primary">
                <h4 class="mb-0">Stripe Credientials</h4>
            </div> -->
            <v-form class="pa-6" ref="formStripe">
                <h4 class="mb-4">Stripe Credientials</h4>
                <v-divider class="mb-4"></v-divider>
                <v-row>
                    <v-col
                    cols="12"
                    md="12"
                    class="mb-0 pb-0"
                    >
                        <v-text-field label="API Key"
                        v-model="stripeDetail.val1"
                        :rules="rulesRequired"
                        ></v-text-field>
                    </v-col>  
                    <v-col
                    cols="12"
                    md="12"
                    class="mb-0 pb-0"
                    >
                        <v-text-field label="Secret Key"
                        v-model="stripeDetail.val2"
                        :rules="rulesRequired"
                        ></v-text-field>
                    </v-col>  
                    <v-col
                    cols="12"
                    md="12"
                    class="mb-0 pb-0"
                    >
                        <v-text-field 
                        label="Convenience Fee (%)"
                        type="number"
                        v-model="stripeDetail.convenience_fee"
                        :rules="rulesRequired"
                        ></v-text-field>
                    </v-col>  
                    <v-col cols="12" class="ma-0 pt-0 pb-0">
                            <v-checkbox
                                v-model="stripeDetail.is_default"
                                label="Default"
                            ></v-checkbox>
                        </v-col>
                    <v-col
                    cols="12"
                    md="12"
                    >
                    <v-btn color="primary" block rounded @click="handleSubmit">Submit</v-btn>
                    </v-col>  
                </v-row>
            </v-form>
        </div>
        <div class="unavailable" v-else>
            <p>{{message}}</p>
        </div>
        <DialogConform 
            :dialogConfirm="modalConfirm" 
            @close="handleClose" 
            @handleConfirm="handleConfirm"/>
    </div>
</template>
<script>
import { ApiService } from '@/core/services/api.service'
import { mapGetters } from 'vuex'
import DialogConform from '@/components/layout/DialogConfirm'
export default {
    name:'payoutStripe',
    data() {
        return {
            modalConfirm:false,
            title:'',
            stripeDetail:{
                is_default:1,
                vendor_id:'',
                val1:'',
                val2:'',
                convenience_fee:'',
                transaction_fee:'',
            },
            render:false,
            message:'Loading...',
            rulesRequired: [
                v => !!v || 'Required',
            ],
        }
    },
    mounted() {
        this.fetchDetail();
    },
    methods: {
        handleClose() {
            this.modalConfirm = false;
        },
        handleSubmit(){
            let validForm = this.$refs.formStripe.validate();
            if(!validForm) return;
            this.modalConfirm = true;
        },
        handleConfirm(){
            let validForm = this.$refs.formStripe.validate();
            if(!validForm) return;
            this.loaderShow();
            console.log(this.stripeDetail);
            ApiService.post('/payout/stripe', this.stripeDetail)
            .then((resp) => {
                this.messageSuccess(resp.message);
                this.loaderHide();
                this.handleClose();
            })
            .catch((error) => {
                this.loaderHide();
                this.messageError(error.response.data.message);
            })
           
        },
     
        async fetchDetail() {
            this.loaderShow();
            await ApiService.post("/profile")
            .then((resp) => {
                this.stripeDetail.vendor_id = resp.data.table_id;
                if(resp.data.owner.payment_credential) {
                    this.stripeDetail = resp.data.owner.payment_credential;
                }
                this.render = true;
                this.loaderHide();
            })
            .catch((error) => {
                 this.message='Failed to fetch data';
                this.loaderHide();
                console.log(error);
            })
        },
        handleBack(){
            this.$router.back();
        }
    },
    components:{
        DialogConform,
    },
    computed: {
          ...mapGetters({
            currentUser:'auth/user',
        })
    }
}
</script>
<style lang="scss" scoped>
.header-stripe{
    padding:20px 24px;
    color: #fff;
}
</style>