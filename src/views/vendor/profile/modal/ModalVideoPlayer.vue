<template>
    <div>
        <v-row justify="center">
            <v-dialog v-model="dialog_video_player" persistent scrollable fullscreen>
                <v-card style="padding-top: 56px !important;">
                    <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                        <v-toolbar-title class="pl-0 text-capitalize">How it Works?</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn text @click="handleClose">
                                Close
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-container class="custom-bs h-100">
                        <div class="" v-if="video">
                            <div>
                                <div class="custom-bs">
                                    <video ref="video" width="100%" webkit-playsinline playsinline class="screen-video" :src="url_base+'/'+video" reload="metadata" autoplay controls></video>
                                    <div class="pa-4">
                                        <p class="mb-0">{{ video_description}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center w-100">
                            <div v-if="loading" class="center">
                                <ComponentLoadingVue/>
                            </div>
                            <div v-else class="unavailable">
                                <p>Tutorial video not available!</p>
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
import { url_base } from "@/core/services/config";



import { mapGetters,  } from "vuex";
export default {
    mounted() {
        this.$bus.$on("MODAL_VIDEO_PLAYER_OPEN", (data) => {
            this.fetchData(data.param);
            this.dialog_video_player = true;
            if(this.$refs.video){
                this.$refs.video.play();
            }
        });
    },
    data() {
        return {
            url_base,
           dialog_video_player:false,
           video: "",
           video_description:'',
           loading:false,
        }
    },
    methods: {
        fetchData(code){    
            this.loading = true;
            ApiService.post("/site-setting-video-link",{code})
            .then((resp)=>{
                this.loading = false;
                this.video = resp.data.value;
                this.video_description = resp.data.description;
            })            
            .catch((error)=>{
                this.loading=false;
                this.video = "";
                console.log({error});
            })
            // this.video = "http://techslides.com/demos/sample-videos/small.mp4";
            // document.getElementById('myvideo').play();
            // console.log(this.$refs.videoRef);
            // this.$refs.videoRef.src = "http://iandevlin.github.io/mdn/video-player/video/tears-of-steel-battle-clip-medium.mp4";
            // this.$refs.videoRef.play();
        },
        handleClose() {
            if(this.$refs.video && this.$refs.video.length){
                this.$refs.video.pause();
            }
            this.dialog_video_player = false;
        },
      
    },
    components:{
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
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