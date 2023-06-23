<template>
    <v-row justify="center" class="background-image">
        <v-dialog
        v-model="dialog"
        persistent
        class="background-image"
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
                <div class="pb82 custom-bs ma-4 mt-14" v-if="item && Object.keys(item).length">
                    <div class="">
                        <div>
                            <v-img
                                contain
                                :src="base_url+'/image-show/'+item.profile_pic"
                                lazy-src="https://picsum.photos/id/11/10/6"
                                height="200">
                            </v-img>
                        </div>
                        <div class="pt-2">
                            <h5 class="text-uppercase primary--text">{{item.name}}</h5>
                            <p v-if="item.category" class="text-capitalize mb-2">({{ item.category }})</p>
                            <div class="d-flex">
                                <h4 class="primary--text">{{formatAmount(item.price)}}</h4><span v-if="item.unit"> /{{ item.unitTypeName }}</span>
                            </div>
                            <div class="pb-4">{{item.description ? item.description : ''}}</div>
                        </div>
                    </div>
                    <div id="menu-modal" v-if="item.variants.length">
                        <div class="pt-5 pl-4">
                            <h4>Add Extra</h4>
                            <div v-for="(varient,i) in item.variants"
                                :key="i" class="mb-6">
                                <h5 class="text-uppercase primary--text">{{ varient.variant.name }}</h5>
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
                                                <p class="mb-0 primary--text">{{ single.name }}</p>
                                                <p class="mb-0">{{ formatAmount(single.value)}} </p>
                                            </div>
                                        </template>
                                        </v-checkbox>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pa-4 custom-bs pb-8" style="position: fixed;bottom: 0;width: 100%;z-index: 1;">
                    <div class="d-flex align-center justify-space-between" v-if="truckProfile && truckProfile.general && truckProfile.general.is_active">
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
                        <v-btn color="primary" large rounded @click="addToCart(item)">Add to cart</v-btn>
                    </div>
                    <div v-else class="text-center">
                        <p class="error--text mb-0">Truck is offline</p>
                    </div>
                </div>
            <!-- </v-container> -->
        </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
import { mdiPlus, mdiMinus, mdiClose } from '@mdi/js'
import { base_url } from '@/core/services/config'
import { mapGetters, mapActions } from 'vuex'
import { ApiService } from '@/core/services/api.service'
import moment from 'moment'
export default {
    props:{
        dialog: {
            required:true,
        },
        truckProfile:{},
        item:{
            required:true,
            type:Object,
        },
        vendorId:{
            required:true,
        },
        itemCart:{},
        selectedVarients:{},
        pickup_date:{},
        pickup_start_date:{},
        pickup_end_date:{},
        locationId:{},
    },
    data(){
        return {
            base_url,
            moment,
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
                this.$router.replace("/login?page=truck-profile&id="+this.$router.currentRoute.params.truckId);
                return;
            }
            this.loaderShow();
            let ids = this.itemSelected.map((x) => {
               return x.id;
            });
            // console.log({
            //     menu_item_id: item.id,
            //     varients : ids,
            //     quantity : this.quantity,
            //     vendor_id: this.vendorId,
            //     pickup_date: this.pickup_date ? this.pickup_date: (this.pickup_start_date?moment(this.pickup_start_date).format('YYYY-MM-DD'):''),
            //     pickup_start_date: this.pickup_start_date?this.pickup_start_date:'',
            //     pickup_end_date: this.pickup_end_date?this.pickup_end_date:'',
            //     is_preorder: this.pickup_date?1:0,
            //     location_id: this.locationId? this.locationId:'',
            //     client_id: this.currentUser.owner.id,
            // });

            ApiService.post("/cart-create",{
                menu_item_id: item.id,
                varients : ids,
                quantity : this.quantity,
                vendor_id: this.vendorId,
                pickup_date: this.pickup_date ? this.pickup_date: (this.pickup_start_date?moment(this.pickup_start_date).format('YYYY-MM-DD'):''),
                pickup_start_date: this.pickup_start_date?this.pickup_start_date:'',
                pickup_end_date: this.pickup_end_date?this.pickup_end_date:'',
                is_preorder: this.pickup_date?1:0,
                location_id: this.locationId? this.locationId:'',
                client_id: this.currentUser.owner.id,
            })
            .then(() => {
                this.loaderHide();
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