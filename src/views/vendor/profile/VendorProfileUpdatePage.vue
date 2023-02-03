<template>
     <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mg56">
            <div class="form-container custom-bs">
                <v-form ref="formCheckoutCash" v-model="valid">
                    <v-row>
                        <v-col
                        cols="12"
                        >
                        <div style="height:100px; width:120px; margin:0 auto;">
                            <InputUpload :src="base_url+'/image-show/'+customer.profile_pic" 
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
                            <v-btn block color="primary" 
                            @click="updateProfile" rounded>Update</v-btn>
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
import Bottomnavbar from '@/components/layout/NavbarBottomVendor'
import { base_url } from '@/core/services/config'
import InputUpload from '@/components/form-element/InputUpload'
import { mapGetters, mapActions } from 'vuex'
export default {
    name:'EditProfile',
    data() {
        return {
            indexValue:0,
            title:'',
            base_url,
            valid:true,
            maxHeight:100,
            customer: {
                fname:'',
                lname:'',
                mobile_no:'',
                email:'',
                profile_pic:'avatar.png',
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
        if(this.currentUser) {
            // this.customer = this.currentUser;
            this.customer.id = this.currentUser.id;
            this.customer.fname = this.currentUser.fname;
            this.customer.lname = this.currentUser.lname;
            this.customer.email = this.currentUser.email;
            this.customer.profile_pic = this.currentUser.profile_pic ? this.currentUser.profile_pic:'avatar.png';
            this.customer.mobile_no = this.currentUser.mobile_no;
        }
    },
    methods: {
        ...mapActions({
            fetchProfile:'auth/fetchProfile'
        }),
        handleBack(){
            this.$router.back();
        },
        changeImage(file){
            this.loaderShow();
            let formData = new FormData();
            formData.append("file",file.file);
            ApiService.post('/store-image', formData)
            .then((resp) => {
                 this.loaderHide();
                 this.customer.profile_pic = resp.file_name;
                 this.hasFile = true;
            })
            .catch(() => {
                this.messageError("Failed ! choose image less than size 2mb");
                this.loaderHide();
            });
        },
        async profileData() {
            this.loaderShow();
            await ApiService.post('/profile').then((resp) => {
                this.loaderHide();
                this.customer.fname = resp.data.fname;
                this.customer.lname = resp.data.lname;
                this.customer.email = resp.data.email;
                this.customer.mobile_no = resp.data.mobile_no ? resp.data.mobile_no : resp.data.phone_no;
            })
            .catch(() => {
                this.loaderHide();
            })
        },
        async updateProfile(){
            this.loaderShow();
            this.customer.other_email = this.customer.email;
            await ApiService.post('/self/profile/contact', this.customer)
            .then(() => {
                this.loaderHide();
                this.messageSuccess("Success");
                this.fetchProfile();
                this.handleBack();
            })
            .catch(() => {
                this.loaderHide();
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
        ...mapGetters({currentUser:'auth/user'}),
    }
}
</script>
<style lang="scss" scoped>
.form-container{
    // background: #fff;
    // border-radius: 10px;
    padding:20px;
}
</style>