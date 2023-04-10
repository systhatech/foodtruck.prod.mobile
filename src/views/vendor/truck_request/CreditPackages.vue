<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mg56">
            <div v-if="packages && packages.length">
                <div class="custom-bs pa-4 mb-4" v-for="(item,index) in packages" :key="index">
                    <div class="d-flex align-center justify-space-between">
                        <div>
                            <h3 class="text-capitalize primary--text">{{item.description}}</h3>
                            <p>{{item.no_of_credits}} Credits</p>
                        </div>
                        <div class="text-right">
                            <h3 class="mb-0 primary--text">{{formatAmount(item.amount)}} </h3>
                            <p class="f8">{{ formatAmount(item.amount/item.no_of_credits) }}/Credit</p>
                        </div>
                    </div>
                    <div class="text-center mt-4 pb-4">
                        <v-btn class="error" rounded large @click="handleCreditTrial(item)" v-if="item.is_trial">Add Trial Credit</v-btn>
                        <v-btn class="primary" rounded large @click="handleCreditBuy(item)" v-else>Add Credit</v-btn>
                    </div>
                </div>
                <ModalBuyCredit/>
            </div>
            <div v-else class="unavailable">
                <p>No packages found</p>
            </div>
        </v-container>
        <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import Bottomnavbar from '@/components/layout/NavbarBottomVendor'
import { mapGetters, mapActions } from 'vuex';
import { base_url } from '@/core/services/config'
import { ApiService } from "@/core/services/api.service";
export default {
    name:'RequestListPage',
    data() {
        return {
            title:'',
            base_url,
            message:'Loading...',
            packages:[],
            stripe_key:'',
        }
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        ModalBuyCredit: () => import("@/views/vendor/truck_request/ModalBuyCredit.vue"),

    },
    mounted() {
        this.fetchPackages();
    },
    methods: {
        ...mapActions({
            signOutAction: 'auth/signOut',
            fetchCarts: 'truck/fetchCarts',
        }),
        fetchPackages(){
            this.loaderShow();
            ApiService.post("/credit_packages")
            .then((resp) =>{
                this.loaderHide();
                this.packages = resp.data;
                this.stripe_key = resp.payment_credientials;
            })
            .catch((error) =>{
                this.loaderHide();
                console.log(error);
            })
        },
        handleCreditBuy(item){
            this.$bus.$emit('MODAL_CREDIT_BUY', {item, 'key': this.stripe_key, 'trial':0});
        },
        handleCreditTrial(item){
            this.$bus.$emit('MODAL_CREDIT_BUY', {item, 'key': this.stripe_key, 'trial':1});
        },
        handleBack() {
            this.$router.back();
        },
     
    },
    computed: {
        ...mapGetters({currentUser:'auth/user'}),
    }
}
</script>
<style lang="scss" scoped>
.mb50{
    margin-bottom: 50px;
}
.name-wrapper{
    align-items: unset;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.setting-list{
    ul{
        list-style: none;
        // margin-top:25px;
        padding:0;
        li{
            // background: #fff;
            // color:#fff;
            padding: 20px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0;
            &:not(:last-child) {
                border-bottom:1px solid #d2d5d4
            }
            span{
                font-size: 0.9rem;
                font-weight: 400;
            }
        }
    }
}
</style>