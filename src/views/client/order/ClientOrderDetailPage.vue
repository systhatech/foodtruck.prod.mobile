<template>
    <v-container class="ma-0 pa-0 background-image mb-14 h-100">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="pb-12">
            <v-row>
                <v-col cols="12" sm="12" md="12" lg="12" xl="12" v-if="render" >
                    <v-row>
                        <v-col cols="12" md="12" lg="12" xl="8" offset-xl="2">
                            <v-row>
                                <v-col cols="12">
                                    <div class="custom-bs pa-4 mb-4">
                                        <div class="mb-4">
                                            <h5 class="name-address mb-2 text-uppercase primary--text">{{ orderDetail && orderDetail.vendor ? orderDetail.vendor.name :'' }}</h5>
                                            <p class="mb-0"> <v-icon color="primary" class="w-18">{{iconPhone}}</v-icon> {{ orderDetail && orderDetail.vendor.contact && orderDetail.vendor.contact.phone ? orderDetail.vendor.contact.phone : orderDetail.vendor.contact.phone_no }}</p>
                                            <p class="mb-0"> <v-icon color="primary" class="w-18">{{iconEmail}}</v-icon> {{ orderDetail && orderDetail.vendor && orderDetail.vendor.contact?orderDetail.vendor.contact.email :'unavailable'}}</p>
                                        </div>
                                        <h5 class="name-address mb-2 text-uppercase primary--text">Pickup Address</h5>
                                        <div class="d-flex align-start" v-if="orderDetail.pickup_addr">
                                            <v-icon color="primary" class="w-18">{{iconLocation}}</v-icon>
                                            <div>
                                                <p class="mb-0">{{ orderDetail.pickup_addr ? orderDetail.pickup_addr.add1 :'' }}</p>
                                                <p class="" >
                                                    {{ orderDetail.pickup_addr? orderDetail.pickup_addr.city:'' }}
                                                    {{ orderDetail.pickup_addr? orderDetail.pickup_addr.state:'' }} 
                                                    {{ orderDetail.pickup_addr? orderDetail.pickup_addr.zip:'' }}
                                                </p>
                                                <div class="mt-4">
                                                    <v-btn fab color="primary" class="mr-2" :href="`tel:${orderDetail.vendor.contact.phone_no ?orderDetail.vendor.contact.phone_no : orderDetail.vendor.contact.mobile_no}`" small><v-icon>{{ iconPhone }}</v-icon> </v-btn>
                                                    <v-btn fab color="primary" :to="'/client/conversation/vendors/'+orderDetail.vendor_id" small><v-icon>{{ iconChat }}</v-icon> </v-btn>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                     <div class="order-item-wrapper pa-4  custom-bs">
                                        <div class="d-flex align-center justify-space-between">
                                            <h5 class="text-uppercase primary--text">ORDER: {{orderDetail.order_no}} </h5> 
                                            <v-chip class="text-capitalize" color="accent" small>{{orderDetail.status}}</v-chip>
                                        </div>
                                        <div class="pb-2">
                                            <p class="f8 text-uppercase">{{ formatDateToDay(orderDetail.pickup_date)}}</p>
                                        </div>
                                        <v-divider></v-divider>
                                 
                                        <ul class="main-items mt-4">
                                            <li v-for="(item,index) in orderDetail.items" :key="index">
                                                <div>
                                                    <div class="d-flex">
                                                        <div class="mr-2">
                                                            <v-img
                                                                :src="base_url+'/image-show/'+item.menu_item.profile_pic"
                                                                :lazy-src="`https://picsum.photos/10/6?image=15`"
                                                                class="grey lighten-2"
                                                                max-height="70"
                                                                max-width="80"
                                                                contain
                                                            >
                                                                <template v-slot:placeholder>
                                                                <v-row
                                                                    class="fill-height ma-0"
                                                                    align="center"
                                                                    justify="center"
                                                                >
                                                                    <v-progress-circular
                                                                    indeterminate
                                                                    color="grey lighten-5"
                                                                    ></v-progress-circular>
                                                                </v-row>
                                                                </template>
                                                            </v-img>
                                                        </div>
                                                        <div class="item-description">
                                                            <div>
                                                                <h5 class="text-uppercase primary--text mb-0">{{ item.menu_item.name }}</h5>
                                                                <p class="text-capitalize mb-1">Quatity : {{ item.quantity }}</p>
                                                                <h4 class="primary--text">{{ formatAmount(item.menu_item.price * item.quantity) }}</h4>
                                                            </div>
                                                        
                                                        </div>
                                                    </div>
                                                    <div v-if="item.varients && item.varients.length>0">
                                                        <ul class="additional-items mb-3">
                                                            <li v-for="(variant, index) in item.varients" :key="index">
                                                                <div>
                                                                    <div class="d-flex justify-space-between">
                                                                        <p class="text-capitalize">{{ variant.variant_item.name }}</p>
                                                                        <p class="">{{ formatAmount(variant.amount) }}</p>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                        <v-divider class="mt-5"></v-divider>
                                        <div class="pt-4 pb-2">
                                            <v-row>
                                                <v-col cols="12" md="6" lg="6" xl="6">
                                                     <table class="w-100">
                                                        <tr>
                                                            <td class="">Sub Total</td>
                                                            <td class=" text-right">{{ formatAmount(orderDetail.amount)}}</td>
                                                        </tr>
                                                        <tr v-if="Number(orderDetail.service_charge)">
                                                            <td class="">Service Charge</td>
                                                            <td class="text-right">{{formatAmount(orderDetail.service_charge)}}</td>
                                                        </tr>
                                                        <tr v-if="Number(orderDetail.tax_amt)">
                                                            <!-- <td class="">Tax ({{ totalData.tax_amount}} %)</td> -->
                                                            <td class="">Tax</td>
                                                            <td class="text-right">{{formatAmount(orderDetail.tax_amt)}}</td>
                                                        </tr>
                                                        <tr v-if="Number(orderDetail.convenience_fee)">
                                                            <td class="">Convenience fee</td>
                                                            <td class="text-right">{{formatAmount(orderDetail.convenience_fee)}}</td>
                                                        </tr>
                                                        <tr v-if="Number(orderDetail.tips_amount)">
                                                            <td class="">Tip</td>
                                                            <td class="text-right">{{formatAmount(orderDetail.tips_amount)}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td class=""><h4 class="text-uppercase primary--text">Total</h4> </td>
                                                            <td class=" text-right"><h4 class="text-uppercase primary--text">{{formatAmount(orderDetail.total_amount)}}</h4> </td>
                                                        </tr>
                                                    </table>
                                                    <div class="text-right mt-4" v-if="orderDetail.payment">
                                                        <p v-if="orderDetail.payment.payment_type.toLowerCase() == 'cash'" class="payment text-uppercase color-secondary f8-bold mb-0">Not Paid</p>
                                                        <p v-else class="payment success--text f8-bold mb-0">PAID BY: <span class="text-uppercase">{{orderDetail.payment.payment_type}}</span> ****{{orderDetail.payment.cr_last4}}</p>
                                                        <span class="f9">{{ formatDateTime(orderDetail.payment.created_at) }}</span>
                                                    </div>
                                                </v-col>
                                            </v-row>
                                        </div>
                                    </div>
                                   
                                   
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" sm="12" md="12" lg="12" xl="12" v-else>
                    <div v-if="loading" class="text-center">
                        <ComponentLoadingVue/>
                    </div>
                    <div v-else class="unavailable">
                        <h3>{{ message }}</h3>
                    </div>
                </v-col>
            </v-row>
        </v-container>
        <Bottomnavbar/>
    </v-container>
</template>
<script>

import { mdiArrowLeft, mdiClose,mdiMapMarker, mdiCalendar,mdiClock, mdiPhone, mdiEmail, mdiChat } from '@mdi/js'
import { ApiService } from '@/core/services/api.service'
import moment from 'moment'
import { base_url } from '@/core/services/config'
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import Bottomnavbar from '@/components/layout/NavbarBottomClient'
import { mapGetters } from 'vuex'

export default {
    data() {
       return {
            title:'',
            loading:false,
            iconLocation:mdiMapMarker,
            iconDate:mdiCalendar,
            iconTime:mdiClock,
            iconEmail:mdiEmail,
            iconChat:mdiChat,
            iconPhone: mdiPhone,
            indexValue:1,
            base_url,
            dialogConfirm:false,
            iconClose: mdiClose,
            disableButton:false,
            moment,
            iconBack: mdiArrowLeft,
            orderDetail:{},
            items:{},
            render: false,
            subTotal: 0,
            taxPercent: 0,
            taxAmount: 0,
            grandTotal : 0,
            paymentBy:'-',
            lastDigit:'-',
            tips : 0,
            dialogAddressType:false,
            loadingAddressType:true,
            addressType:'',
            orderStatus:'',
            orderId:'',
            totalData:{},
            message:'Loading...'
        }
    },
    mounted() {
        this.orderId = this.$router.currentRoute.params.orderId;
        this.fetchOrderDetail();
    },
     components: {
        Topnavbar,
        Bottomnavbar,
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
        // OrderDetail
        // InputUpload
    },
    methods: {
        async fetchOrderDetail(){
            this.loading = true;
            // this.$bus.$emit('SHOW_PAGE_LOADER');
            if(!this.orderId) return;
            await ApiService.post('/order/detail', { 
                order_id: this.orderId, 
                vendor_id: this.currentUser.owner.vendor_id
            })
            .then((response) => {
                this.loading = false;
                this.orderDetail = response.data;
                this.totalData = response.totalData;
                if(this.orderDetail){
                    this.message = "Data not found";
                }
                this.render = true;
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch(() => {
                this.loading = false;
                this.message = "Data not found";
                this.$bus.$emit('HIDE_PAGE_LOADER');
            });
        },
        // handleConfirm
        onClick(status){
            this.orderStatus = status; 
            this.dialogConfirm = true;
        },
        handleCloseConfirm(){
            this.dialogConfirm = false;
        },
        async handleSubmit(){
            this.$bus.$emit('SHOW_PAGE_LOADER')
            await ApiService.post('/order/update-status',{ 
                order_id: this.order.order_id, 
                status: this.orderStatus,
                client_id: this.currentUser.id,
            })
            .then((resp) => {
                this.$emit('refreshOrders');
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageSuccess(resp.message);
                this.disableButton = true;
                this.handleClose();
                this.handleCloseConfirm();
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError("Failed to change status");
            });
        },
        handleClose(){
            this.$emit('close')
        },
       handleChangeType(orderType){
           this.addressType = orderType;
           this.dialogAddressType = true;
       },
       async handleChangeAddressType(orderType){
           await ApiService.post('/order/update-type',{ order_id: this.order.order_id, order_type: orderType.type })
           .then(() => {
                this.fetchOrderDetail();
           })
           .catch(() => {
           });
       },
       handleBack() {
           this.$router.back();
       }
   },
   computed: {
       ...mapGetters({currentUser:'auth/user'})
   }
}
</script>
<style lang="scss" scoped>
$bg-gray : #f5f5f5;
.qty{
    color: rgb(162 162 162);
    font-size: 0.8rem;
    text-transform: lowercase;
}
.text-bold{
    font-weight: 500;
    color: #01a6bc;
}
.testing{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    button{
        width:50%;
    }
}
.h-100{
    height:100% !important;
}
.address-type{
    text-decoration: underline;
    cursor: pointer;
}
.box-bg{
    border: 1px solid #f5f5f5;
    padding: 20px;
    // height: 100%;
    position: relative;
    color: #000;
    margin-top: 30px;
}
.name-address{
    font-weight: 600;
    margin: 0px;
    font-size: 0.9rem;
}
.sub-text{
    margin: 0px;
    font-size: 0.9rem;
}
.order-item-wrapper{
    ul.main-items{
        list-style: none;
        padding:0;

        li:not(:last-child){
            margin-bottom: 16px;
            border-bottom: 1px solid #dadada;
            padding-bottom: 6px;
        }
        li{
            .item-description{
                width:100%;
                p.item-name{
                    font-size: 0.9rem;
                    font-weight: 400;
                    color: #0b0b0b;
                }
            }
            ul.additional-items{
                padding: 0;
                list-style: none;
                li{
                    border:0;
                    padding:0;
                    margin:0;
                    p{
                        padding:4px 0;
                        margin:0;
                    }
                    p.item-name{
                        font-size: 0.8rem;
                        font-weight: 400;
                    }
                }
            }
        }
    }
}
.menu-name{
    font-size: 0.9rem !important;
    padding: 10px 16px !important;
    // background:$bg-gray !important;
}
.card-actions{
    padding: 0 14px 14px 14px !important;
}
</style>