<template>
     <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mg56">
            <v-btn link block rounded color="primary" to="/payout-add" class="mb-6">Add Bank  Account</v-btn>
            <div v-if="payouts && payouts.length">
                <div class="custom-bs pa-4 mb-4 d-flex align-center justify-space-between" v-for="(payout, index) in payouts" :key="index">
                    <div class="">
                        <p class="f9-bold ma-0">{{ payout.bank_name}}</p>
                        <v-chip color="accent" small v-if="payout.default">Default</v-chip>
                    </div>
                    <div class="text-right" style="width:200px">
                        <p class="f9-bold ma-0">{{ hideAccountNumber(payout.account_number)}} / {{ payout.routing_number}}</p>
                    </div>
                </div>
            </div>
            <div class="unavailable" v-else>
                <p>{{message}}</p>
            </div>
        </v-container>
         <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
// import Autcomplete from '@/components/layout/InputAutocompleteSingleTextValue'
// import 
// import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
    name:'payoutPage',
    data() {
        return {
            title:'',
            payouts:[],
            message:'Loading...'
        }
    },
    mounted() {
        this.fetchPayouts();
    },
    methods: {
        hideAccountNumber(number) {
            let last = number.substr(-4);
            return "****"+last;
        },
        handleSubmit(){
            let validForm = this.$refs.formPayout.validate();
            if(!validForm) return;
            this.loaderShow();
            console.log(this.detail);
            ApiService.post('/payout/create', this.detail)
            .then((resp) => {
                this.loaderHide();
                console.log(resp);
              
               
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
                console.log({resp});
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
    components: {
        Topnavbar,
        Bottomnavbar,
        // Autcomplete
        // InputUpload
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