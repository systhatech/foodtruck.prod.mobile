<template>
    <v-container class="ma-0 pa-0 background-image h-100">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mb80">
            <v-btn outlined color="primary" @click="addSchedule()" class="mb-4" rounded large block><v-icon>mdi-plus</v-icon> Add New Schedule</v-btn>
            <p class="mb-0 text-center" style="text-decoration: underline;" @click="handleClick('user_mannual_schedules')">Video tutorial, how to setup schedule?</p>
            <div class="d-flex align-center justify-space-around pt-4">
                <div class="share-icon">
                    <ShareNetwork
                        network="facebook"
                        :url="link_url"
                        :title="post_title"
                        description=""
                        quote=""
                        hashtags=""
                    >
                        <v-btn fab text color="blue"><v-icon large>mdi-facebook</v-icon></v-btn>
                    </ShareNetwork>
                    <ShareNetwork
                        network="twitter"
                        :url="link_url"
                        :title="post_title"
                        description=""
                        quote=""
                        hashtags=""
                    >
                        <v-btn fab text color="primary"><v-icon large>mdi-twitter</v-icon></v-btn>
                    </ShareNetwork>
                </div>
            </div>
            <div>
                <Location :truckProfile="profile"/>
            </div>
            <DialogScheduleAdd :dialog-schedule="modal_schedule" @close="handleCloseModal"/>
            <ModalVideoPlayer/>
        </v-container>
         <Bottomnavbar/>
    </v-container>
</template>
<script>
import { base_url } from '@/core/services/config'
import { mapGetters } from 'vuex'
import ModalVideoPlayer from '@/views/vendor/profile/modal/ModalVideoPlayer.vue'
export default {
    name:'ProfileSchedules',
    data() {
        return {
            title:'',
            base_url,
            schedules:[],
            modal_schedule: false,
            link_url:'',
            post_title:'',
        }
    },
    mounted() {
        this.link_url = "https://yummtrux.systha.com/mobile/index.html#/truck-profile/"+this.currentUser.table_id+"?cmp=location";
        this.post_title = this.currentUser.owner.name+" : Schedule's Link";
    },
    methods: {
        handleClick(param){
            this.$bus.$emit('MODAL_VIDEO_PLAYER_OPEN',{param});
        },
        handleBack(){
            this.$router.back();
        },
        handleCloseModal(){
            this.modal_schedule = false;
        },
        addSchedule(){
            this.modal_schedule = true;
        }
    },
    components: {
        Location: ()=> import('@/views/vendor/profile/components/TruckLocationList.vue'),
        Topnavbar: ()=> import('@/components/layout/TopnavbarBackCustom'),
        Bottomnavbar: ()=> import('@/components/layout/NavbarBottomVendor'),
        DialogScheduleAdd: ()=>import('@/views/vendor/profile/modal/ModalVendorScheduleAdd'),
        ModalVideoPlayer,
        // InputUpload
    },
    computed: {
          ...mapGetters({
            currentUser:'auth/user',
            profile:'auth/profile',
        })
    }
}
</script>
<style lang="scss" scoped>
.share-icon{
    display: flex;
    a{
        text-decoration: none;
    }
}
</style>