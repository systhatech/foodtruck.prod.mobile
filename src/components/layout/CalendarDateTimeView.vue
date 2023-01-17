<template>
    <v-container class="pa-0 ma-0 page-container"> 
        <date-picker 
            v-model="date" 
            is-expanded
            mode="dateTime" 
            :minDate="minDate"
            :timezone="timezone" />
    </v-container>
</template>
<script>

import moment from 'moment'
export default {
    props:["minDate"],
    data() {
       
        return {
            moment,
            masks: {
                weekdays: 'WWW',
            },
            date: new Date(),
            timezone: '',
        };
    },
    watch: {
        date(day){
            this.$emit('dayClick',moment(day).format('YYYY-MM-DD hh:mm:ss'));
        }
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