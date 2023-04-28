<template>
    <div>
        <v-row justify="center">
            <v-dialog v-model="dialog_modal_user" persistent scrollable fullscreen>
                <v-card class="background-image" style="padding-top: 56px !important;">
                    <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                        <v-toolbar-title class="pl-0 text-capitalize">{{ is_edit?'Update User':'New User'}}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn text @click="handleClose">
                                Close
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <div class="pa-6">
                        <div class="pa-4 custom-bs">
                            <v-form ref="formSignupCustomer">
                                <v-row>
                                    <v-col
                                        cols="12"
                                        >
                                        <div style="height:100px; width:120px; margin:0 auto;">
                                            <InputUpload :src="base_url+'/image-show/'+(customer_info.profile_pic?customer_info.profile_pic:'default.jpg')" 
                                            :update_input_file="update_input_file" 
                                            type="menu_image" 
                                            :max-height="maxHeight"
                                            label="Change"
                                            @changeImage="changeImage"/>
                                        </div>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field class="text-center" :rules="rulesRequired" v-model="customer_info.fname" label="First Name"></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field class="text-center" :rules="rulesRequired" v-model="customer_info.lname" label="Last Name"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field class="text-center" @blur="onCheckEmail" :rules="emailRules" v-model="customer_info.email" label="Email"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field class="text-center" :rules="rulesRequired" v-model="customer_info.phone_no" label="Phone No." v-mask="'(###) ###-####'"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" v-if="is_edit">
                                        <v-text-field class="text-center" type="password" v-model="password" label="Password"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" v-else>
                                        <v-text-field class="text-center" :rules="rulesRequired" type="password" v-model="password" label="Password"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-form>
                            <div class="text-center">
                                <v-btn color="primary" rounded block large @click="handleSubmit()">{{ is_edit?'Update':'Submit'}}</v-btn>
                                <v-btn color="error" class="mt-4" v-if="is_edit && customer_info.is_default==0" outlined rounded block large @click="handleDelete()">Delete User</v-btn>

                            </div>
                        </div>
                        <DialogConfirm 
                        @close="handleCloseDelete"
                        @handleConfirm="handleConfirmDelete"
                        :dialogConfirm="modal_confirm"/>
                    </div>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>
<script>

import { mdiClose } from '@mdi/js'
import { ApiService } from '@/core/services/api.service'
import { mapGetters } from 'vuex'
import { base_url } from '@/core/services/config'
import InputUpload from '@/components/form-element/InputUpload'
export default {
 
    data() {
        return {
            base_url,
            iconClose: mdiClose,
            maxHeight:100,
            update_input_file:true,
            customer_info:{
                fname:'',
                lname:'',
                email:'',
                phone_no:'',
                password:'',
                is_default:0,
                profile_pic:'',
            },
            password:'',
            rulesRequired: [
                v => !!v || 'Required',
            ],
            emailRules: [
                (v) => !!v || "E-mail is required",
                (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
            ],
            dialog_modal_user:false,
            is_edit:false,
            modal_confirm:false,
        }
    },
    mounted() {
        this.$bus.$on("MODAL_VENDOR_USER", (data) => {
            if(Object.keys(data).length){
                this.customer_info.fname = data.fname;
                this.customer_info.lname = data.lname;
                this.customer_info.email = data.email;
                this.customer_info.phone_no = this.formatPhoneNumber(data.phone_no);
                this.customer_info.id = data.id;
                this.customer_info.is_default = data.is_default;
                this.customer_info.profile_pic = data.profile_pic;
                this.password="";
                this.is_edit = true;
            }else{
                this.is_edit = false;
                this.customer_info = {
                    profile_pic:'',
                    fname:'',
                    lname:'',
                    email:'',
                    phone_no:'',
                    password:'',
                    is_default:0,
                }
                this.password="";
            }
            this.dialog_modal_user = true;
        });
    },

    methods: {
        handleDelete(){
            this.modal_confirm = true;
        },
        handleConfirmDelete(){
            this.loaderShow();
            ApiService.post("/vendor/user/delete",{ 
                'id': this.customer_info.id,
            })
            .then((resp)=>{
                this.loaderHide();
                this.handleClose();
                console.log(resp);
            })
            .catch((error)=>{
                this.loaderHide();
                this.messageError(error.response.data.message);
            })
        },
         onCheckEmail(){
            if(!this.customer_info.email) return;
            this.loaderShow();
            ApiService.post("/check/email",{ 
                'email': this.customer_info.email,
                'is_edit': this.is_edit ?1:0,
                'id': this.customer_info.id,
            })
            .then((resp)=>{
                this.loaderHide();
                console.log(resp);
            })
            .catch((error)=>{
                this.loaderHide();
                this.customer_info.email = "";
                this.messageError(error.response.data.message);
              
            })
        },

        handleSubmit(){
            if(!this.$refs.formSignupCustomer.validate()) return;

            this.loaderShow();
            this.customer_info.password = this.password ? window.btoa(this.password) :'';
            ApiService.post("vendor/user", this.customer_info)
            .then((resp) =>{
                this.loaderHide();
                this.dialog_modal_user = false;
                this.messageSuccess(resp.message);
                this.handleClose();
            })
            .catch((error) =>{
                this.loaderHide();
                console.log(error);
                this.messageError(error.message);
            })
        },
        handleCloseDelete(){
            this.modal_confirm = false;
        },
        handleClose() {
            this.modal_confirm = false;
            this.dialog_modal_user = false;
            this.$emit('close')
        },
        changeImage(file){
            this.loaderShow();
            let formData = new FormData();
            formData.append("file",file.file);
            ApiService.post('/store-image', formData)
            .then((resp) => {
                 this.loaderHide();
                 this.customer_info.profile_pic = resp.file_name;
                 this.hasFile = true;
            })
            .catch(() => {
                this.messageError("Failed ! choose image less than size 2mb");
                this.loaderHide();
            });
        },

    },
    components:{
        InputUpload,
        DialogConfirm: ()=> import('@/components/layout/DialogConfirm'),
        // InputAutocomplete: ()=> import('@/components/layout/InputAutocompleteSingleTextValue')
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