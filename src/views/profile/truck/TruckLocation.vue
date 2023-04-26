<template>
    <div class="pt-4">
        <div v-if="truckProfile && truckProfile.locations && Object.keys(truckProfile.locations).length">
            <ul class="location-list mt-6">
                <li class="mb-3" v-for="(location, index) in truckProfile.locations" :key="index">

                    <div class="custom-bs p-relative">
                        <div v-if="location.banner">
                            <v-img 
                                height="150"
                                contain
                                :src="base_url+'/image-show/'+ (location.banner ? location.banner :'noimage.png')" >
                            </v-img>
                        </div>
                        <div class="pa-4">
                            <h4 v-if="location.name">{{ location.name ? location.name:'' }}</h4>
                            <div>
                                <h5 class="text-uppercase primary--text">date</h5>
                                <p class="mb-1 fs15"> {{ formatStandardUSDate(location.start_date)}} - {{ formatStandardUSDate(location.end_date)}}</p>
                                <p class="mb-4 fs15"> {{ formatTimeOnly(location.start_date)}} - {{ formatTimeOnly(location.end_date)}}</p>
                            </div>
                            <div>
                                <!-- <v-icon color="primary" class="mr-2">{{ iconLocation }}</v-icon> -->
                                <h5 class="text-uppercase primary--text">Location</h5>
                                <div>
                                    <p class="ma-0 fs15">
                                        {{location.add1 ? location.add1:''}}
                                        {{location.city?location.city:''}}<br>
                                        {{location.state?location.state:''}}
                                        {{location.zip?location.zip:''}}
                                        {{location.country_code?location.country_code:''}}
                                    </p>
                                </div>
                                <div class="pt-4">
                                    <v-btn rounded large color="primary" @click="handlePreorder(location)">pre order</v-btn>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="d-flex align-center"> 
                             <v-icon color="primary" class="mr-2">{{ iconAccount }}</v-icon> 
                             Nearby Client - {{ location.clients_count }}
                        </div> -->
                        <!-- <div class="pt-4">
                            <v-btn block rounded color="warning" @click="handleRoute(location)">update</v-btn>
                        </div> -->
                    </div>
                </li>
            </ul>
            <!-- <ul class="location-list">
                <li v-for="(location, index) in truckProfile.locations" :key="index">
                 
                    <div class="d-flex justify-space-between align-center custom-bs mt-4 pa-4">
                    
                        <div>
                            <div class="d-flex pb-2">
                                <v-icon color="primary">{{ iconLocation }}</v-icon>
                                <div>
                                    <p class="f8-bold ma-0">{{location.name}}</p>
                                    <p class="ma-0 pl-1">
                                        {{location.add1 ? location.add1:''}}
                                        {{location.city?location.city:''}}
                                        {{location.state?location.state:''}}
                                        {{location.zip?location.zip:''}}
                                    </p>
                                </div>
                            </div>
                            <h3> <v-icon color="primary">{{ iconTime }}</v-icon> {{ formatTimeOnly(location.start_time)}} - {{ formatTimeOnly(location.end_time)}}</h3>
                        </div>
                        
                    </div>
                </li>
            </ul> -->
            <TruckPreorder 
                :scheduleDate="selected_schedule"
                :dialog_preorder="modal_preorder" 
                @fetchProfile="fetchProfile"
                @close="handleClose()" 
                :truckProfile="truckProfile"/>
        </div>
        <div v-else class="unavailable">
            <p>No schedule</p>
        </div>
    </div>
</template>
<script>
import { base_url } from '@/core/services/config'
import { mdiMapMarker, mdiCalendar,mdiClock, mdiChevronRight } from '@mdi/js'
export default {
    props:{
        truckProfile:{},
    },
    data() {
        return {
            base_url,
            iconLink: mdiChevronRight,
            iconLocation:mdiMapMarker,
            iconDate:mdiCalendar,
            iconTime:mdiClock,
            modal_preorder:false,
            selected_schedule:null,
        }
    },
    components:{
        TruckPreorder:()=>import('@/views/profile/truck/TruckPreorder.vue')
    },
    methods:{
        fetchProfile(){
            //test
            this.$emit("fetchProfile")
        },
        handleClose(){
            this.modal_preorder = false;
        },
        handlePreorder(param){
            this.selected_schedule = param;
            this.modal_preorder = true;
        },
        handleDate(date){
            console.log({date});
            localStorage.setItem('o_date',date);
            this.$bus.$emit('changeComponent',{
                component:'menus',
                date:date,
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.location-list{
        list-style: none;
        padding: 0;
        // display: flex;
        // align-items: center;
        li{
            text-transform: capitalize;
            // font-weight: 600;
            // font-size:0.8rem;
            // padding:14px;
            // &:not(:last-child) {
            //     border-bottom: 1px solid #dadada;
            // }
            .btn-edit{
                // position: absolute;
                // right: 0;
                // top: 10px;
            }
        }
}
</style>