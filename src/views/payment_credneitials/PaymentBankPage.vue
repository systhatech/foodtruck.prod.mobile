<template>
    <div>
        <v-btn link block rounded color="primary" to="/payment-bank-add" class="mb-6">Add Bank  Account</v-btn>
        <div v-if="payouts && payouts.length">
            <div class="custom-bs pa-4 mb-4 d-flex justify-space-between" v-for="(payout, index) in payouts" :key="index">
                <div class="">
                    <p class="f9-bold ma-0">{{ payout.bank_name}}</p>
                    <v-btn color="accent" text small v-if="payout.default">Default</v-btn>
                    <v-btn color="accent" class="mt-2" rounded small outlined v-else @click="handleDefault(payout.id)">Make Default</v-btn>
                </div>
                <div class="text-right" style="width:200px">
                    <p class="f9-bold ma-0">{{ hideAccountNumber(payout.account_number)}} / {{ payout.routing_number}}</p>
                    <v-chip small :color="payout.status.toLowerCase() =='complete'?'accent':'error'" class="mt-2">{{ payout.status.toLowerCase() == 'complete'?'Active':'Inactive' }}</v-chip>
                    <v-icon fab @click="handleDelete(payout.id)" v-if="payout.status.toLowerCase() !='complete'" color="error" class="ml-2 pa-1 mt-2">mdi-delete-circle</v-icon>
                </div>
                <!-- <p class="f8"></p> -->
            </div>
        </div>
        <div class="unavailable" v-else>
            <p>{{message}}</p>
        </div>
        <DialogConfirm :dialogConfirm="modalConfirm" @close="handleClose" @handleConfirm="handleMakeDefault"/>
        <DialogConfirm 
            :dialogConfirm="modalDeleteConfirm"  
            :message="messageDelete"
            @close="handleClose" 
            @handleConfirm="deletePayout"/>
    </div>
</template>
<script>
import { ApiService } from '@/core/services/api.service'
import { mapGetters } from 'vuex'
import DialogConfirm from '@/components/layout/DialogConfirm'
export default {
    name:'payoutPage',
    data() {
        return {
            title:'',
            payouts:[],
            message:'Loading...',
            payoutId:null,
            modalConfirm:false,
            modalDeleteConfirm:false,
            messageDelete:'You want to delete account?',
        }
    },
    mounted() {
        this.fetchPayouts();
    },
    components: {
        DialogConfirm,
    },
    methods: {
        handleDelete(payoutId) {
            this.payoutId = payoutId;
            this.modalDeleteConfirm  = true;
        },
        handleDefault(payoutId) {
            this.payoutId = payoutId;
            this.modalConfirm  = true;
        },
        handleClose() {
            this.modalConfirm = false;
            this.modalDeleteConfirm = false;
        },
        async deletePayout() {
            this.loaderShow();
            await ApiService.post('/payout/bank-delete', {id: this.payoutId})
            .then((resp) => {
                this.loaderHide();
                this.messageSuccess(resp.message);
                this.handleClose();
                this.fetchPayouts();
            })
            .catch((error) => {
                this.loaderHide();
                this.messageError(error.response.data.message);
            })
        },
        async handleMakeDefault(){
            this.loaderShow();
            await ApiService.post('/payout/make-default', {id: this.payoutId})
            .then((resp) => {
                this.loaderHide();
                this.messageSuccess(resp.message);
                this.handleClose();
                this.fetchPayouts();
            })
            .catch((error) => {
                this.loaderHide();
                this.messageError(error.response.data.message);
            })
        },
        hideAccountNumber(number) {
            let last = number.substr(-4);
            return "****"+last;
        },
        handleSubmit(){
            let validForm = this.$refs.formPayout.validate();
            if(!validForm) return;
            this.loaderShow();
            ApiService.post('/payout/create', this.detail)
            .then((resp) => {
                this.loaderHide();
                this.messageSuccess(resp.message);
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
        async fetchPayouts() {
            this.loaderShow();
            await ApiService.post("/payout/list")
            .then((resp) => {
                this.payouts = resp.data;
                 if(!this.payouts.length) {
                    this.message='No data found';
                }
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
    computed: {
          ...mapGetters({
            currentUser:'auth/user',
        })
    }
}
</script>
<style lang="scss" scoped>
</style>