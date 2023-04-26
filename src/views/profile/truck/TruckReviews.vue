<template>
    <div class="pb-6">
        <div class="text-center pt-4" v-if="truckProfile.can_review">
            <v-btn rounded large block outlined color="primary" @click="handleAddReview()">add review</v-btn>
        </div>
        <div v-if="reviews && reviews.length">
            <div class="pt-4 custom-bs pa-4 mt-4" v-for="(review,index) in reviews" :key="index">
                <div>
                    <div class="d-flex">
                        <v-avatar size="30">
                            <img
                            :src="review.client.contact.profile_pic? base_url+'/image-show/'+review.client.contact.profile_pic:base_url+'/image-show/default.jpg'"
                            alt="Profile Pic">
                        </v-avatar>
                        <div class="pl-2 rating-wrapper w-100">
                            <p class="mb-0">
                                {{ review.client.fullName }}
                            </p>
                            
                            <div class="d-flex align-center justify-space-between w-100">
                                <div class="d-flex align-center">
                                    <v-rating
                                        small
                                        readonly
                                        :value="review.stars"
                                        large
                                        bg-color="orange-lighten-1"
                                        color="success"
                                    ></v-rating>
                                    <div class="pt-1 pl-1">
                                        <pre>({{ review.stars }})</pre>
                                    </div>
                                </div>
                                <!-- <div class="text-right w-100">
                                    <span class="f8 blue-gray--text">{{ formatDate(review.created_at) }}</span>
                                </div> -->
                            </div>
                            
                            <div class="mt-2 w-100">
                                <div>
                                    <p class="mb-0">{{ review.content }}</p>
                                </div>
                                <div v-if="review.image" class="pt-2">
                                    <img
                                        :src="review.image? base_url+'/image-show/'+review.image:base_url+'/image-show/noimage.jpg'"
                                        contain
                                        height="100"
                                        alt="image">
                                </div>
                                <div class="text-right w-100">
                                    <span class="f8" style="color:#a2a2a2;">{{ formatDate(review.created_at) }}</span>
                                </div>
                                <div style="border:1px solid #fafafa; border-radius: 10px;" v-if="review.reply.length">
                                    <div class="d-flex align-center mb-2">
                                        <v-icon color="primary">mdi-comment-multiple</v-icon>
                                        <h4 class="mb-0 pl-1 primary--text">Replies</h4>
                                    </div>
                                    <div >
                                        <div v-for="(reply,ind) in review.reply" :key="ind" class="pa-4 d-flex mb-4" style="border: 1px solid #dadada;border-radius: 10px;">
                                            <div>
                                                <v-avatar size="30">
                                                    <img
                                                    :src="reply.vendor.profile_pic? base_url+'/image-show/'+reply.vendor.profile_pic:base_url+'/image-show/default.jpg'"
                                                    alt="Profile Pic">
                                                </v-avatar>
                                            </div>
                                            <div class="pl-2">
                                                <h4 class="mb-0 primary--text">{{ reply.vendor.name }}</h4>
                                                <p class="mb-2">{{ reply.content }}</p>
                                                <span class="f8" style="color:#a2a2a2;">{{ formatDate(review.created_at) }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="mt-10 text-center">
            <div v-if="loading">
                <ComponentLoadingVue/>
            </div>
            <div v-else class="unavailable">
                <p>No Reviews</p>
            </div>
        </div>
        <ModalAddReview :dialog_review="modal_review" @close="handleClose" :vendorId="vendor_id"/>
    </div>
</template>
<script>
import { base_url } from '@/core/services/config'
import { ApiService } from '@/core/services/api.service'
import { mapGetters } from 'vuex'
export default {
    props:{
        truck:{},
        truckProfile:{}
    },
    data() {
        return {
            base_url,
            modal_review:false,
            vendor_id:'',
            reviews:[],
            loading:false,
        }
    },
    mounted() {
        this.vendor_id = this.$router.currentRoute.params.truckId;
        this.fetchReviews();
    },
    computed: {
        ...mapGetters({currentUser:'auth/user'}),
    },
    methods:{
        fetchReviews(){
            this.loading = true;
            ApiService.post("/review/list",{vendor_id: this.vendor_id})
            .then((resp) =>{
                this.loading = false;
                this.reviews = resp.data;
            })
            .catch((error)=>{
                console.log(error);
            })
        },
        handleAddReview(){
            if(!this.currentUser){
                this.$router.replace("/login?page=truck-profile&id="+this.$router.currentRoute.params.truckId);
                return;
            }else{
                this.modal_review = true;
            }
        },
        
        handleClose(){
            this.modal_review = false;
            this.fetchReviews();
        }
    },
    components:{
        ModalAddReview:()=>import('@/views/profile/truck/menu/ModalAddReview.vue'),
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
    }
}
</script>