<template>
    <div>
        <v-sheet
            class="mx-auto">
            <v-slide-group
            v-model="model"
            class="pr-1"
            center-active
            >
            <v-slide-item
                v-for="(item,n) in items"
                :key="n">
                <v-btn
                    outlined
                    rounded
                    :color="activeIndex==n ? 'primary' : 'lighten-1'"
                    class="ma-1"
                    @click="selectStatus(item,n)">
                     {{ item.name }}
                </v-btn>
            </v-slide-item>
            </v-slide-group>
        </v-sheet> 
    </div>

</template>
<script>
export default {
    props:{
        items:{}
    },
    data() {
        return {
            model:null,
            activeIndex:0,
        }
    },
    methods:{
        selectStatus(status,index){
            this.activeIndex = index;
            this.$emit('selectedStatus',{status,index})
        }
    }
}
</script>