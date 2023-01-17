<template>
    <v-toolbar color="primary" style="position:fixed;width:100%;z-index: 2;">
           <v-btn color="white" class="pl-0" @click="handleBack" tile text>
            <v-icon color="white">mdi-chevron-left</v-icon>Back 
            </v-btn> 
        </v-toolbar>
</template>
<script>
export default {
    props:{
        title:{
            type:String,
            required:true,
        }
    },
    data() {
        return {
            // title:'Dashboard',
        }
    },
    methods: {
        handleBack() {
            this.$router.back();
        }
    }
}
</script>
<style lang="scss" scoped>
.toolbar-title {
    font-size: 1rem;
    margin-left:10px; 
    text-transform: uppercase;
    font-weight: 500;
}
</style>