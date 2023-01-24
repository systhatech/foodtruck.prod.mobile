<template>
    <div class="pt-4">
         <div class="schedule-wrapper" v-if="truckProfile.working_hours && truckProfile.working_hours.length">
            <div
            class="schedulte-item-wrapper"
            v-for="(item, index) in truckProfile.working_hours"
            :key="index"
                >
                <div class="text-capitalize d-flex aling-center justify-space-between">
                    <h5 class="pa-0 ma-0">{{ item.day }}</h5>
                </div>
            </div>
        </div>
        <div v-else class="unavailable">
            <p>{{ message }}</p>
        </div>
    </div>
</template>
<script>
import { base_url } from '@/core/services/config'
export default {
    props:{
        truckProfile:{},
    },
    watch:{
        truckProfile(val) {
            if(!val.working_hours.length){
                this.message = "No schedule";
            }
        },
    },
    data() {
        return {
            base_url,
            message:'Loading...',
        }
    }
}
</script>