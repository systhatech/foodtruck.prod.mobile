<template>
    <div>
        <div class="custom-bs pa-4 mt-2 mb-2 d-flex align-center justify-space-between" v-if="show_current_location">
            <div>
                <div class="d-flex align-center pb-1">
                    <v-icon color="error">{{iconMap}}</v-icon>
                    <h5 class="mb-0 pl-1">CURRENT LOCATION</h5>
                </div>
                <div class="d-flex align-center">
                    <div class="w-18"></div>
                    <p class="mb-0 primary--text">{{ current_location.add1 }}  {{ current_location.zip_code }}</p>
                </div>
            </div>
            <div>
                <v-btn :disabled="loading" fab color="warning" text @click="updateLatLng()"><v-icon large>mdi-reload</v-icon></v-btn>
            </div>
        </div>
    </div>
</template>
<script>
import { mdiMapMarkerRadius } from '@mdi/js';
import { ApiService } from '@/core/services/api.service'

export default {
    data() {
        return {
            loading:false,
            iconMap: mdiMapMarkerRadius,
            current_location:{
                add1:'',
                city:'',
                state:'',
                zip_code:'',
                lat:'',
                lng:'',
            },
            show_current_location:false,
        }
    },
    mounted(){
        this.updateLatLng();
    },
    methods: {
        updateLatLng(){
            this.loaderShow();
            window.updateLatLng();
            setTimeout(() => {
                this.loading = true;
                this.locateGeoLocation();
            }, 500);
        },
        async locateGeoLocation() {
            this.current_location.lat = window.localStorage.geo_latitude?window.localStorage.geo_latitude:0;
            this.current_location.lng = window.localStorage.geo_longitude?window.localStorage.geo_longitude:0;
            await this.fetchAddress();
        },
        async fetchAddress() {
            ApiService.get('/getapikeys')
                .then(async (apiKeys) => {
                    let googleApiKey = apiKeys.google;
                    await ApiService.post(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.current_location.lat},${this.current_location.lng}&key=${googleApiKey}`)
                    .then((resp) => {
                        this.loaderHide();
                        this.loading = false;
                        for (let addr of resp.results) {
                            let address = this.parseGoogleResponse(addr.address_components);
                            this.current_location.add1 = address.street_number + " " + address.route;
                            this.current_location.city = address.locality;
                            this.current_location.state = address.administrative_area_level_1;
                            this.current_location.zip_code = address.postal_code;
                            this.current_location.country = address.country;
                            break;
                        }
                        this.show_current_location = true;
                        this.updateLocation();
                    })
                    .catch(() => {
                        this.loading = false;
                        this.loaderHide();
                    })
                })
        },
        async updateLocation() {
            await ApiService.post('/location/save-current', this.current_location)
            .then(() => {
                this.loaderHide();
                this.$emit('onUpdate');
            })
            .catch((error) => {
                console.log(error);
                this.loaderHide();
            })
        },
    }
}
</script>
<style>

</style>