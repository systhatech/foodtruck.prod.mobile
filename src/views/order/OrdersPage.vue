<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar/>
        <v-container v-if=" currentUser && (currentUser.table == 'clients')" class="mg56">
            <div>
                <v-chip v-for="(item, index) in orderTypes" class="mr-2" :color="activeType==index?'primary':''" :key="index" @click="handleActive(item, index)">
                    {{ item.name }}
                </v-chip>
            </div>
            <div v-if="orders && Object.keys(orders).length">
                <div v-for="(dateWiseOrders, date) in orders" :key="date">
                    <div>
                        <p class="mt-6 mb-1 f9-bold color-secondary">{{ formatDateStandard(date) }}</p>
                    </div>
                    <v-row v-if="dateWiseOrders && dateWiseOrders.length > 0">
                        <v-col cols="12" v-for="(order, i) in dateWiseOrders" :key="i">
                            <div class="order_item custom-bs" >
                                <p class="order_no"><span>{{order.order_no}}</span> 
                                <span class="amount"> {{formatAmount(order.total_amount)}} </span></p>
                                <div class="d-flex justify-space-between">
                                    <div @click="viewDetailPage(order)">
                                        <p class="order_person">Pickup Date : {{formatDateToDay(order.pickup_date)}} {{formatTimeOnly(order.pickup_time)}}</p>
                                        <p class="order_person">{{order.truck_name}}</p>
                                        <p class="order_contact">{{formatPhoneNumber(order.truck_phone)}}</p>
                                        <v-chip class="accent text-capitalize mt-2" small>{{order.status}}</v-chip>
                                    </div>
                                    <div>
                                        <div class="mt-2">
                                            <v-btn fab outlined small @click="gotoVendorChat(order)" color="primary" rounded><v-icon>{{iconChat}}</v-icon></v-btn>
                                        </div>
                                    </div>
                                </div>
                             
                               
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </div>
            <div v-else class="mt-10">
                <p>No orders</p>
            </div>
        </v-container>
        <v-container v-if="currentUser && (currentUser.table=='vendors')" class="mg56">
             <v-row class="sticky-top">
                <v-col cols="12">
                    <ul class="order-types">
                        <li v-for="(item, index) in orderTypes" :key="index" @click="handleActive(item, index)">
                            <span :class=" activeType == index ? 'active-type' :'' ">{{ item.name }}</span>
                        </li>
                    </ul>
                </v-col>
            </v-row>
            <div v-if="orders && Object.keys(orders).length" class="mt-3">
                <div v-for="(dateWiseOrders, date) in orders" :key="date">
                    <v-chip
                    class="mb-2 mt-6"
                    color="primary">
                    {{ formatDateStandard(date) }}
                    </v-chip>
                    <v-row v-if="dateWiseOrders && dateWiseOrders.length > 0">
                        <v-col cols="12" v-for="(order, i) in dateWiseOrders" :key="i">
                            <div class="order_item custom-bs" >
                                <p class="order_no"><span>{{order.order_no}}</span> <span class="amount"> {{formatAmount(order.total_amount)}} </span></p>
                                <div class="d-flex justify-space-between">
                                    <div>
                                        <!-- <p class="order_person">Pickup Date : {{formatDateToDay(order.pickup_date)}} {{formatTimeOnly(order.pickup_time)}}</p> -->
                                        <p class="order_person">{{order.customer_name}}</p>
                                        <p class="order_contact mb-2">{{formatPhoneNumber(order.phone)}}</p>
                                        <v-chip class="accent text-capitalize" small>{{order.status}}</v-chip>
                                    </div>
                                    <div>
                                        <div class="mt-2">
                                            <v-btn fab small @click="gotoChat(order)" color="primary" outlined><v-icon>{{iconChat}}</v-icon></v-btn>
                                        </div>
                                    </div>
                                </div>
                                <div class="pt-4">
                                    <v-btn block rounded color="primary" @click="handleView(order)" outlined>view</v-btn>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </div>
            <div v-else class="mt-10">
                <p>No Items</p>
            </div>
            <OrderDetail :dialog-order-detail="dialogOrderDetail" @close="handleClose" :order="orderItem"/>
        </v-container>
         <Bottomnavbar :value="indexValue"/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/Topnavbar'
import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
import { ApiService } from '@/core/services/api.service'
import OrderDetail from './OrderDetail'
import { mdiChat } from '@mdi/js'
// import InputUpload from '@/components/form-element/InputUpload'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
    name:'OrdersPage',
    data() {
        return {
            title:'',
            indexValue:1,
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
            orderTypes: [],
            otVendor: [
                {name:'New',active_type:true,icon:'mdi-cart-arrow-down',component:'order-new',status:'new'},
                // {name:'Processing',active_type:false,icon:'mdi-refresh',component:'order-processing',status:'preparing'},
                {name:'Ready',active_type:false,icon:'mdi-cart-minus',component:'order-ready',status:'ready'},
                {name:'Completed',active_type:false,icon:'mdi-cart-minus',component:'order-completed',status:'completed'},
            ],
            otClient: [
                {name:'Recent Orders',active_type:false,status:'recent-orders'},
                {name:'Past Orders',active_type:false,status:'completed'},
            ],
            refresh_time:10000,
        }
    },
    mounted() {
        if(this.currentUser){
            if(this.currentUser.table == 'clients'){
                this.orderTypes = this.otClient;
                this.status = "recent-orders";
            }else{
                this.orderTypes = this.otVendor;
            }
        }
        this.fetchOrders();
    },
    methods: {
        gotoChat(order){
            this.$router.push("/conversation/clients/"+order.client_id);
        },
        gotoVendorChat(order){
            this.$router.push("/conversation/vendor/"+order.vendor_id);
        },
        handleBack(){
            this.$router.back();
        },
        async fetchOrders() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post("/order-list",{
                'status': this.status
            })
            .then((resp) => {
                this.orders = resp.data;
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(error);
            })
        },
        async refetchOrders() {
             this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post("/order-list",{
                'status': this.status
            })
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.orders = resp.data;
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(error);
            })
        },
        handleRoute(route){
            this.$router.push("/"+route);
        },
        handleActive(item, index){
            this.activeType = index;
            this.status = item.status;
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
        OrderDetail
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
        .order_no{
            margin: 0;
            font-size: 0.8rem;
            font-weight: 600;
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