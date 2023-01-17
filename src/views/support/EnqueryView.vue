<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialogView"
      persistent
      scrollable
    >
      <v-card>
        <v-card-title>Enquery Detail [#{{item.id}}]</v-card-title>
        <v-card-text>
            <p class="f8-bold mt-4">{{item.reason}}</p>
            <p>{{item.desc}}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="error"
            text
            @click="handleArchive"
          >
            archive
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="handleClose"
          >
            close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <DialogConfirm 
        :dialogConfirm="dialogConfirm"
        @close="closeConfirm"
        @handleConfirm="confirmArchive"/>
  </v-row>
</template>
<script>
import { ApiService } from '@/core/services/api.service'
import DialogConfirm from '@/components/layout/DialogConfirm'
  export default {
    props:{
        dialogView:{},
        item:{}
    },
    components: {
        DialogConfirm,
    },
    data () {
      return {
          dialogConfirm:false,
      }
    },
    watch:{
        dialogView: function(){
            this.loading = false;
        },
    },
    methods: {
        confirmArchive(){
            this.dialogConfirm = false;
            this.loaderShow();
            ApiService.post('/support/enq/delete',{id: this.item.id})
            .then((resp) => {
                this.loaderHide();
                this.closeConfirm();
                this.handleClose();
                console.log({resp});
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        },
        closeConfirm() {
            this.dialogConfirm = false;
        },
        handleClose(){
            this.$emit('close');
        },
        handleArchive(){
            this.dialogConfirm = true;
            console.log({id: this.item.id});
        },
        aa(){
            console.log("Test");
            ApiService.post('/support/enq/delete',{id: this.item.id})
            .then((resp) => {
                console.log({resp});
            })
            .catch((error) => {
                console.log(error);
            })
            // this.$emit('handleConfirm');
        }
    }
  }
</script>