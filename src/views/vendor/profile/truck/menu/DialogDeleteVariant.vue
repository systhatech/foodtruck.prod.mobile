<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialogDeleteVariant"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title></v-card-title>
        <v-card-text class="text-center"> <h3 class="text-secondary">Do you want to delete ?</h3> </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="handleClose"
          >
            No
          </v-btn>
          <v-btn
            color="secondary"
            text
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
          dialogDeleteVariant:{},
          variantItemDelete:{},
      },
    data () {
      return {
    
      }
    },
    created(){
        console.log(this.variantItemDelete);
    },
    methods: {
        handleClose(){
            this.$emit('handleClose');
        },
        handleConfirm(){
            this.$emit('handleConfirmVariant',{variantItemDelete : this.variantItemDelete});
        }
    }
  }
</script>