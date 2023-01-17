<template>
  <v-row justify="center">
    <v-dialog
		v-model="modalPayoutFilter"
		scrollable
		persistent>
      <v-card style="border-radius-10">
		<v-card-title class="d-flex justify-space-between">
            <p class="ma-0">Date Search</p>
            <v-icon @click="handleClose" class="mb-3">mdi-close</v-icon>
		</v-card-title>
		<v-card-text>
			<div class="date-filter mt-4 d-flex align-center">
                <DateStart 
                    label="Start Date" 
                    @dateSelected="selectedStart"
                    :maxDate="maxDate" class="mr-8"/>
                <DateEnd 
                    label="End Date" 
                    @dateSelected="selectedEnd"
                    :minDate="minDate"/>

            </div>
            <div class="mt-3">
                <v-btn block color="primary" rounded @click="handleSearch"> Search</v-btn>
            </div>
		</v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import DateStart from '@/components/form-element/InputDateRange'
import DateEnd from '@/components/form-element/InputDateLastPicker'
import moment from 'moment'
  export default {
    props:{
        modalPayoutFilter:{},
    },
    data () {
        return {
            date: new Date().toISOString().substr(0, 10), 
            maxDate:'',
            minDate:'',
            moment,
            startDate:new Date().toISOString().substr(0, 10), 
            endDate:new Date(new Date().getFullYear(),new Date().getMonth() + 1, 0).toISOString().substr(0, 10),
        }
    },
    watch:{
       
    },
    mounted(){
     
    },
    methods: {
        selectedStart(start) {
            this.minDate = moment(start.date).format('YYYY-MM-DD');
            this.startDate = this.maxDate;
        },
        selectedEnd(end){
            this.maxDate = moment(end.date).format('YYYY-MM-DD');
            this.endDate = this.maxDate;
        },
        handleClose(){
            this.$emit('close');
        },
        handleSearch(){
            this.$emit('search',{ 
                start_date: this.startDate,
                end_date: this.endDate,
            });
        },
        
    },
    components: {
        DateStart,
        DateEnd,
    }
  }
</script>
<style lang="scss" scoped>
.filter{
  text-align: center;
    padding: 10px 12px;
    border: 1px solid #dadada;
    border-radius: 4px;
}

</style>