<template>
    <v-container class="ma-0 pa-0 theme-bg h-100"> 
        <Topnavbar/>
        <v-container class="mg56 pt-4">
           <div>
                <p>There are  {{ clientLocations.length }} clients near you.</p>
           </div>
        </v-container>
        <Bottomnavbar/>
    </v-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Topnavbar from '@/components/layout/Topnavbar'
import Bottomnavbar from '@/components/layout/NavbarBottomVendor'
import { ApiService } from '@/core/services/api.service'
import { mdiHome, mdiAccount, mdiChat,mdiFilter, mdiMap } from '@mdi/js'
import {socketHandler} from '@/core/services/socketio/socket'
export default {
    data() {
        return {
            search:'',
            iconHome: mdiHome,
            iconProfile: mdiAccount,
            iconFilter: mdiFilter,
            iconMap: mdiMap,
            iconChat: mdiChat,
            currentItem:0,
            countMessages:0,
            zoomLevel:14,
            row:'',
            dashboardItems: [],
            // trucks:[],
            value: 1,
            
            // locations:[],
            locationsList:[],
            filter:false,
            distance:10,
            available:"available",
            bgColor:'#dadada',
            modalConfirm:false,
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
            mapView:false
        }
    },
    components: {
       Topnavbar,
       Bottomnavbar,
    },
    mounted() {
        this.fetchTrucks({ 
            available: 1,
            name: this.search,
            guest: localStorage.getItem('g_token'),
        });
        let deviceToken = localStorage.getItem('d_token');
        this.saveDeviceToken(deviceToken);
        if(!this.currentUser) return;
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
    watch:{
        search(newval){
            if(newval.length >3){
                this.fetchData();
            }
        },
    },
    methods: {
        ...mapActions({
            fetchTrucks:'truck/fetchTrucks'
        }),


       
        changeView(){
            this.mapView = !this.mapView;
            this.fetchData();
        },
        handleFilter(params) {
            this.loaderShow();
            params.guest =  localStorage.getItem('g_token') ? localStorage.getItem('g_token'):'';
            params.available =  1;
             ApiService.post('/location/search/km',params)
            .then((resp) => {
                this.loaderHide();
                this.trucks = resp.map((location) => ({
                    ...location, position: {
                        lat: Number(location.lat),
                        lng: Number(location.lng)
                    }
                }));
                this.locations = this.trucks;
                this.handleCloseFilter();
                this.zoomLevel = 12;
                this.loaderHide();
            })
            .catch((error) => {
                this.loaderHide();
                if(error.response && error.response.data && error.response.data.message){
                    this.messageError(error.response.data.message);
                }
                this.messageError(error.response.data.message);
                this.loaderHide();
            });
        },
        handleCloseFilter(){
            this.modelFilter = false;
        },
        checkPremium() {
            if((this.utype == 'vendors')){
                this.fetchProfile();
            }
        },
        async fetchProfile() {
            await ApiService.post("profile").then((response) => {
                if(response.data.owner.subscription === null){
                    this.available = "unavailable";
                    this.modalConfirm = true;
                    this.subscribed = false;
                }else{
                    this.subscribed = true;
                }
			})
			.catch(() => {
                console.log("no fetch")
			})
        },
        updateAvailability() {
            if(this.subscribed){
                this.updateAvaiability();
            }else{
             
                this.available = "unavailable";
                this.modalConfirm = true;
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
            await ApiService.post('/self/availability',{ is_active : this.available == "available" ? 1 : 0})
            .then(() => {
                this.handleAvailable();
            })
            .catch(() => {
                this.loaderHide();
            });
        },
        handleConfirm(){
            this.$router.push({name :'SubscriptionPage'});
        },
        handleCloseConfirm(){
            this.available = "unavailable";
            this.modalConfirm = false;
        },
        handleClose() {
            this.filter = false;
        },
        // handleFilter() {
        //     this.filter = true;
        //     this.fetchCurrentCityTrucks();
        // },
        handleAvailable(){
            this.loaderShow();
            let availability = this.available == "available" ? 1 : 0;
             ApiService.post('/location/all',{ 
                available: availability,
                guest: localStorage.getItem('g_token'),
            })
            .then((resp) => {
                this.loaderHide();
                this.locations = resp.map((location) => ({
                    ...location, position: {
                        lat: Number(location.lat),
                        lng: Number(location.lng)
                    }
                }));
                this.zoomLevel = 12;
                this.trucks = this.locations;
            })
            .catch(() => {
                this.loaderHide();
            });
        },
        fetchDataInterval() {
            this.dataInterval = setInterval(() => {
                if(!this.filter){
                    this.fetchData(false)
                }
            }, 500);
        },
        // fetchData(showLoader = true){
        fetchData(){
        // console.log(showLoader)
            // console.log("test");
            // if(showLoader){
            //     this.loaderShow();
            // }
            // let avai = (this.available == "available") ? 1 : 0;
            // if(this.utype === 'clients') {
             let   avai = 1;
            // }
            this.loaderShow();
            ApiService.post('/location/all',{ 
                available: avai,
                name: this.search,
                guest: localStorage.getItem('g_token'),
            })
            .then((resp) => {
                this.locations = resp.map((location) => ({
                    ...location, position: {
                        lat: Number(location.lat),
                        lng: Number(location.lng)
                    }
                }));
                this.loaderHide();
           
                // this.checkPremium();
                this.zoomLevel = 12;
            })
            .catch(() => {
                this.loaderHide();
                this.checkPremium();
            });
        },

        fetchCurrentCityTrucks(){
            this.loaderShow();
            ApiService.post('/location/trucks',{ guest: localStorage.getItem('g_token') , available:1})
            .then((resp) => {
                this.loaderHide();
                this.trucks = resp.map((location) => ({
                    ...location, position: {
                        lat: Number(location.lat),
                        lng: Number(location.lng)
                    }
                }));
                console.log(this.trucks);
                this.zoomLevel = 12;
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            });
        },
        filterZipCode(zip){
            this.loaderShow();
            ApiService.post('/location/search/km',{ zip : zip.zip_code, guest: localStorage.getItem('g_token'), available:1 })
            .then((resp) => {
                // this.loaderHide();
                // this.handleClose();
                this.trucks = resp.map((location) => ({
                    ...location, position: {
                        lat: Number(location.lat),
                        lng: Number(location.lng)
                    }
                }));
                 this.locations = this.trucks;
                this.zoomLevel = 12;
            })
            .catch(() => {
                this.loaderHide();
            });
        },
        fetchFilterData(dist){
            this.loaderShow();
            ApiService.post('/location/search/km',{ distance : dist.radius, guest: localStorage.getItem('g_token'), available:1 })
            .then((resp) => {
                // this.loaderHide();
                // this.handleClose();
                this.trucks = resp.map((location) => ({
                    ...location, position: {
                        lat: Number(location.lat),
                        lng: Number(location.lng)
                    }
                }));
                 this.locations = this.trucks;
                this.zoomLevel = 12;
            })
            .catch((error) => {
                this.loaderHide();
                this.messageError(error.response.data.message);
                // console.log(error);
            });
        },
          
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
            locations:'truck/trucks'
        }),

        clientLocations(){
            let clients = this.locations.filter((item)=>item.table_name =='clients');
            return clients;
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