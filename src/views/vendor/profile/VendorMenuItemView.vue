<template>
    <v-container class="ma-0 pa-0 background-image h-100">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mb100">
           <div v-if="item && Object.keys(item).length" class="custom-bs">
                <div>
                    <v-img
                    :src="base_url+'/image-show/'+(item && item.profile_pic ? item.profile_pic:'noimage.png')"
                    :lazy-src="base_url+'/image-show/noimage.png'"
                    height="160"
                    ></v-img>
                </div>
                <div class="pt-4 pa-4">
                    <div>
                        <div class="d-flex align-center justify-space-between">
                            <div>
                                <h5 class="text-uppercase primary--text">{{ item.name }}</h5>
                                <p class="mb-0">{{formatAmount(item.price)}}</p>
                                <p class="text-capitalize">({{item.category ? item.category:'n/a'}})</p>
                            </div>
                            <div>
                                <!-- <v-btn color="primary" x-small fab class="mr-2" :to="'/vendor-menu-item-edit/'+item.id"><v-icon>mdi-lead-pencil</v-icon></v-btn> -->
                                <v-btn color="primary" small fab class="mr-2" @click="handleEditItem(item)"><v-icon>mdi-lead-pencil</v-icon></v-btn>
                            </div>
                        </div>
                        <div v-html="item.description"></div>
                    </div>
                    <div class="d-flex justify-space-between pt-4">
                        <div>
                            <v-btn color="primary" large rounded @click="handleAddVarient">add varient</v-btn>
                        </div>
                    </div>
                    <div class="mt-4">
                        <div v-if="item.variants.length">
                            <div v-for="(group,index) in item.variants" :key="index" class="mb-4 abc">
                                <div class="d-flex aling-center justify-space-between pb-4">
                                    <h5 class="text-uppercase pt-2">{{group.variant.name}}</h5>
                                    <div>
                                        <v-btn small fab color="warning" class="mr-2" @click="handleEdit(group.variant)"><v-icon>mdi-lead-pencil</v-icon></v-btn>
                                        <v-btn small fab color="error" @click="handleDelete(group.variant)"><v-icon>mdi-close</v-icon></v-btn>
                                    </div>
                                </div>
                                <div v-for="(item,i) in group.variant.items" :key="i" 
                                    class="d-flex align-center justify-space-between">
                                    <p class="ma-0 pb-2 text-capitalize">{{item.name}}</p>
                                    <span class="">{{ formatAmount(item.value)}}</span>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <p>Variants not available</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div v-if="loading" class="text-center">
                    <ComponentLoadingVue/>
                </div>
                <div v-else class="unavailable">
                    <p>{{  message }}</p>
                </div>
            </div>
            <DialogVarientAdd 
            :dialogVarientAdd="modalVarientAdd"
            :menuName="item.name"
            :menuId="item.id"
            @reloadNow="realoadNow"
            @submit="handleSubmitVarient"
            @close="handleClose"/>

           <DialogVarientUpdate 
            :dialogVarientUpdate="modalVarientUpdate"
            :menuName="item.name"
            :dataGroup="editVarient"
            :menuId="item.id"
            :message="messageDelete"
            @reloadNow="realoadNow"
            @submit="handleUpdateVarient"
            @close="handleClose"/>

            <DialogConfirm 
            @handleConfirm="handleDeleteConfirm"
            @close="handleClose"
            :dialogConfirm="modalConfirm"/>
            <DialogMenuItemEdit 
            @handleConfirm="handleDeleteConfirm"
            @close="handleCloseModalItem"
            :item="editItem"
            :dialogMenuItemEdit="modal_item_update"/>
        </v-container>
         <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
import { base_url } from '@/core/services/config'
import moment from 'moment'
import Bottomnavbar from '@/components/layout/NavbarBottomVendor'
import DialogVarientAdd from '@/views/vendor/profile/components/TruckMenuVarientAdd'
import DialogVarientUpdate from '@/views/vendor/profile/components/TruckMenuVarientUpdate'
import DialogConfirm from '@/components/layout/DialogConfirm'
import DialogMenuItemEdit from '@/views/vendor/profile/modal/ModalMenuItemEdit'
import { mapGetters } from 'vuex'
export default {
    name:'vendorMenuView',
    data() {
        return {
            valid:true,
            start_date: new Date(),
            end_date: new Date(),
            modalVarientAdd:false,
            modalConfirm:false,
            moment,
            loading: false,
            maxHeight:100,
            messageDelete:'Do you want to delete ?',
            title:'',
            base_url,
            schedules:[],
            requiredRules: [
                v => !!v || 'Required',
            ],
            defaultValue:'',
            menu: {
                name:'',
                price:'',
                unit_type:'',
                unit:'',
                description:'',
                profile_pic:'noimage.png',
                item_category_id:'',
                vendor_id:'',
            },
            selectedData:'',
            src:'noimage.png',
            categories:[],
            unit_type:[],
            item:{},
            modalVarientUpdate:false,
            editVarient:{},
            message:'Loading...',
            editItem:{},
            modal_item_update:false,
        }
    },
    mounted() {
        // this.fetchCategory();
        this.fetchMenuData();
    },
    methods: {
        handleDelete(varient) {
            this.editVarient = varient;
            this.modalConfirm = true;
        },
        async handleDeleteConfirm() {
            this.loaderShow();
            await ApiService.post('/varient/group/delete',{
                menu_item_id: this.item.id,
                id: this.editVarient.id,
            })
            .then(() => {
                this.loaderHide();
                this.fetchMenuData();
       
                this.handleClose();
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        },
        realoadNow(){
            this.fetchMenuData();
        },
     
     
        handleEdit(data) {
            this.editVarient = data;
            this.modalVarientUpdate = true;
        },
        handleEditItem(item) {
            this.editItem = item;
            this.modal_item_update = true;
        },
        handleAddVarient() {
            this.modalVarientAdd = true;
        },
        handleSubmitVarient() {
            this.handleClose();
        },
        handleUpdateVarient() {
            console.log("test");
        },
        handleClose() {
            this.editVarient = {};
            this.modalVarientAdd = false;
            this.modalVarientUpdate = false;
            this.modalConfirm = false;
            this.fetchMenuData();
        },
        handleCloseModalItem(){
            this.modal_item_update = false;
            this.fetchMenuData();
        },
         fetchMenuData(){
            // console.log("test");
            this.loading = true;
            this.menuId = this.$router.currentRoute.params.menuId;
            ApiService.get('menuitem/'+this.menuId)
            .then((resp) => {
                this.loading = false;
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.item = resp.data;
                this.item.profile_pic = resp.data.profile_pic ? resp.data.profile_pic:'noimage.png';
                this.defaultValue = resp.data.item_category_id;
                this.defaultValueUnitType = resp.data.unit_type;
            })
            .catch((error) => {
                this.loading = false;
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(error);
            })
        },
        selectedAnswers(data) {
            this.menu.item_category_id = data.selected_data;
        },
        selectedType(data) {
            this.menu.unit_type = data.selected_data;
        },
        fetchCategory(){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.get('lookup/food-menu-item-category')
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.categories = resp.food_category;
                this.unit_type = resp.unit_type;
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(error);
            })
        },
        handleBlur(){

        },
       
        handleBack(){
            this.$router.back();
        },
        changeImage(file){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            let formData = new FormData();
            formData.append("file",file.file);
            ApiService.post('/store-image', formData)
            .then((resp) => {
                 this.$bus.$emit('HIDE_PAGE_LOADER');
                 this.menu.profile_pic = resp.file_name;
            })
            .catch(() => {
                this.messageError("Failed ! choose image less than size 2mb");
                this.$bus.$emit('HIDE_PAGE_LOADER');
            });
        },
        handleSubmit(){
            let valid = this.$refs.formLocation.validate();
            if(!valid){
                this.messsageError('Flease fillup form fields');
                return;
            }
            this.$bus.$emit('SHOW_PAGE_LOADER');
        
            this.menu.vendor_id = this.currentUser.table_id;
            ApiService.post('menuitem/create/only',this.menu)
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageSuccess(resp.message);
                this.$router.push('/profile-menu');
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(error);
            })
        }
    },
    components: {
        Topnavbar,
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
        // DatePicker,
        Bottomnavbar,
        DialogVarientAdd,
        DialogVarientUpdate,
        DialogConfirm,
        DialogMenuItemEdit,
        // InputAddress,
        // InputUpload,
        // InputAutocomplete
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
.abc:not(:last-child){
    border-bottom:1px solid #dadada;
    padding-bottom: 10px;
}
.form-container{
    border-radius: 10px;
    padding:20px;
}
.item_name {
    font-size: 1.1rem;
    // color: #eb1b52;
    text-transform: capitalize;
    padding:0;
    margin:0;
}
</style>