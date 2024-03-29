<template>
    <v-container class="ma-0 pa-0 theme-bg h-100"> 
        <div class="pa-4 pt-2 pb-2 w-100">
            <div class="d-flex align-center justify-space-between w-100">
                <div class="w-100">
                    <CurrentLocation @onUpdate="refreshTrucks"/>
                </div>
            </div>
            <div class="d-flex align-center justify-space-between">
                <v-text-field label="Search by Name" :loading="search_loading" small v-model="search"></v-text-field>
                <v-btn class="ml-4" :disabled="loading" fab color="primary" @click="handleFilterModalOpen">
                    <v-icon large>{{icon_filter}}</v-icon>
                </v-btn>
                <v-btn class="ml-4" :disabled="loading" fab color="primary" @click="changeView()">
                    <v-icon large v-if="map_view">{{icon_list}}</v-icon>
                    <v-icon large v-else>{{icon_map}}</v-icon>
                </v-btn>
            </div>
        </div>
        <v-container v-if="map_view" class="ma-0 pa-0">
            <AddGoogleMap :locationMarkers="locations"/>
        </v-container>
        <v-container v-else class="mg56 pt-4 pb-14 pa-4">
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
import { ApiService } from '@/core/services/api.service'
import {mdiFilter, mdiMap, mdiViewList } from '@mdi/js'
export default {
    props:{
        setting:{},
    },
    data() {
        return {
            search:'',
            search_loading:false,
            icon_map: mdiMap,
            icon_list: mdiViewList,
            zoomLevel:14,
            icon_filter: mdiFilter,
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
            trucks:[],
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
        AddGoogleMap:()=>import('./map/AddGoogleMap'),
        Bottomnavbar:()=>import('@/components/layout/NavbarBottomClient'),
        TruckFilter:()=>import('@/views/dashboard/component/TruckFilter'),
        TruckList:()=>import('@/views/dashboard/component/TruckList'),
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
        CurrentLocation: () => import('@/components/CurrentLocation.vue'),
    },
    async mounted() {
        // this.loading = true;
        // this.fetchAllTrucks();
    },
   
    beforeDestroy() {
        clearInterval(this.dataInterval);
        clearTimeout(this.searchTimer);
    },
    watch:{
        search(newval){
            if(newval.length >=3 || newval.length ==0){
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
            fetchTrucksSearch:'truck/fetchTrucksSearch',
        }),
        refreshTrucks(){
            this.loading = true;
            this.locations = [];
            this.fetchAllTrucks();
        },
        handleFilterModalOpen(){
            this.modelFilter=true
        },
       
        changeView(){
            this.map_view = !this.map_view;
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
            }) 
            .catch((error) => {
                this.loaderHide();
                this.handleCloseFilter();
                this.search_loading = false;
                this.loading = false;
                console.log(error);
            })
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
    
        handleClose() {
            this.filter = false;
        },
     
        fetchAllTrucks() {
            this.loading = true;
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
            }) 
            .catch((error) => {
                this.search_loading = false;
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
        .icon-wrapper {
            padding: 10px;
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


