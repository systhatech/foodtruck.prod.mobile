<template>
    <v-container class="pa-0 ma-0 page-container"> 
            <vc-calendar
                class="custom-calendar max-w-full"
                :masks="masks"
                :attributes="events"
                :min-date="minDate"
                :disabled-dates="datesDisabled"
                disable-page-swipe
                @dayclick="onDayClick"
                is-expanded
                >
            </vc-calendar>
    </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
    props:{
        events:{
            type: Array,
        },
        datesDisabled: {},
        minDate:{},
    },
    data() {
        // const month = new Date().getMonth();
        // const year = new Date().getFullYear();
        return {
            moment,
            masks: {
                weekdays: 'WWW',
            },
            selectedDate:'',
            days: [],
            // events:[],
        };
    },
    components: {
        // Topnavbar
    },
    mounted() {
    },
    methods: {
        onDayClick(day) {
            // this.selectedDate = moment(day.date).format('MM/DD/YYYY');
            this.$emit('dayClick',day);
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
.event-title{
    padding: 12px;
    color: #fff;
    background:#75ab26;
}
ul.event-lists {
    padding-top: 15px;
    li{
        font-size: 0.9rem;
        font-weight: 400;
        padding: 4px 0;
    }
}
</style>