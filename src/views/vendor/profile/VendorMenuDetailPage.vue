<template>
    <v-container class="ma-0 pa-0 background-image h-100">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mg56">
           <div v-if="item && Object.keys(item).length">
                <div>
                    <v-img v-if="item.profile_pic !=='noimage.png'"
                    :src="base_url+'/image-show/'+item.profile_pic"
                    lazy-src="https://picsum.photos/id/11/100/60"
                    height="160"
                    ></v-img>
                </div>
                <div class="pt-4">
                    <div>
                        <h5 class="text-uppercase primary--text">{{ item.name }}</h5>
                    </div>
                    <div class="d-flex justify-space-between">
                        <span>{{formatAmount(item.price)}}</span>
                         <div>
                            <v-btn color="warning" x-small  outlined fab class="mr-2" :to="'/menu-edit/'+item.id"><v-icon>mdi-lead-pencil</v-icon></v-btn>
                            <v-btn color="error" small tile outlined @click="handleAddVarient">add varient</v-btn>
                         </div>
                    </div>
                    <div class="mt-4">
                        <div v-for="(group,index) in item.variants" :key="index" class="mb-4 abc">
                            <div class="d-flex aling-center justify-space-between">
                                <p class="ma-0 pa-0 f9-bold text-capitalize">{{group.variant.name}}</p>
                                <div>
                                    <v-btn x-small fab text color="warning" class="mr-2" @click="handleEdit(group.variant)"><v-icon>mdi-lead-pencil</v-icon></v-btn>
                                    <v-btn x-small fab text color="error" @click="handleDelete(group.variant)"><v-icon>mdi-close</v-icon></v-btn>
                                </div>
                            </div>
                            <div v-for="(item,i) in group.variant.items" :key="i" 
                                class="d-flex align-center justify-space-between">
                                <p class="ma-0 pb-2 f8 text-capitalize">{{item.name}}</p>
                                <span class="f8">{{ formatAmount(item.value)}}</span>
                            </div>
                        </div>
                    </div>
                </div>
           </div>
           <div class="unavailable" v-else>
               <p>{{ message}}</p>
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
        </v-container>
         <!-- <Bottomnavbar value="0"/> -->
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
// import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
import { base_url } from '@/core/services/config'
// import InputAutocomplete from '@/components/layout/InputAutocompleteSingleTextValue'
import moment from 'moment'
// import InputUpload from '@/components/form-element/InputUpload'
import DialogVarientAdd from '@/views/vendor/profile/components/TruckMenuVarientAdd'
import DialogVarientUpdate from '@/views/vendor/profile/components/TruckMenuVarientUpdate'
import DialogConfirm from '@/components/layout/DialogConfirm'
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
                category_id:'',
                vendor_id:'',
            },
            selectedData:'',
            src:'noimage.png',
            categories:[],
            unit_type:[],
            item:{},
            modalVarientUpdate:false,
            editVarient:{},
            message:'Loading...'
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
        },
         fetchMenuData(){
            console.log("test");
            this.menuId = this.$router.currentRoute.params.menuId;
            this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.get('menuitem/'+this.menuId)
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.item = resp.data;
                this.item.profile_pic = resp.data.profile_pic ? resp.data.profile_pic:'noimage.png';
                this.defaultValue = resp.data.category_id;
                this.defaultValueUnitType = resp.data.unit_type;
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(error);
            })
        },
        selectedAnswers(data) {
            this.menu.category_id = data.selected_data;
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
        // DatePicker,
        // Bottomnavbar,
        DialogVarientAdd,
        DialogVarientUpdate,
        DialogConfirm,
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