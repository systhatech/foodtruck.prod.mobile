<template>
    <div>
        <v-row justify="center">
            <v-dialog v-model="dialogCuisineType" persistent scrollable fullscreen>
                <v-card class="background-image" style="padding-top: 56px !important;">
                    <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                        <v-toolbar-title class="pl-0 text-capitalize">Add Cuisine Type</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn text @click="handleClose">
                                Back
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <div class="">
                        <div class="pa-6 mt-4">
                            <v-form ref="formCuisineType" class="custom-bs pa-4 pt-6">
                                <v-row>
                                    <v-col cols="12" md="6" class="ma-0 pt-0 pb-0">
                                        <v-text-field :label="label" v-model="cuisine_name" :rules="rulesRequired"></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <div class="w-100 text-center"><v-btn block  large color="primary" rounded @click="handleSubmit()">submit</v-btn>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-form> 
                            <div>
                                <div class="custom-bs pa-4 mt-4">
                                    <h5 class="primary--text text-uppercase pb-2">Available cuisine types</h5>
                                    <v-divider></v-divider>
                                    <div class="pt-2" v-if="availableCuisines.length">
                                        <p v-for="(cuisine, index) in availableCuisines" :key="index" class="text-capitalize">{{index+1}}. {{ cuisine.text }}</p>
                                    </div>
                                    <div class="unavailable" v-else>
                                        <p>Not available</p>
                                    </div>
                                </div>
                            </div>
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
import { mapGetters } from 'vuex'
export default {
    props: {
        dialogCuisineType: {
            required: true,
            type: Boolean,
        },
        code:{
            required:true,
        },
        label:{},
        availableCuisines:{},
    },
    watch:{
        dialogCuisineType(newval){
            console.log(newval);
        }
    },
    data() {
        return {
            iconClose: mdiClose,
            rulesRequired: [
                v => !!v || 'Required',
            ],
            cuisine_name:'',
        }
    },
    methods: {
        handleAddCusineType(){
            console.log("test");
        },
        handleSubmit(){
            if(!this.$refs.formCuisineType.validate()) return;

            ApiService.post("vendor-lookup", {
                "code": this.code,
                "value": this.cuisine_name,
                "vendor_id": this.currentUser.table_id
            })
            .then((resp) =>{
                this.loaderHide();
                this.$refs.formCuisineType.reset();
                this.$emit('fetchCuisines',{'code': this.code});
                console.log(resp);
            })
            .catch((error) =>{
                this.loaderHide();
                console.log(error);
                this.messageError(error.message);
            })
        },
        handleClose() {
            this.$emit('close')
        },

    },
    components:{
        // InputUpload: ()=> import('@/components/form-element/InputUpload'),
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