<template>
    <v-container class="ma-0 pa-0"> 
        <Topnavbar/>
        <div class="mg56">
            <div v-if="utype == 'vendors' && isLoggedin" class="test pl-3" :class=" available== 'available' ? 'bg-green' : 'bg-red'" id="rdg">
                <v-radio-group
                    v-model="available"
                    color="primary"
                    v-on:change="updateAvailability"
                    row
                    >
                    <v-radio
                        label="Available"
                        value="available"
                    ></v-radio>
                    <v-radio
                        label="Unavailable"
                        value="unavailable"
                    ></v-radio>
                </v-radio-group>
            </div>
            <div class="filter" v-else>
                <v-btn fab color="primary" @click="handleFilter"><v-icon>mdi-filter</v-icon></v-btn>
            </div> 
           <AddGoogleMap :locationMarkers="locations" :trucks="trucks"/>
           <DialogFilter 
           :zoomLevel="zoomLevel"
           @close="handleClose" 
           :trucks="trucks"
           @handleFilterZip="filterZipCode"
           @handleFilter="fetchFilterData" 
           :dialogFilter="filter"/>
           <DialogConfirm :dialog-confirm="modalConfirm" 
           :message="message"
           @handleConfirm="handleConfirm"
           @close="handleCloseConfirm"/>
        </div>

        <Bottomnavbar/>
    </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import Topnavbar from '@/components/layout/Topnavbar'
import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
import DialogFilter from './DialogFilter'

import { ApiService } from '@/core/services/api.service'
import JwtService from '@/core/services/jwt.service'

import { mdiHome, mdiAccount, mdiChat } from '@mdi/js'
import AddGoogleMap from './map/AddGoogleMap'
import {socketHandler} from '@/core/services/socketio/socket'
import DialogConfirm from '@/components/layout/DialogConfirm'


export default {
    data() {
        return {
            iconHome: mdiHome,
            iconProfile: mdiAccount,
            iconChat: mdiChat,
            currentItem:0,
            countMessages:0,
            zoomLevel:14,
            row:'',
            dashboardItems: [],
            trucks:[],
            value: 1,
            
            locations:[],
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
        }
    },
    components: {
       Topnavbar,
        AddGoogleMap,
        DialogFilter,
       Bottomnavbar,
        DialogConfirm,
    },
    mounted() {
        this.utype = localStorage.getItem('utype');
        this.fetchData();
       
        let deviceToken = localStorage.getItem('d_token');
        this.$bus.$on('loginStatus', (status) => {
            if(status.status) {
                this.isLoggedin = 1;
            }else{
                 this.isLoggedin = 0;
            }
        });
         if(JwtService.getToken()){
            this.isLoggedin = 1;
        }else{
            this.isLoggedin = 0;
        }
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
            ApiService.post("/firebase/deviceToken/save",{ deviceToken: token });
            //   .then(() => {
            //     console.log("device token save");
            //   })
              
            //   .catch(() => {
            //     console.log("Failed to save device token");
            //   });
        },
        async updateAvaiability(){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/self/availability',{ is_active : this.available == "available" ? 1 : 0})
            .then(() => {
                this.handleAvailable();
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
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
        handleFilter() {
            this.filter = true;
            this.fetchCurrentCityTrucks();
        },
        handleAvailable(){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            let availability = this.available == "available" ? 1 : 0;
             ApiService.post('/location/all',{ 
                available: availability,
                guest: localStorage.getItem('g_token'),
            })
            .then((resp) => {
                this.locations = resp.map((location) => ({
                    ...location, position: {
                        lat: Number(location.lat),
                        lng: Number(location.lng)
                    }
                }));
                this.zoomLevel = 12;
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
            });
        },
        fetchDataInterval() {
            this.dataInterval = setInterval(() => {
                if(!this.filter){
                    this.fetchData(false)
                }
            }, 500);
        },
        fetchData(showLoader = true){
            if(showLoader){
                this.$bus.$emit('SHOW_PAGE_LOADER');
            }
            let avai = (this.available == "available") ? 1 : 0;
            if(this.utype === 'clients') {
                avai = 1;
            }
            ApiService.post('/location/all',{ 
                available: avai,
                guest: localStorage.getItem('g_token'),
            })
            .then((resp) => {
                this.locations = resp.map((location) => ({
                    ...location, position: {
                        lat: Number(location.lat),
                        lng: Number(location.lng)
                    }
                }));
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.checkPremium();
                this.zoomLevel = 12;
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.checkPremium();
            });
        },

        fetchCurrentCityTrucks(){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.post('/location/trucks',{ guest: localStorage.getItem('g_token') , available:1})
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.trucks = resp.map((location) => ({
                    ...location, position: {
                        lat: Number(location.lat),
                        lng: Number(location.lng)
                    }
                }));
                this.zoomLevel = 12;
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(error);
            });
        },
        filterZipCode(zip){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.post('/location/search/km',{ zip : zip.zip_code, guest: localStorage.getItem('g_token'), available:1 })
            .then((resp) => {
                // this.$bus.$emit('HIDE_PAGE_LOADER');
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
                this.$bus.$emit('HIDE_PAGE_LOADER');
            });
        },
        fetchFilterData(dist){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.post('/location/search/km',{ distance : dist.radius, guest: localStorage.getItem('g_token'), available:1 })
            .then((resp) => {
                // this.$bus.$emit('HIDE_PAGE_LOADER');
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
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError(error.response.data.message);
                // console.log(error);
            });
        },
          
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