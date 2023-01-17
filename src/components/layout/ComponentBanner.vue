<template>
    <div>
          <v-img
          lazy-src="https://picsum.photos/id/11/10/6"
          height="200"
          :src="image"
          ></v-img> 
    </div>
</template>
<script>
export default {
    props:['image']
}
</script>

<style scoped lang="scss">
  .banner {
    background: #dadada;
    border-radius: 10px;
    height: 200px;
    // margin:10px;
    // padding:12px;
    .banner-content {
        height: 100%;
        padding: 18px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        .tagline {
        color: #fff;
        }
    }
}
</style>