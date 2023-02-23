<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar/>
        <v-container class="mg56">
            <div>
                <div>
                    <OrderStatus :items="orderTypes" @selectedStatus="handleActive"/>
                </div>
            </div>
            <div v-if="orders && Object.keys(orders).length">
                <div v-for="(dateWiseOrders, date) in orders" :key="date">
                    <div>
                        <h5 class="mt-6 pl-1 mb-1 text-uppercase">{{ formatDateStandard(date) }}</h5>
                    </div>
                    <v-row v-if="dateWiseOrders && dateWiseOrders.length > 0">
                        <v-col cols="12" v-for="(order, i) in dateWiseOrders" :key="i">
                            <div class="custom-bs pa-4 d-flex align-center justify-space-between" @click="viewDetailPage(order)">
                                <div>
                                    <p class="mb-0 primary--text" style="font-size:13px; font-weight: 600;">{{ order.order_no }}</p>
                                    <p class="mb-0 text-capitalize">{{ order.customer_name }}</p>
                                    <p class="mb-0" style="font-size:13px; font-weight: 500;">{{ order.phone }}</p>
                                </div>
                                <div class="text-right">
                                    <h4 class="primary--text">{{ formatAmount(order.total_amount) }}</h4>
                                    <v-chip small class="text-capitalize" color="primary">{{ order.status }}</v-chip>
                                </div>
                                <!-- <div>
                                    <v-btn fab small color="primary" @click="viewDetailPage(order)"><v-icon>{{icon_right}}</v-icon></v-btn>
                                </div> -->
                            </div>
                            <!-- <div class="order_item custom-bs" >
                                <h4>{{order.order_no}}</h4>
                           
                                <div class="d-flex justify-space-between">
                                    <div @click="viewDetailPage(order)">
                                        <p class="mb-2">{{formatDateToDay(order.pickup_date)}} {{formatTimeOnly(order.pickup_time)}}</p>
                                        <p class="mb-0">{{order.truck_name}}</p>
                                        <p class="order_contact">{{formatPhoneNumber(order.truck_phone)}}</p>
                                        <v-chip class="accent text-capitalize mt-2">{{order.status}}</v-chip>
                                    </div>
                                    <div>
                                        <div class="mt-2">
                                            <v-btn fab outlined small @click="gotoVendorChat(order)" color="primary" rounded><v-icon>{{iconChat}}</v-icon></v-btn>
                                        </div>
                                    </div>
                                </div>
                             
                               
                            </div> -->
                        </v-col>
                    </v-row>
                </div>
            </div>
            <div v-else class="mt-10 text-center">
                <div v-if="loading">
                    <ComponentLoadingVue/>
                </div>
                <div v-else class="unavailable">
                    <p>No orders</p>
                </div>
            </div>
        </v-container>
         <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/Topnavbar'
import Bottomnavbar from '@/components/layout/NavbarBottomClient'
import { ApiService } from '@/core/services/api.service'

import { mdiChat, mdiChevronRight } from '@mdi/js'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
    name:'OrdersPage',
    data() {
        return {
            title:'',
            loading:false,
            icon_right:mdiChevronRight,
            moment,
            valid:true,
            content:'no content',
             tab:0,
            dialogOrderDetail:false,
            status:'new',
            iconChat:mdiChat,
            orderItem:{},
            // vendor_id:3,
            activeItem:0,
            activeType:0,
            orders:[],
            pickup_date: new Date().toISOString().substr(0, 10), 
            orderTypes: [
                {name:'New',active_type:true,icon:'mdi-cart-arrow-down',component:'order-new',status:'new'},
                {name:'Accepted',active_type:false,icon:'mdi-refresh',component:'order-processing',status:'accepted'},
                // {name:'Preparing',active_type:false,icon:'mdi-refresh',component:'order-preparing',status:'preparing'},
                {name:'Ready',active_type:false,icon:'mdi-cart-minus',component:'order-ready',status:'ready'},
                {name:'Completed',active_type:false,icon:'mdi-cart-minus',component:'order-completed',status:'completed'},
                {name:'Cancel',active_type:false,icon:'mdi-cart-minus',component:'order-cancelled',status:'cancelled'},
            ],
            refresh_time:10000,
        }
    },
    mounted() {
        // if(this.currentUser){
        //     if(this.currentUser.table == 'clients'){
        //         this.orderTypes = this.otClient;
        //         this.status = "recent-orders";
        //     }else{
        //         this.orderTypes = this.otVendor;
        //     }
        // }
        this.fetchOrders();
    },
    methods: {
        gotoVendorChat(order){
            this.$router.push("/conversation/vendor/"+order.vendor_id);
        },
        handleBack(){
            this.$router.back();
        },
        async fetchOrders() {
            this.orders = [];
            this.loading = true;
            await ApiService.post("/order-list",{
                'status': this.status
            })
            .then((resp) => {
                this.loading = false;
                this.orders = resp.data;
                this.loaderHide();
            })
            .catch((error) => {
                this.loading = false;
                this.loaderHide();
                console.log(error);
            })
        },
        async refetchOrders() {
            this.loaderShow();
            await ApiService.post("/order-list",{
                'status': this.status
            })
            .then((resp) => {
                this.loaderHide();
                this.orders = resp.data;
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        },
        handleRoute(route){
            this.$router.push("/"+route);
        },
        handleActive(item, index){
            this.activeType = index;
            this.status = item.status.status;
            this.fetchOrders();
        },
        handleView(order){
            this.orderItem = order;
            this.dialogOrderDetail = true;
        },
        viewDetailPage(order){
            this.$router.push({name:'clientOrderDetailPage', params:{orderId: order.order_id}});
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
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
        OrderStatus: ()=> import('@/components/OrdersStatusSlider.vue')
    },
    computed: {
        ...mapGetters({currentUser:'auth/user'}),
    }
}
</script>
<style lang="scss" scoped>
.payment {
    padding: 0;
    margin: 0;
    font-size: 0.8rem;
    font-weight: 600;
    // margin-top:14px;
    text-align: right;
}
.sticky-top{
    position: sticky;
    top: 56px;
    z-index: 1;
    background: #fff;
    padding: 12px;
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
        // .order_no{
        //     margin: 0;
        //     font-size: 0.8rem;
        //     font-weight: 600;
        //     // color: #01a6bc;
        //     display:flex;
        //     justify-content:space-between;
        //     margin-bottom:8px;
        //     // flex-direction:column;
        //     span.amount{
        //         font-size: 0.8rem;
        //     }
        // }
        // .order_person,
        // .order_contact,
        // .order_bill,
        // .order_date{
        //     margin: 0;
        //     font-size: 0.8rem;
        //     text-transform: capitalize;
        // }
    }
</style>