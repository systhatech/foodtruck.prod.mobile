<template>
    <div>
        <div class="autocomplete-wrapper">
            <GmapAutocomplete class="custom-autocomplete w-100" 
            :value="address.add1"
            @place_changed="setPlace" />
        </div>
    </div>
</template>
<script>
export default {
    props:{
        defaultValue:{}
    },
    watch:{
        defaultValue (val) {
            console.log({val});
            this.address.add1 = val;
        }
    },
    data() {
        return {
            address:{
                add1:''
            },
        }
    },
    methods: {
        setPlace(param){
            let address = this.parseGoogleResponse(param.address_components);
            this.address.add1 = param.name;
            this.address.city = address['administrative_area_level_1'] ? address['administrative_area_level_1'] :'';
            this.address.state = address['administrative_area_level_2'] ? address['administrative_area_level_2'] :'';
            this.address.country = address['country'] ? address['country'] :'';
            this.address.locality = address['locality'] ? address['locality'] :'';
            this.address.zip_code = address['postal_code'] ? address['postal_code'] :'';
            this.address.route = address['route'] ? address['route'] :'';
            this.address.street_number = address['street_number'] ? address['street_number'] :'';
            this.$emit('selectedAddr',{address : this.address});
        },
    }
}
</script>
<style lang="scss" scoped>
.autocomplete-wrapper{
    height: 100%;
    display: flex;
    align-items: center;
    .pac-target-input{
        border-bottom: 1px solid #949494 !important;
        padding-bottom: 5px !important;
        &:focus-visible{
            outline: none !important;
            border-bottom: 2px solid #f56342 !important;
        }
    }
}
#vuetify-google-autocomplete-id {
    border-top-width: 0px !important;
    border-right-width: 0px !important;
    border-bottom-width: 0px !important;
    border-left-width: 0px !important;
}
</style>