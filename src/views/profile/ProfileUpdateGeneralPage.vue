<template>
    <v-container class="ma-0 pa-0 background-image h-100">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container>
            <div class="form-container bg-primary-light">
                <v-form ref="formCheckoutCash" v-model="valid">
                    <v-row>
                        <v-col
                        cols="12"
                        >
                        <div style="height:100px; width:120px; margin:0 auto;">
                            <InputUpload :src="base_url+'/image-show/'+src" 
                            :update_input_file="update_input_file" 
                            type="menu_image" 
                            :max-height="maxHeight"
                            label="Change"
                            @changeImage="changeImage"/>
                        </div>
                        </v-col>
                        <v-col
                        cols="6"
                        sm="6"
                        >
                        <v-text-field
                            v-model="customer.fname"
                            :rules="ruleRequired"
                            label="First name"
                            required
                        ></v-text-field>
                        </v-col>

                        <v-col
                        cols="6"
                        sm="6"
                        >
                        <v-text-field
                            v-model="customer.lname"
                            :rules="ruleRequired"
                            label="Last name"
                            required
                        ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            md="6"
                            >
                            <v-text-field
                                v-model="customer.email"
                                :rules="rulesEmail"
                                label="E-mail"
                                required
                            ></v-text-field>
                            </v-col>
                        <v-col
                        cols="12"
                        md="12"
                        >
                        <v-text-field
                            v-model="customer.mobile_no"
                            v-mask="'(###) ###-####'"
                            label="Phone"
                            :rules="ruleRequired"
                            required
                        ></v-text-field>
                        </v-col>
                        <v-col cols="12" class="text-center">
                            <v-btn block depressed color="secondary" class="gradient-bg-s" @click="updateProfile" rounded>Update</v-btn>
                        </v-col>
                    </v-row>

                </v-form>
            </div>
        </v-container>
         <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
import Bottomnavbar from '@/components/layout/NavbarBottom'
import { base_url } from '@/core/services/config'
import InputUpload from '@/components/form-element/InputUpload'
// import { mapGetters } from 'vuex'
export default {
    name:'EditProfile',
    data() {
        return {
            title:'',
            base_url,
            valid:true,
            maxHeight:100,
            customer: {
                fname:'',
                lname:'',
                mobile_no:'',
                email:'',
                profile_pic:'',
            },
            file_name:'',
            ruleRequired: [
                v => !!v || 'Required',
            ],
            rulesEmail: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid',
            ],
            update_input_file:true,
            src:'',
        }
    },
    mounted() {
        this.profileData();
    },
    methods: {
        handleBack(){
            this.$router.back();
        },
        changeImage(file){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            let formData = new FormData();
            formData.append("file",file.file);
            ApiService.post('/store-image', formData)
            .then((resp) => {
                 this.$bus.$emit('HIDE_PAGE_LOADER');
                 this.src = resp.src;
                 this.customer.profile_pic = resp.file_name;
                 this.hasFile = true;
            })
            .catch(() => {
                this.messageError("Failed ! choose image less than size 2mb");
                this.$bus.$emit('HIDE_PAGE_LOADER');
            });
        },
        async profileData() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/self/profile').then((resp) => {
                this.customer = resp.data;
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
        },
        async updateProfile(){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/self/profile/contact', this.customer)
            .then(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageSuccess("Success");
                this.profileData();
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError('Failed to update profile');
            })
        }
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        InputUpload
    },
    computed: {
        // ...mapGetters({
        //     currentUser:'auth/user',
        // })
    }
}
</script>
<style lang="scss" scoped>
.form-container{
    // .login-container{
    // background: #acfa95;
    border-radius: 10px;
    // margin-top: 27px !important;
    padding:20px;
// }
}
</style>