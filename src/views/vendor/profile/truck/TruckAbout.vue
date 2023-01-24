<template>
    <div class="custom-bs pa-4 mt-4">
        <div class="pt-4" v-if="truck.description">
            {{ truck.description }}
        </div>
        <div v-else class="unavailable">
            <p>No description</p>
        </div>
    </div>
</template>
<script>
import { base_url } from '@/core/services/config'
export default {
    props:{
        truck:{},
    },
    data() {
        return {
            base_url,
        }
    }
}
</script>