<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
       <Topnavbar :title="title" @back="handleBack"/>
       <v-container class="mg56">
           <div v-if="showMessage" class="custom-bs pa-4 mb-4">
               <p class="mb-0 color-primary">{{message}}</p>
           </div>
           <div class="pa-4 mb-14 custom-bs">
               <div>
               <v-form ref="formSupport">
                   <v-row>
                       <v-col><h3>How can I help you?</h3></v-col>
                       <v-col cols="12" class="pb-0 mb-0">
                           <v-text-field label="Subject" v-model="form.title" :rules="rulesRequired"></v-text-field>
                       </v-col>
                       <v-col cols="12" class="pb-0 mb-0">
                           <v-textarea label="Message" v-model="form.description" :rules="rulesRequired" auto-grow></v-textarea>
                       </v-col>
                       <v-col cols="12">
                           <v-btn color="primary" large rounded block @click="handleSubmit">Submit</v-btn>
                       </v-col>
                   </v-row>

               </v-form>
               </div>
              
           </div>
       </v-container>
        <!-- <Bottomnavbar :value="indexValue"/> -->
   </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
import { ApiSupport } from '@/core/services/api.support'
// import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
import { base_support_project_url,support_client_username } from '@/core/services/config'
import { mapGetters } from 'vuex'
export default {
   name:'EditProfile',
   data() {
       return {
           title:'',
           indexValue:0,
           showMessage:0,
           rulesRequired: [
               v => !!v || 'Required',
           ],
           message:'Thank you for contacting us!!',
           form:{
               title:'',
               description:'',
           },
           base_support_project_url,
           support_client_username
       }
   },
   mounted() {
       this.fetchContent();
   },
   methods: {
       async handleSubmit() {
           let valid = this.$refs.formSupport.validate();
           if(!valid) return;
           this.loaderShow();
           // let data = {
           //     "username": "foodie",
           //     "title": "my phone is hang222222",
           //     "host": "https://itruck.systha.com",
           //     "relatable_id": "100",
           //     "relatable_name": "Lekhraj Truck",
           //     "desc": "Hello full long message here"
           // };
           let dataFormat = {
               title: this.form.title,
               username: this.support_client_username,
               host: this.base_support_project_url,
               relatable_id: this.currentUser.id,
               desc:   `<div>Name : <span id="supportName">${this.currentUser.fname} ${this.currentUser.lname}</span></div>
                       <div>Email : <span id="supportemail">${this.currentUser.email}</span></div>
                       <div>Phone : <span id="supportPhone">${this.currentUser.phone_no}</span></div> <br>
                       <div>Subject : <span id="supportSubject">${this.form.title}</span></div><br>
                       <div>${this.form.description}</div>`,
           }
           ApiSupport.post('/tool/task/create', dataFormat)
           .then(() => {
               this.loaderHide();
               this.$refs.formSupport.reset();
               this.message = "Your request has been submitted successfully!";
               this.showMessage = 1;
               setTimeout(() => {
                   this.showMessage = 0;
               },10000)
           })
           .catch(() => {
             this.loaderHide();
             this.messageError('Failed');  
           })
           console.log(this.form);
       },
     
       handleBack(){
           this.$router.back();
       },
       async fetchContent() {
           this.$bus.$emit('SHOW_PAGE_LOADER');
           await ApiService.post('/static-content',{page:'page_about'}).then((resp) => {
               this.$bus.$emit('HIDE_PAGE_LOADER');
               this.content = resp.data.page_content;
           })
           .catch(() => {
               this.$bus.$emit('HIDE_PAGE_LOADER');
           })
       },
   },
   components: {
       Topnavbar,
       // Bottomnavbar,
       // InputUpload
   },
   computed: {
       ...mapGetters({currentUser:'auth/user'}),
   }
}
</script>
<style lang="scss" scoped>
.form-container{
   // .login-container{
   background: #acfa95;
   border-radius: 10px;
   margin-top: 27px !important;
   padding:20px;
// }
}
</style>