<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialogDelete"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title></v-card-title>
        <v-card-text class="text-center"> <h3 class="text-secondary">Do you want to delete ?</h3> </v-card-text>
        <v-card-actions>
          <v-btn
            color="green darken-1"
            text
            @click="handleClose"
          >
            No
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
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
        loadingDelete:{},
        dialogDelete:{},
    },
    data () {
      return {
          loading:false,
      }
    },
    watch:{
        dialogDelete: function(val){
            if(!val){
                this.loading = false;
            }
        },
        loadingDelete: function(newVal){
          if(!newVal){
            this.loading = false;
          }
        }
    },
    methods: {
        handleClose(){
            this.$emit('close');
        },
        handleConfirm(){
            this.loading = true;
            this.$emit('onConfirm');
        }
    }
  }
</script>