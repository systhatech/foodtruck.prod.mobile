<template>
	<v-row justify="center">
		<v-dialog
		scrollable
		persistent
		v-model="dialogFilter"
		>
		<v-card>
			<v-toolbar
			elevation="0"
			dark
			color="primary"
			>
			<v-toolbar-title>Filter</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-items>
				<v-btn
				text
				icon
				class="ma-0 pa-0"
				@click="handleClose"
				>
				<v-icon>{{ iconClose }}</v-icon>
				</v-btn>
			</v-toolbar-items>
			</v-toolbar>
			<v-card-text>
				<div class="pt-4">
					<!-- <div class="mb-4">
						<div>
						<p class="mb-0">Date</p>
							<InputDatePicker class="mt-0" label="Select Date" @selectedDate="selectedDate"/>
						</div>
					</div> -->
					<div class="mb-4">
						<div>
						<p class="mb-0">Cuisine</p>
						<div>
							<v-chip v-for="(category,index) in categories" :key="index" 
								class="mr-2 text-capitalize mb-2" 
								:color="setClass(category.id)"
								@click="handleSelect(category,index)">{{ category.value}}</v-chip>
						</div>
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
				</div>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions class="w-100 d-flex align-center justify-space-between pa-4">
			<v-btn
				color="primary"
				@click="handleFilter"
				outlined
			>
				search
			</v-btn>
			<v-btn
				color="primary"
				@click="handleClear"
				outlined
			>
				Clear
			</v-btn>
			</v-card-actions>
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
        radius:0,
        zip:"",
        date: new Date().toISOString().substr(0, 10), 
		categories:[],   
		selectedItems:[],     
      }
    },
    components: {
        // InputDatePicker,
    },
    mounted() {
        this.fetchCategories();
    },
    methods:{
		setClass(id){
			let ids = this.selectedItems.map((item) => item.id);
			if(ids.includes(id)){
				return "primary";
			}
			return "";
			// return false;
			// let isSelected = this.selectedItems.filter((item) => )
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
        fetchCategories() {
           ApiService.get("/self/menus")
           .then((response) => {
				this.categories = response;
           })
           .catch((error) => {
             console.log(error);
           })
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
				cuisines: this.selectedItems.map((item) => item.id),
            })
        },
        handleClear(){
             this.$emit("filter",{ distance:0})
        }
    }
  }
</script>