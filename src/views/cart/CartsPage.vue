<template>
    <v-container class="pa-0 ma-0 page-container background-image h-100"> 
        <Topnavbar title="" @back="handeBack"/>
        <v-container class="mg56" style="padding-bottom:40px !important">
            <v-row v-if="carts && carts.length">
                <v-col cols="12">
                    <div v-if="carts && carts.length>0">
                        <h3>Your Cart</h3>
                        <div v-for="(cart,i) in carts" :key="i">
                            <div class="mt-4">
                            
                                <div class="custom-bs pa-4">
                                    <v-row>
                                        <v-col cols="12" md="12" lg="12" xl="12">
                                            <h2 class="mb-2 primary--text">{{ cart.vendor.name }}</h2>
                                            <div class="d-flex w-100">
                                                <div class="w-100">
                                                    <p class="mb-0 error--text" v-if="cart.pickup_date">Pickup Date</p>
                                                    <p style="font-weight:600">{{ formatDateToDay(cart.pickup_date) }}</p>
                                                    <p class="mb-0 error--text">Pickup Location </p>
                                                    <div v-if="cart.address">
                                                        <p class="mb-0">{{ cart.address.add1 }}, {{ cart.address.city }}</p>
                                                        <p class="mb-2">{{ cart.address.state }}, {{ cart.address.zip }}</p>
                                                    </div>
                                                    <p class="mb-4">{{ cart.items.length }} items in cart</p>
                                                    <div class="w-100 text-center">
                                                        <v-btn :disabled="!cart.vendor.is_active" rounded large color="primary" :to="'/cart/'+cart.id">checkout now</v-btn>
                                                        <div class="text-center w-100" v-if="!cart.vendor.is_active">
                                                            <p class="mt-2 mb-0 error--text w-100">Sorry, Truck is offline</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                    
                                           
                                            </div>
                                        </v-col>
                                    </v-row>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col cols="12">
                    <div class="unavailable">
                        <div>
                            <h3 class="mb-6">Your cart is empty!</h3>
                            <v-btn block large color="primary" rounded :to="{ name: 'home' }"><v-icon>{{iconArrowBack}}</v-icon>shop now</v-btn>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-container>
        <!-- <CartCheckoutModal :dialogModalCheckout="modal_checkout" :cart="selected_cart" @close="handleCloseCheckout"/> -->
         <ModalConfirm 
            :dialogConfirm="modal_confirm" 
            @close="handleCloseConfirm" 
            @handleConfirm="handleConfirm"/>
    </v-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { ApiService } from '@/core/services/api.service'
import { base_url } from '@/core/services/config'
import Topnavbar from "@/components/layout/TopnavbarBackCustom";
// import Bottomnavbar from "@/components/layout/NavbarBottomFixed";
import ModalConfirm from '@/components/layout/DialogConfirm'
import { mdiCart, mdiMapMarker, mdiMinus, mdiPlus } from '@mdi/js';
import { mdiArrowLeft } from '@mdi/js';
export default {
    data() {
        return {
            base_url,
            modal_checkout:false,
            iconAddress: mdiMapMarker,
            iconArrowBack:mdiArrowLeft,
            iconCart: mdiCart,
            modal_confirm:false,
            transactionFee:0,
            convenienceFee:0,
            loading:false,
            iconMinus : mdiMinus,
            iconPlus: mdiPlus,
            quantity:1,
            cartEmpty:true,
            dialog:false,
            item:{},
            itemCart:{},
            // inCart:null,
            vendors:[],
            vendorItems:[],
            selectedVarients:[],
            itemDelete:{},
            varient:{},
            confirmSource:'',
            selected_cart:{},
        }
    },
    components: {
        Topnavbar,
        // Bottomnavbar,
        ModalConfirm,
        // CartCheckoutModal:()=>import('@/views/cart/CartCheckoutModal.vue'),
    },
    computed: {
        ...mapGetters({
            cart:'truck/cart',
            carts:'truck/getCarts',
            cartAmount:'truck/cartAmount',
        }),
    },
    mounted(){
        this.fetchCarts();
    },
    methods: {
        ...mapActions({
            fetchCarts:'truck/fetchCarts'
        }),
        handleCloseCheckout(){
            this.modal_checkout = false;
        },
        handeBack(){
            this.$router.back();
        },
        handleCheckout(cart){
            this.selected_cart = cart;
            this.modal_checkout = true;
        },
        // mapActions
        handleClose(){
            // deleteCookie('foodtruck_carts');
            this.dialog = false;
        },
        // handleCheckout(){
        //     //  this.$router.push("/checkout");
        // },
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
        checkoutNow(){
            this.$router.replace({name:'checkout'});
        },
        async viewModal(product){
            this.itemCart  =  product;
            if(product.varients.length){
                this.selectedVarients = product.varients.map((item) => {
                    return item.variant_item;
                });
            }
            await ApiService.get('/menuitem/'+product.menu_id)
            .then((resp) => {
                this.item = resp.data;
                this.dialog = true;
            })
            .catch((error) => {
                console.log(error);
            });
        }
    },

}
</script>
<style lang="scss" scoped>

.custom-bottom-nav{
    box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
    z-index: 2;
    background: #ffffff;
    position: fixed;
    bottom: 0;
    // border-top: 1px solid #dadada;
    width: 100%;
    padding: 13px 16px 26px 16px;
    display:flex;
    align-items:center;
    justify-content: space-between;
    .sign{
        color:#75ab26;
        font-size:0.9rem;
        font-weight:600;
    }
    .amount{
        font-size: 1.3rem;
        font-weight: 600;
        color: #75ab26;
    }
}
 .varient_items{
    // list-style: none;
    margin-top:10px;
    padding:0;
    li{
        // font-size: 0.8rem;
        font-weight: 400;
        margin-bottom: 10px;
        padding: 0 !important;
        text-transform: capitalize;
        display:flex;
        justify-content:space-between;
        cursor: pointer;
        P{
            margin-bottom: 10px;
            font-weight: 400;
        }
        span {
            font-weight: 400;
        }
    }
}
.cart-item-name{
    text-transform: capitalize;
    // font-size: 0.9rem;
    // font-weight: 600;
    // margin-bottom:10px;
    // padding:0;
    &:hover{
        text-decoration: underline;
    }
}
.amount-text{
    padding: 0;
    margin: 0;
    font-weight: 400;
    font-size: 0.9rem;
}
.your-order{
    font-size: 1.5rem;
    font-weight: 500;
}
.remove-item{
    padding: 0;
    margin: 0;
    font-size: 0.8rem;
    text-transform: capitalize;
    color: #eb1a51;
    &:hover{
        cursor: pointer;
        text-decoration: underline;
        font-weight: 400;
    }
}
.cart-item-wrapper{
    display: grid;
    grid-gap: 5px;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
}
.quantity {
    width: 60px;
    border: 1px solid #dadada;
    padding: 4px 10px;
    text-align: center;
    color: #eb1b52 !important;
    &:focus,
    &:active{
        outline: 1px solid#eb1b52 !important
    }
}
.fw6{
    font-weight: 600;
}
.amount-single{
    font-size: 16px;
    font-weight: 500;
    padding: 0;
    margin:0;
}
.text-title{
    text-transform: capitalize;
    font-weight: 600;
    margin: 0;
}
.sub-title{
    font-size: 0.8rem;
    font-weight: 500;
    margin: 0;
}
.cart-container{
    border-left: 1px solid #dadada;
    height: 100%;
    .sticky-container{
        position: sticky;
        top: 100px;
    }
}
.total-label{
    font-size:17px;
    text-align: right;
}
.amount{
    text-align: right;
    font-weight: 600;
    color: #eb1a51;
    font-size: 17px;
}
.cart-msg{
    text-align: center;
    font-size: 1rem;
    color: #a8a8a8;
    margin: 0;
}
.order-lists{
    list-style: none;
}
p.truck-info{
    font-size: 0.9rem;
    color: #000;
    font-weight: 500;
}
.event-detail {
    list-style: none;
    padding: 0;
    li{
        font-size: 1.2rem;
        font-weight: 600;
        color: #01a6bc;
    }
}
.v-card__title{
    font-size: 1rem;
}
.custom-tabs{
    padding: 0;
    list-style: none;
    display: flex;
    border-bottom: 1px solid #e0e0e0;
    li{
        border-bottom: 1px solid #e0e0e0;
        margin-bottom: -1px;
        color:  #01a6bc;
        margin-right: 30px;
        cursor: pointer;
        p{
            margin-bottom: 7px;
        }
    }
    li.active{
        border-bottom: 1px solid #01a6bc;
    }
}
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
</style>