<template>
     <v-container class="ma-0 pa-0 h-100 background-image">
        <Topnavbar title="" @back="handleBack"/>
        <v-container class="pt-0 content-cs">
            <div class="background-white mt-4 pa-4">
                <table class="w-100">
                    <tr>
                        <td class="f8-bold">Sub Total </td>
                        <td class="f8-bold pb-2 text-right">{{formatAmount(total.sub_total)}}</td>
                    </tr>
                    <tr>
                        <td class="f8-bold">Tax</td>
                        <td class="f8-bold pb-2 text-right">{{formatAmount(total.tax_amount)}}</td>
                    </tr>
                    <tr>
                        <td class="f9-bold">Total</td>
                        <td class="f9-bold pb-2 text-right">{{formatAmount(total.total)}}</td>
                    </tr>
                </table>
            </div>
            
            <div>
                <h4>Shipping Address</h4>
                <v-form ref="formCheckoutCash" v-model="valid">  
                    <!-- <v-row>
                        <v-col
                        cols="6"
                        md="6"
                        >
                        <v-text-field
                            v-model="checkout_card.first_name"
                            :rules="nameRules"
                            label="First name"
                            required
                        ></v-text-field>
                        </v-col>

                        <v-col
                        cols="6"
                        md="6"
                        >
                        <v-text-field
                            v-model="checkout_card.last_name"
                            :rules="nameRules"
                            label="Last name"
                            required
                        ></v-text-field>
                        </v-col>

                        <v-col
                        cols="6"
                        md="6"
                        >
                        <v-text-field
                            v-model="checkout_card.email"
                            :rules="emailRules"
                            label="E-mail"
                            required
                        ></v-text-field>
                        </v-col>
                        <v-col
                        cols="6"
                        md="6"
                        >
                        <v-text-field
                            v-model="checkout_card.phone"
                            v-mask="'(###) ###-####'"
                            label="Phone"
                            required
                        ></v-text-field>
                        </v-col>
                    </v-row> -->
                
                    <v-row>
                        <v-col
                        cols="12"
                        md="12"
                        >
                            <InputAddress id="pickup-address" :default-value="checkout_card.pickup_addr1" @selectAddr="addressSelected"/>
                        </v-col>

                        <v-col
                        cols="6"
                        md="4"
                        >
                        <v-text-field
                            v-model="checkout_card.pickup_state"
                            :rules="nameRules"
                            label="State"
                            required
                        ></v-text-field>
                        </v-col>

                        <v-col
                        cols="6"
                        md="4"
                        >
                        <v-text-field
                            v-model="checkout_card.pickup_city"
                            :rules="nameRules"
                            label="City"
                            required
                        ></v-text-field>
                        </v-col>
                        <v-col
                        cols="6"
                        md="4"
                        >
                        <v-text-field
                            v-model="checkout_card.pickup_zip"
                            v-mask="'#########'"
                            label="ZIP"
                            required
                        ></v-text-field>
                        </v-col>
                    </v-row>

                </v-form>
            </div>
        </v-container>
		<!-- <Bottomnavbar /> -->
	</v-container>
</template>
<script>
import {  mdiClose } from '@mdi/js'
// import { ApiStripe }  from '@/core/services/api-stripe.service'
import { ApiService }  from '@/core/services/api.service'
import JwtService from '@/core/services/jwt.service'
import Topnavbar from "@/components/layout/TopnavbarBackCustom";
import { mapGetters } from 'vuex'
// import {loadStripeTerminal} from '@stripe/terminal-js';
import InputAddress from '@/components/form-element/InputAddress'
// import axios from 'axios'
export default {
  
    data(){
        return {
            title:'',
            loadingPayment:false,
            iconClose:mdiClose,
            step:1,
            phone:'',
            valid: false,
            firstname: '',
            lastname: '',
            nameRules: [
                v => !!v || 'Required',
            ],
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid',
            ],
            defaultAdd1:'',
            checkout_card: {
                first_name:'',
                last_name:'',
                phone:'',
                email:'',
                pickup_addr1:'',
                pickup_city:'',
                pickup_state:'',
                pickup_zip:'',
            },

            gateway:{},
            terminal:null,
            paymentIntentId:null,
            discoveredReaders:[],
            connectedReader:null,
            locationParams:{
                vendor_id:null,
            },
            locations:[],
            readers:[],
            location:null,
            reader:null,
            terminalSetup:false,
            amount:0,
            order_id:'',
            orderDetail:{},

           items:{},
           subTotal: 0,
           taxPercent: 0,
           taxAmount: 0,
           grandTotal : 0,
           paymentBy:'-',
           lastDigit:'-',
           tips : 0,
           total:{}
        }
    },
    mounted() {
        this.fetchCarts();
      
    },
    components: {
        InputAddress,
        Topnavbar
    },
    methods: {
        fetchCarts(){
            ApiService.post('cart-list/fetch',{email: this.currentUser.email})
            .then((resp) => {
                this.total = resp.total;

            })
            .catch((error) => {
                console.log(error);
            })
        },
        addressSelected(addr) {
            this.checkout_card = {
                pickup_addr1: addr.add1,
                pickup_city:addr.city,
                pickup_state:addr.state,
                pickup_zip:addr.zip_code,
            }
        },
        getCurrentCart(){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.get('pos-cart/getcart/'+JwtService.getCurrentCartId()+"?vendor_id="+this.currentUser.vendor_id)
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.checkout_card = resp.data;
                this.defaultAdd1 = this.checkout_card.pickup_addr1;
                delete this.checkout_card.event_id;
                // this.amount = resp.total;
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(error);
            })
        },
        async intializeStripePos() {
            // const StripeTerminal = await loadStripeTerminal();
            // this.terminal = StripeTerminal.create({
            //     onFetchConnectionToken: async () => {
            //         return axios.get('https://foodtruck.systha.com/token?vendor_id='+this.currentUser.vendor_id)
            //         .then(function(response) {
            //             console.log({response});
            //             return response.data.secret;
            //         })
            //     },
            //     onUnexpectedReaderDisconnect: async () => {
            //         console.log("test dispconnect");
            //     }
            // })
        },
        
        handleCollect(){
            // amount = amount*100;
            // // if(selectedReader == null) return;
            // this.$bus.$emit('SHOW_PAGE_LOADER');
            // ApiStripe.get('readers/'+JwtService.getPosReaderId()+"?vendor_id="+this.currentUser.vendor_id)
            // .then((resp) => {
            //     this.handleConnectReader(resp.data, amount);

            // })
            // .catch((error) => {
            //     console.log(error);
            //     this.messageError('Failed to connect reader');
            // });

        },
        handleConnectReader(selectedReader, amount){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            this.terminal.connectReader(selectedReader).then((connectResult) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                if (connectResult.error) {
                    this.messageError('Failed to connect: ', connectResult.error);
                } else {
                    this.messageSuccess(connectResult.reader.label +' connected');
                    this.handleCollectPayment(amount);
            
                }
            });
        },
    
        handleCollectPayment(amount) {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            this.fetchPaymentIntentClientSecret(amount).then((client_secret)  =>{
                // this.terminal.setSimulatorConfiguration({testCardNumber: '4242424242424242'});
                // this.terminal.setReaderDisplay({
                //     type: 'cart',
                //     cart: {
                //         line_items: [
                //         {
                //             description: "Caramel latte",
                //             amount: 659,
                //             quantity: 1,
                //         },
                //         {
                //             description: "Dozen donuts",
                //             amount: 1239,
                //             quantity: 1,
                //         },
                //         ],
                //         tax: 1,
                //         total: 1000,
                //         currency: 'usd',
                //     },
                // });
                this.terminal.collectPaymentMethod(client_secret).then((result) => {
                    if (result.error) {
                        this.$bus.$emit('HIDE_PAGE_LOADER');
                        // Placeholder for handling result.error
                        this.messageError(result.error);
                    } else {
                        // console.log('terminal.collectPaymentMethod', result.paymentIntent);
                        this.terminal.processPayment(result.paymentIntent).then((result)  => {
                        if (result.error) {
                            this.messageError(result.error.message);
                        } else if (result.paymentIntent) {
                            this.paymentIntentId = result.paymentIntent.id;
                            this.handleCapturePayment(result.paymentIntent.id);
                            // this.messageSuccess(result.paymentIntent);
                        }
                        });
                    }
                });
            });
        },
        fetchPaymentIntentClientSecret() {
        
            // return ApiStripe.post('create', { amount: amount, vendor_id: this.currentUser.vendor_id})
            // .then((response) => {
            //     return response.data.client_secret;
            // })
            // .catch((error) => {
            //     console.log(error.response.data);
            // })
        },
        // handleCapturePayment(paymentIntentId) {
        handleCapturePayment() {
            // this.$bus.$emit('SHOW_PAGE_LOADER');
            // return ApiStripe.post('/capture', {id : paymentIntentId, vendor_id: this.currentUser.vendor_id})
            // .then((response) => {
            //     this.savePaymentDetail(response.data);
            // })
        },

        savePaymentDetail(data) {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            let formattedData = {
                ...this.checkout_card,

                intent_id : data.id,
                amount : data.amount/100,
                billing_city : data.charges.data[0].billing_details.address.city,
                billing_country : data.charges.data[0].billing_details.address.country,
                billing_add1 : data.charges.data[0].billing_details.address.add1,
                billing_add2 : data.charges.data[0].billing_details.address.add2,
                billing_state : data.charges.data[0].billing_details.address.state,
                billing_postal_code : data.charges.data[0].billing_details.address.postal_code,
                billing_email : data.charges.data[0].billing_details.email,
                billing_name : data.charges.data[0].billing_details.name,
                billing_phone : data.charges.data[0].billing_details.phone,


                payment_brand:data.charges.data[0].payment_method_details.card_present.brand,
                payment_cardholder_name:data.charges.data[0].payment_method_details.card_present.cardholder_name,
                payment_country:data.charges.data[0].payment_method_details.card_present.country,
                payment_exp_month:data.charges.data[0].payment_method_details.card_present.exp_month,
                payment_exp_year:data.charges.data[0].payment_method_details.card_present.exp_year,
                payment_finterprint:data.charges.data[0].payment_method_details.card_present.fingerprint,
                payment_generated_card:data.charges.data[0].payment_method_details.card_present.generated_card,
                payment_last4:data.charges.data[0].payment_method_details.card_present.last4,
                payment_network:data.charges.data[0].payment_method_details.card_present.network,
                client_id: JwtService.getPosId(),
                vendor_id: this.currentUser.vendor_id,
                cart_id: JwtService.getCurrentCartId(),

            }
            ApiService.post('/pos-cart/payment-detail', formattedData)
            .then((response) => {
                console.log(response);
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageSuccess(response.message);
                this.$bus.$emit('POS_CART_FETCH');
                this.order_id = response.order_id;
                this.step=3;
                this.fetchOrder(response.order_id);
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(error);
                this.messageError('Failed to order');

            })
        },
        fetchOrder(orderId) {
            console.log(orderId);
            ApiService.post('/order/detail', { order_id: 427, vendor_id: this.currentUser.vendor_id})
            .then((response) => {
                this.orderDetail = response.data;
                console.log(this.orderDetail);
                this.subTotal = response.sub_total;
                this.taxPercent = response.tax_percentage;
                this.taxAmount = response.tax_amount;
                this.tips = response.tips;
                this.grandTotal = response.total;
                this.paymentBy = response.payment_by;
                this.lastDigit = response.last_digit;
   
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
            });
        },
        handleEmail(orderId) {
            // console.log(orderId);
            this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.post('/order/detail/email-receipt', { order_id: orderId, vendor_id: this.currentUser.vendor_id})
            .then((resp) => {
                this.messageSuccess(resp.message);
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
            });
        },
        handlePrint() {
            let printThis = document.getElementById('test').innerHTML;
            var win = window.open();
            self.focus();
            win.document.open();
            win.document.write('<'+'html'+'><'+'body'+'>');
            win.document.write(printThis);
            win.document.write('<'+'/body'+'><'+'/html'+'>');
            win.document.close();
            win.print();
            win.onafterprint = (event) =>{
                console.log(event, "close print");
            };
            win.close();
        },
        handleDraft() {
            JwtService.destroyCurrentCartId();
            this.$bus.$emit("POS_VARIENT_ITEMS",[]);
            this.$bus.$emit("POS_ITEMS",[]);
            this.$bus.$emit('POS_CART_FETCH');
        },
        handleBack(){
            console.log("back");
            if(this.step >=2){
                this.step -=1;
            }
        },

        async handleContinueCard() {
            // this.checkout_card.payment_type = this.paymentType;
            // this.checkout_card.pos_id = JwtService.getPosId();
            // this.checkout_card.client_id = this.currentUser.id;
            // this.checkout_card.vendor_id = this.currentUser.owner.id;
            // this.checkout_card.cart_id = JwtService.getCurrentCartId();
            // this.$bus.$emit('SHOW_PAGE_LOADER');
            // await ApiService.post('/pos-cart/checkout-cart', this.checkout_card)
            // .then(() => {
            //     this.$bus.$emit('HIDE_PAGE_LOADER');
            //     this.step = 2;
            // })
            // .catch((error) => {
            //     this.$bus.$emit('HIDE_PAGE_LOADER');
            //     console.log(error);
            // })
        },
        handleSubmit() {
            // this.checkout_card.payment_type = this.paymentType;
            // this.checkout_card.pos_id = JwtService.getPosId();
            // this.checkout_card.current_user_id = this.currentUser.id;
            // this.checkout_card.vendor_id = this.currentUser.vendor_id,
            // this.checkout_card.cart_id = JwtService.getCurrentCartId(),
            // this.$bus.$emit('SHOW_PAGE_LOADER');
            // ApiService.post('/pos-cart/checkout-cart', this.checkout_card)
            // .then((resp) => {
            //     this.$bus.$emit('HIDE_PAGE_LOADER');
            //     this.handleClose();
            //     this.$bus.$emit('POS_CART_FETCH');
            //     this.messageSuccess(resp.message);
            // })
            // .catch((error) => {
            //     this.$bus.$emit('HIDE_PAGE_LOADER');
            //     console.log(error);
            // })
        },
        handleClose() {
            this.$emit('close');
        },
    },
    computed: {
          ...mapGetters({
            currentUser:'auth/user',
        })
    },
}
</script>
<style lang="scss" scoped>
.print-email {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    padding-top:40px;
}
.sticky-div{
    position: sticky;
    top: 0;
    z-index: 1;
    margin-bottom: 2px;
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
}
.varient-groups {
    .active-list{
        color:#49b1bf;
    }
}
.varient-lists{
    list-style: none;
    padding: 0;
    position: sticky;
    top: 188px;
    li{
        padding:10px 0;
        text-transform: capitalize;
        border: 1px solid #dadada;
        padding: 10px 12px;
        margin-bottom: 16px;
    }
    li.active-list{
        p{
            color:#fff;
        }
        border: 1px solid #49b1bf;
        background: #49b1bf;
    }

}
.item-name{
    font-weight: 600;
    text-transform: capitalize;
    font-size: 1.2rem;
    margin-bottom: 0;
}
.active-item{
    background: #bff7ff;
    border: 1px solid #bff7ff !important;
}
.item-quantity{
    font-weight: 600;
    font-size: 1.4rem;
}
.checkbox-container{
    width: 100%;
    overflow-y: hidden;
    overflow-x: auto;
    padding: 20px 0;
    .checkbox-item{
        cursor: pointer;
        margin-right: 20px;
        min-width: 140px;
        max-width: 140px;
        width: 140px;
        border: 1px solid #c7c9ca;
        padding: 12px;
        .custom-checkbox-wrapper{
            text-align: center;
            .custom-checkbox{
                font-weight: 600;
                color: #49b1bf;
                font-size: 1rem;
            }
            p{
                padding: 0;
                margin:0;
            }
        }
    }
    .checkbx-active{
        border: 1px solid #01a6bc;
        padding: 12px;
        background: #01a6bc21;
    }
}
.group-name{
    font-weight: 600;
    text-transform: capitalize;
    color: #6f6f6f;
    padding-bottom: 0;
    margin-bottom: 0;
}
.checkbox-container::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	background-color: #F5F5F5;
}

.checkbox-container::-webkit-scrollbar
{
	width: 10px;
    background-color: #F5F5F5;
    height: 10px;
}

.checkbox-container::-webkit-scrollbar-thumb
{
    background-color: #bbb3b3;
}


//----------------------- new style ------------ //
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
    height:100%;
    position:relative;
    color: #000;
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
    // background:$bg-gray !important;
}
.card-actions{
    padding: 0 14px 14px 14px !important;
}
</style>