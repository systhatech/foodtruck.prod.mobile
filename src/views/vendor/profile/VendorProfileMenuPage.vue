<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <div class="custom-bs pa-4  w-100">
            <div class="d-flex align-center justify-space-between">
                <h4>Available Menus</h4>
                <v-btn color="primary" @click="handleMenuAdd()" class="mb-2" large rounded>Add New menu</v-btn>
            </div>
        </div>
        <v-container class="mb80 pb-14">
            <div v-if="loading" class="text-center w-100">
                <ComponentLoadingVue/>
            </div>
            <div v-else>
                <p class="text-center" style="text-decoration: underline;" @click="handleClick('user_mannual_menu')">Video tutorial, how to setup menu?</p>
                <div v-if="profile.menus && profile.menus.length">
                    <div class="d-flex align-center justify-space-around">
                        <div class="share-icon">
                            <ShareNetwork
                                network="facebook"
                                :url="link_url"
                                :title="post_title"
                                description=""
                                quote=""
                                hashtags=""
                            >
                                <v-btn fab text color="blue"><v-icon large>mdi-facebook</v-icon></v-btn>
                            </ShareNetwork>
                            <ShareNetwork
                                network="twitter"
                                :url="link_url"
                                :title="post_title"
                                description=""
                                quote=""
                                hashtags=""
                            >
                                <v-btn fab text color="primary"><v-icon large>mdi-twitter</v-icon></v-btn>
                            </ShareNetwork>
                        </div>
                    </div>
                    <VendorMenuList :truckProfile="profile" @fetch="profileData"/>
                </div>
                <div v-else class="unavailable">
                    <p>No menu available</p>
                </div>
            </div>
        </v-container>
        <DialogMenuAdd 
            :dialog-menu-add="modal_menu_add" 
            :cuisine_types="cuisine_types" 
            :menuData="menu_data"
            :is-edit="is_edit"
            @close="handleClose"/>
            <Bottomnavbar/>
            <ModalVideoPlayer/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
import Bottomnavbar from '@/components/layout/NavbarBottomVendor'
import { base_url } from '@/core/services/config'
import VendorMenuList from '@/views/vendor/profile/components/VendorMenuList.vue'
import ModalVideoPlayer from '@/views/vendor/profile/modal/ModalVideoPlayer.vue'
// import { Facebook, Twitter } from 'vue-socialmedia-share';
// import InputUpload from '@/components/form-element/InputUpload'
import { mapGetters } from 'vuex'
export default {
    name:'vendorMenuList',
    data() {
        return {
            title:'',
            base_url,
            modal_menu_add:false,
            is_edit:false,
            schedules:[],
            profile:{},
            cuisine_types:[],
            menu_data:{},
            loading: false,
            link_url:'',
            post_title:'',
        }
    },
    mounted() {
        // VENDOR_MENU_EDIT
        this.$bus.$on("VENDOR_MENU_EDIT", (menu) => {
            this.menu_data = menu;
            this.cuisine_types = this.profile.cuisine_types;
            this.is_edit = true;
            this.modal_menu_add = true;
        });
        this.profileData();
        this.link_url = "https://yummtrux.systha.com/mobile/index.html#/truck-profile/"+this.currentUser.table_id+"?cmp=menus";
        this.post_title = this.currentUser.owner.name+" : Today's special menu";
    },
    methods: {
        handleClick(param){
            this.$bus.$emit('MODAL_VIDEO_PLAYER_OPEN',{param});
        },
        handleMenuAdd(){
            this.cuisine_types = this.profile.cuisine_types;
            this.is_edit = false;
            this.modal_menu_add = true;
        },
        handleClose(){
            this.modal_menu_add = false;
            this.profileData();
        },
        handleBack(){
            this.$router.back();
        },
        async profileData() {
            this.loading = true;
            await ApiService.post('/truck/profile/'+ this.currentUser.table_id).then((resp) => {
                this.loading = false;
                this.profile = resp;
            })
            .catch(() => {
                this.loading = false;
            })
        },
    },
    components: {
        VendorMenuList,
        ModalVideoPlayer,
        Topnavbar,
        DialogMenuAdd: ()=> import('@/views/vendor/profile/modal/ModalVendorMenuAdd'),
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
        Bottomnavbar,
        // Facebook,
        // Twitter
        // InputUpload
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
        })
    }
}
</script>
<style lang="scss" scoped>
.section-sticky{
    position: fixed;
    top: 54px;
    background-color: rgb(255 255 255);
    z-index: 1;
    -webkit-box-shadow: 0px 0px 34px 1px #dedede5e !important;
    -moz-box-shadow: 0px 0px 34px 1px #dedede5e !important;
    box-shadow: 0px 0px 34px 1px #dedede5e !important;
    background:#fff;
}
.schedule {
    text-align: center;
    padding: 10px;
    color: #b5b5b5;
    background: #fff;
    height: 180px;
    border-radius: 20px;
    align-items: center;
    justify-content: space-around;
    display: flex;
}
.schedule-wrapper{
    background: #ffffff;
    border-radius:10px;
    padding:10px;
    margin-bottom: 70px;
}
.schedulte-item-wrapper{
    padding:10px;
    // border:1px solid #dadada;
    margin-bottom: 14px;
    border-radius:10px;
    -webkit-box-shadow: 3px 5px 28px -7px rgba(184,184,184,0.52);
    -moz-box-shadow: 3px 5px 28px -7px rgba(184,184,184,0.52);
    box-shadow: 3px 5px 28px -7px rgba(184,184,184,0.52);
}
.form-container{
    // .login-container{
    // background: #acfa95;
    border-radius: 10px;
    // margin-top: 27px !important;
    padding:20px;
// }
}
.share-icon{
    display: flex;

    a{
        text-decoration: none;
    }
}
</style>