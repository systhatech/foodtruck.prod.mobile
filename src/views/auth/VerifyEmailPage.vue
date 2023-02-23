<template>
    <v-container class="ma-0 pa-0 h-100 background-image d-flex align-center justify-space-around">
        <v-container style="height:600px">
            <!-- <div class="mt-10">
                <v-btn icon text color="primary" :to="{
                    name: 'loginPage'
                }"><v-icon class="mr-0 pr-0">{{ icon_back }}</v-icon></v-btn>
            </div> -->
            <!-- <div>
                <v-row>
                    <v-col cols="12">
                        <div class="text-center mb-4">
                            <img :src="base_url + '/default-company/logo'" width="90" />
                        </div>
                    </v-col>
                </v-row>
            </div> -->
            <div class="pa-6 custom-bs">
                <v-form v-model="valid" ref="resetPassword">
                    <v-row>
                        <v-col cols="12" class="pt-4">
                            <v-form ref="formCode">
                                <label for="">Email verification code has been sent to <span class="primary--text">{{ email }}</span><v-btn color="warning" text small @click="handleEdit()">edit email</v-btn></label>
                                <v-text-field label="Code" :rules="rulesRequired" v-model="code"></v-text-field>
                            </v-form>
                        </v-col>
                        <v-col cols="12">
                            <v-btn rounded large color="primary" block @click="submit">
                                Submit
                            </v-btn>
                            <div class="pt-6">
                                <v-btn text color="primary" block @click="resendCode()"> Resend Code </v-btn>
                            </div>
                         
                        </v-col>
                    </v-row>

                </v-form>
                <DialogEditEmail :dialogEditEmail="modal_edit_email" :email="email" @close="handleClose()"/>
            </div>
            <div class="text-center pa-6 ma-4">
                <!-- <v-btn text large to="/Login" color="primary"><v-icon>{{ iconBack }}</v-icon>Login</v-btn> -->
            </div>

        </v-container>

    </v-container>
</template>
<script>
import { ApiService } from '@/core/services/api.service'
export default {
    data: () => ({
        valid:true,
        email: '',
        code:'',
        emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        rulesRequired: [
            v => !!v || 'Required',
        ],
        modal_edit_email:false,
    }),
    components: {
        // Bottomnavbar,
        DialogEditEmail:()=>import('@/components/layout/DialogEditEmail')
    },
    mounted() {
        this.email = this.$router.currentRoute.query.email;
    },

    methods: {
        handleClose(){
            this.modal_edit_email = false;
            setTimeout(() => {
                this.email = this.$router.currentRoute.query.email;
                console.log(this.email);
            }, 200);
        },
        handleEdit(){
            console.log("edit");
            this.modal_edit_email = true;
        },
        handleServiceProvider() {
            this.showServiceProvider = true;
            this.serviceProvider = true;
        },
        async resendCode(){
            this.loaderShow();
            await ApiService.post('/email-verification', {'email' : this.$router.currentRoute.query.email, 'new_email': this.$router.currentRoute.query.email})
            .then((resp) => {
                this.loaderHide();
                this.handleClose();
                this.messageSuccess(resp.message);
            })
            .catch((error) => {
                this.loaderHide();
                if(error.response.data){
                    this.messageError(error.response.data.message);
                }else{
                    this.messageError(error.response.statusText);
                }
            })
        },
        async submit() {
            if (!this.$refs.formCode.validate()) return;
            // console.log(this.$router.query.email);
            this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.post('/email-verify-now', { email: this.email, code: this.code })
                .then((resp) => {
                    this.$bus.$emit('HIDE_PAGE_LOADER');
                    this.messageSuccess(resp.message);
                    this.$router.push("/login");
                })
                .catch((error) => {
                    this.$bus.$emit('HIDE_PAGE_LOADER');
                    this.messageError(error.response.data.message);
                })
        },
    },
};
</script>
<style lang="scss" scoped>
// .background-image{
//     background-image:
//     linear-gradient(to bottom, #ff716673, #edededb0),
//     url('../../assets/static/bg.png');
//     -webkit-background-size: cover;
//     -moz-background-size: cover;
//     -o-background-size: cover;
//     background-size: cover;
// }
.login-container {
    // background: #acfa95;
    border-radius: 10px;
    margin-top: 27px !important;
}

.follow-us {
    color: #fff;
    font-weight: 300;
    font-size: 0.9rem;

    // text-align: right;
    i {
        -webkit-transform: scaleX(-1);
        transform: scaleX(-1);
        color: #fff;
        margin-right: 4px;
        font-size: 0.8rem;
    }

}

.social-links {

    // text-align:right;
    i {
        color: #fff;

        &:not(:last-child) {
            margin-right: 12px;
        }
    }
}

.abc {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.footer-copyright {
    padding: 40px;
    bottom: 0;

    p {
        text-align: center;
        color: #4caf50;
        margin: 0;
        font-size: 0.9rem;
        bottom: 0;
        padding: 30px;
        font-weight: 500;
    }
}
</style>
