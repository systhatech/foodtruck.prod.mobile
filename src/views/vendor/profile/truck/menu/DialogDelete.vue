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
          dialogDelete:{},
          category_id:{},
      },
    data () {
      return {
        dialog: false,
        notifications: false,
        sound: true,
        widgets: false,
      }
    },
    created(){
        console.log(this.category_id);
    },
    methods: {
        handleClose(){
            this.$emit('handleClose');
        },
        handleConfirm(){
            this.$emit('handleConfirm',{category_id : this.category_id});
        }
    }
  }
</script>