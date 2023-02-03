<template>
    <v-container class="ma-0 pa-0 h-100">
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container>
             <div class="form-container custom-bs">
                <v-form
                    ref="formNewPassword"
                    v-model="valid"
                    :lazy-validation="lazy">
                    <v-row>
                        <v-col cols="12">
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
                        </v-col>
                        <v-col cols="12">
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
                        </v-col>
                        <v-col cols="12">
                            <div class="systha-mt__8 text-center">
                                <v-btn
                                    rounded
                                    color="primary"
                                    block
                                    @click="submit"
                                >
                                    update
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-form>
            </div>
        </v-container>
    </v-container>
</template>
<script>
import { ApiService } from '@/core/services/api.service'
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import  JwtService from '@/core/services/jwt.service';
export default {
    name:'UpdatePasswordPage',
    data() {
        return {
            title:'',
            indexValue:0,
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
            lazy:false,
            utype:'',
            technicalDashboardItems: [
                {id:2, name:'Dashboard',route:'dashboard',icon:'mdi-view-dashboard'},
                {id:3, name:'Calendar',route:'technical-calendar', icon:'mdi-calendar'},
                {id:4, name:'Profile',route:'profile', icon:'mdi-account'},
            ],
            items: [
                {id:1, name:'',route:'dashboard',icon:'mdi-view-dashboard'},
                {id:2, name:'',route:'inspection',icon:'mdi-clipboard-text-multiple'},
                {id:3, name:'',route:'pest-control', icon:'mdi-spider'},
                {id:4, name:'',route:'profile', icon:'mdi-account'},
            ],
        }
    },
    mounted() {
       this.utype = JwtService.getUtype();
       console.log(this.utype);
    },
    methods: {
        handleBack() {
          this.$router.back();  
        },
        encryptPassword(event){
            this.password_new.password= window.btoa(event.target.value);
        },
        encryptCPassword(event){
            this.password_new.password_confirm= window.btoa(event.target.value);
        },
        submit () {
            let valid = this.$refs.formNewPassword.validate();
            if(!valid) return;
            else{
                this.loaderShow();
                ApiService.post('/update-password',this.password_new)
                .then((resp) => {
                    this.loaderHide();
                    this.messageSuccess(resp.message);
                    // this.$router.push({name:'profilePage'});
                })
                .catch(() => {
                    this.loaderHide();
                })
            }
        },

    },
    components: {
        Topnavbar,
        Bottomnavbar
    }
}
</script>
<style lang="scss" scoped>
.form-container{
    background: #fff;
    padding: 24px;
    // border-radius: 10px;
    // margin-top: 30px;
}
</style>