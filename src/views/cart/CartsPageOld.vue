<template>
    <v-container class="pa-0 ma-0 page-container background-image h-100"> 
        <Topnavbar :title="title" @back="handeBack"/>
        <v-container class="mg56">
            <v-row v-if="cartItems && cartItems.length">
                <v-col cols="12" v-for="(cart, index) in cartItems" class="" :key="index">
                    <v-card class="custom-bs">
                        <div>
                            <div class="w-100 d-flex justify-space-between flex-column">
                                    <div class="pa-3 pb-0">
                                        <p class="ma-0 f8-bold text-capitalize">{{ cart.name}}</p>
                                    </div>
                                    <div class="pa-3 pt-1 d-flex align-center justify-space-between">
                                        <div>
                                            <div><sup style="font-weight: 600;color: #4caf50;">$</sup>
                                            <span style="color: #4caf50;font-weight:600">{{cart.price * cart.qty}}</span></div>
                                        </div>
                                        <div>
                                            <v-btn x-small text tile color="error" @click="handleRemoveItem(cart)">Remove</v-btn>
                                        </div>
                                        <div>
                                            <div>
                                                <v-icon class="mr-2 color-secondary" @click="handlePlus(cart)">mdi-plus</v-icon>
                                                <span>{{cart.qty}}</span>
                                                <v-icon class="ml-2" @click="handleMinus(cart)">mdi-minus</v-icon>
                                            </div>
                                        </div>
                                    </div>
                                <!-- </div> -->
                            </div>
                        </div>
                        <div class="pa-4" v-if="cart && cart.varients && cart.varients.length">
                            <v-divider></v-divider>
                            <p class="ma-0 pa-0 f8-bold mt-2">Add Ons</p>
                            <div v-for="(varient,index) in cart.varients" :key="index">
                                <div class="d-flex align-center justify-space-between">
                                    <p class="ma-0 pa-0 pb-2 f8 text-capitalize">{{ varient.varient[0].name }}</p>
                                    <div class="d-flex align-center justify-space-between">
                                        <span class="f8">{{ formatAmount(varient.rate * varient.qty) }}</span>
                                        <div style="width:80px;" class="d-flex align-center justify-space-between ml-4 mr-4">
                                            <v-btn 
                                                x-small 
                                                icon
                                                color="primary" 
                                                @click="varientSub(varient)"
                                                text 
                                                ><v-icon>mdi-plus</v-icon>
                                            </v-btn>
                                            <span class="f8">
                                                {{ varient.qty }}
                                            </span>
                                            <v-btn 
                                                x-small 
                                                icon
                                                color="primary" 
                                                @click="varientAdd(varient)"
                                                text 
                                                ><v-icon>mdi-minus</v-icon>
                                            </v-btn>
                                        </div>
                                        <v-btn 
                                            x-small 
                                            class="ml-2" 
                                            color="error" 
                                            text 
                                            @click="handleRemoveVarient(varient)">remove
                                        </v-btn>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col cols="12">
                    <div class="unavailable">
                        <div>
                            <h3 class="mb-6">Your cart is empty!</h3>
                            <v-btn block color="primary" rounded :to="{ name: 'home' }"><v-icon>{{iconArrowBack}}</v-icon>shop now</v-btn>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-container>
        <div class="custom-bottom-nav" v-if="cartItems && cartItems.length">
            <div>
                <sup class="sign">$</sup>
                <span class="amount">{{ formatAmount(cartAmount.sub_total) }}</span>
            </div>
            <v-btn rounded link to="/cart-payment" color="primary"><v-icon>mdi-cart</v-icon>checkout</v-btn>
        </div>
        <div v-else>
            <Bottomnavbar :value="indexVaue"/>
        </div>
         <ModalConfirm 
            :dialogConfirm="dialogConfirm" 
            @close="handleClose" 
            @handleConfirm="handleConfirm"/>
    </v-container>
</template>
<script>
import { mapGetters,mapActions } from 'vuex'
import { ApiService } from '@/core/services/api.service'
import { base_url } from '@/core/services/config'
import Topnavbar from "@/components/layout/TopnavbarBackCustom";
import Bottomnavbar from "@/components/layout/NavbarBottomFixed";
import ModalConfirm from '@/components/layout/DialogConfirm'
import { mdiArrowLeft } from '@mdi/js';
export default {
    data() {
        return {
            title:'',
            indexVaue:0,
            iconArrowBack: mdiArrowLeft,
            message:'Loading...',
            carts:[],
            total:{},
            base_url,
            dialogConfirm:false,
            itemDelete:null,
            varient:null,
            confirmSource:'cartItem',
            orderDate:'',
        }
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        ModalConfirm
    },
    mounted() {
        // this.fetchCarts();
         this.orderDate = localStorage.getItem('o_date') ??'';
    },
    methods: {
        ...mapActions({
			fetchCarts:'truck/fetchCarts',
		}),
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
                this.fetchCarts({email: this.currentUser.email});
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        },
        handleRemoveVarient(varient) {
            this.varient = varient;
            this.confirmSource = "varientItem";
            this.dialogConfirm = true;
        },
        handleClose() {
            this.dialogConfirm = false;
        },
        handlePlus(cart){
            this.loaderShow();
            ApiService.post('cart-item-qty-update',{
                email: this.currentUser.email,
                quantity: ++cart.qty,
                cart_id: cart.id,
            })
            .then(() => {
                this.loaderHide();
                this.fetchCarts({email: this.currentUser.email});
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        },
        handleMinus(cart){
            if(cart.qty == 1){
                this.messageError('Cannot update quantity');
                return;
            }
            this.loaderShow();
            ApiService.post('cart-item-qty-update',{
                email: this.currentUser.email,
                quantity: --cart.qty,
                cart_id: cart.id,
            })
            .then((resp) => {
                this.messageSuccess(resp.message);
                this.loaderHide();
                this.fetchCarts({email: this.currentUser.email});
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        },
        handleRemoveItem(cart) {
            this.itemDelete = cart;
            this.confirmSource = "cartItem";
            this.dialogConfirm = true;
        },
        handleConfirm () {
            if(this.confirmSource == 'cartItem'){
                this.deleteCartItem();
            }else if(this.confirmSource == 'varientItem'){
                this.deleteItemVarient();
            }
        },
        deleteItemVarient() {
            // console.log(this.varient);
            this.loaderShow();
            ApiService.post('cart-item-varient-delete',{
                id : this.varient.id,
            })
            .then((resp) => {
                this.messageSuccess(resp.message);
                this.loaderHide();
                this.handleClose();
                this.fetchCarts();
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        
        },
        deleteCartItem() {
            this.loaderShow();
            ApiService.post('cart-item-delete',{
                email: this.currentUser.email,
                cart_id: this.itemDelete.id,
            })
            .then((resp) => {
                this.messageSuccess(resp.message);
                this.$bus.$emit('countItem');
                this.loaderHide();
                this.handleClose();
                this.fetchCarts();
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        },
        fetchCartsAll(){
            this.loaderShow();
            ApiService.post('cart-list/fetch',{email: this.currentUser.email})
            .then((resp) => {
                console.log("data: ", resp);
                this.carts = resp.data;
                this.total = resp.total;
                if(this.carts.length == 0){
                    this.message="No items";
                }
                this.loaderHide();
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        },
        handeBack() {
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
            this.loaderShow();
            ApiService.get('/messages/count/'+this.currentUser.vendor.id)
            .then((response) => {
                this.loaderHide();
                this.countMessages = response.total;
            })
            .catch(() => {
                this.loaderHide();
            });
        }
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
            cartItems:'truck/cartItems',
            cartAmount:'truck/cartAmount'
        })
    }

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
    padding: 20px 16px 46px 16px;
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
    // $color-primary: #01a6bc;
    // $color-secondary: #01a6bc;
    .icon-plus{
        background: #00ba00;
        border-radius: 50%;
        padding: 2px;
        i{
            color: #fff;
        }
    }
    .icon-minus{
        background: red;
        border-radius: 50%;
        padding: 2px;
        i{
            color: #fff;
        }
    }
    .page-container{
        .item-wrapper{
            background:#f5f5f5;
            padding: 10px;
            text-align: center;
            min-height: 100px;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: space-between;
            border-radius: 0;
            i{
                font-size: 3.1rem;
                // color: #01a6bc;
            }
            p{
                margin: 0;
                padding: 0;
                text-align: center;
                font-weight: 500;
                color: #5a5a5a;
                text-transform: capitalize;
                font-size: 0.8rem;
                letter-spacing: 0.7px;
            }
        }
    }
</style>