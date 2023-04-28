<template>
    <v-row justify="center">
        <v-dialog v-model="dialogReportNew" persistent fullscreen>
            <v-card class="background-image" style="padding-top: 56px !important;">
                <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                    <v-toolbar-title class="">Generate and send report</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn text @click="handleClose">
                            Close
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-container>
                    <div class="custom-bs pa-4">
                        <v-form ref="formReport">
                            <v-row>
                                <v-col cols="12" md="12" lg="6" xl="6">
                                    <v-text-field v-model="info.report_name" :rules="rulesRequired" label="Report Name"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12" lg="6" xl="6" class="pt-0">
                                    <v-text-field v-model="info.email" :rules="emailRules" label="Email"></v-text-field>
                                </v-col>
                                <v-col cols="6" sm="6" md="3" lg="3" xl="3" class="pt-0">
                                    <DatePicker label="Start Date" @selectedDate="dateStart" :max-date="info.end_date" />
                                </v-col>
                                <v-col cols="6" sm="6" md="3" lg="3" xl="3" class="pt-0">
                                    <DatePicker label="End Date" @selectedDate="dateEnd" :min-date="info.start_date" />
                                </v-col>
                            </v-row>
                        </v-form>
                        <div class="text-center pa-4"> 
                            <v-btn
                                color="primary"
                                rounded large
                                @click="handleConfirm"
                            >
                                Generate & send
                            </v-btn>
                        </div>
                    </div>
                </v-container>
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
        dialogReportNew: {},
        defaultTitle: {},
        reportType: {
            required: true,
        },
    },
    data() {
        return {
            info: {
                report_name: 'Report',
                email: '',
                start_date: new Date().toISOString().substr(0, 10),
                end_date: new Date().toISOString().substr(0, 10),
                // type:'report_sales',
            },
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            rulesRequired: [
                v => !!v || 'Required',
            ],
            
        }
    },
    watch: {
        dialogReportNew: function (newVal) {
            if (newVal) {
                this.info.report_name = this.defaultTitle;
            } else {
                this.info.report_name = "Report";
            }
        }
    },
    components: {
        DatePicker
    },
    computed: {
        ...mapGetters({
            currentUser: 'auth/user',
        })
    },
    methods: {
        handleClose() {
            this.$emit('close');
        },
        handleConfirm() {

            console.log(this.$refs.formReport.validate());
       
            if(!this.$refs.formReport.validate()) return;

            this.loaderShow();
            this.info.vendor_id = this.currentUser.table_id;
            this.info.type = this.reportType;
            ApiService.post('/report/create', this.info)
                .then((resp) => {
                    this.loaderHide();
                    this.handleClose();
                    this.messageSuccess(resp.message);
                })
                .catch(() => {
                    this.loaderHide();
                    this.messageError("Sorry, Failed to generate/send rpeort");
                });
        },
        dateStart(param) {
            this.info.start_date = this.formatStandardDate(param.date);
        },
        dateEnd(param) {
            this.info.end_date = this.formatStandardDate(param.date);
        }
    }
}
</script>