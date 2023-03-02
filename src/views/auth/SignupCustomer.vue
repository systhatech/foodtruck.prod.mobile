<template>
    <v-container class="ma-0 pa-0 background-image h-100">
        <v-container>
            <div class="mt-10">
                 <v-btn icon text color="primary" 
                    :to="{
                        name:'loginPage'
                    }" >
                    <v-icon class="mr-0 pr-0">{{iconBack}}</v-icon>
                </v-btn>
            </div>
            <div>
                <v-row>
                    <v-col cols="12">
                        <div class="text-center mb-2">
                            <img :src="base_url+'/default-company/logo'" width="90" />
                        </div>
                    </v-col>
                </v-row>
            </div>
            <div class="custom-bs pa-4 bg-primary-light">
                <v-form ref="formSignupCustomer">
                    <v-row>
                        <v-col cols="6">
                            <v-text-field class="text-center" :rules="rulesRequired" v-model="customer_info.fname" label="First Name"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field class="text-center" :rules="rulesRequired" v-model="customer_info.lname" label="Last Name"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field class="text-center" @blur="onCheckEmail" :rules="emailRules" v-model="customer_info.email" label="Email"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field class="text-center" :rules="rulesRequired" v-model="customer_info.phone_no" label="Phone No." v-mask="'(###) ###-####'"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field class="text-center" :rules="rulesRequired" type="password" v-model="customer_info.password" label="Password"></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
                <div class="text-center">
                    <v-btn color="primary" rounded block large @click="handleSubmit()">Submit</v-btn>
                </div>
            </div>
            <DialogError :dialogError="modal_error" :message="message_error" @close="handleClose"/>
        </v-container>
        <!-- <Bottomnavbar/> -->
    </v-container>
</template>
<script>
import { mapActions } from 'vuex'
import { ApiService } from '@/core/services/api.service'
// import JwtService from '@/core/services/jwt.service'
import { base_url } from '@/core/services/config'
import { mdiTwitter, mdiFacebook, mdiHome, mdiAccount, mdiChat,mdiChevronLeft } from '@mdi/js'
export default {
    data: () => ({
         value: 1,
         modal_error:false,
         message_error:'Error',
        iconBack: mdiChevronLeft,
        iconFb: mdiFacebook,
        iconHome: mdiHome,
        iconProfile: mdiAccount,
        iconChat: mdiChat,
        terms:true,
        iconTw: mdiTwitter,
        base_url,
        showServiceProvider:false,
        login_info: {
            email: "",
            password: "",
            client:1,
        },
        serviceProvider:false,
        indexValue:3,
        loading: false,
        nameErrors: "",
        emailErrors: "",
        checkboxErrors: "",
        show_password: false,
        valid: true,
        activateAccount: false,
        accountActivated: false,
        emailRules: [
            (v) => !!v || "E-mail is required",
            (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
        ],
        rulesRequired: [(v) => !!v || "Required"],
        showError:false,
        errorMessage:'Required',
        customer_info:{
            fname:'',
            lname:'',
            email:'',
            phone_no:'',
            password:'',
        },
        lazy: false,
        phone:'',
        name:'',
        progressValue: 10,
        query: false,
        show: true,
        interval: 0,
        images:[],
        modalDelete:false,
        appointmentId:null,
        activeQuestionIndex:0,
        activeQuestion:{},
        answers:[],
        answer:'',
        radio_text:'',
        questionLength:0,
        step:0,
        location:{
            lat:0,
            lng:0,
            add1:'',
            city:'',
            state:'',
            zip_code:'',
            country:'',
        }
    }),
    components: {
        DialogError :()=> import('@/components/layout/DialogError.vue')
    },
    watch: {
        // serviceProvider(newval) {
        //     newval ? this.login_info.client = 0 : this.login_info.client = 1;
        //     if(newval) {
        //         localStorage.removeItem('destination');
        //     }
        // }
    },
    mounted() {
        // if(JwtService.getToken()) {
        //     this.$router.replace({name:'dashboardPage'});
        // }
        // this.fetchLogo();
        // this.locateGeoLocation();
    },

    methods: {
         ...mapActions({
			registerClient:'auth/signUpClient'
		}),
        handleClose(){
            this.customer_info.email = "";
            this.modal_error = false;
        },
        onCheckEmail(){
            if(!this.customer_info.email) return;
            
            this.loaderShow();
            ApiService.post("/check/email",{ 'email': this.customer_info.email})
            .then((resp)=>{
                this.loaderHide();
                console.log(resp);
            })
            .catch((error)=>{
                this.loaderHide();
                this.message_error = error.response.data.message;
                this.modal_error = true;
            })
        },
        async handleSubmit(){
            if(!this.$refs.formSignupCustomer.validate()) return;
            this.loaderShow();
            await ApiService.post('/register/client', this.customer_info)
            .then((resp) => {
                this.loaderHide();
                console.log(resp);
                // this.messageSuccess("Registered Successfully");
                // JwtService.saveToken(resp.token);
                // JwtService.saveUtype(resp.user.table);
                // this.fetchAddress();
                this.$router.push({ name:'VerifyEmailPage', query:{ email: this.customer_info.email, type:'clients'}});
                // this.sendEmailVerification(this.customer_info.email);
                
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
        async sendEmailVerification(email){
            this.loaderShow();
            await ApiService.post('/email-verification', {email})
            .then(() => {
                this.loaderHide();
                this.$router.push({ name:'VerifyEmailPage', query:{ email: this.customer_info.email, type:'clients'}});
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
            this.loaderShow();
            this.registerClient({
                name: this.answers[0],
                phone_no: this.answers[1],
                email: this.answers[2],
                password: this.answers[3],
            })
            .then(() => {
                this.fetchAddress();
                console.log("success");
            })
        },
        locateGeoLocation: function() {
            navigator.geolocation.getCurrentPosition(res => {
                this.location.lat = res.coords.latitude,
                this.location.lng = res.coords.longitude
            });
        },
        handleBack() {
            if(this.step>0){
                this.step -=1;
                this.activeQuestionIndex -= 1;
                this.activeQuestion = this.questions[this.activeQuestionIndex];
                this.progressValue = (this.step/ this.questions.length)*100;
            }
        },
        selectedAnswers(data) {
            if(this.activeQuestion.type == 'radio_with_text'){
                this.answer =  this.radio_text+ " "+data.selected_data;
            }else{
                this.answer =  this.radio_text+ " "+data.selected_data;
            }
        },
        handleNext() {
            switch(this.activeQuestion.field){
                case 'name':
                case 'phone':
                case 'gender':
                    if(this.answer == ""){
                        this.showError = true;
                        this.errorMessage = "Required";
                        return;
                    }else{
                        this.answers[this.activeQuestionIndex] = this.answer;
                        this.updateStep();
                    }
                    break;
                case 'email':

                    if(this.answer == ""){
                        this.showError = true;
                        this.errorMessage = "Required";
                        return;
                    }
                    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.answer)){
                        this.loaderShow();
                        ApiService.post('/check/email',{email: this.answer})
                        .then(() => {
                            this.answers[this.activeQuestionIndex] = this.answer;
                            this.answer = "";
                            this.updateStep();
                        })  
                        .catch((error) => {
                            this.loaderHide();
                            this.showError = true;
                            this.errorMessage = error.response.data.message;
                        })       
                    }else{
                        this.showError = true;
                        this.errorMessage = "Invalid Email";
                        return;
                    }
                    break;
                case 'radio_with_text':
                    if(this.radio_text == ""){
                       this.showError = true;
                       this.errorMessage = "Required";
                       return;
                   }
                   this.showError = false;
                   this.answers[this.activeQuestionIndex] = this.radio_text+ " "+this.answer;
                   this.radio_text = "";
                   this.answer = "";
                    break;
                case 'password':
                    if(this.answer == ""){
                        this.showError = true;
                        this.errorMessage = "Required";
                        return;
                    }
                    this.answers[this.activeQuestionIndex] = this.answer;
                    this.submit();
                    break;
                default:
                    break;
            }
        },
        updateStep(){
            this.loaderHide();
            this.showError = false;
            this.step +=1;
            this.activeQuestionIndex += 1;
            this.activeQuestion = this.questions[this.activeQuestionIndex];
            this.progressValue = (this.step/ this.questions.length)*100;
            this.answer = "";
        },
        handleServiceProvider() {
            this.showServiceProvider = true;
            this.serviceProvider = true;
        },
        async fetchLogo() {
            this.$bus.$emit('SHOW_PAGE_LOADER')
            await ApiService.get("default-company/logo")
            .then((resp) => {
                this.logo = this.base_url+"/image-show/"+resp.logo;
                this.name = resp.name;
                this.loaderHide();
            })
            .catch(() => {
                this.loaderHide();
                this.messageError('Sorry, Something goes wrong');
            });
        },

        async submitt() {
            this.loaderShow();
            await ApiService.post('/register/client', {
                name: this.answers[0],
                phone_no: this.answers[1],
                email: this.answers[2],
                password: this.answers[3],
            })
            .then(() => {
                 this.messageSuccess("Registered Successfully");
                // JwtService.saveToken(resp.token);
                // JwtService.saveUtype(resp.user.table);
                this.fetchAddress();
                
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
         async fetchAddress() {
            // this.loaderShow();  
            ApiService.get('/getapikeys')
            .then( async (apiKeys) =>  {
                let googleApiKey = apiKeys.google;
                 await ApiService.post(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.location.lat},${this.location.lng}&key=${googleApiKey}`)
                .then((resp) => {
                    this.loaderHide();
                    for(let addr of resp.results) {
                        let address = this.parseGoogleResponse(addr.address_components);
                        this.location.add1 = address.street_number+" "+address.route;
                        this.location.city = address.locality;
                        this.location.state = address.administrative_area_level_1;
                        this.location.zip_code = address.postal_code;
                        this.location.country = address.country;
                        break;
                    }
                    this.updateLocation();
                   
                })
                .catch(() => {
                    this.loaderHide();
                })
            })
        },
        async updateLocation() {
             this.loaderShow();
             await ApiService.post('/location/save-current', this.location)
            .then(() => {
                this.loaderHide();
                this.$router.replace({ name:'home'});
            })
            .catch((error) => {
                console.log(error);
                this.loaderHide();
                this.$router.replace({ name:'home'});
            })
        }
    },
};
</script>
<style lang="scss" scoped>
.login-container{
    // background: #acfa95;
    border-radius: 10px;
    margin-top: 27px !important;
}
</style>
