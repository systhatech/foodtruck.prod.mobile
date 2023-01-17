<template>
     <v-container class="pa-0 ma-0 page-container"> 
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container class="pb-10 mb-14">
            <div class="custom-bs pa-3 mb-4" @click="handleRoute('payment-method-new')">
                <div class="d-flex align-center justify-space-between">
                    <h4>Add Payment method</h4>
                    <v-icon>mdi-chevron-right</v-icon>
                </div>
            </div>
            <div class="mt-2 mb-4 w-100 custom-bs pa-3 d-flex justify-space-between" v-for="(card,index) in cards" :key="index">
                <div>
                    <h5>{{ card.type }} {{ card.card_number }}</h5>
                    <p class="mb-0 f8 text-capitalize">{{ card.name}}</p>
                    <div class="d-flex align-center">
                        <p class="f8 mb-0 color-secondary">{{ card.exp }}</p> <v-btn tile text small color="primary">Update</v-btn>
                    </div>
                </div>
                <div v-if="index==0">
                    <!-- <v-chip x-small>Default</v-chip> -->
                    <v-btn x-small text color="primary">default</v-btn>
                </div>
                <div v-else>
                    <v-btn x-small outlined rounded color="secondary" @click="handleMakeDefault">make default</v-btn>
                </div>
            </div>
        </v-container>
        <DialogDefault :dialog-make-default="dialogMakeDefault" 
        @close="handleClose"
        @submit="handleMakeDefault"/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import DialogDefault from './DialogMakeDefault'
export default {
    data() {
        return {
            title:'',
            phone:'',
            dialogMakeDefault:false,
            cards:[
                {name:'suman thapa',type:'Visa', card_number:'****1876',exp:'02/2024'},
                {name:'suman thapa',type:'Visa', card_number:'****1786',exp:'03/2024'},
                {name:'suman thapa',type:'Visa', card_number:'****1963',exp:'04/2024'},
            ]
        }
    },
    components: {
        Topnavbar,
        DialogDefault
    },
    methods: {
        handleBack(){
            this.$router.back();
        },
        handleClose(){
            this.dialogMakeDefault = false;
        },
        handleMakeDefault(){
            this.dialogMakeDefault = true;
        },
        handlePaymentMethod() {
            console.log("test");
        },
        handleRoute(route){
            this.$router.push('/'+route);
        },
    }
}
</script>
<style lang="scss" scoped>
.payment-method {
    width: 100%;
    border: 2px dashed #83b441;
    text-align: center;
    padding: 10px 12px;
    display: flex;
    color:#83b441;
    align-items: center;
    margin-bottom: 20px;
}
</style>