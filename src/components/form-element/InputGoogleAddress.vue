<template>
    <div>
        <div class="autocomplete-wrapper">
            <GmapAutocomplete class="custom-autocomplete w-100" 
            :value="address.add1"
            @blur="handleBlur"
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
        defaultValue(newval) {
            if(newval){
                this.address.add1 = newval;
            }
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
        handleBlur(){
           this.$emit('selectAddr',this.address);
        },
        setPlace(param){
            let address = this.parseGoogleResponse(param.address_components);
            this.address.add1 = param.name;
            this.address.city = param.vicinity;
            this.address.state = address['administrative_area_level_1'] ? address['administrative_area_level_1'] :'';
            this.address.zip_code = address['postal_code'] ? address['postal_code'] :'';
            this.address.country = address['country'] ? address['country'] :'';
            this.address.country_code = address['country_code'] ? address['country_code'] :'';
            this.address.lat = param.geometry.location.lat();
            this.address.lng = param.geometry.location.lng();
            this.$emit('selectedAddr',this.address);
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
        border-bottom: 1px solid #000 !important;
        padding-bottom: 5px !important;
        &:focus-visible{
            outline: none !important;
            border-bottom: 2px solid #000 !important;
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