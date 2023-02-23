<template>
	<v-row justify="center">
		<v-dialog v-model="dialogEditEmail" persistent max-width="350">
			<v-card>
				<v-card-title class="d-flex align-center justify-space-between">
					<span>Edit Email</span>
					<v-btn color="error" text fab small @click="handleClose">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text class="text-center pt-4">
					<v-text-field label="Email" v-model="new_email"></v-text-field>
					<p class="mb-0 error--text">{{ error_message }}</p>
					<v-btn v-if="forget_password" small rounded color="primary" class="mt-4" to="/password-forget" outlined>forget password</v-btn>
				</v-card-text>
				<v-card-actions>
					<!-- <v-btn
            color="secondary"
            text
            @click="handleClose"
          >
            No
          </v-btn>
          <v-spacer></v-spacer> -->
					<div class="w-100 pb-4">
						<v-btn block color="primary" rounded large @click="handleResendEmail()">submit</v-btn>
					</div>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-row>
</template>
<script>
import { ApiService } from '@/core/services/api.service'
export default {
	props: {
		dialogEditEmail: {},
		message: {},
		email: {},
	},
	data() {
		return {
			loading: false,
			type: 'deliver',
			defaultMessage: 'Do you want to continue?',
			new_email: '',
			error_message: '',
			forget_password:false,
		}
	},
	mounted() {
		this.new_email = this.email;
	},
	watch: {
		dialogEditEmail: function () {
			this.new_email = this.email;
		},
	},
	methods: {

		async handleResendEmail() {
			this.loaderShow();
			await ApiService.post('/email-verification', { 'email': this.email, 'new_email': this.new_email })
				.then((resp) => {
					this.loaderHide();
					this.handleClose();
					this.$router.replace({ name: 'VerifyEmailPage', query: { email: this.new_email, type: 'clients' } });
					this.messageSuccess(resp.message);
				})
				.catch((error) => {
					console.log({error});
					this.loaderHide();
					if (error.response.data) {
						// this.messageError(error.response.data.message);
						this.error_message = error.response.data.message;
						this.forget_password = error.response.data.forget_password;
						
					} else {
						// this.messageError(error.response.statusText);
						this.error_message = error.response.statusText;
					}
				})
		},
		handleClose() {
			this.$emit('close');
		},
		handleConfirm() {
			this.$emit('handleConfirm');
		}
	}
}
</script>