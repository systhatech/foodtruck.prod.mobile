<template>
	<div>
		<v-autocomplete
			v-model="model"
			:items="entries"
			:loading="isLoading"
			:search-input.sync="search"
			hide-no-data
			hide-selected
			no-filter
			:label="label"
			return-object
			chips
			tag
			closable-chips
			color="blue-grey-lighten-2"
			item-title="name"
			item-value="name"
			multiple
		>
            <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :text="item.raw.value"
                ></v-chip>
              </template>
			<template v-slot:item="data">
				<template>
                    <v-list-item-content>
                        <v-list-item-title>
                            <p>
								{{ data.item.value ?data.item.value:'n/a' }}
								<!-- {{ data.item.ctac_comp_name ?' - ' + data.item.ctac_comp_name:'' }} -->
							</p>
                        </v-list-item-title>
                    </v-list-item-content>
				</template>
			</template>
		</v-autocomplete>
	</div>
</template>
<script>
// import { ApiDatatrax } from "@/api.service";
import { ApiService } from '@/core/services/api.service'
  export default {
		props:{
			label:{}
		},
		data: () => ({
			descriptionLimit: 60,
			entries: [],
			isLoading: false,
			model: [],
			search: null
		}),
		methods:{
			handleRemoveModel() {
				this.model = [];
			},
		},
		watch: {
			// model(value) {
			// 	if(value) {
			// 		// this.$emit("selected",value);
            //         this.model = [];
			// 		this.handleRemoveModel();
			// 	}
			// },
		
			search (value) {
				if(value==null || value.length <=2) return;
				this.isLoading = true
		
				ApiService.post("/vendor-lookup-search?search="+value)
				.then((resp) => {
					console.log({resp});
					this.isLoading = false;
                    this.entries = [];
					this.entries = resp.data;
					this.count = this.entries.length;
					// if(!this.entries.length){
					// 	this.$emit('addContact',{'email': value});
					// }
				})
				.catch((error) => {
					this.isLoading = false;
					console.log({error});
				});
			},
		},
	}
</script>