<template>
    <div>
         <div class="custom-bs pa-3 mb-4 dashboard-icons" v-for="(truck, index) in trucks" :key="index"> 
            <div class="mb-2">
                <p class=" ma-0 text-capitalize f8-bold text-uppercase">{{ truck.locate.name }}</p>
                <div>
                    <v-icon color="primary">{{iconAddress}}</v-icon>
                    <span class="f8 ml-1">{{truck.add1}}</span>
                </div>
            </div> 
             <div class="d-flex align-center" @click="viewTruck(truck)">
                <v-img
                lazy-src="https://picsum.photos/id/11/10/6"
                max-width="100"
                width="100"
                contain
                :src="base_url+'/image-show/'+(truck.locate.profile_pic?truck.locate.profile_pic:'noimage.png')"
                ></v-img>
                <div class="pl-2">
                    <div>
                        <div>
                            <v-icon class="f18" color="primary">{{iconClock}}</v-icon>
                            <span class="f9">{{ formatDateTime(truck.date)}}</span>
                        </div>
                        <div>
                             <v-icon class="f18" color="primary">{{iconDistance}}</v-icon>
                            <span class="f9">{{ truck.distance? truck.distance : 0 }} km away</span>
                        </div>
                        <div class="mt-2" v-if="truck.categories">
                            <v-chip color="primary" 
                                v-for="(cat,index) in truck.categories.slice(0,2)"
                                :key="index"
                                class="text-capitalize mr-2 mb-1" outlined small>{{ cat }}</v-chip>
                        </div>
                    </div>
                </div>
             </div>
        </div>
        <!-- <div>
            <v-btn rounded outlined>load more</v-btn>
        </div> -->
    </div>
</template>
<script>
import { mdiMapMarkerMultiple, mdiClock, mdiMapMarkerDistance } from '@mdi/js'
import { base_url} from '@/core/services/config'
export default {
    props:{
        trucks:{}
    },
    data() {
        return {
            base_url,
           iconAddress:mdiMapMarkerMultiple,
           iconClock:mdiClock,
           iconDistance:mdiMapMarkerDistance,
        }
    },
    methods: {
        viewTruck(truck){
            // console.log(truck);
            this.$router.push("/truck-profile/"+truck.table_id);
        }
    }
}
</script>
<style lang="scss" scoped>
.f18{
    font-size:18px;
    width:24px;
}

</style>