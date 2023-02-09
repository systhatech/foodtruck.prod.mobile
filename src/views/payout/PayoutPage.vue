<template>
     <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mb80">
            <div v-if="orders && orders.length">
                <div class="custom-bs pa-6" v-if="amount && Object.keys(amount).length && (default_payment == 'default_company')">
                    <div class="d-flex align-center justify-space-between">
                        <h4 class="ma-0">Available Fund</h4>
                        <span class="color">{{ formatAmount(amount.outstanding)}}</span>
                    </div>
                    <div class="text-center mt-4" v-if="default_payment == 'default_company'">
                        <v-btn :disabled="amount.outstanding < 10" color="primary" outlined rounded small @click="handleTransfer">Transfer</v-btn>
                        <p class="error--text" v-if="amount.outstanding < 10">Minimum payout amount must be 10$</p>
                    </div>
                </div>
                <div class="mt-3 p-relative" v-if="orders && orders.length">
                    <v-btn color="primary" rounded v-if="renderFilter" @click="handleOpenFilter">
                        <v-icon>{{iconFilter}}</v-icon> Select Date Range
                    </v-btn>
                    <div class="pt-4">
                        <p class="mb-0">Settlement from  <span style="font-weight:600">{{  formatStandardUSDate(start_date) }}</span> to <span style="font-weight:600">{{ formatStandardUSDate(end_date) }}</span></p>
                    </div>
                    <div v-if="orders && Object.keys(orders).length" >
                        <div v-for="(dateWiseOrders, date) in orders" :key="date">
                            <span>{{ formatDateStandard(date) }}</span>
                            <v-row v-if="dateWiseOrders && dateWiseOrders.length > 0">
                                <v-col cols="12" v-for="(order, i) in dateWiseOrders" :key="i">
                                    <div class="order_item custom-bs">
                                        <p class="d-flex align-center"><span>Sales</span> <span class="amount"> : {{formatAmount1(order.sub_total)}} </span></p>
                                        <p class="d-flex align-center"><span>Tax</span> <span class="amount"> : {{formatAmount1(order.tax)}} </span></p>
                                        <v-divider class="mb-3 mt-2"></v-divider>
                                        <h5 class="text-uppercase primary--text">Available Fund : {{formatAmount1(order.total_available)}} </h5>
                                            <v-divider class="mb-3 mt-2"></v-divider>
                                        <p class="d-flex align-center"><span>Convenience fee</span> <span class="amount"> : {{formatAmount1(order.conv_fee)}} </span></p>
                                        <p class="d-flex align-center"><span>Service fee</span> <span class="amount"> : {{formatAmount1(order.service_charge)}} </span></p>
                                        <v-divider class="mb-3 mt-2"></v-divider>
                                        <h5 class="text-uppercase primary--text">Total Sales : {{formatAmount1(order.total)}} </h5>
                                        <v-divider class="mb-3 mt-2"></v-divider>
                                        <p class="d-flex align-center"><span>Cash Sales</span> <span class="amount"> : {{formatAmount1(order.cash_sales)}} </span></p>
                                        <p class="d-flex align-center"><span>Card Sales</span> <span class="amount"> : {{formatAmount1(order.card_sales)}} </span></p>
                                        <v-divider class="mb-3 mt-2"></v-divider>
                                        <h5 class="text-uppercase primary--text">Transferred Amount : {{formatAmount1(order.payout)}} </h5>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                    <div v-else class="mt-10 unavailable">
                    <p>{{ message }}</p>
                    </div>
                </div>                    
                <PayoutConfirm 
                    :modal-payout="modalPayout"
                    :bank="bank"
                    :amount="amount"
                    @close="handleClose"
                    @confirm="handlePayProceed"
                />
                <PayoutFilter 
                    :modalPayoutFilter="modalPayoutFilter"
                    @close="handleClose"
                    @search="handleFilterSearch"
                />
                <DialogProceed 
                :dialogConfirm="modalAddBankDetail" 
                @close="handleClose" 
                :message="messageAddDetail"
                @handleConfirm="handleAddBankDetail"/>
            </div>
            <div v-else>
                <div v-if="loading" class="text-center">
                    <ComponentLoadingVue/>
                </div>
                <div v-else class="unavailable">
                    <p>{{ message }}</p>
                </div>
            </div>
        </v-container>
         <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
import Bottomnavbar from '@/components/layout/NavbarBottomVendor'
import { mdiFilter } from '@mdi/js'
// import DateStart from '@/components/form-element/InputDateRange'
// import DateEnd from '@/components/form-element/InputDateLastPicker'
import PayoutFilter from './PayoutFilter'
import PayoutConfirm from './PayoutConfirm'
import DialogProceed from '@/components/layout/DialogProceed'
import { mapGetters } from 'vuex'
import moment from 'moment'
// import { ApiService } from '@/core/services/api.service'
export default {
    name:'payoutPage',
    data() {
        return {
            moment,
            title:'',
            renderFilter:false,
            iconFilter: mdiFilter,
            modalAddBankDetail:false,
            payouts:[],
            loading:false,
            message:'Loading...',
            default_payment:null,
            orders:[],
            modalPayout:false,
            bank:{},
            amount:{},
            date: new Date().toISOString().substr(0, 10), 
            modalPayoutFilter:false,
            start_date: new Date().toISOString().substr(0, 10),
            end_date: '',
            messageAddDetail:'Add Bank Detail Before Transfer',
        }
    },
    mounted() {
        this.end_date = moment().add(7,'days').format('YYYY-MM-DD');
        console.log(this.end_date);
        this.fetchProfile();
        this.fetchOrders();
    },
    methods: {
        handleOpenFilter(){
            console.log("Test");
            this.modalPayoutFilter = true;
        },
        handleBack() {
            this.$router.back();
        },
        handleClose() {
            this.modalPayoutFilter =false;
            this.modalPayout = false;
            this.modalAddBankDetail = false;
        },
        handleAddBankDetail() {
            this.$router.push("/payment-bank-add");
        },
        handleFilterSearch(data) {
            this.start_date = data.start_date;
            this.end_date = data.end_date;
            this.fetchOrders();
        },
        async handlePayProceed() {
            this.loaderShow();
            await ApiService.post('/payout/settlement/outstanding')
            .then(() => {

                this.fetchOrders();
                this.handleClose();
            })
            .catch((error) => {
                // console.log(error);
                this.messageError(error.response.data.message);
                this.loaderHide();
            })
        },
        async handleTransfer(){
            this.loaderShow();
            await ApiService.post('/payout/find')
            .then((resp) => {
                this.bank = resp.data;
                this.modalPayout = true;
                this.loaderHide();
            })
            .catch((error) => {
                // console.log(error);
                this.messageAddDetail = error.response.data.message;
                this.modalAddBankDetail = true;
                this.loaderHide();
            })
        },
        async fetchProfile() {
            await ApiService.post("profile").then((response) => {
                this.default_payment = response.data.owner.default_payment;
                console.log(this.default_payment);
            })
            .catch(() => {
                console.log("no fetch")
            })
        },

        async fetchOrders() {
            // this.loaderShow();
            this.loading= true;
            await ApiService.post("/payout/order-payout-list",{
                status:'completed',
                start_date: this.start_date,
                end_date: this.end_date,
            })
            .then((resp) => {
                this.loading = false;
                this.loaderHide();
                this.handleClose();
                this.orders = resp.data;
                this.renderFilter = true;
                if(!this.orders.length) {
                    this.message="No payout available yet";
                }
                this.amount = resp.amount;
            })
            .catch(() => {
                this.loading = false;
                this.loaderHide();
                console.log("no fetch")
            })
        }
    },
    components: {
        Topnavbar,
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
        Bottomnavbar,
        PayoutConfirm,
        PayoutFilter,
        DialogProceed,
        // DateStart,
        // DateEnd
        // BankDetail,
        // StripeDetail,
    },
    computed: {
         ...mapGetters({
            currentUser:'auth/user',
        })
    }
}
</script>
<style lang="scss" scoped>
.min-amount{
    padding: 0;
    margin: 0;
    font-size: 0.8rem;
    color: #f40403;
    margin-top: 12px;
}
.filter{
    position: absolute;
    right: 0;
    top: 14px;
}
.form-container{
    // .login-container{
    background: #acfa95;
    border-radius: 10px;
    margin-top: 27px !important;
    padding:20px;
// }
}
   $color-primary: #000000;
    $color-secondary: #01a6bc;
    ul.order-types{
        list-style: none;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid #dadada;
        padding-bottom: 10px;
        li{
            text-transform: uppercase;
            font-size: 0.8rem;
            font-weight: 500;
            span{
                color: #9e9e9e;
            }
            span.active-type{
                color: #000000;
                border-bottom: 2px solid #000000;
                padding-bottom: 12px;
            }
        }
    }
    .order_item{
        border-radius:0;
        padding:12px;
        .order_no{
            margin: 0;
            font-size: 0.8rem;
            // font-weight: 600;
            // color: #01a6bc;
            display:flex;
            justify-content:space-between;
            margin-bottom:8px;
            // flex-direction:column;
            span.amount{
                font-size: 0.8rem;
            }
        }
        .order_person,
        .order_contact,
        .order_bill,
        .order_date{
            margin: 0;
            font-size: 0.8rem;
            text-transform: capitalize;
        }
    }
</style>