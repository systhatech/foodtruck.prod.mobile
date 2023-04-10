<template>
    <div class="">
        <!-- <div class="custom-bs pa-4 mb-4">
            <p class="mb-1">Available Credits</p>
            <p class="green--text mb-0">60 Credits</p>
        </div> -->
        <div class="custom-bs pa-6 mb-4 text-center">
            <h2 class="success--text">{{total_credit}} Credits</h2>
            <p>Available</p>
            <v-btn rounded large color="primary" to="/vendor-credit-packages">buy credit</v-btn>
        </div>
        <div>
            <p>Transaction Log</p>
            <div v-if="transactions && transactions.length">
                <div class="">
                    <div v-for="(tran, index) in transactions" :key="index" class="custom-bs pa-4 mb-6">
                        <h4 class="mb-2" :class="tran.transaction_type=='sell'?'error--text':'primary--text'">{{ tran.no_of_credits}} Credits</h4>
                        <div v-if="tran.transaction_type =='buy'">
                            <div v-if="tran.is_trial">
                                <p class="warning--text">Trial Started</p>
                                <p class="f9 text-right">{{formatDateTime(tran.created_at)}}</p>
                            </div>
                            <div v-else>
                                <p class="mb-0">Transaction ID</p>
                                <p>{{ tran.transaction_id }}</p>
                                <div class="d-flex align-center justify-space-between" >
                                    <p class="text-capitalize">{{tran.payment_type}} {{tran.cr_last4}}******</p>
                                    <p class="f9">{{formatDateTime(tran.created_at)}}</p>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <p>{{ tran.event_request.event_name }}</p>
                            <p class="f9 text-right">{{formatDateTime(tran.created_at)}}</p>
                        </div>
                    </div>
                    <div v-if="this.last_page >= this.next_page" class="pa-4 text-center mb-6">
                        <v-btn :disabled="fetching_data" outlined large color="primary" rounded @click="loadMore()">{{fetching_data ?'Loading...':'load more'}}</v-btn>
                    </div>
                </div>
            </div>
            <div v-else class="unavailable">
                <p>No transactions yet</p>
            </div>
        </div>
        <ModalBuyCredit/>
    </div>
</template>
<script>
import {mapGetters} from'vuex'
import moment from 'moment'
import { ApiService } from '@/core/services/api.service'

export default {
    data() {
        return {
            moment,
            transactions:[],
            total_credit:0,
            next_page:1,
            last_page:0,
            fetching_data: false,
        }
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
        }),
    },
    created() {

    },
    mounted() {
        this.fetchTransactions();
    },
    methods: {
        fetchTransactions(){
            ApiService.post("/transaction-list?page="+this.next_page)
            .then((resp) => {
                // this.transactions = resp.data.data;
                this.total_credit = resp.available;
                resp.data.data.forEach(element => {
                    this.transactions.push(element);
                });
 
                this.last_page  = resp.data.last_page;
				if(this.next_page <= this.last_page){
					this.next_page += 1
				}
  
                if(!this.transactions.length) {
                    this.message="No items";
                }
                this.loaderHide();
                this.fetching_data = false;
            })
            .catch((error) =>{
                console.log(error);
            })
        },
        loadMore(){
            if(this.last_page >= this.next_page){
                if(!this.fetching_data)
                this.fetchTransactions();
            }
        },
        handleCreditBuy(){
            this.$bus.$emit('MODAL_CREDIT_BUY');
        }
    },

    components: {
        ModalBuyCredit: () => import("@/views/vendor/truck_request/ModalBuyCredit.vue"),
    }
}
</script>
<style scoped lang="scss">

</style>