<template>
    <div class="pt-4">
        <div v-if="truckProfile && truckProfile.locations && Object.keys(truckProfile.locations).length">
            <ul class="location-list">
                <li v-for="(location, index) in truckProfile.locations" :key="index">
                 
                    <!-- <v-chip color="warning">{{ formatDateToDay(index) }}</v-chip> -->
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
            </ul>
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
        }
    },
    methods:{
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
            font-size:0.8rem;
            // padding:14px;
            // &:not(:last-child) {
            //     border-bottom: 1px solid #dadada;
            // }
            .btn-edit{
                position: absolute;
                right: 0;
                top: 10px;
            }
        }
}
</style>