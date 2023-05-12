<template>
     <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mg56">
            <div>
                <v-btn to="/support-add" color="primary" class="mb-6" block rounded large>new support request</v-btn>
            </div>
            <div class="mb-14" v-if="enqs && enqs.length">
                <div class="support-item custom-bs pa-4" v-for="(item,index) in enqs" :key="index" @click="handleView(item)">
                    <p class="f8-bold mb-0 text-uppercase">#[{{item.id}}] {{ item.title }}</p>
                    <div class="d-flex justify-space-between">
                        <p class="f8">{{ formatDateTime(item.created_at)}}</p>
                        <!-- <v-chip small :color="item.status=='closed'?'error':''" class="text-capitalize">{{ item.status }}</v-chip> -->
                    </div>
                </div>
            </div>
            <div v-else class="text-center pa-4">
                <div v-if="loading" class="text-center">
                    <ComponentLoadingVue/>
                </div>
                <div class="unavailable" v-else>
                    <p>No request found</p>
                </div>
            </div>
            <ViewEnq 
                :dialogView="modalView" 
                :item="viewItem"
                @close="handleClose"/>
        </v-container>
         <!-- <Bottomnavbar/> -->
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
import { ApiSupport } from '@/core/services/api.support'
import ViewEnq from './EnqueryView.vue'
// import Bottomnavbar from '@/components/layout/NavbarBottomClient'
// import InputUpload from '@/components/form-element/InputUpload'
import { support_client_username } from '@/core/services/config'
import { mapGetters } from 'vuex'
export default {
    name:'supportPage',
    data() {
        return {
            title:'',
            loading:false,
            support_client_username,
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
            enqs: [],
            viewItem: {},
            modalView:false,
        }
    },
    mounted() {
        this.fetchContent();
    },
    methods: {
        handleClose() {
            this.modalView = false;
            this.fetchContent();
        },
        handleView(item) {
            this.$router.push("/support/"+item.id);
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
            console.log(this.form);
        },
        handleBack(){
            this.$router.back();
        },
        async fetchContent() {
            this.loading = true;
            // this.loaderShow();
            // "https://support.shubhu.com/tool/tasks/all?username=foodie&relatable_id=100",
            await ApiSupport.get(`/tool/tasks/all?username=${this.support_client_username}&relatable_id=`+this.currentUser.table_id)
            .then((resp) => {
                this.loading = false;
                this.loaderHide();
                this.enqs = resp.data;
            })
            .catch(() => {
                this.loading = false;
                this.loaderHide();
            })
        },
    },
    components: {
        Topnavbar,
        ViewEnq,
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
        // Bottomnavbar,
        // InputUpload
    },
    computed: {
        ...mapGetters({currentUser:'auth/user'}),
    }
}
</script>
<style lang="scss" scoped>
.support-item:not(:last-child) {
    // border-bottom:1px solid #dadada;
    margin-bottom:14px;
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