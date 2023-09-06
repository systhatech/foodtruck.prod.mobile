<template>
    <v-container class="ma-0 pa-0 theme-bg h-100"> 
        <!-- <Topnavbar/> -->
        <v-container class="mb80 pt-4">
            <v-row>
                <v-col cols="12" md="6" offset-md="3">
                    <v-row>
                         <v-col cols="12">
                             <CurrentLocation/>
                             <div class="custom-bs pa-4 mt-3">
                                 <h4>You are <span :class="currentUser.owner.is_active?'success--text':'error--text'">{{currentUser.owner.is_active?'ONLINE':'OFFLINE'}}</span></h4>
                                 <div class="mt-4">
                                    <v-btn large rounded :color="currentUser.owner.is_active ? 'error':'primary'" @click="updateAvailability">{{ currentUser.owner.is_active ? 'Go Offline':'go online'}}</v-btn>
                                 </div>
                             </div>
                         </v-col>
                    
                     </v-row>
                     <div v-if="loading" class="text-center">
                         <ComponentLoadingVue/>
                     </div>
                     <div v-else>
                         <v-row >
                             <v-col cols="12">
                                 <div class="custom-bs pa-4 mb-4" v-if="getProfile && getProfile.general && getProfile.general.show_dashboard_radius_search">
                                     <div class="pb-2">
                                         <h4>Clients Nearby You</h4>
                                     </div>
                                     <div class="pt-2">
                                         <div class="d-flex">
                                             <div v-for="(mile, index) in miles" :key="index">
                                                 <v-btn v-if="index==selected_mile" rounded outlined color="primary">{{ mile }} miles</v-btn>
                                                 <v-btn v-else color="primary" rounded text @click="handleFechClient(mile, index)">{{ mile }} miles</v-btn>
                                             </div>
                                         
                                         </div>
                                     </div>
                                     <div class="pt-4 text-center">
                                         <p>There are  {{ clientLocations }} clients near you.</p>
                                     </div>
                                     <v-btn rounded block large @click="handleSendNotification">Send notification</v-btn> 
                                 </div>
                          
                                 <div class="custom-bs pa-4 mb-4" v-if="!currentUser.owner.profile_pic">
                                     <div class="pt-2">
                                     <p class="error--text">Upload your truck logo</p>
                                     <v-btn color="primary" large rounded to="/vendor-profile-truck">Upload</v-btn>
                                     </div>
                                 </div>
                                 <div class="custom-bs pa-4 mb-4" v-if="Object.keys(truck_profile).length && !truck_profile.menus">
                                     <div class="pt-2">
                                     <p class="error--text">Add Food Menus</p>
                                     <v-btn color="primary" large rounded to="/vendor-profile-menu">Add now</v-btn>
                                     </div>
                                 </div>
                                 <div  v-if="getProfile && getProfile.general && getProfile.general.show_dashboard_video">
                                     <div class="custom-bs pa-4 mb-4" v-if="currentUser && currentUser.owner && !currentUser.owner.payment_credential">
                                         <div class="pt-2">
                                         <p class="error--text">Add stripe payment credentials</p>
                                         <v-btn color="primary" large rounded to="/payments">Add now</v-btn>
                                         </div>
                                     </div>
                                 </div>
                                 <div class="custom-bs pa-4 mb-4" v-if="profile && !profile.locations">
                                     <div class="pt-2">
                                     <p class="error--text">Add Schedules</p>
                                     <v-btn color="primary" large rounded to="/vendor-profile-schedule">Add now</v-btn>
                                     </div>
                                 </div>
                                 <div class="custom-bs pa-4 mb-4" v-if="profile && !profile.attachments">
                                     <div class="pt-2">
                                     <p class="error--text">Add Gallery</p>
                                     <v-btn color="primary" large rounded to="/profile-files">Add Now</v-btn>
                                     </div>
                                 </div>
                                 <div v-if="getProfile && getProfile.general && getProfile.general.show_dashboard_video">
                                     <div class="custom-bs mb-4" v-if="video">
                                         <div class="">
                                             <div class="pa-4" v-if="video_description">
                                                 <h4 class="mb-0">{{ video_description}}</h4>
                                             </div>
                                             <video autoplay width="100%" controls :src="url_base+'/'+video" muted type='video/mp4' playsinline></video>
                                          
                                         </div>
                                     </div>
                                 </div>
                             </v-col>
                         </v-row>
                     </div>
                </v-col>
            </v-row>
            <DialogConfirm :dialog-confirm="modal_confirm" :message="message" @close="handleClose" @handleConfirm="handleConfirm"/>
            <DialogNearbyNotification/>
        </v-container>
        <Bottomnavbar/>
    </v-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Bottomnavbar from '@/components/layout/NavbarBottomVendor'
import DialogConfirm from '@/components/layout/DialogConfirm'
import { ApiService } from '@/core/services/api.service'
import { mdiHome, mdiAccount, mdiChat,mdiFilter, mdiMap } from '@mdi/js'
// import {socketHandler} from '@/core/services/socketio/socket'
import { url_base } from '@/core/services/config'

export default {
    props:{
        setting:{},
    },
    data() {
        return {
            url_base,
            search:'',
            iconHome: mdiHome,
            iconProfile: mdiAccount,
            iconFilter: mdiFilter,
            iconMap: mdiMap,
            iconChat: mdiChat,
            filter:false,
            available:1,
            active:1,
            bgColor:'#dadada',
            modal_confirm:false,
            message:'Please upgrade to Pro',
            dataInterval : null,
            location:{
                lat:0,
                lng:0,
                city:'',
                state:'',
                zip_code:'',
                add1:'',
                country:'',
                guest:'',
            },
            utype:'',
            availableaaa:'',
            refresh:true,
            subscribed:true,
            isLoggedin:false,
            trucks:[
                {id:1,name:"cafe de cart", address:'80 kane west hardford'},
                {id:2,name:"Porters Coffee House", address:'80 kane west hardford 1'}
            ],
            modelFilter:false,
            mapView:false,
            locations:[],
            clients:[],
            distance:20,
            truck_profile:{},
            loading:false,
            current_location:{
                lat:0,
                lng:0,
            },
            video:'',
            video_description:'',
            miles:[1, 2, 5],
            selected_mile:1,
        }
    },
    components: {
        Bottomnavbar,
        DialogConfirm,
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
        DialogNearbyNotification: () => import('@/views/vendor/dashboard/modal/ModalNearbyNotification'),
        CurrentLocation: () => import('@/components/CurrentLocation.vue'),
    },
    mounted() {
        this.profileData();
        this.fetchData();
        this.fetchProfile();
        if(!this.currentUser) return;
        
        // try{
        //     socketHandler.onlineStatus({
        //         id : this.currentUser.table_id,
        //         table : this.currentUser.table,
        //     });
        // }catch(error) {
        //     console.log({error})
        // }

    },
   
    beforeDestroy() {
        clearInterval(this.dataInterval);
    },
    watch:{
        search(newval){
            if(newval.length >3){
                this.fetchData();
            }
        },
    },
    methods: {
        ...mapActions({
            fetchTrucks:'truck/fetchTrucks',
            fetchTrucksSearch:'truck/fetchTrucksSearch',
            fetchProfile:'auth/fetchProfile',
        }),
        handleSendNotification(){
            // console.log("send notification");
            let clients = this.availableLocations.filter((item)=>item.table_name =='clients');
            // return clients.length;
            this.$bus.$emit('MODAL_NEARBY_NOTIFICATION',{ clients });
        },
        fetchData(){    
            ApiService.post("/site-setting-video-link",{'code':'vendor_dashboard_how_it_works'})
            .then((resp)=>{
                this.video = resp.data.value;
                this.video_description = resp.data.description;
                // console.log({resp});
            })            
            .catch((error)=>{
                console.log({error});
            })
        },
        handleRefreshLocation(){
            window.updateLatLng();
            setTimeout(() => {
                this.fetchAddress();
            }, 1000);
        },
        async profileData() {
            this.loading = true;
            await ApiService.post('/truck/profile/'+ this.currentUser.table_id).then((resp) => {
                this.loading = false;
                this.truck_profile = resp;
            })
            .catch(() => {
                this.loading = false;
            })
        },
        handleFechClient(radius, index){
            this.selected_mile = index;
            this.distance = radius;
            this.loaderShow();
            this.fetchTrucksSearch({ 
                available: 1,
                distance: this.distance,
                guest :  localStorage.getItem('g_token') ? localStorage.getItem('g_token'):'',
                unit : "mile",
            }).then(() =>{
                this.loaderHide()
            })
            .catch((error)=>{
                console.log(error);
            })
        },
        updateAvailability() {
            if(this.currentUser.owner.subscription){
                this.updateAvaiability();
            }else{
                this.available = 0;
                this.modal_confirm = true;
            }
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
        async updateAvaiability(){
            this.loaderShow();
        
            await ApiService.post('/self/availability',{ is_active : this.currentUser.owner.is_active ? 0 : 1})
            .then(() => {
                this.loaderHide();
                this.fetchProfile();
                this.fetchTrucks({ 
                    available: 1,
                    // distance: this.distance,
                    name: this.search,
                    guest: localStorage.getItem('g_token'),
                });
            })
            .catch(() => {
                this.loaderHide();
            });
        },
        handleClose() {
            this.available = 0;
            this.modal_confirm = false;
        },
        handleConfirm(){
            this.$router.push({
                name:'SubscriptionPage'
            });
        },   
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
            availableLocations:'truck/trucks',
            truckMenus:'truck/truckMenus',
            profile:'auth/profile',
            getProfile:'auth/profile'
        }),

        clientLocations(){
            let clients = this.availableLocations.filter((item)=>item.table_name =='clients');
            return clients.length;
        }
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