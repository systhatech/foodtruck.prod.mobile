<template>
    <!-- <div> -->
        <v-toolbar flat color="primary"  style="position: sticky;top: 0;z-index: 1;">
            <!-- <v-toolbar-title>test</v-toolbar-title> -->
             <img :src="logo" width="120"/>
        </v-toolbar>
    <!-- </div> -->
</template>
<script>
import logo from './logo.png'
export default {
    props: {
        color:{},
    },
    data() {
        return {
            logo,
        }
    }
}
</script>
<style lang="scss" scoped>
</style>