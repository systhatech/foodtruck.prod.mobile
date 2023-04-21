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
                        <div class="">
                            <div>
                                <div class="custom-bs mt-14">

                                    <!-- <video autoplay width="100%" controls :src="video" type='video/mp4' playsinline></video> -->
                                    <!-- <video class="header-background" width="100%" loop autoplay muted controls="true" playsinline>
                                        <source :src="video" type="video/mp4"/>
                                    </video> -->
                                    <video width="100%" webkit-playsinline playsinline class="screen-video" :src="video" reload="metadata" autoplay controls></video>
                                    <div class="pa-4">
                                        <p class="mb-0">{{ video_description}}</p>
                                    </div>
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
        this.$bus.$on("MODAL_VIDEO_PLAYER_OPEN", (data) => {
            this.fetchData(data.param);
            this.dialog_video_player = true;
        });
    },
    data() {
        return {
           dialog_video_player:false,
           video: "",
           video_description:'',
        }
    },
    methods: {
        fetchData(code){    
            ApiService.post("/site-setting-video-link",{code})
            .then((resp)=>{
                this.video = resp.data.value;
                this.video_description = resp.data.description;
                // console.log({resp});
            })            
            .catch((error)=>{
                console.log({error});
            })
            // this.video = "http://techslides.com/demos/sample-videos/small.mp4";
            // document.getElementById('myvideo').play();
            // console.log(this.$refs.videoRef);
            // this.$refs.videoRef.src = "http://iandevlin.github.io/mdn/video-player/video/tears-of-steel-battle-clip-medium.mp4";
            // this.$refs.videoRef.play();
        },
        handleClose() {
            // this.$emit('close');
            this.dialog_video_player = false;
        },
      
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