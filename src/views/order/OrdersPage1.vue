<template>
    <v-container class="ma-0 pa-0 background-image h-100">
        <Topnavbar :title="title" @back="handleBack"/>
          <v-container v-if="currentUser.table == 'clients'">
            <v-row style="position: sticky; top: 48px; z-index: 1; background: #fff;">
                <v-col cols="12">
                    <!-- <ul class="order-types"> -->
                        <v-chip v-for="(item, index) in orderTypes" :key="index" @click="handleActive(item, index)">
                            {{ item.name }}
                        </v-chip>
                    <!-- </ul> -->
                </v-col>
            </v-row>
            <div>
            <v-row style="position: sticky; top: 48px; z-index: 1; background: #fff;">
                <!-- <v-col cols="8"> -->
                    <!-- <InputDatePicker @selectedDate="selectedDate" name="pickup_date"/> -->
                <!-- </v-col> -->
                <!-- <v-col cols="4" class="d-flex align-center">
                    <v-btn small tile color="secondary" @click="handleSearch">Search</v-btn>
                </v-col> -->
            </v-row>
            </div>
            <!-- <div v-if="currentUser.">

            </div> -->
            <div v-if="orders && Object.keys(orders).length">
                <div v-for="(dateWiseOrders, date) in orders" :key="date">
                    <v-chip
                    class="mb-2 mt-6"
                    color="primary">
                    {{ formatDateStandard(date) }}
                    </v-chip>
                    <v-row v-if="dateWiseOrders && dateWiseOrders.length > 0">
                        <v-col cols="6" sm="6" md="3" v-for="(order, i) in dateWiseOrders" :key="i">
                            <v-card class="order_item" elevation="1" @click="handleView(order)">
                                <!-- {{order}} -->
                                <p class="order_no"><span>{{order.order_no}}</span> <span class="amount"> {{formatAmount(order.total_amount)}} </span></p>
                                <p class="order_person">Pickup Date : {{formatStandardDate(order.pickup_date)}}</p>
                                <p class="order_person">Pickup Time : {{formatTimeOnly(order.pickup_time)}}</p>
                                <p class="order_person">{{order.customer_name}}</p>
                                <p class="order_contact">{{formatPhoneNumber(order.phone)}}</p>
                            </v-card>
                        </v-col>
                    </v-row>
                </div>
            </div>
            <div v-else class="mt-2">
                <p>No result</p>
            </div>
            <!-- <OrderDetail :dialog-order-detail="dialogOrderDetail" @close="handleClose" :order="orderItem"/> -->
        </v-container>
        <v-container v-if="currentUser.table='vendors'">
             <v-row style="position: sticky; top: 48px; z-index: 1; background: #fff;">
                <v-col cols="12">
                    <ul class="order-types">
                        <li v-for="(item, index) in orderTypes" :key="index" @click="handleActive(item, index)">
                            <span :class=" activeType == index ? 'active-type' :'' ">{{ item.name }}</span>
                        </li>
                    </ul>
                </v-col>
            </v-row>
            <div>
            <v-row style="position: sticky; top: 48px; z-index: 1; background: #fff;">
                <!-- <v-col cols="8"> -->
                    <!-- <InputDatePicker @selectedDate="selectedDate" name="pickup_date"/> -->
                <!-- </v-col> -->
                <!-- <v-col cols="4" class="d-flex align-center">
                    <v-btn small tile color="secondary" @click="handleSearch">Search</v-btn>
                </v-col> -->
            </v-row>
            </div>
            <!-- <div v-if="currentUser.">

            </div> -->
            <div v-if="orders && Object.keys(orders).length">
                <div v-for="(dateWiseOrders, date) in orders" :key="date">
                    <v-chip
                    class="mb-2 mt-6"
                    color="primary">
                    {{ formatDateStandard(date) }}
                    </v-chip>
                    <v-row v-if="dateWiseOrders && dateWiseOrders.length > 0">
                        <v-col cols="6" sm="6" md="3" v-for="(order, i) in dateWiseOrders" :key="i">
                            <v-card class="order_item" elevation="1" @click="handleView(order)">
                                <!-- {{order}} -->
                                <p class="order_no"><span>{{order.order_no}}</span> <span class="amount"> {{formatAmount(order.total_amount)}} </span></p>
                                <p class="order_person">Pickup Date : {{formatStandardDate(order.pickup_date)}}</p>
                                <p class="order_person">Pickup Time : {{formatTimeOnly(order.pickup_time)}}</p>
                                <p class="order_person">{{order.customer_name}}</p>
                                <p class="order_contact">{{formatPhoneNumber(order.phone)}}</p>
                            </v-card>
                        </v-col>
                    </v-row>
                </div>
            </div>
            <div v-else class="mt-2">
                <p>No result</p>
            </div>
            <OrderDetail :dialog-order-detail="dialogOrderDetail" @close="handleClose" :order="orderItem"/>
        </v-container>
         <Bottomnavbar :value="indexValue"/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
import OrderDetail from './OrderDetail'
// import InputUpload from '@/components/form-element/InputUpload'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
    name:'EditProfile',
    data() {
        return {
            title:'',
            indexValue:0,
            moment,
            valid:true,
            content:'no content',
             tab:0,
            dialogOrderDetail:false,
            status:'new',
            orderItem:{},
            // vendor_id:3,
            activeType:0,
            orders:[],
            pickup_date: new Date().toISOString().substr(0, 10), 
            orderTypes: [
                {name:'New',active_type:true,icon:'mdi-cart-arrow-down',component:'order-new',status:'new'},
                // {name:'Processing',active_type:false,icon:'mdi-refresh',component:'order-processing',status:'preparing'},
                {name:'Ready',active_type:false,icon:'mdi-cart-minus',component:'order-ready',status:'ready'},
                {name:'Completed',active_type:false,icon:'mdi-cart-minus',component:'order-completed',status:'completed'},
            ],
            refresh_time:10000,
        }
    },
    mounted() {
        this.fetchOrders();
        console.log(this.currentUser);
    },
    methods: {
        handleBack(){
            this.$router.back();
        },
        async fetchOrders() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            // await ApiService.get(`/order/fetch?vendor_id=${this.currentUser.vendor.id}&status=${this.status}&pickup_date=${this.pickup_date}`)
            await ApiService.post("/order-list",{
                'status': this.status
            })
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.orders = resp.data;
                console.log(this.orders);
                // this.refresh_time = parseInt(resp.refresh_time);
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(error);
            })
        },
        async refetchOrders() {
             this.$bus.$emit('SHOW_PAGE_LOADER');
            // await ApiService.get(`/order/fetch?vendor_id=${this.currentUser.vendor.id}&status=${this.status}&pickup_date=${this.pickup_date}`)
            await ApiService.post("/order-list",{
                'status': this.status
            })
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.orders = resp.data;
                console.log(this.orders);
                // this.refresh_time = parseInt(resp.refresh_time);
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
.form-container{
    // .login-container{
    background: #acfa95;
    border-radius: 10px;
    margin-top: 27px !important;
    padding:20px;
// }
}
   $color-primary: #01a6bc;
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
                color: #01a6bc;
                border-bottom: 2px solid #01a6bc;
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
            font-weight: 500;
            color: #01a6bc;
            display:flex;
            justify-content:space-between;
            margin-bottom:8px;
            flex-direction:column;
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