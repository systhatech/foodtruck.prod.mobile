<template>
    <v-container class="pa-0 ma-0 page-container background-image h-100"> 
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container class="mg56">
            <div v-if="cartItems && cartItems.length">
                <div v-if="vendor">
                    <div class="d-flex align-center mb-2">
                        <v-icon color="primary">mdi-account</v-icon>
                        <h5 class="ml-2 text-uppercase primary--text">Truck Detail</h5>
                    </div>
                    <div class="custom-bs pa-4">
                        <div class="d-flex w-100">
                            <div class="w-100 d-flex align-center justify-space-between">
                                <div>
                                    <div>
                                        <h5 class="mb-0 text-capitalize text-uppercase">{{ vendor.name ? vendor.name:'-' }} </h5>
                                        <p class="mb-0">{{  vendor.contact && vendor.contact.phone_no ? vendor.contact.phone_no : (vendor.contact && vendor.contact.mobile_no ?vendor.conact.mobile_no:'') }} </p>
                                        <p class="mb-0">{{ vendor.contact.email }} </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex align-center mt-6 mb-2" v-if="vendor && vendor.address && Object.keys(vendor.address).length">
                    <v-icon color="primary">mdi-map-marker</v-icon>
                    <h5 class="ml-2 text-uppercase primary--text">Pickup Location</h5>
                </div>
                <div class="custom-bs pa-4" v-if="vendor && vendor.address && Object.keys(vendor.address).length">
                    <div v-if="vendor && vendor.address && Object.keys(vendor.address).length">
                        <div class="d-flex">
                            <div>
                                <p class="ma-0">
                                    {{vendor.address && vendor.address.add1 ? vendor.address && vendor.address.add1:''}}<br>
                                    {{vendor.address && vendor.address.city?vendor.address && vendor.address.city:''}}
                                    {{vendor.address && vendor.address.state?vendor.address && vendor.address.state:''}}
                                    {{vendor.address && vendor.address.zip?vendor.address && vendor.address.zip:''}}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <p>Location Uavailable</p>
                    </div>
                </div>
                 <div class="mt-5" v-if="cart && cartItems">
                    <div class="d-flex align-center mt-6 mb-2">
                        <v-icon color="primary mr-2">mdi-notebook-check</v-icon>
                        <h5 class="ml-2 text-uppercase primary--text">Cart Items</h5>
                    </div>
                    <div class="no-border-radius custom-bs pa-4">
                        <div>
                            <div v-for="(product,index) in cartItems" :key="index" class="abc">
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
                                        <td class="text-right">{{ formatAmount(cartAmount.sub_total)}}</td>
                                    </tr>
                                    <tr v-if="cartAmount.service_charge_percent">
                                        <td>Service Charge</td>
                                        <td class="text-right">{{formatAmount(cartAmount.service_charge_amount)}}</td>
                                    </tr>
                                    <tr v-if="cartAmount.tax_percent">
                                        <td>Taxes</td>
                                        <td class="text-right">{{formatAmount(cartAmount.tax_amount)}}</td>
                                    </tr>
                                    <tr v-if="cartAmount.tip_amount">
                                        <td>Tip </td>
                                        <td class="text-right">{{formatAmount(cartAmount.tip_amount)}}</td>
                                    </tr>
                                    <tr v-if="cartAmount.convenience_fee && (payment_method=='card')">
                                        <td>Convenience fee</td>
                                        <td class="text-right">{{formatAmount(cartAmount.convenience_amount)}}</td>
                                    </tr>
                                    <tr v-if ="payment_method=='card'">
                                        <td class=""><h5 class="primary--text">TOTAL</h5> </td>
                                        <td class=" text-right"> <h4 class="primary--text">{{formatAmount(cartAmount.card_total)}}</h4></td>
                                    </tr>
                                    <tr v-if="payment_method=='cash'">
                                        <td class=""><h5 class="primary--text">TOTAL</h5> </td>
                                        <td class=" text-right"> <h4 class="primary--text">{{formatAmount(cartAmount.cash_total)}}</h4></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex align-center mt-5 mb-2" v-if="vendor && Object.keys(vendor).length">
                    <v-icon color="primary">mdi-cash-plus</v-icon>
                    <h5 class="ml-2 text-uppercase primary--text">Leave Tip</h5>
                </div>
                <div class="custom-bs pa-3">
                    <div class="d-flex align-center flex-wrap">
                        <div class="ma-1"><v-btn small outlined text @click="updateTipAmount(0)">No Tip </v-btn></div>
                        <div class="ma-1" v-for="(tip,index) in tips" :key="index"><v-btn small outlined text @click="updateTipAmount(tip)">{{formatAmount(tip)}}</v-btn></div>

                        <div class="d-flex align-center" :class="!other?'':''">
                            <v-btn small outlined text @click="updateTipAmount('other')" class="mr-6">Other</v-btn>
                            <div class="d-flex align-center" v-if="other">
                                <v-text-field type="number" x-small label="Tip amount" v-model="tipAmount"></v-text-field>
                                <v-btn small color="primary" outlined  class="ml-4" @click="addTip">Add tip</v-btn>
                            </div>
                        </div> 
                    </div>
                    <!-- <div>
                        <v-text-field></v-text-field>
                    </div> -->
                </div>
                <div class="d-flex align-center mt-5 mb-2" v-if="vendor && Object.keys(vendor).length">
                    <v-icon color="primary">mdi-credit-card</v-icon>
                    <h5 class="ml-2 text-uppercase primary--text">Payment Method</h5>
                </div>
                <div class="custom-bs pa-4" v-if="vendor && Object.keys(vendor).length">
                    <div class="d-flex align-center justify-space-between">
                        <div>
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
                        </div>
                        <div v-if="cartAmount && cartAmount.card_total">
                            <h3 class="color-secondary" v-if ="payment_method=='card'">{{  formatAmount(parseFloat(cartAmount.card_total)) }}</h3>
                            <h3 class="color-secondary" v-if ="payment_method=='cash'">{{formatAmount(cartAmount.cash_total)}}</h3>
                        </div>
                    </div>
                    <div>
                        
                    </div>
                   <div>
                        <div v-if="payment_method == 'cash' && cash_on_pickup">
                            <v-btn large block color="primary" rounded class="mt-4" @click="handleProceed">Proceed</v-btn>
                        </div>
                       <div v-else-if="payment_method=='card'">
                           <div v-if="vendorPayment && vendorPayment.val1">
                            <CardStripe @proceed="handleProceedCard" :publishablekey="vendorPayment.val1"/>
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
            
        </v-container>
        <Bottomnavbar/>
    </v-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { ApiService } from '@/core/services/api.service'
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import Bottomnavbar from '@/components/layout/NavbarBottomClient'
import CardStripe from './CardStripe'
export default {
    data() {
        return {
            title:'',
            row: null,
            other:false,
            indexValue:1,
            save_card:false,
            initializeCard:true,
            bottomItems:[
                {id:1, name:'Dashboard',route:'dashboard',icon:'mdi-microsoft'},
                {id:2, name:'Profile',route:'profile', icon:'mdi-account'},
                {id:3, name:'Logout',route:'', icon:'mdi-logout'},
            ],
            card_number:'',
            payment_method:'card',
            name_on_card:'',
            zip_code:'',
            exp_month:'',
            exp:'',
            cvv:'',
            showSummary:false,
            total:{},
            stripe:null,
            loadingProceed:false,
            // pulishableKey :'pk_test_51H9I1dLaXKQNg9HDdNcZyN3ljKyRnqHNhiQrl6WE4y1bnBugFdcCWvUrghXJyp5OSVq3ml3G2Mizo3sqhGxbGXM0008HgVAPCZ',
            // pulishableKey :'',
            card:'',
            date:'',
            token: null,
            cardNumber: null,
            cardExpiry: null,
            cardCvc: null,
            personal:{},
            packageId:'',
            plan:{},
            locations:[],
            selectedAddressIndex:0,
            orderItems:[],
            totalData:[],
            payment:{},
            // cartItems:[],
            vendor:null,
            message:'Loading...',
            cash_on_pickup:0,
            orderDate:'',
            cart_id:null,
            tipAmount:'',
            tips:[],
        }

    },
    components: {
        Topnavbar,
        Bottomnavbar,
        CardStripe,
        // StripeElementCard
    },
    mounted() {
        this.orderDate = localStorage.getItem('o_date') ??'';
        this.cart_id = localStorage.getItem('pcid') ? localStorage.getItem('pcid') :'';
        if(this.cart) {
            this.vendor = this.cart.vendor;
            this.tips = this.cart.tips;
        }
    },
   
    methods: {
        ...mapActions({
            fetchCarts: 'truck/fetchCarts',
        }),
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
                ApiService.post("/cart-tip-update", { tip, cart_id: this.cart_id})
                .then((response) => {
                    this.messageSuccess(response.message);
                    this.fetchCarts();
                    this.loaderHide();
                })
                .catch(() => {
                    this.loaderHide();
                    this.messageError("Failed to add/update Tip amount");
                })
            }
        },
        changeLocation(index) {
            this.selectedAddressIndex = index;
        },
        handleProceedCard(param){
            this.token = param.stripeToken;
            this.payment_type = "card";
            this.handleProceed();
        },
        handleProceed(){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.post('/cart/payment',{
                cart_id:this.cart_id,
                current_location_log: this.vendor.address.id,
                payment_type: this.payment_method,
                gateway:'stripe',
                stripeToken: this.token,
                first_name: this.currentUser.fname,
                last_name: this.currentUser.lname,
                name_per_card: this.currentUser.fname+" "+ this.currentUser.lname,
                email: this.currentUser.email,
            })
            .then((resp) => {
                this.loaderHide();
                localStorage.removeItem('pcid');
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
        // fetchData(){
        //     this.$bus.$emit('SHOW_PAGE_LOADER');
        //     ApiService.post('cart-list/fetch',{email: this.currentUser.email})
        //     .then((resp) => {
        //         this.cart_id = resp.cart_id;
        //         this.tips = resp.tips;
        //         console.log(resp);
        //         if(resp.vendor.cash_on_pickup) {
        //             this.payment_method = 'cash';
        //             this.cash_on_pickup = 1;
        //         }else{
        //             this.payment_method = 'card';
        //         }
        //         this.$bus.$emit('HIDE_PAGE_LOADER');
        //         this.total = resp.total;
        //         this.locations = resp.locations;
        //         this.initializeCard = true;
        //         this.pulishableKey = resp.stripe_key;
        //         this.cartItems = resp.data;
        //         this.vendor = resp.vendor;
        //         this.vendor.address = resp.currentLocation;
        //     })
        //     .catch((error) => {
        //         this.$bus.$emit('HIDE_PAGE_LOADER');
        //         console.log(error);
        //     })
        // },
        handleBack(){
            this.$router.back();
        },
        changeTab(param) {
            console.log(param, this.tab);
        },
        handleAppointment() {
            this.$router.push("/artist-appointment/"+1);
        },
        handleRoute(route){
            this.$router.push("/"+route);
        },
        messageCount() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.get('/messages/count/'+this.currentUser.vendor.id)
            .then((response) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.countMessages = response.total;
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
            });
        }
    },
    computed: {
         ...mapGetters({
            cart:'truck/cart',
            cartItems:'truck/cartItems',
            cartAmount:'truck/cartAmount',
            currentUser:'auth/user',
            vendorPayment:'truck/vendorPaymentGateway'
        }),
         stripeElements () {
            return this.$stripe.elements();
        },
    }

}
</script>
<style lang="scss" scoped>
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