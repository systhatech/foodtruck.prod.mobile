<template>
    <div>
        <v-row justify="center">
            <v-dialog
            v-model="dialogOrderDetail"
            persistent
            scrollable
            fullscreen
            >
                <v-card>
                    <v-card-title class="menu-card-title">
                        <div class="w-100 justify-space-between d-flex">
                            <h3 class="text-primary w-100 text-uppercase">Order Detail</h3>
                            <div @click="handleClose" small class="mx-auto"> <v-icon> {{ iconClose }} </v-icon></div>
                        </div>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="pa-4">
                        <template v-if="orderDetail && Object.keys(orderDetail).length">
                            <div class="custom-bs pa-4">
                                <h3 class="name-address f8-bold mb-3">{{ orderDetail && orderDetail.fname ? orderDetail.fullName : (orderDetail && orderDetail.client ? orderDetail.client.fullName :'') }}</h3>
                                <p class="sub-text"> <v-icon color="primary">mdi-phone</v-icon> {{ orderDetail && orderDetail.client.contact.phone_no ? orderDetail.client.contact.phone_no : orderDetail.client.contact.phone_no }}</p>
                                <p class="sub-text"> <v-icon color="primary">mdi-email</v-icon> {{ orderDetail.client.contact.email }}</p>
                                <div class="d-flex flex-start" v-if="orderDetail.pickup_addr">
                                    <v-icon color="primary" class="w-18">mdi-map-marker</v-icon>
                                    <div>
                                        <p class="sub-text">{{ orderDetail.pickup_addr ? orderDetail.pickup_addr.add1 :'' }}</p>
                                        <p class="sub-text" >
                                            {{ orderDetail.pickup_addr? orderDetail.pickup_addr.city:'' }}
                                            {{ orderDetail.pickup_addr? orderDetail.pickup_addr.state:'' }} 
                                            {{ orderDetail.pickup_addr? orderDetail.pickup_addr.zip:'' }}
                                        </p>
                                    </div>
                                    
                                </div>
                            </div>
                            <div class="custom-bs pa-4 mt-4">
                                <div class="d-flex align-center justify-space-between pb-4">
                                    <h3 class="ma-0">ORDER: {{orderDetail.order_no}} </h3> 
                                    <v-chip class="text-capitalize" color="accent" small>{{orderDetail.status}}</v-chip>
                                </div>
                                <v-divider class="pt-4"></v-divider>
                                <div class="order-item-wrapper">
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
                                                            <h5 class="text-capitalize mb-0">{{ item.menu_item.name }}</h5>
                                                            <p class="f8 text-capitalize mb-1">Quatity : {{ item.quantity }}</p>
                                                            <p class="f8">{{ formatAmount(item.menu_item.price * item.quantity) }}</p>
                                                        </div>
                                                    
                                                    </div>
                                                </div>
                                                <div v-if="item.varients && item.varients.length>0">
                                                    <h5>Addional Items</h5>
                                                    <v-divider></v-divider>
                                                    <ul class="additional-items">
                                                        <li v-for="(variant, index) in item.varients" :key="index">
                                                            <div>
                                                                <div class="d-flex justify-space-between">
                                                                    <p class="text-capitalize f8-bold item-name">{{ variant.variant_item.name }}</p>
                                                                    <p class="item-name">{{ formatAmount(variant.amount) }}</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                    <v-divider class="mt-5"></v-divider>
                                    <div>
                                        <v-row>
                                            <v-col cols="12" md="6" lg="6" xl="6">

                                            </v-col>
                                            <v-col cols="12" md="6" lg="6" xl="6">
                                                    <table class="w-100">
                                                    <tr>
                                                        <td class="f8-bold">Sub Total</td>
                                                        <td class="f8-bold text-right">{{ formatAmount(orderDetail.amount)}}</td>
                                                    </tr>
                                                    <tr v-if="Number(orderDetail.service_charge)">
                                                        <td class="f8">Service Charge</td>
                                                        <td class="f8 text-right">{{formatAmount(orderDetail.service_charge)}}</td>
                                                    </tr>
                                                    <tr v-if="Number(orderDetail.tax_amt)">
                                                        <!-- <td class="f8">Tax ({{ totalData.tax_amount}} %)</td> -->
                                                        <td class="f8">Tax</td>
                                                        <td class="f8 text-right">{{formatAmount(orderDetail.tax_amt)}}</td>
                                                    </tr>
                                                    <tr v-if="Number(orderDetail.convenience_fee)">
                                                        <td class="f8">Convenience fee</td>
                                                        <td class="f8 text-right">{{formatAmount(orderDetail.convenience_fee)}}</td>
                                                    </tr>
                                                    <tr v-if="Number(orderDetail.tips_amount)">
                                                        <td class="f8">Tip</td>
                                                        <td class="f8 text-right">{{formatAmount(orderDetail.tips_amount)}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="f8-bold">Total </td>
                                                        <td class="f8-bold text-right">{{formatAmount(orderDetail.total_amount)}}</td>
                                                    </tr>
                                                </table>
                                                <div class="text-right mt-4" v-if="orderDetail.payment">
                                                    <p v-if="orderDetail.payment.payment_type.toLowerCase() == 'cash'" class="payment text-uppercase color-secondary f8-bold">Not Paid</p>
                                                    <p v-else class="payment color-primary f8-bold">Paid by: <span class="text-uppercase">{{orderDetail.payment.payment_type}}</span> ****{{orderDetail.payment.cr_last4}}</p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="unavailable">
                                <h3>{{message}}</h3>
                            </div>
                        </template>
                    </v-card-text>
                    <v-card-actions class="pa-0" v-if="orderDetail">
                        <div v-if="order && order.status == 'new'" class="testing">
                            <v-btn
                                tile
                                :disabled="disableButton"
                                color="error"
                                @click="onClick('archive')"
                                large
                                class=" pa-2"
                                >archive</v-btn
                            >
                            <v-btn
                                v-if="order && order.status == 'new'"
                                tile
                                :disabled="disableButton"
                                color="accent"
                                @click="onClick('ready')"
                                large
                                class=" pa-2"
                                >Ready For pickup</v-btn
                            >
                        </div>

                        <div v-if="order && order.status == 'ready'" class="testing">
                            <v-btn
                                tile
                                :disabled="disableButton"
                                color="error"
                                @click="onClick('archive')"
                                large
                                class=" pa-2"
                                >archive</v-btn
                            >
                            <v-btn
                                tile
                                :disabled="disableButton"
                                color="accent"
                                @click="onClick('completed')"
                                large
                                class=" pa-2"
                                >completed</v-btn
                            >
                        </div>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
        <DialogConfirm :dialog-confirm="dialogConfirm" @handleConfirm="handleSubmit" @close="handleCloseConfirm"/>
    </div>
</template>
<script>
import DialogConfirm from '@/components/layout/DialogConfirm';
import { mdiArrowLeft, mdiClose } from '@mdi/js'
import { ApiService } from '@/core/services/api.service'
import moment from 'moment'
import { base_url } from '@/core/services/config'
import { mapGetters } from 'vuex'
export default {
     props:{
        dialogOrderDetail:{
            required:true,
            type:Boolean,
        },
        order:{
            required:true,
        }
    },
    watch:{
        dialogOrderDetail(newval){
            if(newval){
                this.fetchOrderDetail();
                this.disableButton = false;
            }else{
                this.render = false;
            }
        }
    },
    components: {
        DialogConfirm,
        // NavbarClose
        // DialogAddressType
    },
    data() {
       return {
           title:'Order Detail',
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
           totalData:{},
           message:'Loading...',
        }
    },
    methods: {
        async fetchOrderDetail(){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            if(!this.order || this.order.order_id == undefined) return;
            await ApiService.post('/order/detail', { order_id: this.order.order_id, vendor_id: this.currentUser.vendor_id})
            .then((response) => {
                this.orderDetail = response.data;
                this.totalData = response.total;
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch(() => {
                this.message = "Failed to fetch order";
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
           this.$emit('close');
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
            padding-bottom: 16px;
        }
        li{
            .item-description{
                padding-left: 12px;
                width:100%;
                p.item-name{
                    font-size: 0.9rem;
                    font-weight: 400;
                    color: #0b0b0b;
                }
            }
            ul.additional-items{
                list-style: none;
                padding: 0;
                li{
                    border:0;
                    padding:0;
                    margin:0;
                    p{
                        padding:0;
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
}
.card-actions{
    padding: 0 14px 14px 14px !important;
}
</style>