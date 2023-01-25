<template>
    <div>
        <v-row justify="center">
            <v-dialog v-model="dialogMenuDetail" persistent scrollable fullscreen>
                <v-card class="background-image" style="padding-top: 56px !important;">
                    <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                        <v-toolbar-title class="pl-0 text-capitalize">{{ menu.name }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn text @click="handleClose">
                                Close
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <div class="p-relative background-image">
                        <div class="pa-4 text-center pt-6">
                            <v-btn color="primary" rounded outlined block to="/vendor-menu-item-add">add new menu item</v-btn>
                        </div>
                        <div class="pa-4">
                            <v-row>
                                <v-col cols="12" sm="6" md="6" v-for="(m, i) in menu.itemsGroup" :key="i">
                                    <h5 class="mb-2 text-uppercase">{{ i }}</h5>
                                    <div v-for="(item,index) in m" :key="index">
                                        <div class="mb-4">
                                            <div class="d-flex align-center custom-bs pa-3 pl-0" style="min-height:114px"> 
                                                <v-img
                                                lazy-src="https://picsum.photos/id/11/10/6"
                                                max-width="90"
                                                width="90"
                                                contain
                                                :src="item.profile_pic? base_url+'/image-show/'+item.profile_pic:'usericon'"
                                                ></v-img>
                                                <div class="pl-3 d-flex align-center justify-space-between w-100 h-100">
                                                    <div class="d-flex justify-space-between flex-column h-100">
                                                        <div>
                                                            <h5 class="text-uppercase primary--text">{{item.name}}</h5>
                                                            <p class="mb-1 f8 text-uppercase">({{item.itemCategory ? item.itemCategory:'n/a'}})</p>
                                                        </div>
                                                        <h4 class="primary--text">{{ formatAmount(item.price)}}</h4>
                                                    </div>
                                                    <div>
                                                        <v-btn fab small text @click="viewMenu(item.id)"> <v-icon color="primary">{{ icon_right }}</v-icon></v-btn>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>
<script>

import { mdiArrowLeft, mdiChevronRight, mdiClose, mdiMessage, mdiPencil } from '@mdi/js'
import moment from 'moment'
import { base_url } from '@/core/services/config'
import { mapGetters } from 'vuex'
export default {
    props: {
        dialogMenuDetail: {
            required: true,
            type: Boolean,
        },
        menu: {
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
    },
    data() {
        return {
            title: 'Order Detail',
            base_url,
            iconClose: mdiClose,
            icon_chat: mdiMessage,
            icon_right: mdiChevronRight,
            icon_edit: mdiPencil,
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
        viewMenu(id){
            this.$router.push("/vendor-menu-item/"+id).catch(()=>{});
        },

        handleClose() {
            this.$emit('close')
        },

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