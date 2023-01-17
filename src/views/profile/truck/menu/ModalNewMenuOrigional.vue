<template>
    <v-row justify="center">
        <v-dialog
        v-model="dialogNewMenu"
        fullscreen
        hide-overlay
        persistent
        scrollable
        >
        <v-card>
            <v-card-title class="menu-card-title">
                <div class="w-100 justify-space-between d-flex">
                    <h3 class="text-secondary w-100 text-capitalize">Menu</h3>
                    <div @click="handleClose" style="width:10px;" class="mx-auto"> <v-icon> {{ iconClose }} </v-icon></div>
                </div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0">

                <v-row class="h-100">
                    <v-col cols="12" sm="12" md="12" lg="3" xl="2">
                        <div>
                            <div class="background-image">
                                <InputUpload :src="src" :update_input_file="update_input_file" type="menu_image" @changeImage="changeImage"/>
                            </div>
                            <div>
                                <v-text-field class="mt-4"
                                :rules="requiredRules"
                                @blur="handleBlurMenuName"
                                v-model="menu_name"
                                label="Menu Name"
                                required
                                ></v-text-field>
                            </div>
                            <div class="d-flex align-center justify-space-between">
                                <InputAutocomplete :label="categoryLabel"
                                    :items="category_items"
                                    :removeSelected="removeSelected"
                                    :model="selected_categories"
                                    @selectedData="handleCategorySelected"/>
                                <div style="width:50px; text-align:right">
                                    <v-btn
                                        fab
                                        dark
                                        x-small
                                        color="primary"
                                        title="new category"
                                        @click="handleNewCategory"
                                        >
                                        <v-icon dark>
                                            mdi-plus
                                        </v-icon>
                                    </v-btn>
                                </div>
                            </div>
                            <div>
                                <div class="menu-category-list">
                                    <ul>
                                        <li v-for="(category, index) in food_categories" :key="index" :class="[(selected_category == index) ? 'active' :'']">
                                            <div class="d-flex align-center justify-space-between" >
                                                <div  @click="handleCategoryClick(index, category)"><v-icon color="primary">mdi-muffin</v-icon> <span class="category-name">{{ category.category_name }}</span></div>
                                                <v-btn
                                                    fab
                                                    dark
                                                    x-small
                                                    color="secondary"
                                                    @click="removeCategory(index, category)"
                                                    >
                                                    <v-icon dark>
                                                        mdi-minus
                                                    </v-icon>
                                                </v-btn>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" lg="3" xl="3" class="section-middle">
                        <div v-if="category_selected"  class="category-items">
                            <div class="text-center">
                                <v-btn small tile color="primary" @click="handleAddNewItem">Add Menu Item</v-btn>
                            </div>
                            <ul v-if="items && items.length > 0">
                                <li @click="handleMenuItemSelected(item)" v-for="(item, index) in items" :key="index">
                                    <div>{{item.name}}</div>
                                </li>
                            </ul>
                        </div>
                         <div v-else class="h-100 d-flex align-center justify-space-around">
                            <h3 class="not-message">Category not selected</h3>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" lg="6" xl="7" class="section-right pt-0 mt-0">
                        <div v-if="menu_item_selected">
                            <v-row>
                                <v-col
                                cols="12"
                                md="6"
                                >
                                <v-text-field
                                    label="Dish Name"
                                    v-model="new_menu.name"
                                    required
                                ></v-text-field>
                                </v-col>

                                <v-col
                                cols="12"
                                md="2"
                                >
                                <v-text-field
                                    label="Unit Type"
                                    v-model="new_menu.unit_type"
                                    required
                                ></v-text-field>
                                </v-col>

                                <v-col
                                cols="12"
                                md="2"
                                >
                                <v-text-field
                                    label="Unit"
                                    v-model="new_menu.unit"
                                    required
                                ></v-text-field>
                                </v-col>
                                <v-col
                                cols="12"
                                md="2"

                                >
                                <v-text-field
                                    label="Price"
                                    v-model="new_menu.price"
                                    required
                                ></v-text-field>
                                </v-col>
                                <v-col
                                class="pt-0 mt-0 pb-0 mb-0"
                                cols="3"
                                md="3"
                                >
                                <div class="item-background-image">
                                    <InputUpload :src="new_menu.thumbnail" :update_input_file_second="update_input_file_second" type="menu_item_image" @changeImage="changeImage"/>
                                </div>
                                </v-col>
                                <v-col
                                class="pt-0 mt-0 pb-0 mb-0"
                                cols="9"
                                id="textarea"
                                md="9"
                                >
                                <v-textarea
                                    tile
                                    outlined
                                    class="pa-0"
                                    label="Description"
                                    v-model="new_menu.description"
                                    required
                                    rows="2"
                                ></v-textarea>
                                </v-col>
                                <v-col
                                cols="12"
                                md="12"
                                >
                                <div>
                                    <v-btn color="primary" @click="handleAddVariant" small tile>
                                        Add Variant
                                    </v-btn>
                                </div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" lg="12"> 
                                    <v-expansion-panels accordion  v-model="panel">
                                        <v-expansion-panel
                                            v-for="(item,i) in new_menu.varients.filter(Boolean)"
                                            :key="i">
                                            <v-expansion-panel-header>
                                                {{ item.name }}
                                            </v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <div class="d-flex align-center justify-space-between">
                                                    <v-text-field label="Group Name" v-model="item.name" autofocus></v-text-field>
                                                    <div style="width: 100px;text-align: right;">
                                                        <v-btn
                                                            fab
                                                            dark
                                                            x-small
                                                            @click="handleGroupItemRemove(i,item)"
                                                            color="secondary"
                                                            >
                                                            <v-icon dark>
                                                                mdi-minus
                                                            </v-icon>
                                                        </v-btn>
                                                        <v-btn
                                                            fab
                                                            dark
                                                            x-small
                                                            @click="handleGroupItem(i)"
                                                            color="primary"
                                                            >
                                                            <v-icon dark>
                                                                mdi-plus
                                                            </v-icon>
                                                        </v-btn>
                                                    </div>
                                                </div>
                                                <div>
                                                     <ul class="variant-group">
                                                        <li v-for="(variant_item, index) in item.items" :key="index">
                                                            <v-row>
                                                                <v-col cols="12" md="7" lg="7" xl="7" class="pt-0 pb-0">
                                                                    <v-text-field label="Item Name" v-model="variant_item.name"></v-text-field>
                                                                </v-col>
                                                                <v-col cols="8" md="3" lg="3" xl="3" class="pt-0 pb-0">
                                                                    <v-text-field label="Price" type="number" v-model="variant_item.value"></v-text-field>
                                                                </v-col>
                                                                <v-col cols="4" md="2" lg="2" xl="2" class="pt-0 pb-0">
                                                                    <div class="h-100 d-flex align-center">
                                                                        <v-btn
                                                                        fab
                                                                        dark
                                                                        x-small
                                                                        color="secondary"
                                                                        @click="handleRemoveItem(i,index)"
                                                                        >
                                                                        <v-icon dark>
                                                                            mdi-minus
                                                                        </v-icon>
                                                                        </v-btn>
                                                                    </div>
                                                                </v-col>
                                                            </v-row>
                                                        </li>
                                                     </ul>
                                                </div>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                </v-col>
                            </v-row>
                        </div>
                        <div v-else class="h-100 d-flex align-center justify-space-around">
                            <h3 class="not-message">Menu item not selected</h3>
                        </div>
                    </v-col>
                </v-row>

            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="d-flex justify-space-between pt-4 pb-4 card-actions">
                <v-btn tile @click="handleClose">Close</v-btn>
                <v-btn color="primary" tile @click="handleSubmit">Submit</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
        <ModalAddCategory
            :dialog_new_category="dialog_new_category"
            @categoryCreated="handleCategoryCreated"
            @handleCloseCategory="handleCloseCategory"/>
        <DialogDelete
            :category_id="deleteCategory"
            :dialogDelete = "dialogDelete"
            @handleClose="handleDialogClose"
            @handleConfirm="handleConfirm"/>
        <DialogDeleteVariant
            :variantItemDelete="variant_item_delete"
            :dialogDeleteVariant="dialogDeleteVariant"
            @handleClose="handleDialogVariantClose"
            @handleConfirmVariant="handleConfirmVariant"/>
    </v-row>
</template>
<script>
import { mdiPlus, mdiMinus, mdiClose } from '@mdi/js'
import InputAutocomplete from '../../../components/InputAutocompleteGlobal'
import InputUpload from '../../../components/InputUpload'
import { axiosWeb } from '../../../../utils/axios-web'
import { axios } from '../../../../utils/axios'
import { mapGetters } from 'vuex'
import vueDropzone from "vue2-dropzone";
import DialogDelete from './DialogDelete';
import DialogDeleteVariant from './DialogDeleteVariant';
import ModalAddCategory from './ModalAddCategory';
export default {
    props:{
        dialogNewMenu: {
            required:true,
        },
        menu:{}
    },
    data(){
        return {
            dialogDelete:false,
            dialog_new_category: false,
            deleteCategory:'',
            deleteCategoryIndex:0,
            src:'',
            selected_category:null,
            iconClose: mdiClose,
            category_selected:false,
            menu_item_selected:false,
            removeSelected:false,
            requiredRules: [
                v => !!v || 'Field is required',
            ],
            categoryLabel:'Menu Category',
            category_items:[],
            selected_categories:[],
            category_id:null,
            items:[],
            panel: 0,
            menu_name:'',
            menuId: '',
            food_categories:[],
            variant_index:0,
            menu_image:'',
            menu_item_image:'',
            update_input_file:true,
            update_input_file_second:true,
            new_menu: {
                name:'',
                unit_type:'',
                unit:'',
                price:'',
                thumbnail:'',
                image:'',
                description:'',
                varients:[],
            },
            currentSelectedMenuItem:{},
            dialogDeleteVariant:false,
            variant_item_delete:{},
            variant_item_delete_inex:0,
        }
    },
    watch:{
        dialogNewMenu: function(newValue, oldValue){
            if(newValue) {
                this.category_items = [];
                this.food_categories = [],
                this.category_selected=false,
                this.menu_item_selected=false,
                this.update_input_file = !this.update_input_file;
                this.fetchCategoryItems();
                if(this.menu.id !== undefined){
                    console.log("test here updated");
                    this.menuId = this.menu.id;
                    this.menu_name = this.menu.name;
                    this.src = this.menu.thumbnail;
                    this.fetchMenuCategories(this.menuId);
                }
            }
        },
    },
    methods: {
        handleDialogVariantClose(){
            this.dialogDeleteVariant = false;
        },
        handleGroupItemRemove(index, item){
            this.variant_item_delete = item;
            this.variant_item_delete_inex = index;
            this.dialogDeleteVariant = true;
        },
        async handleConfirmVariant(variant_item){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            if(variant_item.variantItemDelete.id){
               await axios.get('/variant/delete/'+variant_item.variantItemDelete.id)
               .then((resp) => {
                    this.handleMenuItemSelected(this.currentSelectedMenuItem);
                    this.dialogDeleteVariant = false;
                    this.$bus.$emit('HIDE_PAGE_LOADER');
               })
               .catch((error) => {
                   this.$bus.$emit('HIDE_PAGE_LOADER');
               });
            }else{
                this.new_menu.varients.splice(this.variant_item_delete_inex,1);
                this.dialogDeleteVariant = false;
                this.$bus.$emit('HIDE_PAGE_LOADER');
            }
        },
        handleCloseCategory(){
            this.dialog_new_category = false;
        },
        handleNewCategory(){
            this.dialog_new_category = true;
        },
        handleCategoryCreated(){
            this.fetchCategoryItems();
            this.dialog_new_category = false;
        },
        fetchMenuCategories(menuId){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            axios.get('/menu/categories/'+menuId)
            .then((resp) => {
                if(resp.data.length){
                    this.food_categories = resp.data;
                    this.handleCategoryClick(0, this.food_categories[0]);
                }
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch((error) =>{
                this.$bus.$emit('HIDE_PAGE_LOADER');
            });
        },
        changeImage(file){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            let formData = new FormData();
            formData.append("file",file.file);
            axios.post('/store-image', formData)
            .then((resp) => {
                 this.$bus.$emit('HIDE_PAGE_LOADER');
                if(file.type == "menu_image"){
                    this.menu_image = resp.image_name;
                     if(this.menu.id !== undefined){
                        this.handleBlurMenuName();
                        this.$bus.$emit('MODAL_NEW_MENU_VENDOR_MENUS');
                    }
                }
                if(file.type == "menu_item_image"){
                    this.new_menu.image = resp.image_name;
                }
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
            });
        },
        handleBlurMenuName(){
            if(this.menu_name == null || this.menu_name == "") return;

            this.$bus.$emit('SHOW_PAGE_LOADER');
            let formData = new FormData();
            formData.append("old_menu", this.menuId);
            formData.append("menu_name", this.menu_name);
            formData.append("vendor_id", this.currentUser.vendor.id);
            formData.append("profile_pic", this.menu_image);
            axios.post('/vendor/menu/create',formData)
            .then((resp) => {
                 this.$bus.$emit('HIDE_PAGE_LOADER');
                this.menuId = resp.data.id;
            })
            .catch((error) => {
                 this.$bus.$emit('HIDE_PAGE_LOADER');
            });
        },
        removeCategory(index, category){
            this.deleteCategoryIndex = index;
            this.deleteCategory = category.category_id;
            this.dialogDelete = true;
        },
        handleSubmit(){
            if(this.menuId == null) return;
            this.$bus.$emit('SHOW_PAGE_LOADER');
            this.new_menu.menu_id = this.menuId;
            this.new_menu.category_id = this.category_id;
            this.new_menu.vendor_id = this.currentUser.vendor.id;
            axios.post('/vendor/menu/create-menu-items', this.new_menu)
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageSuccess("Success");
                this.$bus.$emit('MODAL_NEW_MENU_VENDOR_MENUS');
                let exists = this.items.filter((x) => x.id == resp.data.id);
                if(exists.length >0) {
                    this.items.forEach((item, index) => {
                        if(item.id == resp.data.id){
                            item.id = resp.data.id;
                            item.name = resp.data.name;
                        }
                    })
                }else{
                    this.items.push({id: resp.data.id, name: resp.data.name});
                }
                this.handleAddNewItem();
            })
            .catch((error) => {
                this.messageError('Failed');
                this.$bus.$emit('HIDE_PAGE_LOADER');
            });
        },

        handleGroupItem(i){
            this.new_menu.varients[i].items.unshift({name:'',price:''});
        },
        handleRemoveGroup(i){
            this.new_menu.varients[i].splice(index, 1);
        },
        handleRemoveItem(i, index){
            this.new_menu.varients[i].items.splice(index, 1);
        },

        handleAddNewItem(){
            this.menu_item_selected = true;
            this.variant_index = 0,
            this.new_menu =  {
                name:'',
                unit_type:'',
                unit:'',
                price:'',
                thumbnail:'',
                image:'',
                description:'',
                varients:[],
            }
            this.update_input_file_second = !this.update_input_file_second;
        },

        handleMenuItemSelected(item){
            this.menu_item_selected = true;
            this.currentSelectedMenuItem = item;
            if(item.id !== 0){
                this.$bus.$emit('SHOW_PAGE_LOADER');
                axios.get('/food-menu-item/'+item.id)
                .then((resp) => {
                    this.new_menu = resp.data;
                    this.panel = 0;
                    this.$bus.$emit('HIDE_PAGE_LOADER');
                })
                .catch((error) => {
                    this.$bus.$emit('HIDE_PAGE_LOADER');
                });
            }
        },

        handleCategoryClick(index, category){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            this.selected_category = index;
            this.category_id = category.category_id;
            this.menu_item_selected = false;
             axios.post('/vendor/menu/items',{
                 menu_id : this.menuId,
                 category_id : category.category_id
             })
            .then((resp) => {
                this.items = resp.data;
                this.new_menu.category_id = category.category_id;
                this.category_selected = true;
                if(this.items.length > 0){
                    this.handleMenuItemSelected(this.items[0]);
                }
                this.handleAddNewItem();
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
            });

        },
        fetchCategoryItems() {
            axios.get('/menu/categories')
            .then((resp) => {
                this.category_items = resp.data;
            })
            .catch((error) => {

            });
        },
        handleDialogClose(){
            this.dialogDelete = false;
        },
        handleConfirm(category) {
            axios.post('/vendor/menu/delete',{
                menu_id: this.menuId,
                vendor_id: this.currentUser.vendor.id,
                category_id: category.category_id
            })
            .then((res)=>{
                this.$bus.$emit('MODAL_NEW_MENU_VENDOR_MENUS');
                this.food_categories.splice(this.deleteCategoryIndex, 1);
                this.items = [];
                this.dialogDelete = false;
                if(this.food_categories.length >0){
                    this.handleCategoryClick(0, this.food_categories[0]);
                }
                this.handleAddNewItem();
            })
            .catch((error) => {});
        },
        handleClose(){
            this.$emit('close');
            this.quantity = 1;
        },
        handleAddVariant(){
            this.variant_index++
            this.new_menu.varients.unshift({
                id_index: this.variant_index,
                name : "New Group ",
                items:[{ name :'' , value :'' }]
            });
            this.panel = 0;
        },
        handleCategorySelected(item){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            this.category_id = item.selected_data;
            let abc = {};
            axios.post('/vendor/menus',{
                vendor_id: this.currentUser.vendor.id,
                categories: JSON.stringify(item.selected_data)
            })
            .then((resp) => {
                if(this.food_categories.length > 0){
                    let exists = this.food_categories.filter((x) => x.category_id == resp.data.category_id);
                    if(exists.length == 0){
                        this.food_categories.unshift(resp.data);
                    }
                }else{
                    this.food_categories.unshift(resp.data);
                }
                this.triggerClick(resp.data);
                this.handleAddNewItem();
                this.removeSelected = !this.removeSelected;
                this.$bus.$emit('HIDE_PAGE_LOADER');
                // console.log(this.food_categories);
            })
            .catch((error) => {
                this.messageError('Something wrong!!');
                this.$bus.$emit('HIDE_PAGE_LOADER');
            });
        },

        triggerClick(category){
            let categoryIndex = 0;
            this.food_categories.forEach((item,index) => {
                if(category.category_id == item.id){
                    categoryIndex = index;
                }
            });
            this.handleCategoryClick(categoryIndex, category);
        }

    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
        })
    },
    components: {
        InputAutocomplete,
        InputUpload,
        DialogDelete,
        DialogDeleteVariant,
        ModalAddCategory
        // vueDropzone
    }
}
</script>
<style lang="scss" scoped>
.variant-group{
    list-style: none;
}
.not-message{
    color: #cfcfcf;
    text-align: center;
    // font-size: 1.5rem;
}
.category-name{
    font-weight: 600;
    font-size: 0.9rem;
    color: #000;
    text-transform: capitalize;
}
.section-middle{
    border-right: 1px solid #dadada;
    border-left: 1px solid #dadada;
}
.menu-category-list{
    ul{
        list-style: none;
        padding:0;
        li{
            padding: 10px 14px;
            border:1px solid #dadada;
            margin-bottom:10px;
            cursor: pointer;
            &:hover{
                background: #e3e0e0;
            }
        }
        li.active{
            background: #e3e0e0;
        }

    }
}
.category-items{
    ul{
        padding:0;
        margin-top:14px;
        list-style: none;
        li{
            padding: 10px 14px;
            font-weight: 600;
            color: #000;
            margin-bottom: 10px;
            text-transform: capitalize;
            border: 1px solid #dadada;
            &:hover{
                background: #dedede;
                opacity: 0.8;
                cursor: pointer;
            }
        }
    }
}
.menu-card-title{
    // position: sticky;
    // top: 0;
    // background: #fff;
    // z-index: 1;
    // border-bottom: 1px solid #dadada;
}
.variant-container{
    border: 1px solid #dadada;
    padding: 20px;
    ul{
        list-style:none;
        li{

        }
    }
}
.background-image{
    height: 150px;
    background: #f5f5f5;
    text-align: center;
    align-items: center;
    display: flex;
    justify-content: space-around;
}
.item-background-image{
    height: 68px;
    background: #f5f5f5;
    text-align: center;
    align-items: center;
    display: flex;
    justify-content: space-around;
}
#textarea {
    .v-text-field__details {
        margin-bottom: 0px !important;
        height: 0 !important;
        display: none !important;
    }
}
</style>
