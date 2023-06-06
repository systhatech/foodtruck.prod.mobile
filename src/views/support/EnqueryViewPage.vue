<template>
     <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mg56">
            <div v-if="enqs && Object.keys(enqs).length">
                <div>
                    <h4 class="">{{enqs.title}}</h4>
                    <div v-html="enqs.desc" class="mt-2"></div>
                </div>
                <div class="mb-6 mt-6">
                    <v-form ref="form">
                        <v-textarea auto-grow outlined   
                            rows="2"
                            row-height="20" label="Write comment" v-model="comment"></v-textarea>
                        <v-btn block color="primary" large rounded @click="submitcomment()">submit</v-btn>
                    </v-form>
                </div>
                <div class="reply-wrapper">
                    {{ comment.user}}
                    <p class="">Comments({{comments.length}})</p>
                    <div v-for="(comment,index) in comments" :key="index" class="mb-4 custom-bs pa-4">
                        <div class="d-flex">
                            <v-avatar>
                                <!-- <img 
                                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                                    alt="John"
                                > -->
                                <v-avatar color="indigo" size="38">
                                    <v-icon dark>
                                        mdi-account-circle
                                    </v-icon>
                                </v-avatar>
                            </v-avatar>
                            <div class="ml-4">
                                <p class="ma-0 pa-0">{{comment.user.name == support_client_username ? 'Me': comment.full_name }}</p>
                                <p class="ma-0 pa-0 f8">{{ formatDateTime(date)}}</p>
                            </div>
                        </div>
                        <div class="pt-2">
                            <p class="mb-0">{{comment.comment}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-center">
                <div v-if="loading">
                    <ComponentLoadingVue/>
                </div>
                <div v-else class="unavailable">
                    <p>No data</p>
                </div>
            </div>
        </v-container>
        <Bottomnavbar :value="indexValue"/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
import { ApiSupport } from '@/core/services/api.support'
import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
// import InputUpload from '@/components/form-element/InputUpload'
import {support_client_username } from '@/core/services/config'
// import { mapGetters } from 'vuex'
export default {
    name:'supportViewPage',
    data() {
        return {
            title:'',
            // date:new Date(),
            indexValue:0,
            date: new Date(),
            showMessage:0,
            dumytext:'this is dum test here for testing here',
            rulesRequired: [
                v => !!v || 'Required',
            ],
            message:'Thank you for contacting us!!',
            form:{
                title:'',
                description:'',
            },
            comment:'',
            enqs: [],
            viewItem: {},
            modalView:false,
            id:null,
            comments:[],
            support_client_username,
            loading:false,
        }
    },
    mounted() {
        this.id = this.$router.currentRoute.params.id;
        this.fetchContent();
       
    },
    methods: {
        async submitcomment() {
            if(!this.comment) return;
            // let valid = this.$refs.form.validate();
            // if(!valid) return;
             this.loaderShow();
             let data = {
                "message": this.comment,
                "username": this.support_client_username,
                "task_id": this.id,
             };
            await ApiSupport.post("/tool/task/comment/add", data)
            .then(() => {
                this.loaderHide();
                // this.comments = resp.comments;
                this.fetchComment();
                this.comment = "";
                console.log(this.comments);
            })
            .catch(() => {
                this.loaderHide();
            })
        },
        handleClose() {
            this.modalView = false;
            this.fetchContent();
            // this.fetchComment();
        },
        handleView(item) {
            this.viewItem = item;
            this.modalView = true;
        },
        messageText(message) {
            let text = message;
            // if (message.table_from_id == this.currentUser.table_id && message.table_from == this.currentUser.table) {
            //     text = 'You: ' + text;
            // }
            return text.substr(0, 25);
        },
        async handleSubmit() {
            let valid = this.$refs.formSupport.validate();
            if(!valid) return;

            this.loaderShow();
            await ApiService.post('/support/create',this.form)
            .then((resp) => {
                this.loaderHide();
                this.$refs.formSupport.reset();
                this.message = resp.message;
                this.showMessage = 1;
                setTimeout(() => {
                    this.showMessage = 0;
                },10000)
            })
            .catch(() => {
              this.loaderHide();
              this.messageError('Failed');  
            })
            // console.log(this.form);
        },
        handleBack(){
            this.$router.back();
        },
        async fetchContent() {
            this.loading = true;
            // this.loaderShow();
            await ApiSupport.get(`/tool/tasks/${this.id}/json`)
            .then((resp) => {
                // this.loading = false;
                this.loaderHide();
                this.enqs = resp;
                this.fetchComment();
            })
            .catch(() => {
                this.loading = false;
                this.loaderHide();
            })
        },
        async fetchComment() {
            this.loading = true;
            await ApiSupport.get(`/tool/tasks/${this.id}/comments?user=${this.support_client_username}`)
            .then((resp) => {
                this.loading = false;
                this.loaderHide();
                this.comments = resp.comments;
            })
            .catch(() => {
                this.loading = false;
                this.loaderHide();
            })
        },
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
        // InputUpload
    },
    computed: {
        // ...mapGetters({
        //     currentUser:'auth/user',
        // })
    }
}
</script>
<style lang="scss" scoped>
.reply-wrapper{
    // border:1px solid #dadada;
    // padding:10px;
}
.support-item:not(:last-child) {
    border-bottom:1px solid #dadada;
    margin-bottom:10px;
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