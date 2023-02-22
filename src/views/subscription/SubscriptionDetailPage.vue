<template>
     <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mg56">
            <div v-if="personal && Object.keys(personal).length" class="pa-4 mb-4 custom-bs">
                <div class="mb-4">
                    <h4 class="primary--text">Truck Information</h4>
                    <p class="ma-0 text-capitalize">{{personal.general.name}}</p>
                    <!-- <p class="ma-0 text-capitalize f9">({{personal.others.truck_type}})</p> -->
                </div>
                 <div class="mb-4">
                    <h4 class="primary--text">Contact Person</h4>
                    <p class="ma-0 text-capitalize">{{personal.contact.fname}} {{personal.contact.lname}}</p>
                    <p class="ma-0">{{personal.contact.email}}</p>
                    <p class="ma-0">{{ formatPhoneNumber(personal.contact.mobile_no)}}</p>
                </div>
                <div>
                    <h4 class="primary--text">Subscription</h4>
                    <div v-html="plan.description"></div>
                    <v-divider></v-divider>
                    <div class="w-100 mt-4">
                        <div class="d-flex align-center justify-space-between">
                            <div class="">Plan</div>
                            <div class="text-right"><h4 class="ma-0 text-capitalize">{{plan.name}}</h4></div>
                        </div>
                        <div class="d-flex align-center justify-space-between">
                            <div class="">Plan Type</div>
                            <div class="text-right"><p class="ma-0 text-capitalize">{{plan.plan_type ? plan.plan_type :'No'}} Package</p></div>
                        </div>
                        <div class="d-flex align-center justify-space-between">
                            <div class="">Price</div>
                            <div class="text-right"><p class="ma-0">{{formatAmount(plan.price)}}</p></div>
                        </div>
                        <div v-if="plan.convenience_fee" class="d-flex align-center justify-space-between">
                            <div class="">Convenience Fee ({{ plan.convenience_fee}})%</div>
                            <div class="text-right"><p class="ma-0">{{formatAmount(plan.convenience_fee_amount)}}</p></div>
                        </div>
                        <div v-if="plan.convenience_fee" class="d-flex align-center justify-space-between pt-2 pb-2">
                            <div class=""><h5 class="text-uppercase primary--text">Total Amount</h5></div>
                            <div class="text-right "><h4 class="ma-0 primary--text">{{formatAmount(plan.total_amount)}}</h4></div>
                        </div>
                        <div v-if="plan.trial_days" class="">
                            <!-- <div class="">Total Amount</div> -->
                            <div class="text-right success--text"><p class="ma-0">{{plan.trial_days}} Days Free</p></div>
                        </div>
                    </div>
                    <!-- <h4 class="ma-0 text-uppercase">{{plan.name}}</h4>
                    <h4 class="ma-0">{{formatAmount(plan.price)}}</h4>
                    <p class="ma-0 color-secondary text-uppercase">{{plan.plan_type ? plan.plan_type :'No'}} Package</p> -->
                    
                </div>
            </div>
            <div  class="pa-4 custom-bs" v-if="initializeCard">
                <h4 class="mb-2 primary--text">Card Information</h4>
                <v-row>
                    <v-col cols="12">
                        <CardStripe @proceed="handleProceedCard"  :publishablekey="publishableKey"/>
                    </v-col>
                    <!-- <v-col cols="6">
                        <label>Card Expiry</label>
                        <div id="card-expiry"></div>
                    </v-col>
                    <v-col cols="6">
                        <label>CVC</label>
                        <div id="card-cvc"></div>
                    </v-col> -->
                </v-row>
                <!-- <v-btn color="primary" v-if="personal && Object.keys(personal).length" class="mt-6" block rounded id="custom-button" @click="createToken">Proceed</v-btn> -->
            </div>
        </v-container>
         <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
// import { StripeElementCard } from '@vue-stripe/vue-stripe';
// import CardStripe from '@/views/cart/CardStripeElements'
import CardStripe from '@/views/cart/CardStripe'
import { ApiService } from '@/core/services/api.service'
import Bottomnavbar from '@/components/layout/NavbarBottomVendor'
import { mapGetters } from 'vuex'
// import InputUpload from '@/components/form-element/InputUpload'
// import { mapGetters } from 'vuex'
export default {
    name:'SubscriptionPage',
    data() {
        return {
            title:'',
           loadingProceed:false,
            stripe:null,
            initializeCard:false,
            publishableKey :'',
            card:'',
            date:'',
            token: null,
            cardNumber: null,
            cardExpiry: null,
            cardCvc: null,
            personal:{},
            packageId:'',
            plan:{},
        }
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
        })
    },
    mounted() {

        this.packageId = this.$router.currentRoute.params.packageid;
        if(this.packageId !== ''){
            this.fetchPackage();
        }
        this.fetchPersonalData();
        this.fetchApiKey();
    },
    methods: {
        async fetchApiKey(){
            let apiKeys = await ApiService.get('/getapikeys');
            this.publishableKey = apiKeys.stripe;
            this.initializeCard = true;
        },
        fetchPackage(){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.post('/subscription/plan/'+this.packageId)
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.plan = resp.data;
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(error);
            })
        },
        // async createToken () {
        async handleProceedCard (param) {
            // this.$bus.$emit('SHOW_PAGE_LOADER');
            // const { token, error } = await this.$stripe.createToken(this.cardNumber);
            // if (error) {
            //     // handle error here
            //     this.messageError(error.message);
            //     // document.getElementById('card-error').innerHTML = error.message;
                // this.$bus.$emit('HIDE_PAGE_LOADER');
            //     return;
            // }
            let data = {
                'name': this.currentUser.fname + " "+ this.currentUser.lname,
                'phone':this.currentUser.mobile_no ? this.currentUser.mobile_no : this.currentUser.phone_no,
                'email': this.currentUser.email,
                'stripeToken': param.stripeToken,
            }
            ApiService.post(`/subscription/plan/${this.packageId}/subscribe`,data)
            .then(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageSuccess('Subscription complete');
                // this.$router.push({name: 'SubscriptionPage'});
                this.$router.push("/subscriptions");
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError('Sorry, Failed to subscribe');
                console.log(error);
            })
        // handle the token
        // send it to your server
        },
         submit () {
            // this will trigger the process
            // this.$refs.elementRef.submit();
            // console.log()
        },
        tokenCreated (token) {
            console.log(token);
            // handle the token
            // send it to your server
        },
        handleBack(){
            this.$router.back();
        },
        initializeGateway(){
        //     this.$bus.$emit('SHOW_PAGE_LOADER');
        //    ApiService.get('/subscription/key/stripe')
        //     .then((resp) => {
        //         this.publishableKey  = resp.data.val1;
        //         console.log(this.publishableKey);
        //          this.$bus.$emit('HIDE_PAGE_LOADER');
        //     })
        //     .catch((error) => {
        //          this.$bus.$emit('HIDE_PAGE_LOADER');
        //          this.messageError({error});
        //     })
        },

       fetchPersonalData() {
           this.$bus.$emit('SHOW_PAGE_LOADER');
           ApiService.post('/self/profile')
           .then((resp) => {
               this.$bus.$emit('HIDE_PAGE_LOADER');
            //    console.log(resp);
               this.personal = resp;
           })
           .catch((error) => {
               this.$bus.$emit('HIDE_PAGE_LOADER');
               console.log(error);
           })
       }      
    },
    components: {
        Topnavbar,
        // StripeElementCard,
        Bottomnavbar,
        CardStripe
        // InputUpload
    },
}
</script>
<style lang="scss" scoped>
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