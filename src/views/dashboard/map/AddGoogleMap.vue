<template>
  <v-container class="ma-0 pa-0 map-wrapper">
    <gmap-map
        :zoom="zoom"    
        :center="center"
        class="map-height"        
      >
      <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">
        <div>
          <div class="mb-4">
            <div v-if="infoContent.table_name=='vendors'">
              <h3 class="color-secondary text-capitalize">{{ infoContent.locate?infoContent.locate.name:'' }}</h3>
              <!-- {{infoContent.table_id == currentUser.table_id ?'My Truck' :''}} -->
            </div>
            <div v-if="infoContent.table_name=='clients'">
                <h3 class="color-secondary text-capitalize" >{{ infoContent.locate?infoContent.locate.fullName:'' }}</h3>
            </div>
          </div>
          <div class="d-flex">
            <v-icon color="primary">{{iconLocation}}</v-icon>
            <div class="f8-bold">  
              {{infoContent.add1 ? infoContent.add1:''}}
              {{infoContent.city ? infoContent.city :''}}
              {{infoContent.state ? infoContent.state:''}}
              {{infoContent.zip_code ? infoContent.zip_code:''}}
            </div>
          </div>
        </div>
        <div class="pb-2 pt-4" v-if="type=='clients'">
          <v-btn v-if="infoContent.table_name=='vendors'" :ripple="false" class="mr-2" fab outlined color="primarylight" link :to="'/truck-profile/'+infoContent.table_id" small><v-icon>mdi-food</v-icon> </v-btn>
          <v-btn fab outlined color="primarylight" v-if="infoContent.locate && infoContent.locate.contact" class="mr-2" link :href="`tel:${infoContent.locate.contact.phone_no}`" small><v-icon>mdi-phone</v-icon> </v-btn>
          <v-btn v-if="infoContent.table_name=='vendors'" fab outlined color="primarylight" link :to="'/conversation/vendors/'+infoContent.table_id" small><v-icon>mdi-chat</v-icon> </v-btn>
          <v-btn v-if="infoContent.table_name=='clients'" fab outlined color="primarylight" link :to="'/conversation/clients/'+infoContent.table_id" small><v-icon>mdi-chat</v-icon> </v-btn>
        </div>
      </gmap-info-window>
      <div v-if="type=='vendors'">
        <gmap-marker
          :icon="{url: m.table_name == 'clients'? base_url+'/icon/client-male.png' : ( m.table_id == currentUser.table_id ? base_url+'/icon/truck.png' : base_url+'/icon/truck.png')}"
          :key="index"
          v-for="(m, index) in locationMarkers"
          :position="m.position"
          :clickable="true" @click="toggleInfoWindow(m,index)"
        ></gmap-marker>
        <!-- <gmap-marker
          :icon="{url: m.table_name == 'clients'? base_url+'/icon/client-male.png' : ( m.table_id == currentUser.table_id ? base_url+'/icon/client-male.png' : base_url+'/icon/client-male.png')}"
          :key="index"
          v-for="(m, index) in locationMarkers"
          :position="m.position"
          :clickable="true" @click="toggleInfoWindow(m,index)"
        ></gmap-marker> -->
      </div>
      <div v-else>
        <gmap-marker
          :icon="{url:  m.table_name == 'vendors' && (m.locate.truck_type && (m.locate.truck_type.value == 'Ice Cream'))? base_url+'/icon/truck.png' : base_url+'/icon/truck.png'}"
          :key="index"
          v-for="(m, index) in locationMarkers"
          :position="m.position"
          :clickable="true" @click="toggleInfoWindow(m,index)"
        ></gmap-marker>
      </div>
    </gmap-map>
  </v-container>
</template>
 
<script>
import iconbus from './busicon.png'
import { base_url } from '@/core/services/config'
import { mdiMapMarker } from '@mdi/js'
import { ApiService } from '@/core/services/api.service'
import { mapGetters} from 'vuex'
export default {
  name: "AddGoogleMap",
  props:{
    locationMarkers:{
      type:Array
    },
    zoomLevel:{},
    newCenter:{},
    locations:{},
  },
  watch:{
    locationMarkers(val){
      this.$bus.$emit('HIDE_PAGE_LOADER');
      if(val.length >0){
        this.center = val[0].position;
      }
    }
  },
  data() {
    return {
      iconbus,
      base_url,
      zoom:8,
      iconLocation:mdiMapMarker,
      //info wind ow
      infoContent: '',
      infoWindowPos: {
        lat: 0,
        lng: 0
      },
      zoomControl:{
       
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
      location:{
                lat:0,
                lng:0,
                city:'',
                state:'',
                zip_code:'',
                add1:'',
                country:'',
                guest:'',
            },
      locPlaces: [],
      shape: {
            coords: [10, 10, 10, 15, 15, 15, 15, 10],
            type: 'url'
          },
      existingPlace: null,
      type:'clients',
    };
  },
 
  
  mounted() {

      this.location.lat = localStorage.getItem('geo_latitude')?localStorage.getItem('geo_latitude'):0;
      this.location.lng = localStorage.getItem('geo_longitude')?localStorage.getItem('geo_longitude'):0;
      this.location.guest = localStorage.getItem('g_token');
      this.fetchAddress();
      this.type = localStorage.getItem('utype') ? localStorage.getItem('utype'):'clients';
  },
 
  methods: {
     toggleInfoWindow: function(marker, idx) {
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
    locateGeoLocation: function() {
       ApiService.post("/location/current",{
        guest: localStorage.getItem('g_token')
      })
      .then((resp) => {
        this.$bus.$emit('HIDE_PAGE_LOADER');
          this.center = resp.data;
          this.addLocationMarker();
          this.initMarker();
      })
      .catch((error) => {
        this.$bus.$emit('HIDE_PAGE_LOADER');
        this.messageError(error.response.data.message);
      })
    },
    async fetchAddress() {
            this.$bus.$emit('SHOW_PAGE_LOADER');  
            ApiService.get('/getapikeys')
            .then( async (apiKeys) =>  {
                let googleApiKey = apiKeys.google;
                 await ApiService.post(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.location.lat},${this.location.lng}&key=${googleApiKey}`)
                .then((resp) => {
                    for(let addr of resp.results) {
                        let address = this.parseGoogleResponse(addr.address_components);
                        this.location.add1 = address.street_number+" "+address.route;
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
             this.$bus.$emit('SHOW_PAGE_LOADER');
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
          currentUser:'auth/user',
      })
  }
};
</script>
<style scoped>
.map-wrapper {
  height:100%;
}
.map-height{
  height:calc(100vh - 216px);
}
</style>