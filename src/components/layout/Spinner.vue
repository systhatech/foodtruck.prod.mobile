<template>
    <div class="loader-wrapper" v-if="showPageLoader">
        <div class="loadingio-spinner-dual-ball-w5n8af2q15"><div class="ldio-wk30rg7jnpk">
        <div></div><div></div><div></div>
        </div></div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            showPageLoader:false,
        }
    },
    mounted() {
        this.$bus.$on('SHOW_PAGE_LOADER', () => {
           this.showPageLoader = true;
        })
        this.$bus.$on('HIDE_PAGE_LOADER', () => {
           this.showPageLoader = false;
        })
    }
}
</script>
<style lang="scss" scoped>
.loader-wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    text-align: center;
    position: fixed;
    z-index: 1000;
    background: #1919197d;
    height: 100%;
}
@keyframes ldio-wk30rg7jnpk-o {
    0%    { opacity: 1; transform: translate(0 0) }
   49.99% { opacity: 1; transform: translate(80px,0) }
   50%    { opacity: 0; transform: translate(80px,0) }
  100%    { opacity: 0; transform: translate(0,0) }
}
@keyframes ldio-wk30rg7jnpk {
    0% { transform: translate(0,0) }
   50% { transform: translate(80px,0) }
  100% { transform: translate(0,0) }
}
.ldio-wk30rg7jnpk div {
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    top: 40px;
    left: 0px;
}
.ldio-wk30rg7jnpk div:nth-child(1) {
  background: #e90c59;
  animation: ldio-wk30rg7jnpk 1s linear infinite;
  animation-delay: -0.5s;
}
.ldio-wk30rg7jnpk div:nth-child(2) {
  background: #46dff0;
  animation: ldio-wk30rg7jnpk 1s linear infinite;
  animation-delay: 0s;
}
.ldio-wk30rg7jnpk div:nth-child(3) {
  background: #e90c59;
  animation: ldio-wk30rg7jnpk-o 1s linear infinite;
  animation-delay: -0.5s;
}
.loadingio-spinner-dual-ball-w5n8af2q15 {
    width: 130px;
    height: 130px;
    display: inline-block;
    overflow: hidden;
//   background: #ffffff;
}
.ldio-wk30rg7jnpk {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(1);
  backface-visibility: hidden;
  transform-origin: 0 0; /* see note above */
}
.ldio-wk30rg7jnpk div { box-sizing: content-box; }
/* generated by https://loading.io/ */
</style>