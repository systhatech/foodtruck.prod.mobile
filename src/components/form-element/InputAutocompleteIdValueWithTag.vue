<template>
    <v-autocomplete
        v-model="selected"
        chips
        closable-chips
        color="primary"
        multiple
        :label="label"
        :items="items"
        item-text="value"
        item-value="value"
        @change="handleSelected"
        >    
        <template v-slot:chip="{ props, item }">
        <v-chip
            v-bind="props"
            :prepend-avatar="item.raw.avatar"
            :text="item.raw.name"
        ></v-chip>
        </template>
        <template v-slot:item="data">
            <template>
            <v-list-item-content>
                <v-list-item-title v-html="data.item.value" class="text-capitalize"></v-list-item-title>
            </v-list-item-content>
            </template>
        </template>   
    </v-autocomplete>
</template>
<script>
// import { mdiMapMarker } from "@mdi/js";
export default {
    props:{
        items:{},
        model:{},
        label:{},
        removeSelected:{},
        itemSelected:{},
    },
    data (){
        return {
            selected: [],
        }
    },
    watch:{
        items: function(newValue){
            if(newValue) {
                this.selected = this.itemSelected ? this.itemSelected:'';
            }
        },
        removeSelected: function() {
            this.selected="";
        }
    },
    methods :{
        handleSelected(){
            if(this.selected != undefined) {
                this.emitEvent();
            }
        },
        remove () {
            this.selected = ''
        },
        emitEvent(){
            if(this.selected != undefined ){
                this.$emit('selected',{ 'selected_data' : this.selected});
            }
        }
    }
}
</script>