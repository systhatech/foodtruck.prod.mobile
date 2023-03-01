<template>
    <div>
        <v-row justify="center">
            <v-dialog v-model="dialog_notification" persistent scrollable fullscreen>
                <v-card style="padding-top: 56px !important;">
                    <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                        <v-toolbar-title class="pl-0 text-capitalize">Nearby Clients</v-toolbar-title>
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
                                <div class="custom-bs mt-14 pa-4">

                                    <v-textarea v-model="message" label="Message"></v-textarea>
                                    <v-btn block rounded large color="primary" @click="sendNotification()">Send notification</v-btn>
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
        this.$bus.$on("MODAL_NEARBY_NOTIFICATION", (data) => {
            // this.fetchData(data.param);
            console.log({data});
            this.dialog_notification = true;
        });
    },
    data() {
        return {
           dialog_notification:false,
           video: "",
           message:'',
           code:'',
        }
    },
    methods: {
        fetchData(code){    
            ApiService.post("/site-setting-video-link",{code})
            .then((resp)=>{
                this.video = resp.data.value;
                this.video_description = resp.data.description;
                console.log({resp});
            })            
            .catch((error)=>{
                console.log({error});
            })
        },
        handleClose() {
            this.dialog_notification = false;
        },
        sendNotification(){
            ApiService.post("/firebase/blast/nearby",{ 'message': this.message })
            .then((resp)=>{
            
                console.log({resp});
            })            
            .catch((error)=>{
                console.log({error});
            })
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