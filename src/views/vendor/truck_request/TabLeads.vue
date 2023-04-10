<template>
    <div class="">
        <div v-for="(item,index) in leads" :key="index">
            <div v-if="item.type =='catering'">
                <div class="custom-bs pa-4 mb-4">
                    <ItemCatering :item="item" :availableCredit="availableCredit"/>
                </div>
            </div>
            <div v-if="item.type == 'event'">
                <div class="custom-bs pa-4 mb-4">
                    <ItemEvent :item="item" :availableCredit="availableCredit"/>
                </div>
            </div>
            <div v-if="item.type =='regular_event'">
                <div class="custom-bs pa-4 mb-4">
                    <ItemRegularEvent :item="item" :availableCredit="availableCredit"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters} from'vuex'
import moment from 'moment'

export default {
    props:{
        leads:{},
        availableCredit:{}
    },
    data() {
        return {
            moment,
        }
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
        }),
    },
    created() {

    },
    mounted() {
        console.log(this.availableCredit);
    },
    methods: {

    },

    components: {
        ItemCatering:() => import('@/views/vendor/truck_request/ItemCatering.vue'),
        ItemEvent:() => import('@/views/vendor/truck_request/ItemEvent.vue'),
        ItemRegularEvent:() => import('@/views/vendor/truck_request/ItemRegularEvent.vue'),
    }
}
</script>
<style scoped lang="scss">

</style>