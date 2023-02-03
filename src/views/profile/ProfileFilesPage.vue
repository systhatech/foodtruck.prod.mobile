<template>
     <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container class="mg56">
            <div class="form-container">
                <div>
                    <div class="pb-4">
                        <h5 class="text-uppercase primary--text">Add image in your gallery</h5>
                    </div>
                    <v-divider></v-divider>
                   <div style="height:200px; margin:0 auto;" class="pt-5">
                        <InputUpload 
                        type="menu_image" 
                        :max-height="maxHeight"
                        label="select"
                        :remove="remove"
                        @changeImage="changeImage"/>
                    </div>
                    <div class="pt-4">
                        <!-- <InputAutocomplete @selected="selected" :defaultClear="defaultClear" label="Image Type" :items="imageTypes"/> -->
                        <v-btn color="primary" rounded block @click="handleUpload">Upload</v-btn>
                    </div>
                </div>

                <div class="mt-4 custom-bs pa-4" v-if="files && files.length">
                    <div class="pb-3">
                        <h5 class="primary--text text-uppercase">Gallery</h5>
                    </div>
                    <v-divider></v-divider>
                    <div class="pt-4">
                        <v-row>
                            <v-col cols="6" v-for="(f,i) in files" :key="i" @click="handleDelete(f)">
                                <v-img 
                                    contain
                                    lazy-src="https://picsum.photos/id/11/10/6"
                                    max-width="250"
                                    height="100"
                                    :src="base_url+'/image-show/'+f.file_name"
                                    ></v-img>
                            </v-col>
                        </v-row>    
                    </div>
                </div>
                <div v-else>
                    <p>No images</p>
                </div>
            </div>
            <DialogConfirm :dialogConfirm="dialogConfirm" message="Do you to delete ?" @handleConfirm="handleConfirm" @close="handleClose"/>
        </v-container>
        <!-- <Bottomnavbar :value="indexValue" :index="indexValue"/> -->
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
// import InputAddress from '@/components/form-element/InputAddress'
// import InputAutocomplete from '@/components/layout/InputAutocompleteSingleTextValue'
import InputUpload from '@/components/form-element/InputUpload'
import { ApiService } from '@/core/services/api.service'
// import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
import DialogConfirm from '@/components/layout/DialogConfirm'
import { base_url } from '@/core/services/config'
// import  JwtService from '@/core/services/jwt.service';
export default {
    name:'ProfileAddressPage',
    data() {
        return {
            indexValue:0,
            maxHeight:300,
            remove:false,
            base_url,
            title:'',
            imageTypes:[
                {text:'Banner',value:'banner'},
                {text:'Slider',value:'slider'},
                {text:'Gallery',value:'gallery'},
            ],
            src:'noimage.png',
            file:{
                file_name:'',
                type:'gallery',
            },
            defaultClear:false,
            files:[],
            fileToDelete:{},
            dialogConfirm:false,
            
        }
    },
    mounted() {
        this.fetchImages();
    },
    methods: {
        handleConfirm(){
            this.loaderShow();
            ApiService.post("/file/delete",{id: this.fileToDelete.id})
            .then((resp) => {
                this.loaderHide();
               this.messageSuccess(resp.message);
               this.fetchImages();
               this.handleClose();
            })
            .catch(() => {
                this.loaderHide();
                this.handleClose();
                this.messageError('Failed to delete');
            })
        },
        handleClose(){
            this.dialogConfirm =false;
        },
        handleDelete(file){
            this.fileToDelete = file;
            this.dialogConfirm = true;
        },
        fetchImages() {
            ApiService.post("/self/profile/images/fetch")
            .then((resp) => {
                this.files = resp.data;
            })
            .catch(() => {
            })
        },
        handleUpload() {
            if(this.file.file_name == ''){
                this.messageError('Please select image');
            }else if(this.file.type==''){
                this.messageError('Please, select type');
            }else{
                this.loaderShow();
                ApiService.post('/store/image', this.file)
                .then((resp) => {
                    this.loaderHide();
                    this.remove = true;
                    this.defaultClear = true;
                    this.fetchImages();
                    this.messageSuccess(resp.message);
                })
                .catch((error) => {
                    this.loaderHide();
                    this.messageError(error.response.data.message);
                })
            }
        },
        handleBack() {
            this.$router.back();
        },
        selected(image) {
            this.file.type = image.selected_data;

        },
        changeImage(file){
            this.loaderShow();
            let formData = new FormData();
            formData.append("file",file.file);
            ApiService.post('/store-image', formData)
            .then((resp) => {
                 this.loaderHide();
                 this.file.file_name = resp.file_name;
            })
            .catch(() => {
                this.messageError("Failed ! choose image less than size 2mb");
                this.loaderHide();
            });
        },
    },
    components: {
        Topnavbar,
        InputUpload,
        DialogConfirm
    }
}
</script>
<style lang="scss" scoped>
.form-container{
// 
}
</style>