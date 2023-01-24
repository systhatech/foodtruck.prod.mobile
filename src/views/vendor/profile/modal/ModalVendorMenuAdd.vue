<template>
    <div>
        <v-row justify="center">
            <v-dialog v-model="dialogMenuAdd" persistent scrollable fullscreen>
                <v-card class="background-image" style="padding-top: 56px !important;">
                    <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                        <v-btn icon @click="handleClose">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title class="pl-0 text-capitalize">New Menu</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn text @click="handleClose">
                                Close
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <div class="p-relative pa-4">
                        <div class="pa-4 custom-bs">
                            <v-form ref="formMenu">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <div>
                                            <InputUpload :src="base_url+'/image-show/'+menu.profile_pic ? menu.profile_pic:'default.png'" 
                                            :update_input_file="update_input_file" 
                                            type="menu_image" 
                                            :max-height="maxHeight"
                                            :min-height="maxHeight"
                                            label="Upload menu image"
                                            @changeImage="changeImage"/>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="Menu Name" v-model="menu.name"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="Cuisine Type"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-textarea label="Menu Description" v-model="menu.description"></v-textarea>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-checkbox
                                            v-model="menu.is_active"
                                            label="Active"
                                            ></v-checkbox>
                                    </v-col>
                                </v-row>
                            </v-form> 
                        </div>
                    </div>
                    <!-- <div class="pa-4 custom-bs" style="position: fixed;bottom: 0;width: 100%;z-index: 1;">
                        <div class="d-flex align-center justify-space-between">
                           <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptate, impedit?</p>
                        </div>
                    </div> -->
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>
<script>

import { mdiArrowLeft, mdiClose } from '@mdi/js'
import { ApiService } from '@/core/services/api.service'
import moment from 'moment'
import { base_url } from '@/core/services/config'
import { mapGetters } from 'vuex'
export default {
    props: {
        dialogMenuAdd: {
            required: true,
            type: Boolean,
        },
    },

    data() {
        return {
            iconClose: mdiClose,
            iconBack: mdiArrowLeft, 
            base_url,
            moment,
            update_input_file:true,
            maxHeight:100,
            menu:{
                name:'',
                cuisine_type:'',
                description:'',
                is_active:'',
                profile_pic:'',
            }
        }
    },
    methods: {
        viewMenu(id){
            this.$router.push("/vendor-menu/"+id).catch(()=>{});
        },
        changeImage(file){
            this.loaderShow();
            let formData = new FormData();
            formData.append("file",file.file);
            ApiService.post('/store-image', formData)
            .then((resp) => {
                this.loaderHide();
                console.log(resp);
                this.menu.profile_pic = resp.file_name;
                // this.hasFile = true;
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
        InputUpload: ()=> import('@/components/form-element/InputUpload')
    },
    computed: {
        ...mapGetters({
            currentUser: 'auth/user',
        })
    }
}
</script>
<style lang="scss" scoped>
$bg-gray : #f5f5f5;

.qty {
    color: rgb(162 162 162);
    font-size: 0.8rem;
    text-transform: lowercase;
}

.text-bold {
    font-weight: 500;
    color: #01a6bc;
}

.testing {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    button {
        width: 50%;
    }
}

.h-100 {
    height: 100% !important;
}

.address-type {
    text-decoration: underline;
    cursor: pointer;
}

.box-bg {
    border: 1px solid #f5f5f5;
    padding: 20px;
    // height: 100%;
    position: relative;
    color: #000;
    margin-top: 30px;
}

.name-address {
    font-weight: 600;
    margin: 0px;
    font-size: 0.9rem;
}

.sub-text {
    margin: 0px;
    font-size: 0.9rem;
}

.order-item-wrapper {
    ul.main-items {
        list-style: none;
        padding: 0;

        li:not(:last-child) {
            margin-bottom: 16px;
            border-bottom: 1px solid #dadada;
            padding-bottom: 16px;
        }

        li {
            .item-description {
                width: 100%;
            }

            ul.additional-items {
                list-style: none;
                padding: 0;

                li {
                    border: 0;
                    padding: 0;
                    margin: 0;

                    // p {
                    //     padding: 0;
                    //     margin: 0;
                    // }

                    // p.item-name {
                    //     font-size: 0.8rem;
                    //     font-weight: 400;
                    // }
                }
            }
        }
    }
}

.menu-name {
    font-size: 0.9rem !important;
    padding: 10px 16px !important;
}

.card-actions {
    padding: 0 14px 14px 14px !important;
}
</style>