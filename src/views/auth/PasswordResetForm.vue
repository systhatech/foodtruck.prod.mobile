<template>
    <v-container>
        <v-row>
            <v-col
                cols="12"
                sm="12"
                md="6"
                offset-md="3"
                lg="4"
                offset-lg="4"
                xl="4"
                offset-xl="4">
                <div class="mt-10">
                    <div>
                        <h4 class="create-account__title">New Password</h4>
                    </div>
                    <v-form
                    ref="formNewPassword"
                    v-model="valid"
                    :lazy-validation="lazy">
                    <v-text-field
                        @keyup="encryptPassword"
                        :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="rulesPassword"
                        :type="show_password ? 'text' : 'password'"
                        name="password"
                        label="Password"
                        autocomplete="off"
                        hint="Min 8 Character"
                        counter
                        required
                        @click:append="show_password = !show_password"
                    ></v-text-field>
                    <v-text-field
                        @keyup="encryptCPassword"
                        :append-icon="show_password_confirm ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="rulesPassword"
                        :type="show_password_confirm ? 'text' : 'password'"
                        name="password_confirm"
                        label="Password"
                        autocomplete="off"
                        hint="Min 8 Character"
                        counter
                        required
                        @click:append="show_password_confirm = !show_password_confirm"
                    ></v-text-field>
                    <div class="systha-mt__8">
                        <v-btn
                            tile
                            :disabled="!valid"
                            :loading="loading"
                            color="success"
                            class="mr-4"
                            @click="submit"
                        >
                            Submit
                        </v-btn>

                        <v-btn
                        tile
                            class="mr-4"
                            @click="reset"
                        >
                            Reset
                        </v-btn>
                    </div>
                </v-form>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
// import { axiosWeb } from "../../utils/axios-web";
import { ApiService } from '@/core/services/api.service'
export default {
    data: () => ({
        loading:false,
        password_new: {
            password:'',
            password_confirm:'',
        },
        show_password:false,
        show_password_confirm:false,
        rulesPassword: [
            v => !! v || 'Password is required.',
            v => /^(?=.*\d).{8,}$/.test(v) || 'Min 8 character at least 1 digit'
        ],
        valid: true,
        lazy:false
        }),
      

    methods: {
      submit () {
        let valid = this.$refs.formNewPassword.validate();
        if(!valid) return;
        else{
            this.valid = false;
            this.loading = true;
            let info = {
                    expires : this.$route.query.user?this.$route.query.expires:'',
                    user : this.$route.query.user?this.$route.query.user:'',
                    signature : this.$route.query.signature?this.$route.query.signature:'',
                    password: this.password_new.password,
                    password_confirm: this.password_new.password_confirm
                }
                // console.log(info);
                ApiService.post(`/admin/contact/resetPassword?expires=${info.expires}&user=${info.user}&signature=${info.signature}`,info)
                .then((resp) => {
                    this.loading =false;
                    this.messageSuccess(resp.message);
                    this.$router.push('/login');
                })
                .catch(() => {
                    this.loading =false;
                    this.messageError('Failed to update password');
                });
        }
      },
      reset () {
        this.$refs.formNewPassword.reset()
      },
        encryptPassword(event){
            this.password_new.password= window.btoa(event.target.value);
        },
        encryptCPassword(event){
            this.password_new.password_confirm= window.btoa(event.target.value);
        },

    },
};
</script>
<style lang="scss" scoped></style>
