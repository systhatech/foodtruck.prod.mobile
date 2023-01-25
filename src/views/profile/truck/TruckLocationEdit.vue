<template>
	<v-container class="ma-0 pa-0 background-image h-100">
		<Topnavbar :title="title" @back="handleBack" />
		<v-container class="mg56">
			<div class="custom-bs pa-4 mb-16">
				<v-form v-model="valid" ref="formLocation" class="pt-4">
					<v-row>
						<v-col cols="12" class="pb-0 pt-0" md="12">
							<InputAddress id="pickup-address" :default-value="defaultValue"
								@selectAddr="addressSelected" />
						</v-col>
						<v-col cols="12">
							<v-text-field v-model="address.city" :rules="requiredRules" label="City"
								required></v-text-field>
						</v-col>

						<v-col cols="6" class="pb-0 pt-0">
							<v-text-field v-model="address.state" :rules="requiredRules" label="State"
								required></v-text-field>
						</v-col>

						<v-col cols="6" sm="6" class="pb-0 pt-0">
							<v-text-field v-model="address.zip" v-mask="'#########'" label="ZIP"
								required></v-text-field>
						</v-col>
						<v-col cols="6" sm="6" class="pb-0 pt-0">
							<v-text-field v-model="address.country" label="Country" :rules="requiredRules"
								required></v-text-field>
						</v-col>
						<v-col cols="6" sm="6" class="pb-0 pt-0">
							<v-text-field v-model="address.country_code" label="Country Code"></v-text-field>
						</v-col>
						<v-col cols="12" sm="12">
							<div>
								<p class="ma-0 cl">Date</p>
								<DatePicker v-model="address.start_date" mode="date">
									<template v-slot="{ inputValue, inputEvents }">
										<input class="custom-input" :value="inputValue" v-on="inputEvents" />
									</template>
								</DatePicker>
							</div>
						</v-col>
						<v-col cols="12" sm="12">
							<div>
								<p class="ma-0 cl">Start Time</p>
								<DatePicker v-model="address.start_time" mode="time">
									<template v-slot="{ inputValue, inputEvents }">
										<input class="custom-input" :value="inputValue" v-on="inputEvents" />
									</template>
								</DatePicker>
							</div>
						</v-col>
						<v-col cols="12" sm="12">
							<div>
								<p class="ma-0 cl">End Time</p>
								<DatePicker v-model="address.end_time" mode="time">
									<template v-slot="{ inputValue, inputEvents }">
										<input class="custom-input" :value="inputValue" v-on="inputEvents" />
									</template>
								</DatePicker>
							</div>
						</v-col>
						<v-col cols="12" class="text-center">
							<div>
								<v-btn color="primary" block class="mb-6" rounded @click="handleUpdate">Update</v-btn>
								<v-btn rounded outlined block color="error" @click="confirmDelete">Delete</v-btn>
							</div>
						</v-col>
					</v-row>
				</v-form>
			</div>
			<DialogConfirm :dialogConfirm="dialogConfirm" @handleConfirm="handleDelete" @close="handleClose" />
		</v-container>
		<Bottomnavbar />
	</v-container>
</template>
<script>
import Topnavbar from "@/components/layout/TopnavbarBackCustom";
import InputAddress from '@/components/form-element/InputGoogleAddress'
import { ApiService } from "@/core/services/api.service";
import Bottomnavbar from "@/components/layout/NavbarBottomFixed";
import DialogConfirm from "@/components/layout/DialogConfirm";
import { base_url } from "@/core/services/config";
import DatePicker from "v-calendar/lib/components/date-picker.umd";
import moment from "moment";

// import InputUpload from '@/components/form-element/InputUpload'
import { mapGetters, mapActions } from "vuex";
export default {
	name: "EditLocation",
	data() {
		return {
			valid: true,
			dialogConfirm: false,
			moment,
			title: "",
			base_url,
			schedules: [],
			requiredRules: [(v) => !!v || "Required"],
			defaultValue: "",
			address: {
				name: "",
				add1: "",
				city: "",
				state: "",
				zip: "",
				country:'',
				country_code:'',
				lat:'',
				lng:'',
				start_date: new Date(),
				start_time: new Date(),
				end_time: new Date(),
				vendor_id: "",
			},
			selectedData: "",
			locationId: "",
		};
	},
	mounted() {
		this.fetchLocation();
	},
	methods: {
		...mapActions({
            fetchProfile:'auth/fetchProfile'
        }),
		confirmDelete() {
			this.dialogConfirm = true;
		},
		handleClose() {
			this.dialogConfirm = false;
		},
		async fetchLocation() {
			this.loaderShow();
			this.locationId = this.$router.currentRoute.params.locationId;
			await ApiService.post("/vendor/location/find", {
				locationId: this.locationId,
			})
				.then((resp) => {
					// this.address = resp.data;
					this.address.id = resp.data.id;
					this.address.start_time = moment(
						resp.data.start_time,
						"YYYY-MM-DD HH:mm:ss"
					).toDate();
					this.address.end_time = moment(
						resp.data.end_time,
						"YYYY-MM-DD HH:mm:ss"
					).toDate();
					this.address.start_date = moment(
						resp.data.start_date,
						"YYYY-MM-DD HH:mm:ss"
					).toDate();
					this.address.end_date = moment(
						resp.data.end_date,
						"YYYY-MM-DD HH:mm:ss"
					).toDate();

					this.defaultValue = resp.data.add1;

					this.address.add1 = resp.data.add1;
					this.address.city = resp.data.city;
					this.address.state = resp.data.state;
					this.address.zip = resp.data.zip;
					this.address.country = resp.data.country;
					this.address.country_code = resp.data.country_code;
					this.address.vendor_id = resp.data.vendor_id;

					this.loaderHide();
				})
				.catch(() => {
					this.loaderHide();
					this.messageError("Failed to update address");
				});
		},
		async handleDelete() {
			this.loaderShow();
			this.locationId = this.$router.currentRoute.params.locationId;
			await ApiService.post("/vendor/location-delete", {
				location_id: this.locationId,
			})
			.then((resp) => {
				this.loaderHide();
				this.messageSuccess(resp.message);
				this.fetchProfile();
				this.$router.push("/vendor-profile-schedule");
			})
			.catch(() => {
				this.loaderHide();
				this.messageError("Failed to update address");
			});
		},
		handleBack() {
			this.$router.back();
		},
		addressSelected(addr) {
			this.address.add1 = addr.add1;
            this.address.city = addr.city;
            this.address.state = addr.state;
            this.address.lat = addr.lat;
            this.address.lng = addr.lng;
            this.address.zip = addr.zip_code;
            this.address.country = addr.country;
            this.address.country_code = addr.country_code;
			console.log(this.address);
            setTimeout(() => {
                this.defaultValue = addr.add1;
            },200);
		},
		handleUpdate() {
			let valid = this.$refs.formLocation.validate();
			if (!valid) {
				this.messageError("Flease fillup form fields");
				return;
			}
			let selectedDate = moment(this.address.start_date).format("YYYY-MM-DD"),
				timeStart = moment(this.address.start_time).format("HH:mm:ss"),
				timeEnd = moment(this.address.end_time).format("HH:mm:ss");

			this.address.start_date = moment(this.address.start_date).format(
				"YYYY-MM-DD HH:mm:ss"
			);

			this.address.start_time = selectedDate + " " + timeStart;
			this.address.end_time = selectedDate + " " + timeEnd;
			this.address.vendor_id = this.currentUser.table_id;
			this.loaderShow();
			ApiService.post("vendor/location-create", this.address)
				.then((resp) => {
					this.loaderHide();
					this.messageSuccess(resp.message);
					this.fetchProfile();

				})
				.catch((error) => {
					this.loaderHide();
					console.log(error);
				});
		},
	},
	components: {
		Topnavbar,
		DatePicker,
		Bottomnavbar,
		InputAddress,
		DialogConfirm,
		// InputUpload
	},

	computed: {
		...mapGetters({
			currentUser: "auth/user",
		}),
	},
};
</script>
<style lang="scss" scoped>
.cl {
	color: #828282;
	font-size: 0.9rem;
	padding-bottom: 10px;
}

.custom-input {
	border: 1px solid #dadada;
	padding: 10px 12px;
}

.schedule {
	text-align: center;
	padding: 10px;
	color: #b5b5b5;
	background: #fff;
	height: 180px;
	border-radius: 20px;
	align-items: center;
	justify-content: space-around;
	display: flex;
}

.schedule-wrapper {
	background: #ffffff;
	border-radius: 10px;
	padding: 10px;
	margin-bottom: 70px;
}

.schedulte-item-wrapper {
	padding: 10px;
	// border:1px solid #dadada;
	margin-bottom: 14px;
	border-radius: 10px;
	-webkit-box-shadow: 3px 5px 28px -7px rgba(184, 184, 184, 0.52);
	-moz-box-shadow: 3px 5px 28px -7px rgba(184, 184, 184, 0.52);
	box-shadow: 3px 5px 28px -7px rgba(184, 184, 184, 0.52);
}

.form-container {
	// .login-container{
	// background: #acfa95;
	border-radius: 10px;
	// margin-top: 27px !important;
	padding: 20px;
	// }
}
</style>