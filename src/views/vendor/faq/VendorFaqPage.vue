<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar/>
        <v-container class="mg56">
           <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores, quae. Quo molestias, vero odit aliquam quam illum nobis facere doloribus reiciendis veritatis voluptate possimus cumque id asperiores ipsam officiis rem aut atque quisquam natus rerum. Assumenda deserunt eveniet odit neque sed veritatis, doloribus minima quod. Assumenda adipisci pariatur officia perspiciatis voluptate nemo sit dolorum soluta, at nulla, aut beatae blanditiis fugiat a necessitatibus. Placeat rem tempore similique dolorum neque quam saepe fugit perspiciatis esse. Vitae aspernatur facere rerum optio corporis quidem illum possimus non temporibus dolor. Nihil maiores, debitis exercitationem fuga enim natus iure voluptatibus sequi aperiam minus at aliquid.</p>
        </v-container>
         <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/Topnavbar'
import Bottomnavbar from '@/components/layout/NavbarBottomVendor'
import { ApiService } from '@/core/services/api.service'
import { mdiChat, mdiChevronRight } from '@mdi/js'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
    name:'OrdersPage',
    data() {
        return {
            title:'',
            indexValue:1,
            moment,
            valid:true,
            content:'no content',
             tab:0,
            dialogOrderDetail:false,
            status:'new',
            iconChat:mdiChat,
            icon_right:mdiChevronRight,
            orderItem:{},
            loading:false,
            activeItem:0,
            activeType:0,
            orders:[],
            pickup_date: new Date().toISOString().substr(0, 10), 
            orderTypes: [
                {name:'New',active_type:true,icon:'mdi-cart-arrow-down',component:'order-new',status:'new'},
                {name:'Accepted',active_type:false,icon:'mdi-refresh',component:'order-processing',status:'accepted'},
                // {name:'Preparing',active_type:false,icon:'mdi-refresh',component:'order-preparing',status:'preparing'},
                {name:'Ready',active_type:false,icon:'mdi-cart-minus',component:'order-ready',status:'ready'},
                {name:'Completed',active_type:false,icon:'mdi-cart-minus',component:'order-completed',status:'completed'},
                {name:'Cancel',active_type:false,icon:'mdi-cart-minus',component:'order-cancelled',status:'cancelled'},
            ],
            refresh_time:10000,
        }
    },
    mounted() {
        this.fetchOrders();
    },
    methods: {
    
        handleBack(){
            this.$router.back();
        },
        async fetchOrders() {
            this.orders = [];
            this.loading = true;
            await ApiService.post("/order-list",{
                'status': this.status
            })
            .then((resp) => {
                this.loading = false;
                this.orders = resp.data;
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch((error) => {
                this.loading = false;
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(error);
            })
        },
        async refetchOrders() {
             this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post("/order-list",{
                'status': this.status
            })
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.orders = resp.data;
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(error);
            })
        },
        handleRoute(route){
            this.$router.push("/"+route);
        },
        handleActive(item, index){
            this.activeType = index;
            this.status = item.status.status;
            this.fetchOrders();
        },
        handleView(order){
            this.orderItem = order;
            this.dialogOrderDetail = true;
        },
        viewDetailPage(order){
            this.$router.push({name:'OrderDetailPage', params:{orderId: order.order_id}});
        },
        handleClose(){
            this.dialogOrderDetail = false;
            this.fetchOrders();
        },
        selectedDate(date){
            this.pickup_date = moment(date.date).format('YYYY-MM-DD');
        },
        handleSearch(){
            this.fetchOrders();
        }
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        // OrderDetail,
        // ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
        // OrderStatus: ()=> import('@/components/OrdersStatusSlider.vue')
    },
    computed: {
        ...mapGetters({currentUser:'auth/user'}),
    }
}
</script>
<style lang="scss" scoped>
.payment {
    padding: 0;
    margin: 0;
    font-size: 0.8rem;
    font-weight: 600;
    text-align: right;
}
.sticky-top{
    position: sticky;
    top: 56px;
    z-index: 1;
    background: #fff;
    padding: 12px;
}
.form-container{
    background: #acfa95;
    border-radius: 10px;
    margin-top: 27px !important;
    padding:20px;
}
   $color-primary: #000000;
    $color-secondary: #01a6bc;
    ul.order-types{
        list-style: none;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid #dadada;
        padding-bottom: 10px;
        li{
            text-transform: uppercase;
            font-size: 0.8rem;
            font-weight: 500;
            span{
                color: #9e9e9e;
            }
            span.active-type{
                color: #000000;
                border-bottom: 2px solid #000000;
                padding-bottom: 12px;
            }
        }
    }
    .order_item{
        border-radius:0;
        padding:12px;
        .order_no{
            margin: 0;
            font-size: 0.8rem;
            font-weight: 600;
            display:flex;
            justify-content:space-between;
            margin-bottom:8px;
            span.amount{
                font-size: 0.8rem;
            }
        }
        .order_person,
        .order_contact,
        .order_bill,
        .order_date{
            margin: 0;
            font-size: 0.8rem;
            text-transform: capitalize;
        }
    }
</style>