<template>
    <v-autocomplete
        v-model="selected"
        chips
        :label="label"
        :items="items"
        item-text="value"
        item-value="value"
        hide-selected
        clearable
        @change="handleSelected"
        >    
        <template v-slot:selection="data">
            <span class="text-capitalize">{{ data.item.value }}</span>
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
            selected: [2],
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
                this.$emit('selected',{ 'selected_data' : this.selected, 'model' :this.model ? this.model :''});
            }
        }
    }
}
</script>