<template>
    <vuetify-google-autocomplete
        :id="id"
        :placeholder="placeholder"
        v-model="address.add1"
        @blur="handleBlur"
        label="Street"
        autofocus
        v-on:placechanged="getAddressData"
    >
    </vuetify-google-autocomplete>
</template>
<script>
// import { mdiMapMarker } from "@mdi/js";
export default {
    props:{
        id:{

        },
        defaultValue:{}
    },
    watch: {
        defaultValue(newval) {
            this.address.add1 = newval;
        }
    },
    data (){
        return {
            placeholder:'',
            address: {
                add1:'',
                city : '',
                state : '',
                country : '',
                locality :'',
                zip_code : '',
                route :  '',
                street_number : '',
            },
        }
    },
    methods :{
        handleBlur(){
           this.$emit('selectAddr',this.address);
        },
        getAddressData: function(addressData, placeResultData) {
            let address = this.parseGoogleResponse(placeResultData.address_components);
            this.address.add1 = (address['route'] ? address['route'] :'') + " " + (address['street_number'] ? address['street_number'] :'');
            this.address.city = address['locality'] ? address['locality'] :'';
            this.address.state = address['administrative_area_level_1'] ? address['administrative_area_level_1'] :'';
            this.address.country = address['country'] ? address['country'] :'';
            this.address.zip_code = address['postal_code'] ? address['postal_code'] :'';
            this.address.locality = (address['route'] ? address['route'] :'') + " " + (address['street_number'] ? address['street_number'] :'');
            this.$emit('selectAddr',this.address);
            // add1 / street : route, + street_number
            // city: locality,
            // state :adm_level_1:

            // house number/ apartment : house number appart
        },
    }
}
</script>