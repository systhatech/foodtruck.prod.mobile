<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mg56">
            <v-btn color="primary" link to="/profile-menu-add" class="mb-2" rounded outlined block>Add New menu</v-btn>
            <div>
                <TruckMenu :truckProfile="profile"/>
            </div>
        </v-container>
         <Bottomnavbar :value="0"/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
import { base_url } from '@/core/services/config'
import TruckMenu from './truck/TruckMenu.vue'
// import InputUpload from '@/components/form-element/InputUpload'
import { mapGetters } from 'vuex'
export default {
    name:'EditProfile',
    data() {
        return {
            title:'',
            base_url,
            schedules:[],
            profile:{},
        }
    },
    mounted() {
        this.profileData();
    },
    methods: {
        handleBlur(){

        },
        handleBack(){
            this.$router.back();
        },
        async profileData() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.get('/truck/profile/'+ this.currentUser.table_id).then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.profile = resp;
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
        },
    },
    components: {
        TruckMenu,
        Topnavbar,
        Bottomnavbar,
        // InputUpload
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
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