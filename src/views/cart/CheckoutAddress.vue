<template>
     <v-container class="pa-0 ma-0 page-container"> 
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container class="pb-10 mb-14">
            <div class="add-address" @click="handleRoute('checkout-address/1')">
                <div style="margin:0 auto;">
                    <v-icon color="secondary">mdi-plus</v-icon><span>Add Address</span>
                </div>
            </div>
            <div class="d-flex custom-bs pa-3 mb-4" v-for="(address, index) in addresses" :key="index">
                <div><v-icon color="secondary" class="f8">mdi-map-marker</v-icon></div>
                <div class="w-100">
                    <div class="w-100 d-flex justify-space-between">
                        <p class="f8-bold mb-0">{{ address.name }}</p>
                        <v-btn link to="/checkout-address/1" x-small color="secondary" tile text>Edit</v-btn>
                    </div>
                    <p class="f8 mb-0">{{address.phone}}</p>
                    <v-chip x-small color="secondary" class="text-capitalize">{{ address.tag}}</v-chip>
                    <p class="f8 mb-0">{{address.address}}</p>
                </div>
            </div>
        </v-container>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
export default {
    data() {
        return {
            title:'',
            addresses:[
                {id:1, tag:'home',address:'80 kane west hardford',name:'John D',phone:'(099) 888-8888'},
                {id:1, tag:'office',address:'80 kane west hardford',name:'Adam A',phone:'(099) 888-8888'},
            ]
        }
    },
    components: {
        Topnavbar
    },
    methods: {
        handleBack(){
            this.$router.back();
        },
        handleRoute(route) {
            this.$router.push('/'+route);
        }
    }
}
</script>
<style lang="scss" scoped>
.add-address {
    width: 100%;
    border: 3px dashed #83b441;
    text-align: center;
    padding: 20px 10px;
    display: flex;
    color:#83b441;
    align-items: center;
    margin-bottom: 20px;
}
</style>