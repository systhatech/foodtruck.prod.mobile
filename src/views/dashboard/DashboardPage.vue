<template>
    <v-container class="ma-0 pa-0 theme-bg h-100"> 
        <Topnavbar/>
        <div>
            <div v-if="currentUser && currentUser.table=='vendors'">
                <DashboardVendor/>
            </div>
            <div v-else>
                <DashboardClient/>
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
            search:'',
            zoomLevel:14,
            filter:false,
            distance:10,
            available:"available",
            bgColor:'#dadada',
            modalConfirm:false,
            message:'Please upgrade to Pro',
            dataInterval : null,
            current_location:{
                lat:0,
                lng:0,
                city:'',
                state:'',
                zip_code:'',
                add1:'',
                country:'',
                guest:'',
            },
          
            modelFilter:false,
            mapView:false
        }
    },
    components: {
        Topnavbar,
        DashboardVendor: ()=> import('@/views/vendor/dashboard/VendorDashboardPage'),
        DashboardClient: ()=> import('@/views/client/dashboard/ClientDashboardPage'),
    },
    mounted() {
        // this.fetchTrucks({ 
        //     available: 1,
        //     name: this.search,
        //     guest: localStorage.getItem('g_token'),
        // });
        // this.locateGeoLocation();
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
    watch:{
        search(newval){
            if(newval.length >3){
                this.fetchData();
            }
        }
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
       
        saveDeviceToken(token){
            ApiService.post("/firebase/deviceToken/save",{ deviceToken: token })
              .then(() => {
                console.log("device token save");
              })
              
              .catch(() => {
                console.log("Failed to save device token");
              });
        },
     

        handleClose() {
            this.filter = false;
        },
     
       
        fetchDataInterval() {
            this.dataInterval = setInterval(() => {
                if(!this.filter){
                    this.fetchData(false)
                }
            }, 500);
        },
        fetchData(){
            let   avai = 1;
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

        // locateGeoLocation: function () {
        //     navigator.geolocation.getCurrentPosition(res => {
        //         this.current_location.lat = res.coords.latitude;
        //         this.current_location.lng = res.coords.longitude;
        //     });
        //     this.fetchAddress();
        // },
        // async fetchAddress() {
        //     // this.loaderShow();
        //     ApiService.get('/getapikeys')
        //         .then(async (apiKeys) => {
        //             let googleApiKey = apiKeys.google;
        //             await ApiService.post(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.current_location.lat},${this.current_location.lng}&key=${googleApiKey}`)
        //                 .then((resp) => {
        //                     this.loaderHide();
        //                     for (let addr of resp.results) {
        //                         let address = this.parseGoogleResponse(addr.address_components);
        //                         this.current_location.add1 = address.street_number + " " + address.route;
        //                         this.current_location.city = address.locality;
        //                         this.current_location.state = address.administrative_area_level_1;
        //                         this.current_location.zip_code = address.postal_code;
        //                         this.current_location.country = address.country;
        //                         break;
        //                     }
        //                     this.updateLocation();
                            
        //                     console.log(this.current_location);
        //                 })
        //                 .catch(() => {
        //                     this.loaderHide();
        //                 })
        //         })
        // },
        // async updateLocation() {
        //     await ApiService.post('/location/save-current', this.current_location)
        //     .then((resp) => {
        //         console.log(resp);
        //         this.loaderHide();
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //         this.loaderHide();
        //     })
        // }
          
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