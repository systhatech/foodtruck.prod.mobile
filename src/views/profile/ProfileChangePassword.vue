<template>
    <v-container class="ma-0 pa-0 background-image h-100">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mg56">
            <div class="form-container custom-bs" > 
                <h4 class="mb-4">Change Password</h4>
                <v-form v-model="valid" ref="formPassword"> 
                    <v-row>
                        <v-col cols="12" class="pt-0 ma-0">
                            <v-text-field :rules="rulesRequired" label="New Password" v-model="password.new_password" type="password"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pt-0 ma-0">
                            <v-text-field :rules="rulesRequired" label="Re-Type Password" v-model="password.confirm_password" type="password"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pt-0 ma-0">
                            <!-- <v-btn color="secondary" :disabled="!valid" @click="handleUpdate" rounded block>Update</v-btn> -->
                            <v-btn color="primary"  @click="handleUpdate" rounded block>Update</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </div>
        </v-container>
        <!-- <Bottomnavbar :value="indexValue"/> -->
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
// import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
import { base_url } from '@/core/services/config'
// import InputUpload from '@/components/form-element/InputUpload'
import { mapGetters } from 'vuex'
export default {
    name:'EditProfile',
    data() {
        return {
            title:'',
            indexValue:0,
            base_url,
            valid:true,
            schedules:[],
            rulesRequired: [
                v => !!v || 'Required',
            ],
            password: {
                new_password:'',
                confirm_password:'',
            }
        }
    },
    mounted() {

    },
    methods: {
        handleBlur(){

        },
        handleBack(){
            this.$router.back();
        },
        async handleUpdate() {
            let valid = this.$refs.formPassword.validate();
            if(!valid) {
                this.messageError('Field is empty');
                return;
            }
            this.loaderShow();
            await ApiService.post('/change_password',this.password).then((resp) => {
                this.loaderHide();
                this.messageSuccess(resp.message);
                this.handleBack();
            })
            .catch((error) => {
                this.loaderHide();
                this.messageError(error.response.data.message);
            })
        },
    },
    components: {
        Topnavbar,
        // Bottomnavbar,
        // InputUpload
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
        })
    }
}
</script>
<style lang="scss" scoped>
.schedule {
    text-align: center;
    padding: 10px;
    color: #b5b5b5;
    background: #fff;
    height: 180px;
    border-radius: 20px;
    align-items: center;
    justify-content: space-around;
    display: flex;
}
.schedule-wrapper{
    background: #ffffff;
    border-radius:10px;
    padding:10px;
    margin-bottom: 70px;
}
.schedulte-item-wrapper{
    padding:10px;
    // border:1px solid #dadada;
    margin-bottom: 14px;
    border-radius:10px;
    -webkit-box-shadow: 3px 5px 28px -7px rgba(184,184,184,0.52);
    -moz-box-shadow: 3px 5px 28px -7px rgba(184,184,184,0.52);
    box-shadow: 3px 5px 28px -7px rgba(184,184,184,0.52);
}
.form-container{
    padding:20px;
}
</style>