<template>
    <div>
        <v-row justify="center">
            <v-dialog v-model="dialogOrderDetail" persistent scrollable fullscreen>
                <v-card class="background-image" style="padding-top: 56px !important;">
                    <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                        <!-- <v-btn icon @click="handleClose">
                            <v-icon>mdi-close</v-icon>
                        </v-btn> -->
                        <v-toolbar-title>{{ orderDetail.order_no }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn text @click="handleClose">
                                Close
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <div class="pb82 p-relative background-image">
                        <template v-if="orderDetail && Object.keys(orderDetail).length">
                            <div class="custom-bs pa-4">
                                <h5 class="text-uppercase">{{ orderDetail && orderDetail.fname ?orderDetail.fullName : (orderDetail && orderDetail.client ?orderDetail.client.fullName: '') }}</h5>
                                <p class="mb-1"> <v-icon color="primary">mdi-phone</v-icon> {{ orderDetail && orderDetail.client.contact.phone_no ? orderDetail.client.contact.phone_no :orderDetail.client.contact.phone_no }}</p>
                                <p class="mb-1"> <v-icon color="primary">mdi-email</v-icon> {{ orderDetail.client.contact.email}}</p>
                                <div class="d-flex flex-start" v-if="orderDetail.pickup_addr">
                                    <v-icon color="primary" class="w-18">mdi-map-marker</v-icon>
                                    <div>
                                        <p class="mb-1">{{orderDetail.pickup_addr ? orderDetail.pickup_addr.add1 :''}}</p>
                                        <p class="mb-1">
                                            {{ orderDetail.pickup_addr ? orderDetail.pickup_addr.city : '' }}
                                            {{ orderDetail.pickup_addr ? orderDetail.pickup_addr.state : '' }}
                                            {{ orderDetail.pickup_addr ? orderDetail.pickup_addr.zip : '' }}
                                        </p>
                                    </div>

                                </div>
                                <div>
                                    <v-btn fab small color="primary"><v-icon>{{  icon_chat }}</v-icon></v-btn>
                                </div>
                            </div>
                            <div class="custom-bs pa-4 mt-4">
                                <div class="d-flex align-center justify-space-between pb-4">
                                    <h5 class="ma-0">ORDER: {{ orderDetail.order_no }} </h5>
                                    <v-chip class="text-capitalize" color="accent" small>{{
                                        orderDetail.status
                                    }}</v-chip>
                                </div>
                                <v-divider class="pt-4"></v-divider>
                                <div class="order-item-wrapper">
                                    <ul class="main-items mt-4">
                                        <li v-for="(item, index) in orderDetail.items" :key="index">
                                            <div>
                                                <div class="d-flex">
                                                    <div class="mr-2">
                                                        <v-img
                                                            :src="base_url + '/image-show/' + item.menu_item.profile_pic"
                                                            :lazy-src="`https://picsum.photos/10/6?image=15`"
                                                            class="grey lighten-2 mt-1" max-height="70" max-width="80"
                                                            contain>
                                                        </v-img>
                                                    </div>
                                                    <div class="item-description">
                                                        <div>
                                                            <h4 class="text-capitalize mb-0">{{ item.menu_item.name }}
                                                            </h4>
                                                            <p class="text-capitalize mb-1">Quatity : {{item.quantity}}
                                                            </p>
                                                            <p class="">{{formatAmount(item.menu_item.price *item.quantity)}}</p>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div v-if="item.varients && item.varients.length > 0">
                                                    <h5 class="mb-2 text-uppercase">Addional Items</h5>
                                                    <v-divider></v-divider>
                                                    <ul class="additional-items pt-6">
                                                        <li v-for="(variant, index) in item.varients" :key="index">
                                                            <div>
                                                                <div class="d-flex justify-space-between">
                                                                    <p class="text-capitalize">{{variant.variant_item.name}}</p>
                                                                    <p class="item-name">{{formatAmount(variant.amount)}}</p>
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
                                                        <td class="">Sub Total</td>
                                                        <td class=" text-right">{{ formatAmount(orderDetail.amount) }}
                                                        </td>
                                                    </tr>
                                                    <tr v-if="Number(orderDetail.service_charge)">
                                                        <td class="">Service Charge</td>
                                                        <td class="text-right">
                                                            {{ formatAmount(orderDetail.service_charge) }}</td>
                                                    </tr>
                                                    <tr v-if="Number(orderDetail.tax_amt)">
                                                        <!-- <td class="">Tax ({{ totalData.tax_amount}} %)</td> -->
                                                        <td class="">Tax</td>
                                                        <td class="text-right">{{ formatAmount(orderDetail.tax_amt) }}
                                                        </td>
                                                    </tr>
                                                    <tr v-if="Number(orderDetail.convenience_fee)">
                                                        <td class="">Convenience fee</td>
                                                        <td class="text-right">
                                                            {{ formatAmount(orderDetail.convenience_fee) }}</td>
                                                    </tr>
                                                    <tr v-if="Number(orderDetail.tips_amount)">
                                                        <td class="">Tip</td>
                                                        <td class="text-right">{{
                                                            formatAmount(orderDetail.tips_amount)
                                                        }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="">Total </td>
                                                        <td class=" text-right">
                                                            {{ formatAmount(orderDetail.total_amount) }}</td>
                                                    </tr>
                                                </table>
                                                <div class="text-right mt-4" v-if="orderDetail.payment">
                                                    <p v-if="orderDetail.payment.payment_type.toLowerCase() == 'cash'"
                                                        class="payment text-uppercase color-secondary ">Not Paid</p>
                                                    <p v-else class="payment color-primary ">Paid by: <span
                                                            class="text-uppercase">{{
                                                                orderDetail.payment.payment_type
                                                            }}</span>
                                                        ****{{ orderDetail.payment.cr_last4 }}</p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="unavailable">
                                <h3>{{ message }}</h3>
                            </div>
                        </template>
                    </div>
                    <div class="pa-4 custom-bs" style="position: fixed;bottom: 0;width: 100%;z-index: 1;" v-if="order.status!='completed'">
                        <div class="d-flex align-center justify-space-between">
                            <div v-if="order && order.status == 'new'"
                                class="d-flex align-center justify-space-between w-100">
                                <v-btn rounded :disabled="disableButton" color="error"
                                    @click="onClick('archive')">archive</v-btn>
                                <v-btn v-if="order && order.status == 'new'" rounded :disabled="disableButton"
                                    color="accent" @click="onClick('ready')">Ready For pickup</v-btn>
                            </div>

                            <div v-if="order && order.status == 'ready'"
                                class="d-flex align-center justify-space-between w-100">
                                <v-btn rounded :disabled="disableButton" color="error"
                                    @click="onClick('archive')">archive</v-btn>
                                <v-btn rounded :disabled="disableButton" color="accent"
                                    @click="onClick('completed')">completed</v-btn>
                            </div>
                        </div>
                    </div>
                </v-card>
            </v-dialog>
        </v-row>
        <DialogConfirm :dialog-confirm="dialogConfirm" @handleConfirm="handleSubmit" @close="handleCloseConfirm" />
    </div>
</template>
<script>
import DialogConfirm from '@/components/layout/DialogConfirm';
import { mdiArrowLeft, mdiClose, mdiMessage } from '@mdi/js'
import { ApiService } from '@/core/services/api.service'
import moment from 'moment'
import { base_url } from '@/core/services/config'
import { mapGetters } from 'vuex'
export default {
    props: {
        dialogOrderDetail: {
            required: true,
            type: Boolean,
        },
        order: {
            required: true,
        }
    },
    watch: {
        dialogOrderDetail(newval) {
            if (newval) {
                this.fetchOrderDetail();
                this.disableButton = false;
            } else {
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
            title: 'Order Detail',
            base_url,
            dialogConfirm: false,
            iconClose: mdiClose,
            icon_chat: mdiMessage,
            disableButton: false,
            moment,
            iconBack: mdiArrowLeft,
            orderDetail: {},
            items: {},
            render: false,
            subTotal: 0,
            taxPercent: 0,
            taxAmount: 0,
            grandTotal: 0,
            paymentBy: '-',
            lastDigit: '-',
            tips: 0,
            dialogAddressType: false,
            loadingAddressType: true,
            addressType: '',
            orderStatus: '',
            totalData: {},
            message: 'Loading...',
        }
    },
    methods: {
        async fetchOrderDetail() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            if (!this.order || this.order.order_id == undefined) return;
            await ApiService.post('/order/detail', { order_id: this.order.order_id, vendor_id: this.currentUser.vendor_id })
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
        onClick(status) {
            this.orderStatus = status;
            this.dialogConfirm = true;
        },
        handleCloseConfirm() {
            this.dialogConfirm = false;
        },
        async handleSubmit() {
            this.$bus.$emit('SHOW_PAGE_LOADER')
            await ApiService.post('/order/update-status', {
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
        handleClose() {
            this.$emit('close')
        },
        handleChangeType(orderType) {
            this.addressType = orderType;
            this.dialogAddressType = true;
        },
        async handleChangeAddressType(orderType) {
            await ApiService.post('/order/update-type', { order_id: this.order.order_id, order_type: orderType.type })
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
            currentUser: 'auth/user',
        })
    }
}
</script>
<style lang="scss" scoped>
$bg-gray : #f5f5f5;

.qty {
    color: rgb(162 162 162);
    font-size: 0.8rem;
    text-transform: lowercase;
}

.text-bold {
    font-weight: 500;
    color: #01a6bc;
}

.testing {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    button {
        width: 50%;
    }
}

.h-100 {
    height: 100% !important;
}

.address-type {
    text-decoration: underline;
    cursor: pointer;
}

.box-bg {
    border: 1px solid #f5f5f5;
    padding: 20px;
    // height: 100%;
    position: relative;
    color: #000;
    margin-top: 30px;
}

.name-address {
    font-weight: 600;
    margin: 0px;
    font-size: 0.9rem;
}

.sub-text {
    margin: 0px;
    font-size: 0.9rem;
}

.order-item-wrapper {
    ul.main-items {
        list-style: none;
        padding: 0;

        li:not(:last-child) {
            margin-bottom: 16px;
            border-bottom: 1px solid #dadada;
            padding-bottom: 16px;
        }

        li {
            .item-description {
                width: 100%;
            }

            ul.additional-items {
                list-style: none;
                padding: 0;

                li {
                    border: 0;
                    padding: 0;
                    margin: 0;

                    // p {
                    //     padding: 0;
                    //     margin: 0;
                    // }

                    // p.item-name {
                    //     font-size: 0.8rem;
                    //     font-weight: 400;
                    // }
                }
            }
        }
    }
}

.menu-name {
    font-size: 0.9rem !important;
    padding: 10px 16px !important;
}

.card-actions {
    padding: 0 14px 14px 14px !important;
}
</style>