<template>
    <div>
        <v-form id="paymentform">
            <v-row>
                <v-col cols="12">
                    <!-- <label class="f8-bold">Card Number</label>
                    <div id="card-number"></div> -->
                    <stripe-element-card
                        @element-click="cardBlur"
                        :hidePostalCode="true"
                        ref="elementRef"
                        :pk="publishablekey"
                        @error="handleError"
                        @element-ready="elementReady"
                        @token="tokenCreated"
                        />
                    <!-- <button @click="submit">Generate token</button> -->
                </v-col>
            </v-row>
            <v-btn block color="primary" rounded class="mt-4" @click="handleProceed">Proceed</v-btn>
        </v-form>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
// import { ApiService } from '@/core/services/api.service'
import { StripeElementCard } from '@vue-stripe/vue-stripe';
export default {
    props: {
        publishablekey:{},
    },
    data() {
        return {
            // pulishableKey:'pk_test_HWXJvemu3UMjLToQMuQXdVHf00hbtPgsPF',
        }

    },
    mounted() {
        this.loaderShow();
    },
    components: {
        StripeElementCard,
    },
    beforeDestroy() {
        this.$refs.elementRef.destroy()
    },

    methods: {
        handleProceed () {
        // this will trigger the process
            this.$bus.$emit('SHOW_PAGE_LOADER');
            try {
                this.$refs.elementRef.submit();
            } catch (error) {
                 this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(error);
            }
        },
        handleError(error) {
            this.$bus.$emit('HIDE_PAGE_LOADER');
            this.messageError(error.message);
        },
        elementReady() {
            console.log("element ready");
            this.loaderHide();
        },
        cardBlur() {
            console.log('blur');
        },
        tokenCreated (token) {
            this.$emit('proceed',{
                'stripeToken': token.id
            });
        // handle the token
        // send it to your server
        },
        // initializeCard(){
        //     const style = {
        //     base: {
        //         color: 'black',
        //         fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        //         fontSmoothing: 'antialiased',
        //         fontSize: '14px',
        //         '::placeholder': {
        //         color: '#aab7c4',
        //         },
        //     },
        //     invalid: {
        //         color: '#fa755a',
        //         iconColor: '#fa755a',
        //     },
        //     };
        //     this.cardNumber = this.stripeElements.create('cardNumber', { style });
        //     this.cardNumber.mount('#card-number');
        //     this.cardExpiry = this.stripeElements.create('cardExpiry', { style });
        //     this.cardExpiry.mount('#card-expiry');
        //     this.cardCvc = this.stripeElements.create('cardCvc', { style });
        //     this.cardCvc.mount('#card-cvc');
        //     this.packageId = this.$router.currentRoute.params.packageid;
        // },
       
        // async handleProceed () {
        //     this.$bus.$emit('SHOW_PAGE_LOADER');
        //     const { token, error } = await this.$stripe.createToken(this.cardNumber);
        //     if (error) {
        //         this.messageError(error.message);
        //         this.$bus.$emit('HIDE_PAGE_LOADER');
        //         return;
        //     }
        //     this.$bus.$emit('HIDE_PAGE_LOADER');
         
        //     this.$emit('proceed',{
        //         'stripeToken': token.id
        //     });
        // },
    },
    computed: {
        // stripeElements () {
        //     return this.$stripe.elements();
        // },
          ...mapGetters({
            currentUser:'auth/user',
        })
    }

}
</script>