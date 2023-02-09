<template>
	<div>
		<v-row justify="center">
			<v-dialog v-model="dialogVarientAdd" persistent scrollable fullscreen>
				<v-card class="background-image" style="padding-top: 56px !important;">
					<v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
						<v-toolbar-title class="pl-0 text-capitalize">New Variant</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-toolbar-items>
							<v-btn text @click="handleClose">
								Close
							</v-btn>
						</v-toolbar-items>
					</v-toolbar>
					<div>
					<v-container class="custom-bs">
						<v-row>
							<v-col cols="12" sm="8" offset-sm="2" md="6" offset-md="3">
								<div>
									
									<v-form ref="formVarient">
										<v-text-field label="Group Name" :rules="rulesRequired"
											v-model="varient.name"></v-text-field>
										<div>
											<div class="d-flex align-center justify-space-between mb-3">
												<div>
													<p class="ma-0 pa-0">Items</p>
													<v-checkbox v-model="select_single" label="Select Single"></v-checkbox>
												</div>
			
												<v-btn fab x-small color="accent"
													@click="addItem()"><v-icon>mdi-plus</v-icon></v-btn>
											</div>
											<div>
			
												<v-row class="mb-0 mt-0 pt-0 pb-0" v-for="(item, i) in varient.items" :key="i">
													<v-col cols="6" class="mb-0 mt-0 pt-0 pb-0"><v-text-field v-model="item.name"
															label="Name"></v-text-field></v-col>
													<v-col cols="4" class="mb-0 mt-0 pt-0 pb-0"> <v-text-field v-model="item.value"
															type="number" label="Price"></v-text-field></v-col>
													<v-col cols="2" class="text-center">
														<v-btn fab x-small color="error" :disabled="varient.items.length == 1"
															@click="removeItem(i)"><v-icon>mdi-minus</v-icon></v-btn>
													</v-col>
												</v-row>
			
											</div>
										</div>
									</v-form>
									<div class="text-center pt-4">
										<v-btn color="primary" block large rounded @click="handleSubmit">
											Submit
										</v-btn>
									</div>
								</div>
							</v-col>
						</v-row>
					</v-container>
						
					</div>
				</v-card>
            </v-dialog>
        </v-row>
    </div>
</template>
<script>
import { ApiService } from '@/core/services/api.service'
export default {
	props: {
		menuName: {},
		menuId: {},
		dialogVarientAdd: {},
		message: {}
	},
	data() {
		return {
			select_single: 0,
			name: '',
			rulesRequired: [
				v => !!v || 'Required',
			],
			varient: {
				name: '',
				items: [
					{ name: '', value: '' },
				],
			},
		}
	},
	watch: {
		dialogVarientAdd(){
			this.name = "";
			this.varient = {
				name: '',
				items: [
					{ name: '', value: '' },
				],
			};
		},
		dialogConfirm: function () {
			this.loading = false;
		},
	},
	methods: {
		handleClose() {
			this.$emit('close');
		},
		addItem() {
			this.varient.items.unshift({ name: '', value: '' });
		},
		removeItem(i) {
			if (this.varient.items.length == 1) return;
			this.varient.items.splice(i, 1);
		},
		async handleSubmit() {
			let validate = this.$refs.formVarient.validate();
			if (!validate) return;
			this.loaderShow();
			let data = new FormData();
			data.append("name", this.varient.name);
			data.append("menu_id", this.menuId);
			data.append("select_single", this.select_single == true ? 1 : 0);

			let count = 0;
			this.varient.items.forEach((item, i) => {
				if (item.name) {
					data.append(`item[${i}][name]`, item.name);
					if (!item.value) {
						data.append(`item[${i}][value]`, 0);
					}
					data.append(`item[${i}][value]`, item.value);
					count++;
				}
			});
			if (!count) {
				this.messageError('Add at least one item');
				this.loaderHide();
				return;
			}
			await ApiService.post('/varient/group/add', data)
				.then((resp) => {
					this.loaderHide();
					this.messageSuccess(resp.message);
					this.$emit('reloadNow');
					this.handleClose();
				})
				.catch((error) => {
					this.loaderHide();
					console.log(error);
				})
		}
	}
}
</script>