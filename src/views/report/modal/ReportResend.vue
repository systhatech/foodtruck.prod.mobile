<template>
	<v-row justify="center">
		<v-dialog v-model="dialogReportResend" persistent fullscreen>
			<v-card class="background-image" style="padding-top: 56px !important;">
				<v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
					<v-toolbar-title class="">Resend Report</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-toolbar-items>
						<v-btn text @click="handleClose">
							Close
						</v-btn>
					</v-toolbar-items>
				</v-toolbar>
				<v-container>
					<div class="custom-bs mt-14 pa-4">
						<v-form>
							<v-row>
								<v-col cols="12" md="12" lg="6" xl="6">
									<v-text-field v-model="report.report_name" label="Report Name"></v-text-field>
								</v-col>
								<v-col cols="12" md="12" lg="6" xl="6" class="pt-0">
									<v-text-field v-model="report.target_email" label="Email"></v-text-field>
								</v-col>
							</v-row>
							<div>
								<v-btn color="primary" block large rounded @click="handleConfirm"> Send email </v-btn>
							</div>
						</v-form>
					</div>
				</v-container>
				<!-- <v-card-actions>
			<v-btn color="secondary" text @click="handleClose"> Close </v-btn>
			<v-spacer></v-spacer>
			<v-btn color="primary" text @click="handleConfirm"> Send </v-btn>
			</v-card-actions> -->
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
			currentUser: 'auth/user',
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