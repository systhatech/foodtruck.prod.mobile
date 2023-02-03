<template>
    <v-container class="ma-0 pa-0 background-image h-100">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mg56">
            <v-btn color="primary" @click="addSchedule()" class="mb-4" rounded outlined block>Add New Schedule</v-btn>
            <!-- <v-btn color="primary" to="/vendor-location-add" class="mb-4" rounded outlined block>Add New Schedule</v-btn> -->
            <div>
                <Location :truckProfile="profile"/>
            </div>
            <DialogScheduleAdd :dialog-schedule="modal_schedule" @close="handleCloseModal"/>
        </v-container>
         <!-- <Bottomnavbar value="0"/> -->
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
            // profile:{},
        }
    },
    mounted() {
        console.log(this.profile);
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
        // Bottomnavbar,
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
.schedule {
    text-align: center;
    padding: 10px;
    color: #b5b5b5;
    background: #fff;
    height: 180px;
    border-radius: 20px;
    align-items: center;
    justify-content: space-around;
    display: flex;
}
.schedule-wrapper{
    background: #ffffff;
    border-radius:10px;
    padding:10px;
    margin-bottom: 70px;
}
.schedulte-item-wrapper{
    padding:10px;
    // border:1px solid #dadada;
    margin-bottom: 14px;
    border-radius:10px;
    -webkit-box-shadow: 3px 5px 28px -7px rgba(184,184,184,0.52);
    -moz-box-shadow: 3px 5px 28px -7px rgba(184,184,184,0.52);
    box-shadow: 3px 5px 28px -7px rgba(184,184,184,0.52);
}
.form-container{
    // .login-container{
    // background: #acfa95;
    border-radius: 10px;
    // margin-top: 27px !important;
    padding:20px;
// }
}
</style>