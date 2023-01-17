<template>
  <v-row justify="center">
    <v-dialog
		v-model="modelBookingFilter"
		scrollable
		persistent>
      <v-card class="pa-4" style="border-radius-10">
		<v-card-title class="d-flex">
			<v-icon @click="handleClose" class="mb-3">mdi-close</v-icon>
			<div v-if="!searchBy" class="d-flex w-100">
				<h4 class="ma-0 filter mr-4" @click="handleSearch('radius')">Radius</h4>
				<h4 class="ma-0 filter" @click="handleSearch('zip')">Zip Code</h4>
			</div>
		</v-card-title>
		<v-card-text>
			<v-row>
                <v-col cols="4" sm="4" md="4" lg="2" xl="2">
                    <InputDateRange label="Start Date" @dateSelected="startDate" name="start_date"/>
                </v-col>
                <v-col cols="4" sm="4" md="4" lg="2" xl="2">
                    <InputDateRange label="End Date" @dateSelected="endDate" name="end_date"/>
                </v-col>
                <v-col cols="4" sm="4" md="4" lg="2" xl="2">
                    <v-text-field 
                        label="ZIP Code"
                        type="number"
                        v-model="zip_code"
                    ></v-text-field>
                </v-col>
                <v-col cols="4" sm="12" md="12" lg="6" xl="6">
                    <div class="d-flex align-center justify-space-between">
                        <v-text-field 
                            label="City"
                            v-model="city"
                        ></v-text-field>
                        <div class="ml-5">
                            <v-btn small tile color="primary" @click="handleSearch">Search</v-btn>
                            <v-btn small tile color="secondary">Reset</v-btn>
                        </div>
                    </div>
                </v-col>
            </v-row>
		</v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { base_url } from '@/core/services/config'
// import ModalLocationBooking from './ModalLocationBooking'
import moment from 'moment'
import InputDateRange from '@/components/form-element/InputDateRange'
  export default {
    props:{
        modelBookingFilter:{},
        trucks:{
          type:Array,
        },
    },
    data () {
      return {
          base_url,
          loading:false,
          validRadius:false,
          validZip:false,
          radius:'',
          searchBy:'',
          zip_code:'',
          rulesRequired: [
            v => !!v || 'Required',
            ],
            city:'',
            start_date: "",
            end_date: "", 
      }
    },
    watch:{
        modelBookingFilter: function(val){
            if(!val){
              this.searchBy = "";
            }
        },
    },
    components : {
        // ModalLocationBooking,
        InputDateRange,
    },
    mounted(){
     
    },
    methods: {
         startDate(startDate) {
            if(startDate.date){
                this.start_date = moment(startDate.date).format('YYYY-MM-DD');
            }
        },
        endDate(endDate) {
            if(endDate.date) {
                this.end_date =  moment(endDate.date).format('YYYY-MM-DD');
            }
        },
        handleSearch(param){
          this.searchBy = param;
        },
        setRadius(radius){
          this.radius = radius;
        },
        handleClose(){
            this.$emit('close');
        },
        handleConfirm(){
            if(this.$refs.formRadius.validate()){
              this.$emit('handleFilter',{ radius:this.radius});
            }
        },
        handleZipCode(){
          if(this.$refs.formZip) {
            this.$emit('handleFilterZip',{ zip_code : this.zip_code });
          }
        }
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
.truck-list{
  list-style: none;
  padding:0;
  li{
    display:flex;
	align-items: center;
	padding: 14px 0;
	&:not(:last-child){
		border-bottom:1px solid #dadada;
	}
  }
}
</style>