<template>
    <div>
        
        <div class="custom-bs" v-if="render">
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
                    <v-btn color="primary" large block rounded @click="handleSubmit">Submit</v-btn>
                    </v-col>  
                </v-row>
            </v-form>
        </div>
        <div class="unavailable" v-else>
            <div v-if="loading">
                    <ComponentLoadingVue/>
                </div>
                <div v-else class="unavailable">
                    <p>No orders</p>
                </div>
        </div>
        <DialogConform 
            :dialogConfirm="modalConfirm" 
            @close="handleClose" 
            @handleConfirm="handleConfirm"/>
    </div>
</template>
<script>
import { ApiService } from '@/core/services/api.service'
import { mapGetters,mapActions } from 'vuex'
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
            loading:false,
            rulesRequired: [
                v => !!v || 'Required',
            ],
        }
    },
    mounted() {
        this.fetchDetail();
    },
    methods: {
        ...mapActions({ 'fetchCurrentUser': 'auth/fetchProfile'}),
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
                this.fetchCurrentUser();
                this.handleBack();
            })
            .catch((error) => {
                this.loaderHide();
                this.messageError(error.response.data.message);
            })
           
        },
     
        async fetchDetail() {
            // this.loaderShow();
            this.loading = true;
            await ApiService.post("/profile")
            .then((resp) => {
                this.loading = false;
                this.stripeDetail.vendor_id = resp.data.table_id;
                if(resp.data.owner.payment_credential) {
                    this.stripeDetail = resp.data.owner.payment_credential;
                }
                this.render = true;
                this.loaderHide();
            })
            .catch((error) => {
                this.loading = false;
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
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
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