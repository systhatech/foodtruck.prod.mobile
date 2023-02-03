<template>
    <v-container class="ma-0 pa-0 background-image h-100">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mg56">
           <div>
                <v-form v-model="valid" ref="formLocation">
                    <v-row>
                        <v-col
                        cols="12"
                        class="pb-0 pt-4"
                        md="12"
                        >
                            <div style="height:100px; width:120px; margin:0 auto;">
                                <InputUpload :src="base_url+'/image-show/'+(menu && menu.profile_pic ? menu.profile_pic:'noimage.png')" 
                                type="menu_image" 
                                :max-height="maxHeight"
                                label="Change"
                                @changeImage="changeImage"/>
                            </div>
                        </v-col>
                        <v-col
                        cols="12"
                        class="pb-0 pt-0"
                        md="12"
                        >
                            <v-text-field
                                v-model="menu.name"
                                :rules="requiredRules"
                                label="Name"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col
                        cols="6"
                        class="pb-0 pt-0"
                        md="6"
                        >
                            <v-text-field
                                v-model="menu.price"
                                    type="number"
                                :rules="requiredRules"
                                label="Price"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col
                        cols="6"
                        class="pb-0 pt-0"
                        md="6"
                        >
                            <InputAutocomplete @selected="selectedAnswers" label="Category" :items="categories"/>
                        </v-col>
                        <v-col
                        cols="6"
                        class="pb-0 pt-0"
                        md="6"
                        >
                            <InputAutocomplete @selected="selectedType" label="Unit Type" :items="unit_type"/>
                        </v-col>
                        <v-col
                        cols="6"
                        class="pb-0 pt-0"
                        md="6"
                        >
                            <v-text-field
                                v-model="menu.unit"
                                :rules="requiredRules"
                                label="Quantity"
                                v-mask="'####'"
                                required
                            ></v-text-field>
                        </v-col>


                        <v-col
                        cols="12"
                        class="pb-0 pt-0"
                        md="12"
                        >
                            <v-textarea
                                v-model="menu.description"
                                :rules="requiredRules"
                                label="Description"
                                required
                            ></v-textarea>
                        </v-col>
                        <v-col cols="12" class="text-center">
                            <v-btn color="primary" block  
                            rounded @click="handleSubmit">Submit</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
           </div>
           <!-- <VarientAdd :dialogVarientAdd="dialogVarientAdd"/> -->
        </v-container>
        <!-- <Bottomnavbar/> -->
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
// import Bottomnavbar from '@/components/layout/NavbarBottomVendor'
import { ApiService } from '@/core/services/api.service'
import { base_url } from '@/core/services/config'
import InputAutocomplete from '@/components/layout/InputAutocompleteSingleTextValue'
import moment from 'moment'
import InputUpload from '@/components/form-element/InputUpload'
// import VarientAdd from './TruckMenuVarientAdd'
import { mapGetters } from 'vuex'
export default {
    name:'EditProfile',
    data() {
        return {
            valid:true,
            start_date: new Date(),
            end_date: new Date(),
            dialogVarientAdd:false,
            moment,
            maxHeight:100,
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
                varients:[],
            },
            selectedData:'',
            categories:[],
            unit_type:[],

            dialogDelete:false,
            dialog_new_category: false,
            deleteCategory:'',
            deleteCategoryIndex:0,
            src:'',
            selected_category:null,
            category_selected:false,
            menu_item_selected:false,
            removeSelected:false,
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
            // menu: {
            //     name:'',
            //     unit_type:'',
            //     unit:'',
            //     price:'',
            //     thumbnail:'',
            //     image:'',
            //     description:'',
            //     varients:[],
            // },
            currentSelectedMenuItem:{},
            dialogDeleteVariant:false,
            variant_item_delete:{},
            variant_item_delete_inex:0,
        }
    },
    mounted() {
        this.fetchCategory();
    },
    methods: {
        // handleAddVarient() {
        //     this.dialogVarientAdd = true;
        // },
        handleGroupItem(i){
            this.menu.varients[i].items.unshift({name:'',price:''});
        },
        // handleRemoveGroup(i){
        //     this.menu.varients[i].splice(index, 1);
        // },
        handleRemoveItem(i, index){
            this.menu.varients[i].items.splice(index, 1);
        },

        handleAddNewItem(){
            this.menu_item_selected = true;
            this.variant_index = 0,
            this.menu =  {
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

        handleGroupItemRemove(index, item){
            this.variant_item_delete = item;
            this.variant_item_delete_inex = index;
            this.dialogDeleteVariant = true;
        },
        handleAddVarient(){
            this.variant_index++
            this.menu.varients.unshift({
                id_index: this.variant_index,
                name : "New Group ",
                items:[{ name :'' , value :'' }]
            });
            this.panel = 0;
        },
        selectedAnswers(data) {
            this.menu.category_id = data.selected_data;
        },
        selectedType(data) {
            this.menu.unit_type = data.selected_data;
        },
        fetchCategory(){
            this.loaderShow();
            ApiService.get('lookup/food-menu-item-category')
            .then((resp) => {
                this.loaderHide();
                this.categories = resp.food_category;
                this.unit_type = resp.unit_type;
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        },
        handleBlur(){

        },
       
        handleBack(){
            this.$router.back();
        },
        changeImage(file){
            this.loaderShow();
            let formData = new FormData();
            formData.append("file",file.file);
            ApiService.post('/store-image', formData)
            .then((resp) => {
                this.loaderHide();
                this.menu.profile_pic = resp.file_name;
            })
            .catch((error) => {
                console.log(error);
                this.messageError("Failed ! choose image less than size 2mb");
                this.loaderHide();
            });
        },
       
        handleSubmit(){
            let valid = this.$refs.formLocation.validate();
            if(!valid){
                this.messageError('Flease fillup form fields');
                return;
            }
           this.loaderShow();
            this.menu.vendor_id = this.currentUser.table_id;
            ApiService.post('menuitem/create/only',this.menu)
            .then((resp) => {
                this.loaderHide();
                this.messageSuccess(resp.message);
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        }
    },
    components: {
        Topnavbar,
        // DatePicker,
        // Bottomnavbar,
        // InputAddress,
        InputUpload,
        InputAutocomplete,
        // VarientAdd
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

.form-container{
    border-radius: 10px;
    padding:20px;
}
.variant-group{
    list-style: none;
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


</style>