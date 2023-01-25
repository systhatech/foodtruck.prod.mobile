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
                            <InputUpload :src="base_url+'/image-show/'+ (truck.profile_pic ? truck.profile_pic :'noimage.png')" 
                            :update_input_file="update_input_file" 
                            type="menu_image" 
                            :max-height="maxHeight"
                            label="Change"
                            @changeImage="changeImage"/>
                        </div>
                        </v-col>
                        <v-col
                        class="pb-0 pt-0"
                        cols="12"
                        sm="12"
                        >
                        <v-text-field
                            v-model="truck.name"
                            :rules="ruleRequired"
                            label="Truck Name"
                            required
                        ></v-text-field>
                        </v-col>
                        <v-col
                        class="pb-0 pt-0"
                        cols="12"
                        sm="12"
                        >
                         <v-textarea
                            label="Description" 
                            v-model="truck.description"
                            auto-grow
                            rows="1"
                            row-height="15"
                            ></v-textarea>
                        </v-col>
                        <v-col
                        cols="6"
                        md="6"
                        >
                            <v-text-field
                            v-model="truck.vechicle_no"
                            :rules="ruleRequired"
                            label="Plate No."
                            required
                        ></v-text-field>
                        </v-col>
                        <v-col
                        cols="6"
                        md="6"
                        >
                            <v-text-field
                                v-model="truck.model_no"
                                :rules="ruleRequired"
                                label="Model No"
                                required
                            ></v-text-field>
                        </v-col>
                        <!-- <v-col cols="12" class="text-center">
                            <v-btn block color="primary"
                            :disabled="!valid"
                             @click="updateGeneral" rounded>Update</v-btn>
                        </v-col> -->
                        <v-col cols="12" class="text-center">
                            <v-btn block color="primary"
                             @click="updateGeneral" rounded>Update</v-btn>
                        </v-col>
                    </v-row>

                </v-form>
            </div>
        </v-container>
         <Bottomnavbar :value="indexValue"/>
    </v-container>
</template>
<script>
import { base_url } from '@/core/services/config'
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
import InputUpload from '@/components/form-element/InputUpload'
import { mapGetters } from 'vuex'
export default {
    name:'TruckProfile',
    data() {
        return {
            base_url,
            indexValue:0,
            title:'',
            valid:true,
            maxHeight:100,
            available:true,
            truck: {
                name:'',
                description:'',
                profile_pic:'',
                vechicle_no:'',
                model_no:'',
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
        // this.profileData();
        if(this.currentUser) {
            this.truck = this.currentUser.owner;
            console.log(this.truck.vechicle_no);
        }
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
                 this.truck.profile_pic = resp.file_name;
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
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.truck.name = resp.general.name;
                this.truck.profile_pic = resp.general.profile_pic;
                let desc =  document.createElement("div")
                desc.innerHTML = resp.general.description;
                this.truck.description = desc.textContent;
                this.truck.ref_no = resp.general.ref_no;
                this.truck.model_no = resp.general.model_no;
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
        },
        async updateGeneral(){

            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/self/profile/general', this.truck)
            .then(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageSuccess('Updated successfully');
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError('Failed to update');
            })
        }
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        InputUpload
    },
    computed: {
        ...mapGetters({ currentUser:'auth/user'}),
    }
}
</script>
<style lang="scss" scoped>
.form-container{
    // .login-container{
    // background: #acfa95;
    // border-radius: 10px;
    margin-bottom: 60px !important;
    padding:20px;
// }
}
</style>