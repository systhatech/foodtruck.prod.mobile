<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar/>
        <v-container class="mg56">
            <div class="w-100 d-flex align-center w-100">
    
                    <!-- <OrderStatus :items="report_types" @selectedStatus="handleActive"/> -->
                    <!-- <div v-for="(type,index) in report_types" :key="index">
                        <v-btn large class="mr-2" outlined rounded color="primary" v-if="index==active_index" @click="handleActive(type, index)">{{ type.name }}</v-btn>
                        <v-btn large v-else class="mr-2" text rounded @click="handleActive(type, index)">{{ type.name }}</v-btn>
                    </div> -->
          
            </div>
            <div v-if="order && Object.keys(order).length" class="mt-3">
               <v-row>
                <!-- <v-col cols="6">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, officiis.</p>
                </v-col>
                <v-col cols="6">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, officiis.</p>
                </v-col> -->
                <v-col cols="12">
                    <div class="custom-bs pa-4">
                        <div class="mb-2">
                            <h4 class="primary--text">Today's Sales Summary</h4>
                        </div>
                        <v-divider></v-divider>
                        <div class="pt-2">
                            <p class="d-flex align-center"><span>Sub Total</span> <span class="amount"> : {{formatAmount1(order.sub_total)}} </span></p>
                            <p class="d-flex align-center"><span>Tax</span> <span class="amount"> : {{formatAmount1(order.tax)}} </span></p>
                            <!-- <v-divider class="mb-3 mt-2"></v-divider>
                            <h5 class="text-uppercase primary--text">Available Fund : {{formatAmount1(order.total_available)}} </h5>
                                <v-divider class="mb-3 mt-2"></v-divider> -->
                            <p class="d-flex align-center"><span>Convenience fee</span> <span class="amount"> : {{formatAmount1(order.convenience_fee)}} </span></p>
                            <p class="d-flex align-center"><span>Service fee</span> <span class="amount"> : {{formatAmount1(order.service_charge)}} </span></p>
                            <v-divider class="mb-3 mt-2"></v-divider>
                            <h5 class="text-uppercase primary--text">Total Sales : {{formatAmount1(order.total)}} </h5>
                            <!-- <v-divider class="mb-3 mt-2"></v-divider>
                            <p class="d-flex align-center"><span>Cash Sales</span> <span class="amount"> : {{formatAmount1(order.cash_sales)}} </span></p>
                            <p class="d-flex align-center"><span>Card Sales</span> <span class="amount"> : {{formatAmount1(order.card_sales)}} </span></p>
                            <v-divider class="mb-3 mt-2"></v-divider> -->
                            <!-- <h5 class="text-uppercase primary--text">Transferred Amount : {{formatAmount1(order.payout)}} </h5> -->
                        </div>
                    </div>
                </v-col>

               </v-row>
            </div>
            <div v-else class="mt-10 text-center">
                <div v-if="loading">
                    <ComponentLoadingVue/>
                </div>
                <div v-else class="unavailable">
                    <p>No orders</p>
                </div>
            </div>
            <!-- <OrderDetail :dialog-order-detail="dialogOrderDetail" @close="handleClose" :order="orderItem"/> -->
        </v-container>
         <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/Topnavbar'
import Bottomnavbar from '@/components/layout/NavbarBottomVendor'
import { ApiService } from '@/core/services/api.service'
// import OrderDetail from '@/views/vendor/order/VendorOrderDetail'

import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
    name:'OrdersPage',
    data() {
        return {
            title:'',
            loading:false,
            order:{},
        }
    },
    mounted() {
        this.fetchOrders();
    },
    methods: {

        handleBack(){
            this.$router.back();
        },
        async fetchOrders() {
            this.orders = [];
            this.loading = true;
            await ApiService.post("/sales-summary")
            .then((resp) => {
                this.order = resp.total_amount;
            })
            .catch((error) => {
                this.loading = false;
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(error);
            })
        },
      
        handleRoute(route){
            this.$router.push("/"+route);
        },
        handleActive(item, index){
            this.active_index = index;
            // this.status = item.status.status;
            console.log(item);
            this.fetchOrders();
        },
        handleView(order){
            this.orderItem = order;
            this.dialogOrderDetail = true;
        },
        viewDetailPage(order){
            this.$router.push({name:'OrderDetailPage', params:{orderId: order.order_id}});
        },
        handleClose(){
            this.dialogOrderDetail = false;
            this.fetchOrders();
        },
        selectedDate(date){
            this.pickup_date = moment(date.date).format('YYYY-MM-DD');
        },
        handleSearch(){
            this.fetchOrders();
        }
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        // OrderDetail,
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
        // OrderStatus: ()=> import('@/components/OrdersStatusSlider.vue')
    },
    computed: {
        ...mapGetters({currentUser:'auth/user'}),
    }
}
</script>
<style lang="scss" scoped>

</style>