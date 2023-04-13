<template>
    <v-row justify="center">
      <v-dialog
        v-model="dialog_verify_phone"
        persistent
        max-width="290"
      >
        <v-card>
          <v-card-title>
            <div class="d-flex align-center justify-space-between w-100">
                <p class="mb-0">Confirm Mobile Number</p>
                <v-btn fab small text color="error" @click="handleClose()"><v-icon>mdi-close</v-icon></v-btn>
            </div>
          </v-card-title>
          <v-card-text class="">
              <div>
                    <v-form ref="formVerification">
                        <div class="pt-4 text-center">
                            <p>Verification code has been sent to your phone</p>
                            <v-text-field id="input_code" v-model="code" class="text-center" v-mask="'########'" :rules="rulesRequired"></v-text-field>
                        </div>
                    </v-form>
              </div>
          </v-card-text>
          <!-- <v-divider></v-divider> -->
          <v-card-actions class="pa-4 pt-0 mt-0">
            <v-btn
              color="primary"
              large 
              rounded
              block
              @click="handleConfirm"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </template>
  <script>
    export default {
      props:{
          dialog_verify_phone:{},
          message:{},
          resp:{},
      },
      data () {
        return {
           code:'',
           rulesRequired: [(v) => !!v || "Required"],
        }
      },
      methods: {
          handleClose(){
              this.$emit('close');
          },
          handleConfirm(){
            if(!this.$refs.formVerification.validate()) return;

            this.$emit('handleConfirm',{code: this.code});
          }
      }
    }
  </script>
<style lang="scss" scoped>

</style>