<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container class="mg56">
           <div v-if="type=='c'">
            
                <FormCatering/>
           </div>
           <div v-else-if="type=='e'">
                <FormEvent/>
           </div>
           <div v-else-if="type=='re'">
                <FormRegularEvent/>
           </div>
        </v-container>
         <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import Bottomnavbar from '@/components/layout/NavbarBottomClient'
// import { ApiService } from '@/core/services/api.service'
// import OrderDetail from '@/views/vendor/order/VendorOrderDetail'

// import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
    name:'OrdersPage',
    data() {
        return {
            title:'',
            start_request:false,
            type:''
        }
    },
    mounted() {
        this.type =  this.$router.currentRoute.query.type;
        console.log(this.type);
    },
    methods: {

        handleBack(){
            this.$router.back();
        },
        handleClick(param){
            console.log(param);
            this.$router.push("/test");
        }
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        FormCatering:()=> import('@/views/client/truck_request/FormCatering.vue'),
        FormEvent:()=> import('@/views/client/truck_request/FormEvent.vue'),
        FormRegularEvent:()=> import('@/views/client/truck_request/FormRegularEvent.vue'),
    },
    computed: {
        ...mapGetters({currentUser:'auth/user'}),
    }
}
</script>
<style lang="scss" scoped>

</style>