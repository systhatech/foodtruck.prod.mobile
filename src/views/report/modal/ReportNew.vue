<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialogReportNew"
      persistent
      max-width="600"
    >
      <v-card>
        <v-card-title>Filter</v-card-title>
        <v-card-text class="text-center pb-0">
           <v-form>
               <v-row>
                    <v-col cols="12" md="12" lg="6" xl="6">
                        <v-text-field v-model="info.report_name" label="Report Name"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="12" lg="6" xl="6" class="pt-0">
                        <v-text-field v-model="info.email" label="Email"></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" md="3" lg="3" xl="3" class="pt-0">
                        <DatePicker label="Start Date" 
                            @selectedDate="dateStart"
                            :max-date="info.end_date"/>
                    </v-col>
                    <v-col cols="6" sm="6" md="3" lg="3" xl="3" class="pt-0">
                        <DatePicker label="End Date" 
                            @selectedDate="dateEnd"
                            :min-date="info.start_date"/>
                    </v-col>
               </v-row>
           </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="secondary"
            text
            @click="handleClose"
          >
            Close
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="handleConfirm"
          >
            Generate & send
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import DatePicker from '@/components/form-element/InputDatePicker';
import { ApiService } from '@/core/services/api.service';
import { mapGetters } from 'vuex'
export default {
    props: {
        dialogReportNew:{},
        defaultTitle:{},
        reportType:{
            required:true,
        },
    },
    data () {
        return {
            info: {
                report_name:'Report',
                email:'',
                start_date:new Date().toISOString().substr(0, 10), 
                end_date:new Date().toISOString().substr(0, 10), 
                // type:'report_sales',
            }
        }
    },
    watch:{
        dialogReportNew: function(newVal) {
            if(newVal) {
                this.info.report_name = this.defaultTitle;
            }else{
                this.info.report_name = "Report";
            }
        }
    },
    components: {
        DatePicker
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
        })
    },
    methods: {
        handleClose(){
            this.$emit('close');
        },
        handleConfirm(){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            this.info.vendor_id = this.currentUser.vendor.id;
            this.info.type = this.reportType;
            ApiService.post('/report/create', this.info)
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.handleClose();
                this.messageSuccess(resp.message);
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError("Sorry, Failed to generate/send rpeort");
            });
        },
        dateStart(param) {
            this.info.start_date = this.formatStandardDate(param.date);
        },
        dateEnd(param){
            this.info.end_date = this.formatStandardDate(param.date);
        }
    }
}
</script>