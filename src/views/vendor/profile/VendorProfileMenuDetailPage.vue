<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <div class="mb80">
            <div class="p-relative background-image">
                <div class="pa-4 text-center pt-6">
                    <!-- <v-btn color="primary" rounded outlined block to="/vendor-menu-item-add">add new menu item</v-btn> -->
                    <v-btn color="primary" rounded large block @click="handleMenuAdd()">add new menu item</v-btn>
                </div>
                <!-- {{ menu.itemsGroup }} -->
                <div class="pa-4" v-if="menu && menu.itemsGroup && Object.keys(menu.itemsGroup).length">
                    <v-row>
                        <v-col cols="12" sm="6" md="6" v-for="(m, i) in menu.itemsGroup" :key="i">
                            <h5 class="mb-2 text-uppercase">{{ i }}</h5>
                            <div v-for="(item,index) in m" :key="index">
                                <div class="mb-4">
                                    <div class="d-flex align-center custom-bs pa-3 pl-0" style="min-height:114px" @click="viewMenu(item.id)">  
                                        <v-img
                                        lazy-src="https://picsum.photos/id/11/10/6"
                                        max-width="90"
                                        width="90"
                                        contain
                                        :src="item.profile_pic? base_url+'/image-show/'+item.profile_pic:'usericon'"
                                        ></v-img>
                                        <div class="pl-3 w-100 h-100">
                                            <div class="d-flex justify-space-between flex-column h-100">
                                                <div>
                                                    <h5 class="text-uppercase primary--text">{{item.name}}</h5>
                                                    <p class="mb-1 f8 text-uppercase">({{item.itemCategory ? item.itemCategory:'n/a'}})</p>
                                                </div>
                                                <h4 class="primary--text">{{ formatAmount(item.price)}}</h4>
                                            </div>
                                            <!-- <div>
                                                <v-btn fab small text > <v-icon color="primary">{{ icon_right }}</v-icon></v-btn>
                                            </div> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </div>
                <div v-else class="text-center">
                    <ComponentLoadingVue/>
                </div>
            </div>
            <DialogMenuItemAdd 
            @close="handleClose"
            :dialogMenuItemAdd="modal_menu_add"/>
        </div>
        <Bottomnavbar/>
    </v-container>
</template>
<script>
import Bottomnavbar from '@/components/layout/NavbarBottomVendor' 
import { ApiService } from '@/core/services/api.service'
import { base_url } from '@/core/services/config'
import { mdiChevronRight } from '@mdi/js'
import { mapGetters } from 'vuex'
export default {
    name:'vendorMenuList',
    data() {
        return {
            icon_right: mdiChevronRight,
            title:'',
            base_url,
            modal_menu_add:false,
            is_edit:false,
            schedules:[],
            profile:{},
            cuisine_types:[],
            menu_data:{},
            menu:{},
        }
    },
    mounted() {
        this.profileData();
    },
    methods: {
        handleMenuAdd(){
            this.cuisine_types = this.profile.cuisine_types;
            this.modal_menu_add = true;
        },
        viewMenu(id){
            this.$router.push("/vendor-menu-item/"+id).catch(()=>{});
        },
        handleClose(){
            this.modal_menu_add = false;
            this.profileData();
        },
        handleBack(){
            this.$router.back();
        },
        async profileData() {
            this.loading =true;
            // this.loaderShow();
            await ApiService.get('/menu/'+this.$router.currentRoute.params.menuId).then((resp) => {
                this.loading = false;
                this.loaderHide();
                this.menu = resp.data;
            })
            .catch(() => {
                this.loading = false;
                this.loaderHide();
            })
        },
    },
    components: {
        Bottomnavbar,
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
        Topnavbar:()=>import('@/components/layout/TopnavbarBackCustom'),
        DialogMenuItemAdd: ()=> import('@/views/vendor/profile/modal/ModalMenuItemAdd'),
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
</style>