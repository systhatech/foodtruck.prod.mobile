<template>
    <div>
        <v-autocomplete
            v-model="selected"
            :items="items"
            item-text="text"
            item-value="value"
            hide-selected
            class="text-capitalize"
            :label="label"
            clearable
            @change="handleSelected"
            >
            <template v-slot:item="data">
                <template>
                <v-list-item-content>
                    <v-list-item-title class="text-capitalize" v-html="data.item.text"></v-list-item-title>
                </v-list-item-content>
                </template>
            </template>
        </v-autocomplete>
    </div>
</template>
<script>
import { mdiMapMarker } from "@mdi/js";
export default {
    props:{
        items:{},
        model:{},
        label:{},
        defaultValue:{},
        defaultClear:{}
    },
    data (){
        return {
            selected: '',
            iconLocation:mdiMapMarker,
        }
    },
    watch:{
        defaultValue: function(val){
            this.selected = val;
        },
        defaultClear: function(){
            this.selected = '';
        }
    },
    created(){
        this.selected = this.defaultValue;
    },
    methods :{
        handleSelected(){
           this.emitEvent();
        },
        remove (item) {
            const index = this.selected.indexOf(item.id)
            if (index >= 0) this.selected.splice(index, 1)
            this.emitEvent();
        },
        emitEvent(){
            this.$emit('selected',{ 'selected_data' : this.selected, 'model' :this.model});
        }
    }
}
</script>