<template>
    <v-container class="pa-0 ma-0 page-container"> 
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container class="pb-10 mb-14">
            <h4 class="mb-2">Payment Summary</h4>
            <div class="no-border-radius custom-bs pa-4">
                <div>
                    <div v-for="n in 2" :key="n" class="product-item">
                        <p class="ma-0 f8">Item {{n}} x2</p>
                        <span class="f9-bold">{{formatAmount(13)}}</span>
                    </div>
                    <div class="mt-4">
                        <table class="w-100 text-right">
                            <tr>
                                <td>Total</td>
                                <td class="f8-bold">$30.00</td>
                            </tr>
                            <tr>
                                <td>Discount</td>
                                <td class="f8-bold">$5.00</td>
                            </tr>
                            <tr>
                                <td>Tax(6%)</td>
                                <td class="f8-bold">$3.00</td>
                            </tr>
                        </table>
                    </div>
                    <v-divider class="mt-4"></v-divider>
                    <div>
                        <h4 class="text-right mt-4">Grand Total : $38.00</h4>
                    </div>
                    <v-divider class="mt-4"></v-divider>
                    <div>
                        <h4 class="mt-4 text-right">Paid By   Visa****450 $38.00</h4>
                    </div>
                </div>
            </div>
            <div class="text-center mt-4 pt-4">
                <v-btn rounded outlined link to="/dashboard-customer" color="secondary"><v-icon>mdi-arrow-left</v-icon>Back to dashboard</v-btn>
            </div>
        </v-container>
        <Bottomnavbar :value="indexValue"/>
    </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { ApiService } from '@/core/services/api.service'
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
export default {
    data() {
        return {
            title:'',
            row: null,
            indexValue:1,
            save_card:false,
            artists : [
                {id:1, name:"Product 1", price:100, qty:1},
                {id:2, name:"Product 2", price:110, qty:2},
                {id:3, name:"Product 3", price:20, qty:3},
                {id:4, name:"Product 4", price:220, qty:4},
            ],
            bottomItems:[
                {id:1, name:'Dashboard',route:'dashboard',icon:'mdi-microsoft'},
                {id:2, name:'Profile',route:'profile', icon:'mdi-account'},
                {id:3, name:'Logout',route:'', icon:'mdi-logout'},
            ],
            card_number:'',
            payment_method:'cash',
            name_on_card:'',
            zip_code:'',
            exp_month:'',
            exp:'',
            cvv:'',
            showSummary:false,
            total:{},
            stripe:null,
            loadingProceed:false,
            pulishableKey :'pk_test_HWXJvemu3UMjLToQMuQXdVHf00hbtPgsPF',
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
        }

    },
    components: {
        Topnavbar,
        Bottomnavbar,
    },
    mounted() {
        this.fetchData();
    },
   
    methods: {
        changeLocation(index) {
            this.selectedAddressIndex = index;
        },
      
        handleProceed(){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.post('pos-cart/checkout-cart',{
                vendor_location : this.locations[this.selectedAddressIndex].id
            })
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageSuccess(resp.message);
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError("Failed to checkout");
            })
        },
        fetchData(){
            ApiService.post('cart-list/fetch',{email: this.currentUser.email})
            .then((resp) => {
                this.total = resp.total;
                this.locations = resp.locations;
            })
            .catch((error) => {
                console.log(error);
            })
        },
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
         stripeElements () {
            return this.$stripe.elements();
        },
          ...mapGetters({
            currentUser:'auth/user',
        })
    }

}
</script>
<style lang="scss" scoped>
.selected-address{
    background: #3fb595;
    padding: 12px;
    border-radius: 3px;
    color: #fff;
}
.custom-bottom-nav{
    box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
    z-index: 2;
    background: #ffffff;
    position: fixed;
    bottom: 0;
    // border-top: 1px solid #dadada;
    width: 100%;
    padding: 20px;
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
.product-item {
    // d-flex align-center justify-space-between w-100
    width:100%;
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding: 10px 0;
    &:not(:last-child) {
        border-bottom: 1px solid #dadada;
    }
}
</style>
