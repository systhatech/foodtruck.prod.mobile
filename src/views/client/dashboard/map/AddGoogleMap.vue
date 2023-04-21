<template>
	<v-container class="ma-0 pa-0 map-wrapper">
		<gmap-map :zoom="zoom" :center="center" class="map-height">
			<gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen"
				@closeclick="infoWinOpen = false">
				<div @click="handleTruckProfile(infoContent)">
					<div class="mb-4">
						<div v-if="infoContent.table_name == 'vendors'" >
							<h2 class="primary--text text-capitalize">{{infoContent.locate ? infoContent.locate.name : ''}}</h2>
						</div>
					</div>
					<div class="d-flex w-100">
						<!-- <v-icon color="primary">{{ iconLocation }}</v-icon> -->
						<div class="">
							<p class="mb-0 f8">
								{{ infoContent.add1 ? infoContent.add1 : '' }}
								{{ infoContent.city ? infoContent.city : '' }}
								{{ infoContent.state ? infoContent.state : '' }}
								{{ infoContent.zip_code ? infoContent.zip_code : '' }}
							</p>
							<div class="d-flex pt-4">
								<v-chip small color="primary" class="mr-2 text-capitalize" v-for="(c, index) in infoContent.cuisines" :key="index">{{c.value}}</v-chip>
							</div>
						</div>
					</div>
					
				</div>
				<!-- <div class="pb-2 pt-4" v-if="type == 'clients'">
					<v-btn fab color="primary" v-if="infoContent.table_name == 'vendors'" class="mr-2"
						:to="'/truck-profile/' + infoContent.table_id"><v-icon large>mdi-food</v-icon> </v-btn>
					<v-btn fab color="primary"
						v-if="infoContent.locate && infoContent.locate.contact" class="mr-2"
						:href="`tel:${infoContent.locate.contact.phone_no}`"><v-icon large>mdi-phone</v-icon> </v-btn>
					<v-btn fab color="primary" v-if="infoContent.table_name == 'vendors'"
						:to="'/client/conversation/vendors/' + infoContent.table_id"><v-icon large>mdi-chat</v-icon> </v-btn>
				</div> -->
			</gmap-info-window>
			<div>
				<gmap-marker v-for="(m, index) in locationMarkers" :icon="{
					url: m.locate.profile_pic ? base_url + '/image-show/' + m.locate.profile_pic : base_url + '/icon/truck.png',
					size: { width: 60, height: 90, f: 'px', b: 'px', },
					scaledSize: { width: 45, height: 50, f: 'px', b: 'px', }
				}" 
				:key="index" height="80" width="80"
				:position="m.position" :clickable="true" @click="toggleInfoWindow(m, index)"></gmap-marker>
			</div>
		</gmap-map>
	</v-container>
</template>

<script>
import iconbus from './busicon.png'
import { base_url } from '@/core/services/config'
import { mdiMapMarker } from '@mdi/js'
import { ApiService } from '@/core/services/api.service'
import { mapGetters } from 'vuex'
export default {
	name: "AddGoogleMap",
	props: {
		locationMarkers: {
			type: Array
		},
		zoomLevel: {},
		newCenter: {},
		locations: {},
	},
	watch: {
		locationMarkers(val) {
			this.loaderHide();
			if (val.length > 0) {
				this.center = val[0].position;
			}
		}
	},
	data() {
		return {
			iconbus,
			base_url,
			zoom: 8,
			iconLocation: mdiMapMarker,
			//info wind ow
			infoContent: '',
			infoWindowPos: {
				lat: 0,
				lng: 0
			},
			zoomControl: {

			},
			infoWinOpen: false,
			currentMidx: null,
			//optional: offset infowindow so it visually sits nicely on top of our marker
			infoOptions: {
				pixelOffset: {
					width: 0,
					height: -35
				}
			},


			center: {
				// lat: 39.7837304,
				// lng: -100.4458825
				lat: 0,
				lng: 0,
			},
			location: {
				lat: 0,
				lng: 0,
				city: '',
				state: '',
				zip_code: '',
				add1: '',
				country: '',
				guest: '',
			},
			locPlaces: [],
			shape: {
				coords: [10, 10, 10, 15, 15, 15, 15, 10],
				type: 'url'
			},
			existingPlace: null,
			type: 'clients',
		};
	},


	mounted() {

		this.location.lat = localStorage.getItem('geo_latitude') ? localStorage.getItem('geo_latitude') : 0;
		this.location.lng = localStorage.getItem('geo_longitude') ? localStorage.getItem('geo_longitude') : 0;
		this.location.guest = localStorage.getItem('g_token');
		this.fetchAddress();
		this.type = this.currentUser ? this.currentUser.table : 'clients';
		this.center = this.locationMarkers[0].position;
	},

	methods: {
		handleTruckProfile(truck){
			// console.log(truck);
			this.$router.push("/truck-profile/"+truck.locate.id);
		},
		toggleInfoWindow: function (marker, idx) {
			this.infoWindowPos = marker.position;
			this.infoContent = marker;

			//check if its the same marker that was selected if yes toggle
			if (this.currentMidx == idx) {
				this.infoWinOpen = !this.infoWinOpen;
			}
			//if different marker set infowindow to open and reset current marker index
			else {
				this.infoWinOpen = true;
				this.currentMidx = idx;

			}
		},
		initMarker(loc) {
			this.existingPlace = loc;
		},
		addLocationMarker() {
			if (this.existingPlace) {
				const marker = {
					lat: this.existingPlace.geometry.location.lat(),
					lng: this.existingPlace.geometry.location.lng()
				};
				this.locationMarkers.push({
					position: marker,
					// icon: 'https://maps.google.com/mapfiles/kml/shapes/library_maps.png', 
					icon: iconbus,
				});
				this.locPlaces.push(this.existingPlace);
				this.center = marker;
				this.existingPlace = null;
			}
		},
		locateGeoLocation: function () {
			ApiService.post("/location/current", {
				guest: localStorage.getItem('g_token')
			})
				.then((resp) => {
					this.loaderHide();
					this.center = resp.data;
					this.addLocationMarker();
					this.initMarker();
				})
				.catch((error) => {
					this.loaderHide();
					this.messageError(error.response.data.message);
				})
		},
		async fetchAddress() {
			this.loaderShow();
			ApiService.get('/getapikeys')
				.then(async (apiKeys) => {
					let googleApiKey = apiKeys.google;
					await ApiService.post(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.location.lat},${this.location.lng}&key=${googleApiKey}`)
						.then((resp) => {
							for (let addr of resp.results) {
								let address = this.parseGoogleResponse(addr.address_components);
								this.location.add1 = address.street_number + " " + address.route;
								this.location.city = address.locality;
								this.location.state = address.administrative_area_level_1;
								this.location.zip_code = address.postal_code;
								this.location.country = address.country;
								break;
							}
							this.updateLocation();

						})
						.catch(() => {
							this.updateLocation();

						})
				})
		},
		async updateLocation() {
			this.loaderShow();
			await ApiService.post('/location/save-current', this.location)
				.then(() => {
					this.locateGeoLocation();

				})
				.catch((error) => {
					console.log(error);
					this.locateGeoLocation();

				})
		}
	},
	computed: {
		...mapGetters({
			currentUser: 'auth/user',
		})
	}
};
</script>
<style scoped>
.map-wrapper {
	height: 100%;
}

.map-height {
	height: calc(100vh - 252px);
}
</style>