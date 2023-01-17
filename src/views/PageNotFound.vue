<template>
  <div>
      <Topnavbar :title="title"/>
      <v-container class="page-not-found">
        <h3>Page Not Found</h3>
      </v-container>
  </div>
</template>

<script>
import Topnavbar from '@/components/layout/TopnavbarBack'
export default {
  name: 'PageNotFound',
  components: {
    Topnavbar
  },
  data() {
    return {
      title:'',
    }
  }
}
</script>
<style lang="scss" scoped>
    .page-not-found {
        height: calc(100vh - 100px);
        display: flex;
        align-items: center;
        justify-content: space-around;
        h3{
          color:#dadada;
          text-align: center;
        }
    }
</style>
