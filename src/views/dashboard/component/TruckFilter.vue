<template>
    <v-row justify="center">
        <v-dialog
        v-model="dialogFilter"
        persistent
        scrollable
        fullscreen>
        <v-card class="background-image" style="padding-top: 56px !important;">
            <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                <v-toolbar-title class="text-capitalize">Filter</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn text @click="handleClose">
                        Close
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <!-- <v-container> -->
                <div class="pa-4">
					<div class="custom-bs pa-4">
						<div class="mb-4">
							<div>
								<Lookup label="Cuisines" :items="cuisine_types" @selected="handleSelectedCuisines"/>
							</div>
						</div>
						<div class="mb-4">
							<div>
							<p class="mb-0">Radius</p>
							<v-text-field class="pt-0"  
								v-model="radius"
								type="number"></v-text-field>
							</div>
						</div>
						<div class="mb-4">
							<div>
							<p class="mb-0">ZIP CODE</p>
							<v-text-field class="pt-0" type="number"
								v-model="zip"></v-text-field>
							</div>
						</div>
						<div class="w-100 d-flex align-center justify-space-around pa-4">
							<v-btn
								color="primary"
								@click="handleFilter"
								rounded
								large
								block
							>
								search
							</v-btn>
						</div>
					</div>
				</div>
			
			
		</v-card>
		</v-dialog>
	</v-row>
</template>
<script>
import { mdiClose } from '@mdi/js'
// import InputDatePicker from '@/components/form-element/InputDatePicker'
import moment from 'moment'
import { ApiService } from '@/core/services/api.service'

  export default {
    props:{
        dialogFilter:{}
    },
    data () {
      return {
        moment,
        iconClose:mdiClose,
        notifications: false,
        sound: true,
        widgets: false,
        radius:10,
        zip:"",
        date: new Date().toISOString().substr(0, 10), 
		categories:[],   
		selectedItems:[],    
		cuisine_types:[], 
		selected_cuisines:[],
      }
    },
    components: {
        // InputDatePicker,
		Lookup: ()=> import('@/components/form-element/InputAutocompleteIdValueWithTag.vue')
    },
    mounted() {
		this.fetchCuisines();
    },
    methods:{
		handleSelectedCuisines(param){
			console.log(param.selected_data);
			this.selected_cuisines = param.selected_data;
		},
		fetchCuisines(){
			ApiService.post("/vendor-lookup-search")
			.then((resp) => {
				this.cuisine_types = resp.data;
			})
			.catch((error) => {
				this.isLoading = false;
				console.log({error});
			});
		},

		setClass(id){
			let ids = this.selectedItems.map((item) => item.id);
			if(ids.includes(id)){
				return "primary";
			}
			return "";
		},
		handleSelect(value){
			let exist = this.selectedItems.filter((item) => item.id == value.id);
			if(exist.length){
				this.selectedItems = this.selectedItems.filter((item) => item.id != value.id);
			}else{
				this.selectedItems.push(value);
			}
			console.log(this.selectedItems);
		},
       
        handleClose(){
            this.$emit('close');
        },
        selectedDate(date){
            this.date = moment(date).format('YYYY-MM-DD')
        },
        handleFilter(){
            this.$emit("filter",{
                date: this.date,
                zip: this.zip,
                distance: this.radius ? this.radius: 0,
				cuisines: this.selected_cuisines,
            })
        },
        handleClear(){
             this.$emit("filter",{ distance:0})
        }
    }
  }
</script>