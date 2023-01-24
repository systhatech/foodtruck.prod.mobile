<template>
    <v-row justify="center">
        <v-dialog
        v-model="dialog"
        persistent
        scrollable
        fullscreen>
        <v-card class="background-image" style="padding-top: 56px !important;">
            <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                <v-btn icon @click="handleClose">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Detail</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn text @click="handleClose">
                        Close
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <div class="pa-4 pb82 p-relative background-image" v-if="item && Object.keys(item).length">
                <v-img
                    :src="base_url+'/image-show/'+item.profile_pic"
                    lazy-src="https://picsum.photos/id/11/10/6"
                    contain
                    height="250"
                    class="grey lighten-2 profile-image mx-auto">
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
                <div class=" pt-2">
                    <h3 class="text-capitalize">{{item.name}}</h3>
                    <h2 class="primary--text">{{formatAmount(item.price)}}</h2>
                    <div class="pb-4">
                        {{item.description ? item.description : ''}}
                    </div>
                    
                </div>
                <div id="menu-modal">
                   <v-expansion-panels  v-model="panel" multiple>
                        <v-expansion-panel
                            elevation="0"
                            v-for="(varient,i) in item.variants"
                            :key="i">
                            <v-expansion-panel-header class="text-capitalize">
                                {{ varient.variant ? varient.variant.name :'' }}
                            </v-expansion-panel-header>

                            <v-expansion-panel-content v-if="varient.variant.items.length">
                            <ul class="flavour-list pl-6 pr-6">
                                <li v-for="(single,index) in varient.variant.items" :key="index">
                                     <v-checkbox
                                        style="font-size:0.8rem !important; text-transform:capitalize"
                                       
                                        v-model="itemSelected"
                                        :value="single"
                                        color="primary"
                                        hide-details
                                    >
                                    <template v-slot:label>
                                        <div>
                                            <p class="mb-0">{{ single.name }}</p>
                                            <p class="mb-0">{{ formatAmount(single.value)}} </p>
                                        </div>
                                    </template>
                                    </v-checkbox>
                                </li>
                            </ul>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div>
            </div>
            <div class="pa-4 custom-bs" style="position: fixed;bottom: 0;width: 100%;z-index: 1;">
                <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                        <v-btn
                            fab
                            :disabled="disabledPlus"
                            small
                            @click="quantityIncrease()"
                            color="primary"
                            >
                            <v-icon dark>{{ mdiPlus }}</v-icon>
                        </v-btn>
                        <div class="quantity">{{quantity}}</div>
                        <v-btn
                            fab
                            small
                            @click="quantityDecrease()"
                            color="error"
                            >
                            <v-icon dark>{{ mdiMinus }}</v-icon>
                        </v-btn>
                    </div>
                    <v-btn color="primary" rounded @click="addToCart(item)">Add to cart - {{getAmount(item)}}</v-btn>
                </div>
            </div>
        </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
import { mdiPlus, mdiMinus, mdiClose } from '@mdi/js'
// import { setCookie, getCookie } from '../../../utils/cookie.js'
import { base_url } from '@/core/services/config'
import { mapGetters, mapActions } from 'vuex'
import { ApiService } from '@/core/services/api.service'
export default {
    props:{
        dialog: {
            required:true,
        },
        item:{
            required:true,
            type:Object,
        },
        vendorId:{
            required:true,
        },
        itemCart:{},
        selectedVarients:{},
    },
    data(){
        return {
            base_url,
            mdiPlus, 
            mdiMinus,
            iconClose: mdiClose,
            quantity:1,
            panel:[0],
            itemSelected:[],
            // cartItems: [],
            amount:0,
            disabledMinus:false,
            disabledPlus:false,
            itemValue:0,
        }
    },
    watch: {
        dialog() {
            this.itemSelected = [];
            if(this.selectedVarients) {
                this.itemSelected = this.selectedVarients;
            }
            if(this.itemCart) {
                this.quantity = this.itemCart.quantity;
            }
        },
    },
    methods: {
        ...mapActions({
            fetchCarts:'truck/fetchCarts',
        }),
        getAmount(item){
            let total = 0;
            if(this.itemSelected.length) {
                this.itemSelected.forEach((item) => {
                    total+=item.value;
                });
            } 
            return this.formatAmount((item.price+total) * this.quantity)
        },
        async addToCart(item){
          
            if(!this.currentUser){
                this.$router.replace({name:'loginPage'})
                return;
            }
            this.loaderShow();
            let ids = this.itemSelected.map((x) => {
               return x.id;
            });
            ApiService.post("/cart-create",{
                id: item.id,
                varients : ids,
                quantity : this.quantity,
                vendor_id: this.vendorId,
                cart_id: localStorage.getItem("pcid") ? localStorage.getItem("pcid") :'',
            })
            .then((resp) => {
                this.loaderHide();
                localStorage.setItem("pcid",resp.cart_id);
                this.fetchCarts();
                this.handleClose();
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
                this.messageError(error.response.data.message);
            })
        },
        handleClose(){
            this.$emit('close');
            this.quantity = 1;
        },
        quantityDecrease(){
            if(parseInt(this.quantity) > 2){
                this.quantity -= 1;
                this.disabledPlus = false;
            }else{
                this.disabledMinus = true;
                this.quantity = 1;
            }
        },
        quantityIncrease(){
            if(parseInt(this.quantity) < 10){
                this.quantity +=1;
                this.disabledMinus = false;
            }else{
                this.disabledPlus = true;
            }
        },
        
    },
    computed: {
        ...mapGetters({ 
            currentUser : 'auth/user',
            cartItems : 'truck/cartItems'
        }),
    }
}
</script>
<style lang="scss" scoped>

.v-label {
    font-size: 0.9rem !important;
    text-transform: capitalize !important;
}
.flavour-list{
    list-style: none;
    padding:0;
    // li{
    //     display: flex;
    //     justify-content: space-between;
    //     align-items: center;
    // }
}
// .menu-item-name{
//     font-size: 1.5rem;
//     color: #eb1b52;
//     text-transform:capitalize;
// }

.v-card__title{
    padding:16px 25px;
    // background: transparent;
    // position: absolute;
    // width: 100%;
    // -webkit-box-shadow: 0px 10px 10px -5px rgba(235,235,235,1);
    // -moz-box-shadow: 0px 10px 10px -5px rgba(235,235,235,1);
    // box-shadow: 0px 10px 10px -5px rgba(235,235,235,1);
}
.card-actions {
    // -webkit-box-shadow: 1px -9px 10px -5px rgba(235,235,235,1);
    // -moz-box-shadow: 1px -9px 10px -5px rgba(235,235,235,1);
    // box-shadow: 1px -9px 10px -5px rgba(235,235,235,1);
}
.quantity {
    width: 30px;
    // border: 1px solid #dadada;
    padding: 4px 10px;
    text-align: center;
    color: #eb1b52 !important;
    // &:focus,
    // &:active{
    //     outline: 1px solid#eb1b52 !important
    // }
}
.cardBody{
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>