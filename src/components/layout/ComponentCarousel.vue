<template>
<div>
    <v-carousel hide-delimiters height="200">
            <v-carousel-item
            v-for="(item,i) in items"
            :key="i"
            :src="item.src"
            max-height="200"
            height="100"
            contain
            ></v-carousel-item>
        </v-carousel>
    </div>
</template>
<script>
export default {
    props:{
        items:{}
    },
    data() {
        return {
           
        }
    },
    methods: {
        handleRoute(item) {
            return this.$router.push('/'+item.route).catch(()=>{});
        }
    }
}
</script>