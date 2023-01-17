<template>
    <v-snackbar
    :color="color"
    v-model="snackbar"
    :timeout="timeout"
    tile
    text
    >
      {{ message }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>
<script>
export default {
    data() {
        return{
            snackbar:false,
            color:'primary',
            message:'Default message',
            timeout:3000,
        }
    },
    mounted() {
        this.$bus.$on('SHOW_NOTIFICATION', (payload) => {
            this.message = payload.message;
            if(payload.type == 'success'){
                this.color = 'green';
            }else if(payload.type == 'error'){
                this.color = 'red';
            }
            this.snackbar = true;
        })
    }
}
</script>