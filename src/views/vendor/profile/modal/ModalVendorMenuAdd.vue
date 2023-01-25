<template>
    <div>
        <v-row justify="center">
            <v-dialog v-model="dialogMenuAdd" persistent scrollable fullscreen>
                <v-card class="background-image" style="padding-top: 56px !important;">
                    <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                        <v-toolbar-title class="pl-0 text-capitalize">New Menu</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn text @click="handleClose">
                                Close
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <div>
                        <div class="pa-4 custom-bs">
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
                                    <v-col cols="12" md="6" class="ma-0 pt-0 pb-0">
                                        <InputAutocomplete @selected="selectedItem" 
                                        label="Cuisine Type" 
                                        :default-value="defaultCuisine"
                                        :error="hasError" 
                                        :items="cuisine_types"/>
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
                                        <div class="w-100 text-center"><v-btn color="primary" rounded @click="handleSubmit()">submit</v-btn>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-form> 
                        </div>
                    </div>
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
        cuisine_types:{}
    },
    watch:{
        dialogMenuAdd(newval){
            if(newval && this.isEdit){
                this.menu.id = this.menuData.id;
                this.menu.cusine = this.menuData.cusine;
                this.menu.name = this.menuData.name;
                this.menu.description = this.menuData.description;
                this.menu.profile_pic = this.menuData.profile_pic;
                this.is_active = this.menuData.is_active;
                if(this.menuData.cusine){
                    let data = this.cuisine_types.filter((item) => item.value == this.menuData.cusine);
                    this.defaultCuisine = data[0];
                }
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
        }
    },
    methods: {
        handleSubmit(){
            if(!this.menu.cusine){
                this.hasError = true;
                return;
            }else{
                this.hasError = false;
            }
            if(!this.$refs.formMenu.validate()) return;
            
            this.menu.is_active = this.is_active?1:0;
            // console.log({
            //     ...this.menu,
            //     vendor_id: this.currentUser.table_id,
            // });
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
                this.messageSuccess(error.message);
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
        InputAutocomplete: ()=> import('@/components/layout/InputAutocompleteSingleTextValue')
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