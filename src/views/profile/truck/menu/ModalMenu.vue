<template>
    <v-row justify="center">
        <v-dialog
        v-model="dialog"
        persistent
        scrollable
        fullscreen>
        <v-card class="background-image" style="padding-top: 56px !important;">
            <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                <v-toolbar-title class="text-capitalize">{{item.name}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn text @click="handleClose">
                        Close
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <!-- <v-container> -->
                <div class="pa-4 pb82 background-white pb-16 mt-14" v-if="item && Object.keys(item).length">
                    <div class="d-flex">
                        <div>
                            <v-img
                                :src="base_url+'/image-show/'+item.profile_pic"
                                lazy-src="https://picsum.photos/id/11/10/6"
                                
                                height="100"
                                width="100">
                            </v-img>
                        </div>
                        <div class="pl-4">
                            <h5 class="text-uppercase primary--text">{{item.name}}</h5>
                            <h4 class="primary--text">{{formatAmount(item.price)}}</h4>
                            <div class="pb-4">
                                {{item.description ? item.description : ''}}
                            </div>
                        </div>
                    </div>
                    <div id="menu-modal" v-if="item.variants.length">
                        <div class="pt-5 pl-4">
                            <p>Add Extra</p>
                            <div v-for="(varient,i) in item.variants"
                                :key="i" class="mb-6">
                                <h5 class="text-uppercase">{{ varient.variant.name }}</h5>
                                <ul class="flavour-list">
                                    <li v-for="(single,index) in varient.variant.items" :key="index">
                                            <v-checkbox
                                            class="text-capitalize mt-0 mb-2"
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
                            </div>
                        </div>
                       <!-- <v-expansion-panels  v-model="panel" multiple>
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
                        </v-expansion-panels> -->
                    </div>
                </div>
                <div class="pa-4 custom-bs pb-8" style="position: fixed;bottom: 0;width: 100%;z-index: 1;">
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
                            <div class="quantity"><h3>{{quantity}}</h3></div>
                            <v-btn
                                fab
                                small
                                @click="quantityDecrease()"
                                color="error"
                                >
                                <v-icon dark>{{ mdiMinus }}</v-icon>
                            </v-btn>
                        </div>
                        <v-btn color="primary" large rounded @click="addToCart(item)">Add to cart - {{getAmount(item)}}</v-btn>
                    </div>
                </div>
            <!-- </v-container> -->
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
                // this.$router.replace({name:'loginPage'})
                this.$router.replace("/login?page=truck-profile&id="+this.$router.currentRoute.params.truckId);
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
    padding-left: 16px;
}

.v-card__title{
    padding:16px 25px;
}
.quantity {
    width: 40px;
    padding: 4px 10px;
    text-align: center;
}
.cardBody{
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>