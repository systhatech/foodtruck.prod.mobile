<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialogConfirm"
      persistent
      max-width="290"
    >
      <v-card>
        <!-- <v-card-title>Confirm</v-card-title> -->
        <v-card-text class="text-center">
            <h3 style="padding-top:40px;">{{ message ? message : defaultMessage}}</h3>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="secondary"
            text
            @click="handleClose"
          >
            No
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            :loading="loading"
            @click="handleConfirm"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
  export default {
    props:{
        dialogConfirm:{},
        message:{}
    },
    data () {
      return {
          loading:false,
          type:'deliver',
          defaultMessage:'Do you want to continue?'
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