<template>
  <v-row justify="center">
    <v-dialog
      v-model="modalPayout"
      persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between">Account Detail <v-icon @click="handleClose">mdi-close</v-icon></v-card-title>
        <v-card-text>
            <div>
                <div class="mb-4 mt-4">
                    <p class="mb-0 f8">Bank Name</p>
                    <h4 class="text-uppercase">{{ bank.bank_name}}</h4>
                </div>
                <div class="mb-4">
                    <p class="mb-0 f8">Account Holder Name</p>
                    <h4 class="text-uppercase">{{ bank.account_holder_name}}</h4>
                </div>
                <div class="mb-4">
                    <p class="mb-0 f8">Account Number</p>
                    <h4>{{ bank.account_number}}</h4>
                </div>
                <div class="mb-4">
                    <p class="mb-0 f8">Routing Number</p>
                    <h4>{{ bank.routing_number }}</h4>
                </div>
                <div>
                    <p class="mb-0 f8">Total Amount</p>
                    <h4 class="color-primary">{{ formatAmount(amount.outstanding)}}</h4>
                </div>
            </div>
        </v-card-text>
        <v-card-actions class="pb-6">
          <v-btn
            color="primary"
            outlined
            block
            rounded
            @click="handleProceed">
            Proceed
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
// import { ApiService } from '@/core/services/api.service'
  export default {
    props:{
        modalPayout:{},
        message:{},
        bank:{},
        amount:{},
    },
    data () {
      return {
          loading:false,
          type:'deliver',
          defaultMessage:'Do you want to continue?'
      }
    },
    watch:{
        modalPayout: function(){
            this.loading = false;
        },
        amount(val) {
          console.log(val);
        }
    },
    methods: {
        handleClose(){
            this.$emit('close');
        },
        async handleProceed(){
            this.$emit('confirm');
            // this.loaderShow();
            // await ApiService.post('/payout/settlement/outstanding')
            // .then((response) => {
            //     this.loaderHide();
            //     console.log(response);
            //     this.handleClose();
            // })
            // .catch((error) => {
            //     console.log(error);
            //     this.loaderHide();
            // })
        }
    }
  }
</script>