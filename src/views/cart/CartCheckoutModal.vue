<template>
    <div>
        <v-row justify="center">
            <v-dialog v-model="dialogModalCheckout" persistent scrollable fullscreen>
                <v-card style="margin-top: 56px !important;">
                    <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                        <v-toolbar-title class="pl-0 text-capitalize">Checkout</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn text @click="handleClose">
                                Close
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-container style="background-color: #fff;">
                        <div>
                            <div class="">
                                <div v-if="cart && cart.items && cart.items.length">
                                    <div v-if="cart.vendor">
                                        <div class="d-flex align-center mb-2">
                                            <v-icon color="primary">mdi-account</v-icon>
                                            <h4 class="ml-2 text-capitalize primary--text">Pickup location</h4>
                                        </div>
                                        <div class="custom-bs pa-4">
                                            <div class="d-flex w-100">
                                                <div class="w-100 d-flex align-center justify-space-between">
                                                    <div>
                                                        <div class="d-flex">
                                                            <!-- <div class="mr-2">
                                                                <v-img width="30" :src="base_url+'/image-show/'+cart.vendor.profile_pic"></v-img>
                                                            </div> -->
                                                            <div>
                                                                <h4 class="mb-0 text-capitalize primary--text">{{ cart.vendor.name ? cart.vendor.name:'-' }} </h4>
                                                                <div>
                                                                    <p class="mb-0">{{ cart.address.add1 }} {{  cart.address.city }}</p>
                                                                    <p>{{ cart.address.state }} {{  cart.address.zip }}</p>
                                                                </div>
                                                                <div v-if="cart.pickup_date">
                                                                    <p class="mb-0" style="font-weight:600">{{ formatDateToDay(cart.pickup_date) }}</p>
                                                                    <p style="font-weight:600">{{ formatTimeOnly(cart.pickup_start_date) }} - {{ formatTimeOnly(cart.pickup_end_date) }}</p>
                                                                </div>
                                                            </div>
                                                            <!-- <p class="mb-0">{{  cart.vendor.contact && cart.vendor.contact.phone_no ? cart.vendor.contact.phone_no : (cart.vendor.contact && cart.vendor.contact.mobile_no ?cart.vendor.conact.mobile_no:'') }} </p>
                                                                <p class="mb-0">{{ cart.vendor && cart.vendor.contact && cart.vendor.contact.email? cart.vendor.contact.email:'' }} </p> -->
                                                            </div>
                                                            
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="d-flex align-center mt-6 mb-2" v-if="cart && cart.vendor && cart.vendor.address && Object.keys(cart.vendor.address).length">
                                        <v-icon color="primary">mdi-map-marker</v-icon>
                                        <h4 class="ml-2 text-capitalize primary--text">Pickup Location</h4>
                                    </div>
                                    <div class="custom-bs pa-4" v-if="cart && cart.vendor && cart.vendor.address && Object.keys(cart.vendor.address).length">
                                        <div v-if="cart && cart.vendor && cart.vendor.address && Object.keys(cart.vendor.address).length">
                                            <div class="d-flex">
                                                <div>
                                                    <p class="ma-0">
                                                        {{cart.vendor.address && cart.vendor.address.add1 ? cart.vendor.address && cart.vendor.address.add1:''}}<br>
                                                        {{cart.vendor.address && cart.vendor.address.city?cart.vendor.address && cart.vendor.address.city:''}}
                                                        {{cart.vendor.address && cart.vendor.address.state?cart.vendor.address && cart.vendor.address.state:''}}
                                                        {{cart.vendor.address && cart.vendor.address.zip?cart.vendor.address && cart.vendor.address.zip:''}}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <p>Location Uavailable</p>
                                        </div>
                                    </div>
                                    <div class="mt-5" v-if="cart && cart.items">
                                        <div class="d-flex align-center mt-6 mb-2">
                                            <v-icon color="primary mr-2">mdi-notebook-check</v-icon>
                                            <h4 class="ml-2 text-capitalize primary--text">Cart Items</h4>
                                        </div>
                                        <div class="no-border-radius custom-bs pa-4">
                                            <div>
                                                <div v-for="(product,index) in cart.items" :key="index" class="abc">
                                                    <div class="product-item">
                                                        <p class="ma-0  text-capitalize">{{ product.food_menu_item.name }} ({{ product.quantity }})</p>
                                                        <span class="">{{ formatAmount(product.food_menu_item.price * product.quantity) }}</span>
                                                    </div>
                                                    <div v-if="product.varients && product.varients.length">
                                                        <div v-for="(item, i) in product.varients" :key="i" class="d-flex align-center justify-space-between bottom-padding">
                                                            <p class="ma-0 pa-0 text-capitalize">{{item.variant_item.name}}</p>
                                                            <span>{{formatAmount(item.variant_item.value * product.quantity)}}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mt-2">
                                                    <table class="w-100">
                                                        <tr>
                                                            <td>Sub Total</td>
                                                            <td class="text-right">{{ formatAmount(cart.sub_total)}}</td>
                                                        </tr>
                                                        <tr v-if="cart.service_charge">
                                                            <td>Service Charge</td>
                                                            <td class="text-right">{{formatAmount(cart.service_charge)}}</td>
                                                        </tr>
                                                        <tr v-if="cart.tax_percent">
                                                            <td>Tax</td>
                                                            <td class="text-right">{{formatAmount(cart.tax_amount)}}</td>
                                                        </tr>
                                                        <tr v-if="cart.tips_amount">
                                                            <td>Tip</td>
                                                            <td class="text-right">{{formatAmount(cart.tips_amount)}}</td>
                                                        </tr>
                                                        <tr v-if="cart.convenience_amount && (cart.payment_method=='card')">
                                                            <td>Convenience fee</td>
                                                            <td class="text-right">{{formatAmount(cart.convenience_amount)}}</td>
                                                        </tr>
                                                        <tr v-if ="cart.payment_method=='card'">
                                                            <td class=""><h4 class="primary--text">TOTAL</h4> </td>
                                                            <td class=" text-right"> <h4 class="primary--text">{{formatAmount(cart.card_total)}}</h4></td>
                                                        </tr>
                                                        <tr v-if="cart.payment_method=='cash'">
                                                            <td class=""><h4 class="primary--text">TOTAL</h4> </td>
                                                            <td class=" text-right"> <h4 class="primary--text">{{formatAmount(cart.cash_total)}}</h4></td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="d-flex align-center mt-5 mb-2" v-if="cart.vendor && Object.keys(cart.vendor).length">
                                        <v-icon color="primary">mdi-cash-plus</v-icon>
                                        <h4 class="ml-2 text-capitalize primary--text">Leave Tip</h4>
                                    </div>
                                    <div class="custom-bs pa-3">
                                        <div class="d-flex align-center flex-wrap">
                                            <div class="ma-1" style="width: 90px;"><v-btn  color="primary" @click="updateTipAmount(0)" block>No Tip </v-btn></div>
                                            <div class="ma-1" style="width: 90px;" v-for="(tip,index) in cart.tips" :key="index"><v-btn block  color="primary" @click="updateTipAmount(tip)">{{formatAmount(tip)}}</v-btn></div>

                                            <div class="d-flex align-center" :class="!other?'':''">
                                                <div style="width:90px;" class="pl-1">
                                                    <v-btn color="primary"  block @click="updateTipAmount('other')" class="mr-6">Other</v-btn>
                                                </div>
                                                <div class="d-flex align-center pl-2" v-if="other">
                                                    <v-text-field type="number" x-small label="Tip amount" v-model="tipAmount"></v-text-field>
                                                    <v-btn color="primary"  class="ml-4" @click="addTip">Add tip</v-btn>
                                                </div>
                                            </div> 
                                        </div>
                                        <!-- <div>
                                            <v-text-field></v-text-field>
                                        </div> -->
                                    </div>
                                    <div class="d-flex align-center mt-5 mb-2" v-if="cart.vendor && Object.keys(cart.vendor).length">
                                        <v-icon color="primary">mdi-credit-card</v-icon>
                                        <h4 class="ml-2 text-capitalize primary--text">Payment Method</h4>
                                    </div>
                                    <div class="custom-bs pa-4" v-if="cart.vendor && Object.keys(cart.vendor).length">
                                        <div class="d-flex align-center justify-space-between">
                                            <!-- <div>
                                                <v-radio-group
                                                class="mt-4"
                                                v-model="payment_method"
                                                row
                                                >
                                                <v-radio
                                                    v-if="cash_on_pickup==1"
                                                    label="Cash at pickup"
                                                    value="cash"
                                                ></v-radio>
                                                <v-radio
                                                    label="Card"
                                                    value="card"
                                                ></v-radio>
                                                </v-radio-group>
                                            </div> -->
                                            <!-- <div v-if="cart && cart.card_total">
                                                <h3 class="color-secondary" v-if ="cart.payment_method=='card'">{{  formatAmount(parseFloat(cart.card_total)) }}</h3>
                                                <h3 class="color-secondary" v-if ="cart.payment_method=='cash'">{{formatAmount(cart.cash_total)}}</h3>
                                            </div> -->
                                        </div>
                                        <div>
                                            
                                        </div>
                                    <div>
                                            <div v-if="cart.payment_method == 'cash' && cash_on_pickup">
                                                <v-btn large block color="primary" rounded class="mt-4" @click="handleProceed">Proceed</v-btn>
                                            </div>
                                        <div v-else-if="cart.payment_method=='card'">
                                            <div v-if="cart.vendor.payment_credential && cart.vendor.payment_credential.val1">
                                                <CardStripe @proceed="handleProceedCard" :publishablekey="cart.vendor.payment_credential.val1"/>
                                            </div>
                                            <div v-else>
                                                <p class="f9 color-primary text-center text-uppercase">Card Payment Not Available</p>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>

                                <div v-else class="unavailable">
                                    <h3>No item in cart</h3>
                                </div>
                            </div>
                                <!-- <DialogConfirm
                                :dialogConfirm="dialogConfirm"
                                @handleConfirm="handleDelete"
                                @close="handleClose"
                            /> -->
                        </div>
                    </v-container>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
  </template>
  <script>

  import moment from 'moment'
  import { ApiService } from "@/core/services/api.service";
//   import DialogConfirm from "@/components/layout/DialogConfirm";
import CardStripe from './CardStripe'
  import { base_url } from '@/core/services/config'
  // import datetime from 'vuejs-datetimepicker';
  import { mapActions, mapGetters } from 'vuex'
import { mdiMinus, mdiPlus } from '@mdi/js';
  export default {
    // props: {
    //     dialogModalCheckout: {
    //         required: true,
    //         type: Boolean,
    //     },
    //     cart:{},
    // },
    // watch: {
    //       dialogModalCheckout(newval) {
    //         console.log(newval);
    //     //     if (newval) {
    //     //       this.defaultValue = "";
    //     //       console.log("test", this.defaultValue);
    //     //       //   this.fetchOrderDetail();
    //     //       //   this.disableButton = false;
    //     //   } else {
    //     //       // this.render = false;
    //     //           setTimeout(() => {
    //     //               this.defaultValue = "";
    //     //           }, 500);
    //     //           this.address = {
    //     //               add1:'',
    //     //               city:'',
    //     //               state:'',
    //     //               zip:'',
    //     //               country:'',
    //     //               country_code:'',
    //     //               lat:'',
    //     //               lon:'',
    //     //           }
    //     //     }
    //     }
    // },
    components: {

      // datetime,
      CardStripe,

    //   DialogConfirm,

    },
    data() {
        return {
            valid:true,
            dialogConfirm:false,
            cash_on_pickup:0,
            moment,
            start_date:  new Date(),
            end_date:  new Date(),
            iconMinus: mdiMinus,
            iconPlus: mdiPlus,
            title:'',
            base_url,
            schedules:[],
            requiredRules: [
                v => !!v || 'Required',
            ],
            defaultValue:'',
            address: {
                name:'',
                banner:'',
                add1:'',
                city:'',
                state:'',
                zip:'',
                country:'',
                country_code:'',
                lat:'',
                lon:'',
            },
            selectedData:'',
            file:{
                file_name:'',
                type:'gallery',
            },
            remove:false,
            maxHeight:300,
            other:false,
            dialogModalCheckout:false,
            cart:{},
            tipAmount:0,
        }
    },
    mounted() {
        this.$bus.$on('CART_CHECKOUT',(param) => {
            this.cart = param.cart;
            this.dialogModalCheckout = true;
        })
    },
    methods: {
        ...mapActions({
            fetchCarts:'truck/fetchCarts'
        }),
        fetchCartDetail(){
            ApiService.get('/cart/'+this.cart.id)
            .then((resp) =>{
                this.cart = resp.data;
            })
            .catch((error) => {
                console.log(error);
            })
        },
        addTip(){
            if(this.tipAmount){
                this.updateTipAmount(this.tipAmount);
            }
        },
        updateTipAmount(tip){
            if(tip=="other") {
                this.other = true;
            }else{
                this.other = false;
                this.loaderShow();
                ApiService.post("/cart-tip-update", { tip, cart_id: this.cart.id})
                .then(() => {
                    // this.messageSuccess(response.message);
                    // this.fetchCarts();
                    this.fetchCartDetail();
                    this.loaderHide();
                })
                .catch(() => {
                    this.loaderHide();
                    this.messageError("Failed to add/update Tip amount");
                })
            }
        },
        handleClose(){
            // this.$emit('close');
            this.dialogModalCheckout = false;
        },
        handleBack() {
            this.$router.back();
        },
        addressSelected(addr) {
            this.address.add1 = addr.add1;
            this.address.city = addr.city;
            this.address.state = addr.state;
            this.address.zip = addr.zip_code;
            this.address.country = addr.country;
            this.address.country_code = addr.country_code;
            this.address.lat = addr.lat;
            this.address.lon = addr.lng;
            setTimeout(() => {
                this.defaultValue = addr.add1;
            }, 200);
        },
        varientSub(param) {
           let qty = param.qty+1;
           this.updateQuantity(param.id, qty);

       },
       varientAdd(param) {

           if(param.qty == 1) {
               this.messageError('Cannot decrease quantity');
               return;
           }
           let qty = param.qty - 1;
            this.updateQuantity(param.id, qty);
       },
        updateQuantity(id,qty) {
            this.loaderShow();
            ApiService.post('cart-item-varient-qty-update',{
                quantity: qty,
                id: id,
            })
            .then(() => {
                this.loaderHide();
                this.fetchCarts();
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        },
        handleRemoveVarient(varient) {
            this.varient = varient;
            console.log(varient);
            this.confirmSource = "varientItem";
            this.modal_confirm = true;
        },
        handleCloseConfirm() {
            this.modal_confirm = false;
        },
        handlePlus(cart){
            this.loaderShow();
            ApiService.post('/carts-item-qty-update',{
                quantity: ++cart.quantity,
                cart_id: cart.id,
            })
            .then(() => {
                // this.messageSuccess(resp.message);
                this.fetchCarts();
                this.loaderHide();
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        },
        handleMinus(cart){
            console.log(cart);
            if(cart.quantity ==1 ){
                this.messageError('Cannot update quantity');
                return;
            }else{
                this.loaderShow();
                ApiService.post('/carts-item-qty-update',{
                    quantity: --cart.quantity,
                    cart_id: cart.id,
                })
                .then(() => {
                    // this.messageSuccess(resp.message);
                    this.fetchCarts();
                    this.loaderHide();
                })
                .catch((error) => {
                    this.loaderHide();
                    console.log(error);
                })
            }
        },
        handleRemoveItem(cart) {
            this.itemDelete = cart;
            this.confirmSource = "cartItem";
            this.modal_confirm = true;

        },
        handleConfirm () {
            if(this.confirmSource == 'cartItem'){
                this.deleteCartItem();
            }else if(this.confirmSource == 'varientItem'){
                this.deleteItemVarient();
            }
        },
        deleteItemVarient() {
            this.loaderShow();
            ApiService.post('carts-item-varient-delete',{
                id : this.varient.id,
            })
            .then(() => {
                // this.messageSuccess(resp.message);
                this.fetchCarts();
                this.handleCloseConfirm();
                this.loaderHide();
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        
        },
        deleteCartItem() {
            this.loaderShow();
            ApiService.post('carts-item-delete',{
                cart_id: this.itemDelete.id,
            })
            .then(() => {
                // this.messageSuccess(resp.message);
                this.fetchCarts();
                this.handleCloseConfirm();
                this.loaderHide();
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        },
        handleProceedCard(param){
            this.token = param.stripeToken;
            this.payment_type = "card";
            console.log({
                cart_id:this.cart.id,
                current_location_log: this.cart.address.id,
                location_id: this.cart.location_id ? this.cart.location_id:'',
                payment_type: this.cart.payment_method,
                gateway:'stripe',
                stripeToken: this.token,
                first_name: this.currentUser.fname,
                last_name: this.currentUser.lname,
                name_per_card: this.currentUser.fname+" "+ this.currentUser.lname,
                email: this.currentUser.email,
            });
            this.handleProceed();
        },
        handleProceed(){
            this.loaderShow();
            ApiService.post('/cart/payment',{
                cart_id:this.cart.id,
                current_location_log: this.cart.address.id,
                location_id: this.cart.location_id ? this.cart.location_id:'',
                payment_type: this.cart.payment_method,
                gateway:'stripe',
                stripeToken: this.token,
                first_name: this.currentUser.fname,
                last_name: this.currentUser.lname,
                name_per_card: this.currentUser.fname+" "+ this.currentUser.lname,
                email: this.currentUser.email,
            })
            .then((resp) => {
                this.loaderHide();
                this.fetchCarts();
                this.$router.replace({name:'OrderDetailPage', params:{orderId: resp.order_id}})
                this.messageSuccess(resp.message);
            })
            .catch((error) => {
                console.log({error});
                this.loaderHide();
                this.messageError("Failed to checkout");
            })
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
.cart-items{
    list-style: none;
    padding: 0;
    // margin-bottom:50px;
    li{
        padding-bottom: 14px;
        &:hover{
            cursor:pointer;
        }
        .item-remove{
            margin: 0;
            font-size: 0.8rem;
            color: #ec2156;
        }
    }
    // .cart-item-single{
    //     border-bottom: 1px solid #dadada;
    //     // padding: 10px;
    // }
}
p{
    font-size: 15px;
}
.tip{
    border:1px solid #dadada;
}
.abc {
     &:not(:last-child) {
        border-bottom: 1px solid #dadada;
    }
}
.bottom-padding:last-child{
    padding-bottom: 10px;
}
.product-item {
    width:100%;
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding: 10px 0;
}
  </style>