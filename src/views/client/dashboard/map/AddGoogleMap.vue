<template>
	<v-container class="ma-0 pa-0 map-wrapper">
		<gmap-map :zoom="zoom" :center="center" class="map-height">
			<gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen"
				@closeclick="infoWinOpen = false">
				<div class="pa-2">
					<div class="text-center">
						<v-avatar size="50">
							<v-img
								lazy-src="https://picsum.photos/id/11/10/6"
								contain
								:src="base_url+'/image-show/'+(infoContent && infoContent.locate && infoContent.locate.profile_pic?infoContent.locate.profile_pic:'default.jpg')"
								></v-img>
						</v-avatar>
						<h3 class="primary--text mt-1 text-capitalize mb-2">{{infoContent && infoContent.locate ? infoContent.locate.name : ''}}</h3>
					</div>
					<div class="text-center">
						<div class="d-flex w-100">
							<div class="">
								<h3 class="mb-0" style="font-weight:400" v-if="infoContent">
									{{ infoContent.add1 ? infoContent.add1 : '' }}
									{{ infoContent.city ? infoContent.city : '' }}<br>
									{{ infoContent.state ? infoContent.state : '' }}
									{{ infoContent.zip_code ? infoContent.zip_code : '' }}<br>
									{{ infoContent.country_code ? infoContent.country_code : '' }}
								</h3>
								<h3 v-else>n/a</h3>
							</div>
						</div>
						<div class="mt-3 pb-2">
							<v-btn outlined block color="primary" rounded @click="handleTruckProfile(infoContent)">view</v-btn>
						</div>
					</div>
				</div>
			</gmap-info-window>
			<div>
				<gmap-marker v-for="(m, index) in locationMarkers" :icon="{
					url: m.locate.profile_pic ? base_url + '/image-show/' + m.locate.profile_pic : base_url + '/icon/truck.png',
					size: { height: 90, f: 'px', b: 'px', },
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

		this.type = this.currentUser ? this.currentUser.table : 'clients';
		if(this.locationMarkers.length){
			this.center = this.locationMarkers[0].position;
		}else{
			this.center.lat = parseFloat(this.location.lat);
			this.center.lng = parseFloat(this.location.lng);
		}
	},

	methods: {
		handleTruckProfile(truck){
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
	height: calc(100vh - 280px);
}
</style>