<template>
     <v-bottom-navigation :value="value" horizontal fixed>
        <v-btn v-for="(item, index) in items" :key="index" @click="handleRoute(item)">
          <span>{{ item.name }}</span>
          <v-icon class="mg-auto" color="primary">{{ item.icon }}</v-icon>
        </v-btn>
      </v-bottom-navigation>
</template>
<script>
export default {
    props: {
        items:{},
        value:{},
    },
    data() {
        return {
        }
    },
    methods: {
        handleRoute(item) {
            if(item.destination) {
                localStorage.setItem('destination',item.destination);
            }
            this.$router.push('/'+item.route).catch(()=>{});
        }
    }
}
</script>
<style lang="scss" scoped>
.mg-auto{
    margin:0 !important;
    margin: 0 auto;
}
</style>