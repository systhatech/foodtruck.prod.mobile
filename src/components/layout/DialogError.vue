<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialogError"
      persistent
      max-width="290"
    >
      <v-card>
        <!-- <v-card-title>Confirm</v-card-title> -->
        <v-card-text class="text-center error--text">
            <h4 style="padding-top:40px;">{{ message ? message : defaultMessage}}</h4>
        </v-card-text>
        <v-card-actions class="w-100 pb-5">
            <div class="w-100 text-center">
                <v-btn
                  color="error"
                  block 
                  rounded
                  large
                  @click="handleClose">Close</v-btn>
            </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
  export default {
    props:{
        dialogError:{},
        message:{}
    },
    data () {
      return {
          loading:false,
          type:'deliver',
          defaultMessage:'Error!'
      }
    },
    watch:{
        dialogConfirm: function(){
            this.loading = false;
        },
    },
    methods: {
        handleClose(){
            this.$emit('close');
        },
        handleConfirm(){
            this.$emit('handleConfirm');
        }
    }
  }
</script>