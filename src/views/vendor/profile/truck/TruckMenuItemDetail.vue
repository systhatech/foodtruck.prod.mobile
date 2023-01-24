<template>
    <v-container class="ma-0 pa-0 background-image h-100">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mg56" v-if="item && Object.keys(item).length" >
            <div v-if="item.profile_pic == null || item.profile_pic !=='noimage.png' ">
                <v-img
                contain
                lazy-src="https://picsum.photos/id/11/10/6"
                max-height="150"
                :src="item.profile_pic? base_url+'/image-show/'+item.profile_pic:base_url+'/image-show/default.jpg'"
                ></v-img>
            </div>
            <div class="pa-4 mb-14 custom-bs mt-4">
                <div class="mb-2">
                    <h4 class="pb-2">Order Date{{formatDateToDay(orderDate)}}</h4>
                    <v-divider></v-divider>
                </div>
               <h4 class="text-capitalize">{{item.name}}</h4>
                <span> {{item.unit}} Items</span>
                <h4 class="mb-0">{{ formatAmount(item.price) }}</h4>
               <v-row>
                    <v-col cols="12">
                        <h4 class="mt-4">Description</h4>
                        <div>
                            <p>{{item.description}}</p>
                        </div>
                    </v-col>
                    <v-col cols="12">
                          <div id="menu-modal">
                            <v-expansion-panels  v-model="panel" multiple>
                                    <v-expansion-panel
                                        elevation="0"
                                        v-for="(varient,i) in item.variants"
                                        :key="i"
                                        >
                                        <v-expansion-panel-header class="text-capitalize">{{ varient.variant ? varient.variant.name :'' }}</v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                        <!-- <div class="d-flex align-center" v-if="varient.variant.select_single">
                                                <v-radio-group v-model="itemSelectedRadio[varient.variant_id]" class="mb-0 mt-0 w-100 mt-4">
                                                     <div v-for="(single,index) in varient.variant.items" :key="index" class="d-flex align-center justify-space-between">
                                                        <v-radio
                                                            style="font-size:0.9rem !important; text-transform:capitalize"
                                                            :label="single.name+' '+single.id"
                                                            @change="handleChangeItem(single)"
                                                            :value="single"
                                                            color="primary"
                                                        ></v-radio>
                                                        <span class="">{{ formatAmount(single.value)}} </span>
                                                     </div>
                                                </v-radio-group>
                                 
                                        </div> -->
                                        <div>
                                            <ul class="flavour-list" >
                                                <li v-for="(single,index) in varient.variant.items" :key="index">
                                                    <v-checkbox
                                                        style="font-size:0.9rem !important; text-transform:capitalize"
                                                        :label="single.name"
                                                        v-model="itemSelected"
                                                        @change="handleChangeItem(single, varient)"
                                                        :value="single"
                                                        color="primary"
                                                        hide-details
                                                    ></v-checkbox>
                                                    <span class="mt-4">{{ formatAmount(single.value)}} </span>
                                                </li>
                                            </ul>
                                        </div>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </div>
                    </v-col>
               </v-row>
            </div>
        </v-container>
        <div  v-if="item && Object.keys(item).length" class="custom-bottom-nav">
            <div>
               <div class="d-flex align-center justify-space-around">
                    <v-btn outlined color="primary" small fab @click="handlePlus"><v-icon>mdi-plus</v-icon></v-btn>
                    <span style="width:30px; text-align:center">{{quantity}}</span>
                    <v-btn outlined color="primary" small fab @click="handleMinus"><v-icon>mdi-minus</v-icon></v-btn>
                </div>
            </div>
            <v-btn rounded color="primary" @click="handleAddToCart"><v-icon>mdi-cart</v-icon>add to cart</v-btn>
        </div>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
import { base_url } from '@/core/services/config'
import { mapGetters } from 'vuex'
export default {
    name:'EditProfile',
    data() {
        return {
            title:'',
            base_url,
            indexValue:0,
            itemId:"",
            item:{},
            quantity:1,
            panel:[0],
            cart_id: '',
            itemSelected:[],
            existInCart:null,
            itemSelectedRadio:{},
            orderDate:'',
        }
    },
    mounted() {
        this.itemId = this.$router.currentRoute.params.itemId;
        this.fetchItem();
        this.orderDate = localStorage.getItem('o_date') ??'';
    },
    watch: {
        itemSelected(abc) {
            console.log({abc});
        },
        // itemSelectedRadio(radio){
        //     console.log({radio});
        // }
    },
    methods: {
        async handleChangeItem(param,group) {
            if(group.variant.select_single) {
                let exists = this.itemSelected.filter((x)=> x.id == param.id);
                console.log({exists});
                this.itemSelected = this.itemSelected.filter((x) => (x.variant_id!= group.variant_id));
                if(exists.length){
                    this.itemSelected.push(param);
                }
            }
            // }else{
            this.loaderShow();
            param.menuId = this.item.id;
            await ApiService.post('/pos-cart/varient-update',param)
            .then(() => {
                this.loaderHide();
                // this.fetchItem();
            })
            .catch(() => {
                this.loaderHide();
                this.messageError("Failed");
            });
            // }
         
        },
        handlePlus(){
            if(this.quantity<=10){
                this.quantity++;
            }
        },
        handleMinus(){
            if(this.quantity>=2){
                this.quantity--;
            }
        },
        handleBack(){
            this.$router.back();
        },
        async handleAddToCart() {
            let cartData = new FormData();
            cartData.append('menu_id', this.item.menu_id);
            cartData.append('id', this.item.id);
            cartData.append('qty', this.quantity);
            cartData.append('price',this.item.price);
            cartData.append('client_id', this.currentUser.owner.id);
            cartData.append('cart_id', this.cart_id);
            this.itemSelected.forEach((element, i) => {
                cartData.append(`item[${i}][id]`, element.id);
                cartData.append(`item[${i}][group_id]`, element.variant_id);
            });
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/pos-cart/new',cartData)
            .then(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.$router.back();
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError("Failed to add in cart");
            });
        },
        async fetchItem() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/food-menu-item',{
                'foodItemId': this.itemId
            })
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.item = resp.data;
                this.quantity = resp.qty;
                console.log({resp});
                if(resp.exists_in_cart){
                    resp.exists_in_cart.forEach((item) => {
                        this.itemSelected.push(item[0]);
                    })
                }

                // if(resp.radiogroup){
                //     console.log(resp.radiogroup[0]);
                //     this.itemSelectedRadio = resp.radiogroup[0];
                // }
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
        },
    },
    components: {
        Topnavbar,
    },
    computed: {
         ...mapGetters({
            currentUser:'auth/user',
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

.v-label {
    font-size: 0.9rem !important;
    text-transform: capitalize !important;
}
.flavour-list{
    list-style: none;
    padding:0;
    li{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
.menu-item-name{
    font-size: 1.5rem;
    color: #eb1b52;
    text-transform:capitalize;
}

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
    width: 50px;
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
h2{
    padding: 20px;
    color: #4caf50;
}
</style>