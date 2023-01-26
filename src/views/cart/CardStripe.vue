<template>
    <div>
        <v-form id="paymentform">
            <v-row>
                <v-col cols="12">
                    <label class="">Card Number</label>
                    <div id="card-number"></div>
                </v-col>
                <v-col cols="6">
                    <label class="">Card Expiry</label>
                    <div id="card-expiry"></div>
                </v-col>
                <v-col cols="6">
                    <label class="">CVC</label>
                    <div id="card-cvc"></div>
                </v-col>
            </v-row>
            <v-btn block color="primary" rounded class="mt-6" @click="handleProceed">Proceed</v-btn>
        </v-form>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import { StripePlugin } from '@vue-stripe/vue-stripe';
// import { ApiService } from '@/core/services/api.service'
export default {
    props: {
        publishablekey:{},
    },
    data() {
        return {
            stripe:null,
            card:'',
            date:'',
            token: null,
            cardNumber: null,
            cardExpiry: null,
            cardCvc: null,
        }

    },
    mounted() {
        // this.initializeCard();
        this.fetchApiKey();
    },
    beforeDestroy () {
        this.cardNumber.destroy();
        this.cardExpiry.destroy();
        this.cardCvc.destroy();
    },
    methods: {
        fetchApiKey() {
            const options = {
                pk: this.publishablekey,
                stripeAccount: process.env.STRIPE_ACCOUNT,
                apiVersion: process.env.API_VERSION,
                locale: process.env.LOCALE,
            };
            Vue.use(StripePlugin, options);
            this.initializeCard();
        },
        initializeCard(){
            const style = {
            base: {
                color: 'black',
                // fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '14px',
                '::placeholder': {
                color: '#aab7c4',
                },
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
            };
            this.cardNumber = this.stripeElements.create('cardNumber', { style });
            this.cardNumber.mount('#card-number');
            this.cardExpiry = this.stripeElements.create('cardExpiry', { style });
            this.cardExpiry.mount('#card-expiry');
            this.cardCvc = this.stripeElements.create('cardCvc', { style });
            this.cardCvc.mount('#card-cvc');
            this.packageId = this.$router.currentRoute.params.packageid;
        },
       
        async handleProceed () {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            const { token, error } = await this.$stripe.createToken(this.cardNumber);
            if (error) {
                this.messageError(error.message);
                this.$bus.$emit('HIDE_PAGE_LOADER');
                return;
            }
    
            this.$emit('proceed',{
                'stripeToken': token.id
            });
        },
    },
    computed: {
         stripeElements () {
            return this.$stripe.elements();
        },
        ...mapGetters({
            currentUser:'auth/user',
        })
    }

}
</script>
<style lang="scss">
label{
    font-size: 15px;
    font-weight: 500;
}
</style>