<template>
  <v-row justify="center">
    <v-dialog v-model="dialogReportResend" persistent max-width="600">
      <v-card>
        <v-card-title>Resend Report</v-card-title>
        <v-card-text class="text-center pb-0">
          <v-form>
            <v-row>
              <v-col cols="12" md="12" lg="6" xl="6">
                <v-text-field
                  v-model="report.report_name"
                  label="Report Name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12" lg="6" xl="6" class="pt-0">
                <v-text-field
                  v-model="report.target_email"
                  label="Email"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" text @click="handleClose"> Close </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="handleConfirm"> Send </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { ApiService } from "@/core/services/api.service";
import { mapGetters } from "vuex";
export default {
  props: {
    dialogReportResend: {},
    report: {},
  },
  data() {
    return {
      info: {
        report_name: "",
        id: "",
        target_email: "",
      },
    };
  },
  watch: {
    dialogReportResend(newVal) {
      if (newVal) {
        this.info = this.report;
      }
    },
  },
  computed: {
	...mapGetters({
		currentUser:'auth/user',
	})
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    handleConfirm() {
      this.$bus.$emit("SHOW_PAGE_LOADER");
      this.info.vendor_id = this.currentUser.client_id;
      ApiService.post("/report/resend", this.info)
        .then((resp) => {
          this.$bus.$emit("HIDE_PAGE_LOADER");
          this.handleClose();
          this.messageSuccess(resp.message);
        })
        .catch(() => {
          this.$bus.$emit("HIDE_PAGE_LOADER");
          this.messageError("Sorry, Failed to resend report");
        });
      // this.$emit('handleOk',this.info);
    },
  },
};
</script>