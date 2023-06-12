<template>
     <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mb80">
            <div class="mb-4">
                <p class="mb-0 text-center" style="text-decoration: underline;" @click="handleClick('user_mannual_payment')">Video tutorial, setting up stripe accout</p>
            </div>
            <div v-if="default_payment">
                <div v-if="default_payment=='vendor'">
                    <StripeDetail class="mb-6"/>
                    
                </div>
                <div v-else>
                    <BankDetail/>
                </div>
            </div>
            <div v-else class="unavailable">
                <p>{{ message }}</p>
            </div>
            <ModalVideoPlayer/>
        </v-container>
         <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import Bottomnavbar from '@/components/layout/NavbarBottomVendor'
import BankDetail from './PaymentBankPage'
import StripeDetail from './PaymentStripePage'

import ModalVideoPlayer from '@/views/vendor/profile/modal/ModalVideoPlayer.vue'
import { mapGetters } from 'vuex'
export default {
    name:'PaymentPage',
    data() {
        return {
            title:'',
            payouts:[],
            message:'Loading...',
            default_payment:null
        }
    },
    mounted() {
        if(this.currentUser) {
            this.default_payment = this.currentUser.owner.default_payment;
        }
    },
    methods: {
        handleClick(param){  
            this.$bus.$emit('MODAL_VIDEO_PLAYER_OPEN',{param});
        },
        handleBack() {
            this.$router.back();
        },
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        BankDetail,
        StripeDetail,
        ModalVideoPlayer,
    },
    computed: {
          ...mapGetters({
            currentUser:'auth/user',
        })
    }
}
</script>
<style lang="scss" scoped>
.subscription {
    text-align: center;
    padding: 10px;
    color: #b5b5b5;
    background: #fff;
    height: 180px;
    border-radius: 20px;
    align-items: center;
    justify-content: space-around;
    display: flex;
}
.price{
    font-size: 1.2rem;
    font-weight: 600;
    color: #000000;
}
.package-container{
    background: #acfa95;
    border-radius: 10px;
    padding: 18px;
    text-align: center;
}
.form-container{
    // .login-container{
    background: #acfa95;
    border-radius: 10px;
    margin-top: 27px !important;
    padding:20px;
// }
}
</style>