<template>
    <v-container class="ma-0 pa-0 theme-bg h-100"> 
        <!-- <Topnavbar/> -->
        <div class="pa-4 pt-2 pb-2">
            <div class="d-flex align-center justify-space-between">
                <v-text-field label="Search by Name" :loading="search_loading" small v-model="search"></v-text-field>
                <v-btn class="ml-4" fab color="primary" @click="handleFilterModalOpen">
                    <v-icon large>{{icon_filter}}</v-icon>
                </v-btn>
                <v-btn class="ml-4" fab color="primary" @click="changeView()">
                    <v-icon large v-if="map_view">{{icon_list}}</v-icon>
                    <v-icon large v-else>{{icon_map}}</v-icon>
                </v-btn>
            </div>
        </div>
        <v-container v-if="map_view" class="ma-0 pa-0">
            <AddGoogleMap :locationMarkers="locations"/>
        </v-container>
        <v-container v-else class="mg56 pt-4 pb-14">
           <div>
               <div v-if="locations && locations.length">
                    <TruckList :trucks="locations"/>
                    <div class="text-center pt-4" v-if="!last_page">
                        <v-btn color="primary" :disabled="loading" @click="loadMore()" large rounded outlined>{{ loading ? 'Loading...':'Load More'}}</v-btn>
                    </div>
               </div>
               <div v-else class="text-center">
                    <div v-if="loading">
                        <ComponentLoadingVue/>
                    </div>
                    <div v-else class="unavailable">
                        <p>No trucks available</p>
                    </div>
               </div>
           </div>
        </v-container>
        <TruckFilter 
         :dialogFilter="modelFilter"
         @filter="handleFilter"
         @close="handleCloseFilter"/>
        <Bottomnavbar/>
    </v-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
// import Topnavbar from '@/components/layout/Topnavbar'
import Bottomnavbar from '@/components/layout/NavbarBottomClient'
import TruckList from '@/views/dashboard/component/TruckList'
import TruckFilter from '@/views/dashboard/component/TruckFilter'
import { ApiService } from '@/core/services/api.service'
import { mdiHome, mdiAccount, mdiChat,mdiFilter, mdiMap, mdiViewList } from '@mdi/js'
import AddGoogleMap from './map/AddGoogleMap'
import spinnerImg from './spinner.gif'
// import {socketHandler} from '@/core/services/socketio/socket'
export default {
    data() {
        return {
            search:'',
            search_loading:false,
            spinnerImg,
            iconHome: mdiHome,
            iconProfile: mdiAccount,
            icon_filter: mdiFilter,
            icon_map: mdiMap,
            icon_list: mdiViewList,
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
            map_view:false,
            loading:false,
            searchTimer:null,
            next_page:1,
            last_page:0,
            locations:[],
        }
    },
    components: {
    //    Topnavbar,
        AddGoogleMap,
        // DialogFilter,
       Bottomnavbar,
       TruckFilter,
       TruckList,
       ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
        // DialogConfirm,
    },
    async mounted() {
        this.fetchAllTrucks();
        // await this.locateGeoLocation();
        this.fetchDataInterval();
    },
   
    beforeDestroy() {
        clearInterval(this.dataInterval);
        clearTimeout(this.searchTimer);
    },
    watch:{
        search(newval){
            if(newval.length >=3 || newval.length ==0){
                // this.fetchData();
                clearTimeout(this.searchTimer);
                this.searchTimer = setTimeout(() => {
                    this.search_loading = true;
                    this.locations = [];
                    this.fetchAllTrucks();
                }, 800);
            }
        }
    },
    methods: {
        ...mapActions({
            // fetchTrucks:'truck/fetchTrucks',
            fetchTrucksSearch:'truck/fetchTrucksSearch',
        }),
        handleFilterModalOpen(){
            this.modelFilter=true
        },
       
        changeView(){
            this.map_view = !this.map_view;
            // this.fetchData();
        },
        handleFilter(params) {
            this.loaderShow();
            this.next_page = 1;
            ApiService.post("/location/all",{
                available: 1,
                name: this.search,
                guest: localStorage.getItem('g_token'),
                unit:'mile',
                page:this.next_page,
                ...params,
            })
            .then((resp) => {
                this.loaderHide();
                this.handleCloseFilter();
                this.loading = false;
                this.search_loading = false;
                this.locations = [];
                if(resp.data.length){
                    this.trucks = resp.data.map((loc) => ({
                        ...loc, position: {
                            lat: Number(loc.lat),
                            lng: Number(loc.lng)
                        }
                    }));
                    if(resp.per_page > resp.data.length){
                        this.last_page = 1;
                    }
                    this.locations = this.locations.concat(this.trucks);
                }
                // this.locations = this.trucks;
            }) 
            .catch((error) => {
                this.loaderHide();
                this.handleCloseFilter();
                this.search_loading = false;
                this.loading = false;
                console.log(error);
            })
            // this.loaderShow();
            // params.guest =  localStorage.getItem('g_token') ? localStorage.getItem('g_token'):'';
            // params.available =  1;
            // params.unit = "mile";
            // this.fetchTrucksSearch(params)
            // .then(()=>{
            //     this.loading = false;
            //     this.loaderHide();
            //     this.search_loading = false; 
            //     this.handleCloseFilter();
            // })
            // .catch((error)=>{
            //     this.loaderHide();
            //     this.loading = false;
            //     console.log(error)
            // })
            // ApiService.post('/search',params)
            // .then((resp) => {
            //     this.loaderHide();
            //     this.trucks = resp.map((location) => ({
            //         ...location, position: {
            //             lat: Number(location.lat),
            //             lng: Number(location.lng)
            //         }
            //     }));
            //     this.locations = this.trucks;
            //     this.handleCloseFilter();
            //     this.zoomLevel = 12;
            //     this.loaderHide();
            // })
            // .catch((error) => {
            //     this.loaderHide();
            //     if(error.response && error.response.data && error.response.data.message){
            //         this.messageError(error.response.data.message);
            //     }
            //     this.messageError(error.response.data.message);
            //     this.loaderHide();
            // });
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
      
        // fetchData(showLoader = true){
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
                // console.log(this.trucks);
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

        fetchDataInterval() {
            this.dataInterval = setInterval(() => {
                this.locateGeoLocation(false)
            }, 300000);
        },
        async locateGeoLocation() {
            this.loading = true;
            navigator.geolocation.getCurrentPosition(res => {
                this.current_location.lat = res.coords.latitude;
                this.current_location.lng = res.coords.longitude;
            });
            await this.fetchAddress();
        },
        async fetchAddress() {
            // this.loaderShow();
            ApiService.get('/getapikeys')
                .then(async (apiKeys) => {
                    let googleApiKey = apiKeys.google;
                    await ApiService.post(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.current_location.lat},${this.current_location.lng}&key=${googleApiKey}`)
                        .then((resp) => {
                            this.loaderHide();
                            for (let addr of resp.results) {
                                let address = this.parseGoogleResponse(addr.address_components);
                                this.current_location.add1 = address.street_number + " " + address.route;
                                this.current_location.city = address.locality;
                                this.current_location.state = address.administrative_area_level_1;
                                this.current_location.zip_code = address.postal_code;
                                this.current_location.country = address.country;
                                break;
                            }
                            this.updateLocation();
                        })
                        .catch(() => {
                            this.loaderHide();
                        })
                })
        },
        async updateLocation() {
            await ApiService.post('/location/save-current', this.current_location)
            .then(() => {
                this.fetchAllTrucks();
                this.loaderHide();
            })
            .catch((error) => {
                console.log(error);
                this.loaderHide();
            })
        },
        fetchAllTrucks() {
            this.loading = true;
            
            // this.fetchTrucks({ 
            //     available: 1,
            //     name: this.search,
            //     guest: localStorage.getItem('g_token'),
            //     unit:'mile',
            //     page:this.next_page,
            // })
            // .then(()=>{
            //     this.loading = false;
            //     this.search_loading = false;
            // })
    
            ApiService.post("/location/all",{
                available: 1,
                name: this.search,
                guest: localStorage.getItem('g_token'),
                unit:'mile',
                page:this.next_page,
            })
            .then((resp) => {
                this.loading = false;
                this.search_loading = false;
                this.trucks = resp.data.map((loc) => ({
                    ...loc, position: {
                        lat: Number(loc.lat),
                        lng: Number(loc.lng)
                    }
                }));
                if(resp.per_page > resp.data.length){
                    this.last_page = 1;
                }
                this.locations = this.locations.concat(this.trucks);
                // this.locations = this.trucks;
            }) 
            .catch((error) => {
                this.search_loading = false;
                this.loading = false;
                console.log(error);
            })
        },
        fetchAllTrucksSearch() {
            this.loading = true;
            // this.fetchTrucks({ 
            //     available: 1,
            //     name: this.search,
            //     guest: localStorage.getItem('g_token'),
            //     unit:'mile',
            //     page:this.next_page,
            // })
            // .then(()=>{
            //     this.loading = false;
            //     this.search_loading = false;
            // })
    
            ApiService.post("/location/all",{
                available: 1,
                name: this.search,
                guest: localStorage.getItem('g_token'),
                unit:'mile',
                page:this.next_page,
            })
            .then((resp) => {
                this.loading = false;
                this.trucks = resp.data.map((loc) => ({
                    ...loc, position: {
                        lat: Number(loc.lat),
                        lng: Number(loc.lng)
                    }
                }));
                if(resp.per_page > resp.data.length){
                    this.last_page = 1;
                }
                this.locations = this.locations.concat(this.trucks);
                // this.locations = this.trucks;
            }) 
            .catch((error) => {
                this.loading = false;
                console.log(error);
            })
        },
        loadMore(){
            this.next_page +=1;
            this.fetchAllTrucks();
        }
          
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
            // locations:'truck/trucks'
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


