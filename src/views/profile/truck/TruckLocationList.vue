<template>
    <div>
        <div v-if="truckProfile && truckProfile.locations && Object.keys(truckProfile.locations).length">
            <ul class="location-list mt-6">
                <li class="" v-for="(location, index) in truckProfile.locations" :key="index">
                    <div class="custom-bs p-relative">
         
                        <div v-if="location.banner">
                            <v-img 
                                height="150"
                                contain
                                :src="base_url+'/image-show/'+ (location.banner ? location.banner :'noimage.png')" >
                            </v-img>
                        </div>
                        <div>
                            <div class="d-flex">
                                <div class="d-flex">
                                    <v-icon color="primary" class="mr-2">{{ iconTime }}</v-icon>
                                    <p class="ma-0"> {{ formatTimeOnly(location.start_time)}} - {{ formatTimeOnly(location.end_time)}}</p>
                                </div>
                                <v-btn link @click="handleRoute(location.id)" small tile text color="warning" class="btn-edit"><v-icon>mdi-pencil</v-icon></v-btn>
                            </div>
                            <div class="d-flex">
                                <v-icon color="primary" class="mr-2">{{ iconLocation }}</v-icon>
                                <div>
                                    <p class="ma-0">
                                        {{location.add1 ? location.add1:''}}
                                        {{location.city?location.city:''}}
                                        {{location.state?location.state:''}}
                                        {{location.zip?location.zip:''}}
                                    </p>
                                </div>
                            </div>
                            <div class="d-flex align-center"> 
                                 <v-icon color="primary" class="mr-2">{{ iconAccount }}</v-icon> 
                                 Nearby Client - {{ location.clients_count }}
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div v-else class="pa-4 unavailable">
            <h4>No schedule available</h4>
        </div>
    </div>
</template>
<script>
import { base_url } from '@/core/services/config'
import { mdiMapMarker, mdiCalendar,mdiClock, mdiAccount } from '@mdi/js'
export default {
    props:{
        truckProfile:{},
    },
    data() {
        return {
            base_url,
            iconLocation:mdiMapMarker,
            iconDate:mdiCalendar,
            iconTime:mdiClock,
            iconAccount:mdiAccount,
            message:'Loading...'
        }
    },
    watch: {
        truckProfile(newval) {
            if(newval.locations.length) {
                this.message="";
            }else{
                 this.message="No schedule";
            }
        }
    },
    methods: {
        handleRoute(id) {
            this.$router.push("/truck-profile-location/"+id);
        }
    }
}
</script>
<style lang="scss" scoped>
.custom-bg-unavailable{
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #cbcbcb;
}
.location-list{
        list-style: none;
        padding: 0;
        margin-bottom:60px;
        li{
            text-transform: capitalize;
            position: relative;
            font-size:0.8rem;
            margin-bottom:20px;
            .btn-edit{
                position: absolute;
                right: 0;
                top: 10px;
            }
        }
}
</style>