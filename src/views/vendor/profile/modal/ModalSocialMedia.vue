<template>
    <div>
        <v-row justify="center">
            <v-dialog v-model="dialog_social_media" persistent scrollable fullscreen>
                <v-card style="padding-top: 56px !important;">
                    <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                        <v-toolbar-title class="pl-0 text-capitalize">Social Media</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn text @click="handleClose">
                                Close
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-container class="custom-bs h-100">
                        <div class="">
                            <div>
                                <div class="custom-bs pa-4">
                                    <v-form ref="formSocialMedia">
                                        <v-row>
                                            <v-col cols="12" class="pb-0">
                                                <v-text-field :rules="rulesRequired" v-model="media.social_media" label="Social Media"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" class="pb-0">
                                                <v-text-field v-model="media.page_id" label="Page ID"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" class="pb-0 pt-0">
                                                <v-text-field :rules="rulesRequired" v-model="media.app_id" label="Application ID"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" class="pb-0 pt-0">
                                                <v-text-field :rules="rulesRequired" v-model="media.app_secret" label="Application Secret"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" class="pb-0 pt-0">
                                                <v-checkbox
                                                v-model="media.is_default"
                                                label="Default"
                                                ></v-checkbox>
                                            </v-col>
                                            <v-col cols="12" class="pb-0 pt-0">
                                                <v-textarea label="Description" v-model="media.description"></v-textarea>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-btn block large rounded color="primary" @click="handleSubmit()">submit</v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                   
                                </div>
                            </div>
                        </div>
                    </v-container>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>
<script>

import { ApiService } from "@/core/services/api.service";
// import Bottomnavbar from "@/components/layout/NavbarBottomFixed";
// import { base_url } from "@/core/services/config";



import { mapGetters,  } from "vuex";
export default {
    mounted() {
        // this.fetchData();
        this.$bus.$on("MODAL_SOCIAL_MEDIA", () => {
            // this.fetchData(data.param);
            this.dialog_social_media = true;
        });
    },
    data() {
        return {
           dialog_social_media:false,
           media: {
                social_media:'',
                description:'',
                page_id:'',
                app_id:'',
                app_secret:'',
                is_default:false,    
            },
            rulesRequired: [
                v => !!v || 'Required',
            ],
            accounts:[],
        }
    },
    methods: {
        fetchData(){    
           
            // this.video = "http://techslides.com/demos/sample-videos/small.mp4";
            // document.getElementById('myvideo').play();
            // console.log(this.$refs.videoRef);
            // this.$refs.videoRef.src = "http://iandevlin.github.io/mdn/video-player/video/tears-of-steel-battle-clip-medium.mp4";
            // this.$refs.videoRef.play();
        },
        handleClose() {
            this.$emit('close');
            this.dialog_social_media = false;
        },
        handleSubmit(){
            if(!this.$refs.formSocialMedia.validate()) return;

            this.media.vendor_id = this.currentUser.table_id;
            ApiService.post("/social-media-create", this.media)
            .then((resp)=>{
              
                console.log({resp});
                this.dialog_social_media = false;
            })            
            .catch((error)=>{
                console.log({error});
            })
            console.log(this.media);
        }
      
    },

    computed: {
        ...mapGetters({
            currentUser: 'auth/user',
        })
    }
}
</script>
<style lang="scss" scoped>
.custom-input {
    border-bottom: 1px solid #afafaf;
    padding: 4px 0;
}
</style>