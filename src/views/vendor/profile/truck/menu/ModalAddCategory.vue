<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog_new_category"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title></v-card-title>
        <v-card-text class="pb-0"> 
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation
            >
                <v-text-field
                v-model="category"
                :rules="requiredRules"
                label="Category Name"
                required
                ></v-text-field>

                 <!-- <v-btn
                color="secondary"
                @click="handleClose"
                >
                Close
                </v-btn>
                <v-btn
                :disabled="!valid"
                color="primary"
                @click="handleSubmit"
                >
                Submit
                </v-btn> -->

            </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="secondary"
            text
            @click="handleClose"
          >
            close
          </v-btn>
          <v-btn
            color="primary"
            text
            :loading="submitLoader"
            @click="handleSubmit"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { ApiService } from '@/core/services/api.service';
  export default {
      props:{
          dialog_new_category:{},
      },
    data () {
      return {
          category:'',
          submitLoader:false,
          valid:true,
          requiredRules: [
                v => !!v || 'Field is required',
            ],
      }
    },
    created(){
      
    },
    watch: {
        dialog_new_category: function(newVal) {
          console.log(newVal);
            this.category = "";
        }
    },
    methods: {
        handleClose(){
            this.$emit('handleCloseCategory');
        },
        handleSubmit(){

            if(!this.$refs.form.validate()) return;

            this.submitLoader = true;
            ApiService.post('/lookup/food-category',{category: this.category})
            .then(() => {
                this.$emit('categoryCreated');
                this.submitLoader = false;
            })
            .catch(() => {
                this.submitLoader = false;
            })
        }
    }
  }
</script>