<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container class="mg56 pa-0">
            <div class="pa-4">
                <div v-if="currentUser && reviews && reviews.length" class="">
                    <div v-for="(review,index) in reviews" :key="index" class="mb-4 custom-bs pa-4">
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
                                    </div>
                                    
                                    <div class="mt-2 w-100">
                                        <div>
                                            <p class="mb-0">{{ review.content }}</p>
                                        </div>
                                        <div v-if="review.image">
                                            <img
                                                :src="review.image? base_url+'/image-show/'+review.image:base_url+'/image-show/noimage.jpg'"
                                                contain
                                                height="100"
                                                alt="image">
                                        </div>
                                        <div class="text-right w-100">
                                            <span class="f8" style="color:#a2a2a2;">{{ formatDate(review.created_at) }}</span>
                                        </div>

                                        <!-- <div>
                                            <v-switch
                                                    v-model="review.published"
                                                    hide-details
                                                    inset
                                                    @change="handleChange(review)"
                                                    :label="review.published?'Published':'Draft'">
                                            </v-switch>
                                        </div> -->
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
                                                        <h4 class="mb-0 primary--text text-capitalize">{{ reply.vendor.name }}</h4>
                                                        <p class="mb-2">{{ reply.content }}</p>
                                                        <span class="f8" style="color:#a2a2a2;">{{ formatDate(review.created_at) }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mt-4 d-flex">
                                            <!-- <v-btn rounded large outlined color="primary" block @click="handleReply(review)">Reply</v-btn> -->
                                            <v-textarea
                                                label="Write reply"
                                                v-model="review.reply_text"
                                                auto-grow
                                                outlined
                                                rows="1"
                                                class="ma-0 pa-0"
                                                color="primary"
                                            ></v-textarea>
                                            <div class="ml-4 pt-2">
                                                <v-btn :disabled="!review.reply_text" fab small color="primary" @click="handleReply(review)"><v-icon>mdi-send</v-icon></v-btn>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="w-100 text-center">
                        <div v-if="loading">
                            <ComponentLoadingVue/>
                        </div>
                     
                        <div v-else class="unavailable">
                            <p>No reviews available</p>
                        </div>
                    </div>
                </div>
            </div>
            <DialogConfirm
                :dialogConfirm="modal_confirm"
                :message="message"
                @handleConfirm="confirmChange"
                @close="handleClose"
            />
            <ModalVendorUser @close="fetchMembers()"/>
            <ModalAddReview 
                @close="handleClose" 
                :reviewItem="selected_item"
                :dialog_review="modal_review" 
                :vendorId="vendor_id"/>
        </v-container>
        <Bottomnavbar/>
    </v-container>
</template>
<script>
import {base_url} from '@/core/services/config';
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import {ApiService} from "@/core/services/api.service";
import Bottomnavbar from "@/components/layout/NavbarBottomVendor";
import DialogConfirm from "@/components/layout/DialogConfirm";
import {mapGetters} from "vuex";
import { mdiPhone, mdiArchiveOutline, mdiChat, mdiAccount} from '@mdi/js';

export default {
    name: "ChatList",
    data() {
        return {
            loading:false,
            modal_review:false,
            iconPhone: mdiPhone,
            iconArchive: mdiArchiveOutline,
            iconChat: mdiChat,
            iconAccount: mdiAccount,
            base_url,
            title: "",
            indexValue: 2,
            valid: true,
            maxHeight: 100,
            dialogConfirm: false,
            message: "Do you want to Continue?",
            tz: "",
            customer: {
                fname: "",
                lname: "",
                phone_no: "",
                email: "",
                profile_pic: "",
                is_default:0,
            },
            file_name: "",
            ruleRequired: [(v) => !!v || "Required"],
            rulesEmail: [
                (v) => !!v || "E-mail is required",
                (v) => /.+@.+/.test(v) || "E-mail must be valid",
            ],
            update_input_file: true,
            src: "",
            members: [],
            archive: {
                table_name: "",
                table_id: "",
            },
            modal_vendor_user:false,
            reviews:[],
            modal_confirm:false,
            selected_item:null,
            vendor_id:'',
        };
    },
    mounted() {
        this.fetchReviews();
        this.vendor_id = this.currentUser.table_id;
        // this.initTimezone();
    },
    methods: {
        handleReply(item){
            // this.selected_item = item;
            // this.modal_review = true;
            // review_id:'',
            //     stars:0,
            //     content:'',
            //     image:'',
            //     vendor_id:'',
            //     client_id:'',
            // let review = {
            //     vendor_id: parseInt(this.vendor_id),
            //     client_id: item.client_id,
            //     review_id: item.id,
            //     content: item.reply_text,
            //     stars:0,
            //     image:'',
            // }

            this.loaderShow();
            ApiService.post("/review/vendor",{
                vendor_id: parseInt(this.vendor_id),
                client_id: item.client_id,
                review_id: item.id,
                content: item.reply_text,
                stars:0,
                image:'',
            })
            .then((resp) => {
                this.loaderHide();
                this.fetchReviews();
                this.messageSuccess(resp.message);
                this.handleClose();
            })
            .catch((error) => {
                this.loaderHide();
                this.messageError(error.response.data.message);
            })
            // console.log(review);
        },
        handleChange(param){
            this.selected_item = param;
            this.modal_confirm = true;
            console.log(param);
        },
        confirmChange(){
            this.loaderShow();
            this.selected_item.published = this.selected_item.published ?1:0;
            ApiService.post('/review/publish',this.selected_item)
            .then(() => {
                this.loaderHide();
                this.fetchReviews();
                this.handleClose();
            })
            .catch(() => {
                this.loaderHide();
            })
            console.log(this.selected_item);
        },
        fetchReviews(){
            this.loading = true;
            ApiService.post("/review/list",{vendor_id: this.currentUser.table_id})
            .then((resp) =>{
                this.loading = false;
                this.reviews = resp.data;
            })
            .catch((error)=>{
                console.log(error);
            })
        },
        handleUserAdd(){
            this.$bus.$emit('MODAL_VENDOR_USER',{});
        },
        handleRoute(user) {
            this.$bus.$emit('MODAL_VENDOR_USER',user);
        },
        messageText(message) {
            let text = message.message;
            if (message.table_from_id == this.currentUser.table_id && message.table_from == this.currentUser.table) {
                text = 'You: ' + text;
            }
            return text.substr(0, 25);
        },
        async initTimezone() {
            let timezone_offset_minutes = new Date().getTimezoneOffset();
            timezone_offset_minutes =
                timezone_offset_minutes === 0 ? 0 : -timezone_offset_minutes;

            try {
                let res = await ApiService.get("timezone/" + timezone_offset_minutes);
                this.tz = res.tz
            } catch (error) {
                console.error(error);
            }
        },
        handleClose() {
            this.modal_confirm = false;
            this.modal_vendor_user = false;
            this.modal_review = false;
            this.fetchReviews();
        },
        handleOpenArkive(param) {
            this.archive.table_name = param.table;
            this.archive.table_id = param.table_id;
            this.modal_confirm = true;
        },
        handleArchive() {
            this.$bus.$emit("SHOW_PAGE_LOADER");
            ApiService.post("/chat/archive", this.archive)
                .then((resp) => {
                    this.$bus.$emit("HIDE_PAGE_LOADER");
                    this.messageSuccess(resp.message);
                    this.handleClose();
                    this.fetchMembers();
                })
                .catch(() => {
                    this.$bus.$emit("HIDE_PAGE_LOADER");
                    this.messageError("Failed to archive");
                });
        },
        handleBack() {
            this.$router.back();
        },
      
        fetchMembers() {
            this.loading = true;
            ApiService.post("/vendor/users")
                .then((resp) => {
                    this.loading = false;
                    this.$bus.$emit("HIDE_PAGE_LOADER");
                    this.members = resp.data;
                })
                .catch(() => {
                    this.loading = false;
                    this.$bus.$emit("HIDE_PAGE_LOADER");
                    this.message("Failed to fetch members");
                });
        },
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        DialogConfirm,
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
        ModalVendorUser: () => import('@/views/vendor/profile/modal/ModalVendorUser.vue'),
        ModalAddReview:()=>import('@/views/profile/truck/menu/ModalAddReviewReply.vue'),
    },
    computed: {
        ...mapGetters({currentUser:'auth/user'}),
    },
};
</script>
<style lang="scss" scoped>
.badge {
    font-size: 90%;
}

.chat-lists {
    list-style: none;
    padding: 0;
    margin: 0px;

    li {
        // padding-bottom: 20px;

        &:not(:last-child) {
            margin-bottom: 0px;
            border-bottom: 1px solid #dadada;
        }

        .last_msg {
            margin: 0;
            font-size: 0.9rem;
            // font-weight: 600;
        }

        .last_msg_date {
            margin: 0;
            font-size: 0.9rem;
            // font-style: italic;
            color: #757575;
        }
    }
}

.price {
    font-size: 3rem;
    color: #000000;
}

.package-container {
    background: #acfa95;
    border-radius: 10px;
    padding: 18px;
    text-align: center;
}

.form-container {
    // .login-container{
    background: #acfa95;
    border-radius: 10px;
    margin-top: 27px !important;
    padding: 20px;
    // }
}
</style>
