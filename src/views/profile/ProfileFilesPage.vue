<template>
     <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container class="mg56">
            <div class="form-container custom-bs">
                <div>
                   <div style="height:200px; margin:0 auto;">
                        <InputUpload 
                        type="menu_image" 
                        :max-height="maxHeight"
                        label="select"
                        :remove="remove"
                        @changeImage="changeImage"/>
                    </div>
                    <div class="pt-4">
                        <InputAutocomplete @selected="selected" :defaultClear="defaultClear" label="Image Type" :items="imageTypes"/>
                        <v-btn color="primary" rounded block @click="handleUpload">Upload</v-btn>
                    </div>
                </div>

                <div class="mt-4" v-if="files">
                    <!-- <v-row> -->
                        <div cols="6" v-for="(file,index) in files" :key="index">
                            <h5 class="text-capitalize mb-2 mt-4">{{index}}</h5>
                            <v-row v-if="files[index].length">
                                <v-col cols="6" v-for="(f,i) in files[index]" :key="i" @click="handleDelete(f)">
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
                    <!-- </v-row> -->
                </div>
            </div>
            <DialogConfirm :dialogConfirm="dialogConfirm" message="Do you to delete ?" @handleConfirm="handleConfirm" @close="handleClose"/>
        </v-container>
        <Bottomnavbar :value="indexValue" :index="indexValue"/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
// import InputAddress from '@/components/form-element/InputAddress'
import InputAutocomplete from '@/components/layout/InputAutocompleteSingleTextValue'
import InputUpload from '@/components/form-element/InputUpload'
import { ApiService } from '@/core/services/api.service'
import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
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
                type:'',
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
            this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.post("/file/delete",{id: this.fileToDelete.id})
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
               this.messageSuccess(resp.message);
               this.fetchImages();
               this.handleClose();
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
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
                if(resp.image_types.length){
                    this.imageTypes =resp.image_types;
                }
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
                this.$bus.$emit('SHOW_PAGE_LOADER');
                ApiService.post('/store/image', this.file)
                .then((resp) => {
                    this.$bus.$emit('HIDE_PAGE_LOADER');
                    this.remove = true;
                    this.defaultClear = true;
                    this.fetchImages();
                    this.messageSuccess(resp.message);
                })
                .catch((error) => {
                    this.$bus.$emit('HIDE_PAGE_LOADER');
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
            this.$bus.$emit('SHOW_PAGE_LOADER');
            let formData = new FormData();
            formData.append("file",file.file);
            ApiService.post('/store-image', formData)
            .then((resp) => {
                 this.$bus.$emit('HIDE_PAGE_LOADER');
                 this.file.file_name = resp.file_name;
            })
            .catch(() => {
                this.messageError("Failed ! choose image less than size 2mb");
                this.$bus.$emit('HIDE_PAGE_LOADER');
            });
        },
    },
    components: {
        Topnavbar,
        // InputAddress,
        InputUpload,
        Bottomnavbar,
        InputAutocomplete,
        DialogConfirm
    }
}
</script>
<style lang="scss" scoped>
.form-container{
    // background: #fff;
    // border-radius:10px;
    padding: 24px;
    margin-bottom:40px;
}
</style>