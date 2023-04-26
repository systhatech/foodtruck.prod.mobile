<template>
    <v-row justify="center">
        <v-dialog
        v-model="dialog_review"
        persistent
        scrollable
        fullscreen>
        <v-card class="background-image" style="padding-top: 56px !important;">
            <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                <v-toolbar-title class="text-capitalize">Review Reply</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn text @click="handleClose">
                        Close
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <!-- <v-container> -->
                <div class="pa-4 pb82 background-white pb-16 mt-14">
                  <v-form ref="formReview">
                    <v-textarea
                    label="Write reply"
                    v-model='review.content'
                    auto-grow
                    outlined
                    :rules="rulesRequired"
                    rows="4"
                    class="ma-0 pa-0"
                    color="primary"
                ></v-textarea>
                <!-- <div class="pt-6">
                    <h4 class="mb-2 text-center">Upload Image</h4>
                    <div style="height:200px; margin:0 auto;border:1px solid #dadada" class="pt-5">
                        <InputUpload 
                        type="menu_image" 
                        :max-height="maxHeight"
                        label="Select"
                        :remove="remove"
                        @changeImage="changeImage"/>
                    </div>
                </div> -->
                  </v-form>
                </div>
                <div class="pa-4 custom-bs pb-8" style="position: fixed;bottom: 0;width: 100%;z-index: 1;">
                    <div class="">
                        <v-btn color="primary" block large rounded @click="submit()">Submit</v-btn>
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
import { mapGetters } from 'vuex'
// import InputUpload from '@/components/form-element/InputUpload'
import { ApiService } from '@/core/services/api.service'
import moment from 'moment'
export default {
    props:{
        dialog_review: {
            required:true,
        },
        vendorId:{},
        reviewItem:{},
    },
    data(){
        return {
            base_url,
            moment,
            mdiPlus, 
            mdiMinus,
            remove:false,
            maxHeight:300,
            iconClose: mdiClose,
            review:{
                review_id:'',
                stars:0,
                content:'',
                image:'',
                vendor_id:'',
                client_id:'',
            },
            rulesRequired: [
                v => !!v || 'Required',
            ],
        }
    },
    watch: {
        dialog_review() {
            this.review.vendor_id = parseInt(this.vendorId);
            this.review.client_id = this.reviewItem.client_id;
            this.review.review_id = this.reviewItem.id;
        },
    },
    components:{
        // InputUpload,
    },
    methods: {
        changeImage(file){
            this.loaderShow();
            let formData = new FormData();
            formData.append("file",file.file);
            ApiService.post('/store-image', formData)
            .then((resp) => {
                 this.loaderHide();
                 this.review.image = resp.file_name;
            })
            .catch(() => {
                this.messageError("Failed ! choose image less than size 2mb");
                this.loaderHide();
            });
        },
        async submit(){
            if(!this.$refs.formReview.validate()) return;

            // console.log(this.review);
            this.loaderShow();
            ApiService.post("/review/vendor",this.review)
            .then((resp) => {
                this.loaderHide();
                this.messageSuccess(resp.message);
                this.handleClose();
            })
            .catch((error) => {
                this.loaderHide();
                this.messageError(error.response.data.message);
            })
        },
        handleClose(){
            this.$emit('close');
            this.quantity = 1;
        },
    },
    computed: {
        ...mapGetters({ 
            currentUser : 'auth/user',
        }),
    }
}
</script>
<style lang="scss" scoped>

.v-label {
    font-size: 0.9rem !important;
    text-transform: capitalize !important;
}

.v-card__title{
    padding:16px 25px;
}
</style>