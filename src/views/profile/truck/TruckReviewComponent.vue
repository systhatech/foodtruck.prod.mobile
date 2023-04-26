<template>
    <div class="">
        <div class="text-center pt-4">
            <v-btn rounded large block outlined color="primary" @click="handleAddReview()">add review</v-btn>
        </div>
        <div class="pt-4 custom-bs pa-4 mt-4" v-if="truck.description">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci, beatae.</p>
        </div>
        <div v-else class="unavailable">
            <p>No description</p>
        </div>
        <ModalAddReview :dialog_review="modal_review" @close="handleClose" :vendorId="vendor_id"/>
    </div>
</template>
<script>
import { base_url } from '@/core/services/config'
export default {
    props:{
        truck:{},
    },
    data() {
        return {
            base_url,
            modal_review:false,
            vendor_id:'',
        }
    },
    mounted() {
        this.vendor_id = this.$router.currentRoute.params.truckId;
    },
    methods:{

        handleAddReview(){
            this.modal_review = true;
        },
        
        handleClose(){
            this.modal_review = false;
        }
    },
    components:{
        ModalAddReview:()=>import('@/views/profile/truck/menu/ModalAddReview.vue')
    }
}
</script>