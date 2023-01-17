<template>
    <v-toolbar color="primary" style="position: sticky;top: 0;z-index: 1;">
        <v-btn class="pl-0" @click="handleBack" tile text color="white">
            <v-icon>mdi-chevron-left</v-icon>Back 
        </v-btn> 
        <v-toolbar-title class="toolbar-title" style="font-size: 0.9rem;font-weight: 500; margin-left:10px; color:#fff;">{{ action.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn v-if="action.hasAction" tile color="grey lighten-5 pr-2" text @click="handleAction"><v-icon>{{ action.icon }}</v-icon>{{ action.title_action }}</v-btn>
    </v-toolbar>
</template>
<script>
export default {
    props:{
        action:{
            type:Object,
        }
    },
    methods: {
        handleBack() {
            this.$emit('actionBack');
        },
        handleAction(){
            this.$emit('handleAction');
        }
    }
}
</script>
<style lang="scss" scoped>
.v-icon--link {
    color: #fff !important;
}
.section-top-navbar{
    background: #01a6bc !important;
    padding: 6px;
    height: 60px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 2;
    .page-title{
        margin: 0;
        font-weight: 500;
        // padding: 0 20px;
    }
    i{
        color:#fff !important;
    }
}
</style>