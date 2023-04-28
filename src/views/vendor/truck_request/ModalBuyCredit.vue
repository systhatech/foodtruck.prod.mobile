<template>
    <v-row justify="center">
        <v-dialog
        v-model="modal_buy_credit"
        persistent
        scrollable
        fullscreen>
        <v-card class="background-image" style="padding-top: 56px !important;">
            <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                <v-toolbar-title class="text-capitalize">Buy Credit</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn text @click="handleClose">
                        Close
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
     
                <div class="pa-4 pb82 background-white">
                    <div class="pa-6 custom-bs">
                        <div class="mb-4">
                            <div v-if="trial" class="mb-4 text-center">
                                <h3 class="warning--text" >Trial with {{ selected_package.no_of_credits }} credits</h3>
                            </div>
                            <div v-else>
                                <h2 class="primary--text">{{ formatAmount(selected_package.amount) }}</h2>
                                <p class="primary--text mb-0">{{ selected_package.no_of_credits }} Credits</p>
                            </div>
                        </div>
                        <div v-if="trial" class="text-center mt-4">
                            <v-btn color="warning" rounded large @click="handleStartTrial()">Start Trial</v-btn>
                        </div>
                        <div v-else>
                            <div v-if="key">
                                <CardStripe @proceed="handleProceedCard" :publishablekey="key"/>
                            </div>
                            <div v-else>
                                <p class="error--text">Please! setup payment credientials</p>
                            </div>
                        </div>
                    </div>
                </div>
        </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
import { mdiClose } from '@mdi/js'
import { base_url } from '@/core/services/config'
import { mapGetters } from 'vuex'
import { ApiService } from '@/core/services/api.service'
import moment from 'moment'
export default {
    props:{
    },
    data(){
        return {
            base_url,
            vendorPayment:'',
            modal_buy_credit:false,
            moment,   
            iconClose: mdiClose,
            item:{},
            selected_package:{},
            key:'',
            trial:0,

        }
    },
    mounted(){
        this.$bus.$on("MODAL_CREDIT_BUY", (param) => {
            this.selected_package = param.item;
            this.key = param.key;
            this.trial = param.trial;
            console.log("trial :",this.trial);
            this.modal_buy_credit = true;
        });
    },
    components:{
        CardStripe:() => import('@/views/cart/CardStripe.vue')
    },
    methods: {
        handleStartTrial(){
            ApiService.post("/credit_package_buy",{
                'amount': 0,
                'package_id': this.selected_package.id,
                'no_of_credits': this.selected_package.no_of_credits,
                'is_trial': this.trial,
            })
            .then((resp)=>{
                this.loaderHide();
                this.handleClose();
                console.log(resp);
            })
            .catch((error)=>{
                this.loaderHide();
                console.log(error);
            })
        },
        handleProceedCard(param){
            console.log(param);
            console.log({
                'stripe_key': param.stripeToken,
                'amount': this.trial ? 0 : this.selected_package.amount,
                'package_id': this.selected_package.id,
                'no_of_credits': this.selected_package.no_of_credits,
                'is_trial': this.trial,
            });
            ApiService.post("/credit_package_buy",{
                'stripe_key': param.stripeToken,
                'amount': this.trial ? 0 : this.selected_package.amount,
                'package_id': this.selected_package.id,
                'no_of_credits': this.selected_package.no_of_credits,
                'is_trial': this.trial,
            })
            .then((resp)=>{
                this.loaderHide();
                this.handleClose();
                console.log(resp);
            })
            .catch((error)=>{
                this.loaderHide();
                console.log(error);
            })
        },
        handleClose(){
            this.modal_buy_credit = false;
            this.$router.back();
        },
        handleSubmit(){
            this.loaderShow();
            ApiService.post("/event_buy",{
                "id": this.item.id
            })
            .then(() =>{
                this.modal_buy_credit = false;
                this.loaderHide();
            })
            .catch((error)=>{
                this.loaderHide();
                console.log(error);
            })
        }
       
       
    },
    computed: {
        ...mapGetters({ 
            currentUser : 'auth/user',
         
        }),
    }
}
</script>
<style lang="scss" scoped>

.v-label {
    font-size: 0.9rem !important;
    text-transform: capitalize !important;
}
.flavour-list{
    list-style: none;
    padding-left: 16px;
}

.v-card__title{
    padding:16px 25px;
}
.quantity {
    width: 40px;
    padding: 4px 10px;
    text-align: center;
}
.cardBody{
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>