<template>
  <v-row justify="center">
    <v-dialog
		v-model="dialogFilter"
		scrollable
		persistent>
      <v-card class="pa-4" style="border-radius-10">
      <v-card-title class="d-flex ma-0 pa-0i">
        <v-icon @click="handleClose" class="mb-3">mdi-close</v-icon>
        <div v-if="!searchBy" class="d-flex w-100">
          <h4 class="ma-0 filter" @click="handleSearch('radius')">Radius</h4>
          <h4 class="ma-0 filter" @click="handleSearch('zip')">Zip Code</h4>
          <!-- <h4 class="ma-0 filter" @click="handleSearch('')">Order Ahead</h4> -->
        </div>
      </v-card-title>
		<v-card-text class="pa-0">
			<div v-if="searchBy == 'radius'">
			<v-form v-model="validRadius" ref="formRadius" class="pt-4">
				<p class="ma-0">Enter Radius(KMs)</p>
				<v-text-field placeholder="Radius in Kilometers" :rules="rulesRequired" type="number" v-model="radius"></v-text-field>
				<div class="d-flex flex-wrap justify-space-between">
				<v-chip class="mb-2" @click="setRadius(5)">5KM</v-chip>
				<v-chip class="mb-2" @click="setRadius(10)">10KM</v-chip>
				<v-chip class="mb-2" @click="setRadius(15)">15KM</v-chip>
				<v-chip class="mb-2" @click="setRadius(20)">Max Radius</v-chip>
				</div>
				<v-btn block rounded class="mt-3"  color='primary' @click="handleConfirm">Search</v-btn>
			</v-form>
			</div>
			<div v-if="searchBy == 'zip'">
			<v-form v-model="validZip" ref="formZip" class="pt-4">
			<p class="ma-0">Zip Code</p>
			<v-text-field placeholder="Enter Zip Code" :rules="rulesRequired" v-model="zip_code"></v-text-field>
			<v-btn block rounded class="mt-3"  color="primary"  @click="handleZipCode">Search</v-btn>
			</v-form>
			</div>
			<div v-if="trucks && trucks.length">
        <ul class="truck-list">
          <li v-for="(member,index) in trucks" :key="index">
            <div class="image-warpper">
            <img
              width="100"
              :src="member.locate.profile_pic? base_url+'/image-show/'+member.locate.profile_pic:base_url+'/image-show/default.jpg'"
              alt="Profile Pic"
              >
            </div>
            <div class="pl-4">
              <div>
                <h4 class="color-secondary mb-2">{{member.locate.name}}</h4>
                <div class="d-flex">
                  <v-icon color="primary">mdi-map-marker</v-icon>
                  <p class="ma-0 pa-0 f8-bold">{{member.add1}} {{ member.city }} {{ member.zip}}</p>
                </div>
              </div>
              <div>
                <v-btn v-if="member.table_name=='vendors'" class="mr-2" fab outlined color="primarylight" link :to="'/truck-profile/'+member.table_id" small><v-icon>mdi-food</v-icon> </v-btn>
                <v-btn fab outlined color="primarylight" v-if="member.locate && member.locate.contact" class="mr-2" link :href="`tel:${member.locate.contact.phone_no}`" small><v-icon>mdi-phone</v-icon> </v-btn>
                <v-btn v-if="member.table_name=='vendors'" fab outlined color="primarylight" link :to="'/conversation/vendors/'+member.table_id" small><v-icon>mdi-chat</v-icon> </v-btn>
                <v-btn v-if="member.table_name=='clients'" fab outlined color="primarylight" link :to="'/conversation/clients/'+member.table_id" small><v-icon>mdi-chat</v-icon> </v-btn>
              </div>
            </div>
          </li>
        </ul>
			</div>
      <div v-else>
        <h3 class="text-center mt-4">{{message}}</h3>
      </div>
		</v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { base_url } from '@/core/services/config'
  export default {
    props:{
        dialogFilter:{},
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
          message:'Loading...'
      }
    },
    watch:{
        dialogFilter: function(val){
            if(!val){
              this.searchBy = "";
            }
        },
        trucks(val) {
          if(!val.length) {
            this.message="No truck found";
          }
        }
    },
    mounted(){
     
    },
    methods: {
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