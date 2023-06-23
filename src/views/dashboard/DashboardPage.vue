<template>
    <v-container class="ma-0 pa-0 theme-bg h-100 background-image"> 
        <Topnavbar/>
        <div class="background-image">
            <div v-if="currentUser && currentUser.table=='vendors'">
                <DashboardVendor :setting="setting"/>
            </div>
            <div v-else>
                <DashboardClient :setting="setting"/>
            </div>
        </div>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/Topnavbar'
import { mapGetters, mapActions } from 'vuex'
import { ApiService } from '@/core/services/api.service'
import {socketHandler} from '@/core/services/socketio/socket'
export default {
    data() {
        return {
            setting:{
                show_background_process:0,
            }
        }
    },
    components: {
        Topnavbar,
        DashboardVendor: ()=> import('@/views/vendor/dashboard/VendorDashboardPage'),
        DashboardClient: ()=> import('@/views/client/dashboard/ClientDashboardPage'),
    },
    mounted() {
        // this.fetchSetting();
        if(this.currentUser == null || (!this.currentUser && Object.keys(this.currentUser).length ==0)) return;
        let deviceToken = localStorage.getItem('d_token');
        this.saveDeviceToken(deviceToken);
        try{
            socketHandler.onlineStatus({
                id : this.currentUser.table_id,
                table : this.currentUser.table,
            });
        }catch(error) {
            console.log({error})
        }
       
    },
   
    beforeDestroy() {
        clearInterval(this.dataInterval);
    },

    methods: {
        ...mapActions({
            fetchTrucks:'truck/fetchTrucks'
        }),

        fetchSetting(){
            ApiService.post("/getsettings")
            .then((resp) =>{
                this.setting.show_background_process = resp.show_background_process;
            })
            .catch((error) =>{
                console.log(error);
            })
        },
       
        saveDeviceToken(token){
            ApiService.post("/firebase/deviceToken/save",{ deviceToken: token })
              .then(() => {
                console.log("device token save");
              })
              .catch(() => {
                console.log("Failed to save device token");
              });
        },
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
            locations:'truck/trucks'
        })
    }

}
</script>
<style lang="scss" scoped>
    $color-primary: #01a6bc;
    $color-secondary: #01a6bc;
    .filter{
        position: absolute;
        z-index: 2;
        transform: translate(-50%, -50%);
        left: 50%;
        bottom: 120px;
    }
    .bg-green{
        background : #b1ffc9;
        color:#fff;
    }
    .bg-red{
        background: #fdbfbf;
        color:#fff;
    }
    .test{
       position: absolute;
        z-index: 2;
        // background: #fdbfbf;
        width: 75%;
        padding: 0px 10px;
        transform: translate(-50%, -50%);
        left: 50%;
        bottom: 114px;
        border-radius:40px;
    }
    .active-item{
            // background:#cce3ff !important;
    }
    // .custom-bs{
    //     -webkit-box-shadow: 0px 0px 34px 1px rgba(222,222,222,1) !important;
    //     -moz-box-shadow: 0px 0px 34px 1px rgba(222,222,222,1) !important;
    //     box-shadow: 0px 0px 34px 1px rgba(222,222,222,1) !important;
    // }
    .dashboard-items{
        border-radius: 10px;
        text-align: center;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 12px;
        -webkit-box-shadow: 0px 0px 34px 1px rgba(222,222,222,1) !important;
        -moz-box-shadow: 0px 0px 34px 1px rgba(222,222,222,1) !important;
        box-shadow: 0px 0px 34px 1px rgba(222,222,222,1) !important;
        
        .icon-wrapper{
            color:#dadada;
            i{
                font-size:2rem;
            }
        }
        .text-item{
            font-size:0.8rem;
            font-weight: 600;
        }
    }
    .item-container {
        display: flex;
        align-items: center;
        margin: 24px 0;
        padding: 14px 16px;
        border-radius: 10px;
        background: #a0cbff91;
        // border: 1px solid #a0cbff91;
        .icon-wrapper {
            padding: 10px;
            // background: #19477e26;
            background: #19477ede;
            border-radius: 9px;
            i {
            color: #fff;
            }
        }
        .text-wrapper {
            padding: 0 12px;
            .text-heading {
                padding: 0 12px;
                font-weight: 600;
                font-size: 1.2rem;
                color: #000;
            }
            .text-sub-heading {
                font-size: 0.8rem;
            }
        }
       
    }
    #rdg{
        .v-input--selection-controls .v-input__slot > .v-label, .v-input--selection-controls .v-radio > .v-label {
            font-size: 0.9rem !important;
        }
        .v-input--radio-group__input {
            display: flex !important;
            align-items: center !important;
            justify-content: space-around !important;
        }
    }
</style>