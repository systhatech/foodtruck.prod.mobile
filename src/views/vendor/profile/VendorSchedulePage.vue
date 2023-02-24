<template>
    <v-container class="ma-0 pa-0 background-image h-100">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mb80">
            <v-btn outlined color="primary" @click="addSchedule()" class="mb-4" rounded large block><v-icon>mdi-plus</v-icon> Add New Schedule</v-btn>
            <div>
                <Location :truckProfile="profile"/>
            </div>
            <DialogScheduleAdd :dialog-schedule="modal_schedule" @close="handleCloseModal"/>
        </v-container>
         <Bottomnavbar/>
    </v-container>
</template>
<script>
import { base_url } from '@/core/services/config'
import { mapGetters } from 'vuex'
export default {
    name:'ProfileSchedules',
    data() {
        return {
            title:'',
            base_url,
            schedules:[],
            modal_schedule: false,
        }
    },
    mounted() {
        // 
    },
    methods: {
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
        DialogScheduleAdd: ()=>import('@/views/vendor/profile/modal/ModalVendorScheduleAdd')
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
</style>