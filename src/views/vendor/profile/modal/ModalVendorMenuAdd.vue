<template>
    <div>
        <v-row justify="center">
            <v-dialog v-model="dialogMenuAdd" persistent scrollable fullscreen>
                <v-card class="background-image" style="padding-top: 56px !important;">
                    <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                        <v-toolbar-title class="pl-0 text-capitalize">{{ isEdit ? 'Update Menu':'Add Menu'}}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn text @click="handleClose">
                                Close
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <div class="">
                        <div class="pa-6 pt-16 mt-4">
                            <v-form ref="formMenu">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <div style="height:200px; width:200px; margin: 0 auto;">
                                            <InputUpload :src="base_url+'/image-show/'+menu.profile_pic" 
                                            :update_input_file="update_input_file" 
                                            type="menu_image" 
                                            :max-height="maxHeight"
                                            label="Change"
                                            @changeImage="changeImage"/>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" md="6" class="ma-0 pt-0 pb-0">
                                        <v-text-field label="Menu Name" v-model="menu.name" :rules="rulesRequired"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6" class="ma-0 pt-0 pb-0 w-100">
                                        <div class="d-flex align-center w-100">
                                            <div style="flex-grow:1">
                                                <InputAutocomplete @selected="selectedItem" 
                                                label="Cuisine Type" 
                                                :default-value="defaultCuisine"
                                                :error="hasError" 
                                                :items="cuisine_types"/>
                                            </div>
                                            <div class="ml-4">
                                                <v-btn small color="primary" fab @click="handleAddCusineType()"><v-icon>mdi-plus</v-icon></v-btn>
                                            </div>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" md="6" class="ma-0 pt-0 pb-0">
                                        <v-textarea label="Menu Description" v-model="menu.description" :rules="rulesRequired"></v-textarea>
                                    </v-col>
                                    <v-col cols="12" class="ma-0 pt-0 pb-0">
                                        <v-checkbox
                                            v-model="is_active"
                                            label="Active"
                                            ></v-checkbox>
                                    </v-col>
                                    <v-col cols="12">
                                        <div class="w-100 text-center"><v-btn block  large color="primary" rounded @click="handleSubmit()">submit</v-btn>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-form> 
                        </div>
                    </div>
                    <ModalCuisineType 
                    :availableCuisines="cuisine_types"
                    :dialogCuisineType="modal_cuisine_type" 
                    code="cuisine_type"
                    label="Cuisine Name"
                    @fetchCuisines="fetchCuisineTypes"
                    @close="handleCloseCuisineType()"/>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>
<script>

import { mdiClose } from '@mdi/js'
import { ApiService } from '@/core/services/api.service'
import { base_url } from '@/core/services/config'
import { mapGetters } from 'vuex'
export default {
    props: {
        dialogMenuAdd: {
            required: true,
            type: Boolean,
        },
        menuData:{},
        isEdit:{},
        // cuisine_types:{}
    },
    watch:{
        dialogMenuAdd(newval){
            this.fetchCuisineTypes();
            if(newval && this.isEdit){
                this.menu.id = this.menuData.id;
                // this.menu.cusine = this.menuData.cusine;
                this.menu.name = this.menuData.name;
                this.menu.description = this.descriptionStripe(this.menuData.description);
                this.menu.profile_pic = this.menuData.profile_pic;
                this.is_active = this.menuData.is_active;
            }else{
                this.menu = {
                    name:'',
                    cusine:'',
                    description:'',
                    is_active:'',
                    profile_pic:'default.png',
                };
                this.is_active = 0;
                this.defaultCuisine = {};
            }
        }
    },
    data() {
        return {
            iconClose: mdiClose,
            base_url,
            update_input_file:true,
            maxHeight:50,
            hasError:false,
            rulesRequired: [
                v => !!v || 'Required',
            ],
            defaultCuisine:{},
            menu:{
                name:'',
                cusine:'',
                description:'',
                is_active:'',
                profile_pic:'default.png',
            },
            is_active:false,
            modal_cuisine_type:false,
            cuisine_types:[],
        }
    },
    methods: {
        fetchCuisineTypes() {
            ApiService.post("/vendor-lookup-values",{'code': 'cuisine_type'})
            .then((resp) => {
                this.loaderHide();
                this.cuisine_types = resp.data;
                if(this.isEdit){
                    if(this.menuData.cusine){
                        let data = this.cuisine_types.filter((item) => item.value == this.menuData.cusine);
                        this.defaultCuisine = data[0];
                    }
                }
                // this.lookup_values = this.categories;
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            });

            // ApiService.post("/vendor-lookup-cuisine-types",{
            //     "code":"cuisine_type"
            // })
            // .then((resp) =>{
            //     this.cuisine_types = resp.data;
            // })
            // .catch((error) =>{
            //     this.loaderHide();
            //     console.log(error);
            //     // this.messageError(error.message);
            // })
        },
        handleCloseCuisineType(){
            this.modal_cuisine_type = false;
            this.fetchCuisineTypes();
        },
        handleAddCusineType(){
            this.modal_cuisine_type = true;
        },
        descriptionStripe(str){
            if ((str===null) || (str===''))
                return false;
            else
                str = str.toString();
                
            // Regular expression to identify HTML tags in
            // the input string. Replacing the identified
            // HTML tag with a null string.
            return str.replace( /(<([^>]+)>)/ig, '');
        },

        handleSubmit(){
            if(!this.menu.cusine){
                this.hasError = true;
                return;
            }else{
                this.hasError = false;
            }
            if(!this.$refs.formMenu.validate()) return;
            
            this.menu.is_active = this.is_active?1:0;
            this.loaderShow();
            ApiService.post("/menu/create", {
                ...this.menu,
                vendor_id: this.currentUser.table_id,
            })
            .then((resp) =>{
                this.loaderHide();
                this.messageSuccess(resp.message);
                setTimeout(() => {
                    this.handleClose();
                }, 1000);
            })
            .catch((error) =>{
                this.loaderHide();
                console.log(error);
                // this.messageError(error.message);
            })
        },
        selectedItem(item){
            this.menu.cusine = item.selected_data;
            this.hasError = false;
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
            .catch(() => {
                this.messageError("Failed ! choose image less than size 2mb");
                this.loaderHide();
            });
        },

        handleClose() {
            this.$emit('close')
        },

    },
    components:{
        InputUpload: ()=> import('@/components/form-element/InputUpload'),
        InputAutocomplete: ()=> import('@/components/layout/InputAutocompleteSingleTextValue'),
        ModalCuisineType: ()=> import('@/views/vendor/profile/modal/ModalCuisineType')
    },
    computed: {
        ...mapGetters({
            currentUser: 'auth/user',
        })
    }
}
</script>
<style lang="scss" scoped>
</style>