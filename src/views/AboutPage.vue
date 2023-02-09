<template>
     <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mg56">
            <div v-if="loading" class="text-center">
                <ComponentLoadingVue/>
            </div>
            <div v-else class="pa-4 custom-bs">
                <div v-html="content"></div>
            </div>
        </v-container>
         <!-- <Bottomnavbar :value="indexValue"/> -->
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
// import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
// import InputUpload from '@/components/form-element/InputUpload'
// import { mapGetters } from 'vuex'
export default {
    name:'EditProfile',
    data() {
        return {
            title:'',
            loading: false,
            content:'No content'
        }
    },
    mounted() {
        this.fetchContent();
    },
    methods: {
        handleBack(){
            this.$router.back();
        },
        async fetchContent() {
            // this.$bus.$emit('SHOW_PAGE_LOADER');
            this.loading= true;
            await ApiService.post('/static-content',{page:'page_about'}).then((resp) => {
                this.loading = false;
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.content = resp.data.page_content;
            })
            .catch(() => {
                this.loading = false;
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
        },
    },
    components: {
        Topnavbar,
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
        // Bottomnavbar,
        // InputUpload
    },
    computed: {
        //   ...mapGetters({
        //     currentUser:'auth/user',
        // })
    }
}
</script>
<style lang="scss" scoped>
.form-container{
    // .login-container{
    background: #acfa95;
    border-radius: 10px;
    margin-top: 27px !important;
    padding:20px;
// }
}
</style>