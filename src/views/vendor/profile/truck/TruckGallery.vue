<template>
    <div class="pt-4">
        <div class="form-container custom-bs pa-4">

            <div class="mt-4" v-if="files && Object.keys(files).length">
                <!-- <v-row> -->
                    <div v-for="(file,index) in files" :key="index">
                        <h5 class="text-capitalize mb-2 mt-4">{{index}}</h5>
                        <v-row v-if="files[index].length">
                            <v-col cols="6" v-for="(f,i) in files[index]" :key="i">
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
            <div v-else class="unavailable">
                <p>{{ message }}</p>
            </div>
        </div>
        <DialogConfirm :dialogConfirm="dialogConfirm" message="Do you to delete ?" @handleConfirm="handleConfirm" @close="handleClose"/>
    </div>
</template>
<script>
import { ApiService } from '@/core/services/api.service'
import DialogConfirm from '@/components/layout/DialogConfirm'
import { base_url } from '@/core/services/config'
export default {
    name:'ProfileGalleryPage',
    props:{
        truckProfile:{},
    },
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
            message:'Loading...',
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
        fetchImages() {
            ApiService.get("/vendor/gallery/"+ this.truckProfile.general.id)
            .then((resp) => {
                this.files = resp.data;
                if(this.files && !Object.keys(this.files).length) {
                    this.message = "No photos";
                }
                if(resp.image_types.length){
                    this.imageTypes = resp.image_types;
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
        DialogConfirm
    }
}
</script>
<style lang="scss" scoped>
.form-container{
    margin-bottom:40px;
}
</style>