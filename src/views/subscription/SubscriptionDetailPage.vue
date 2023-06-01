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
                            <div class="text-right success--text"><p class="ma-0">{{plan.trial_days}} Days Free</p></div>
                        </div>
                    </div>
                </div>
            </div>
            <div  class="pa-4 custom-bs" v-if="initializeCard">
                <h4 class="mb-2 primary--text">Card Information</h4>
                <v-row>
                    <v-col cols="12">
                        <CardStripe @proceed="handleProceedCard"  :publishablekey="publishableKey"/>
                    </v-col>
                </v-row>
            </div>
        </v-container>
         <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import CardStripe from '@/views/cart/CardStripe'
import { ApiService } from '@/core/services/api.service'
import Bottomnavbar from '@/components/layout/NavbarBottomVendor'
import { mapGetters } from 'vuex'
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
            this.loaderShow();
            ApiService.post('/subscription/plan/'+this.packageId)
            .then((resp) => {
                this.loaderHide();
                this.plan = resp.data;
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        },
        // async createToken () {
        async handleProceedCard (param) {
            let data = {
                'name': this.currentUser.fname + " "+ this.currentUser.lname,
                'phone':this.currentUser.mobile_no ? this.currentUser.mobile_no : this.currentUser.phone_no,
                'email': this.currentUser.email,
                'stripeToken': param.stripeToken,
            }
            ApiService.post(`/subscription/plan/${this.packageId}/subscribe`,data)
            .then(() => {
               this.loaderHide();
                this.messageSuccess('Subscription complete');
                this.$router.push("/subscriptions");
            })
            .catch((error) => {
               this.loaderHide();
                this.messageError('Sorry, Failed to subscribe');
                console.log(error);
            })
        // handle the token
        // send it to your server
        },

        tokenCreated (token) {
            console.log(token);
            // handle the token
            // send it to your server
        },
        handleBack(){
            this.$router.back();
        },

       fetchPersonalData() {
           this.loaderShow();
           ApiService.post('/self/profile')
           .then((resp) => {
              this.loaderHide();
               this.personal = resp;
           })
           .catch((error) => {
              this.loaderHide();
               console.log(error);
           })
       }      
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        CardStripe
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