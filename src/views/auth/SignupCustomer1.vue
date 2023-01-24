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
            <div class="pa-4 login-container background-white bg-primary-light">
                <div v-if="this.step <= this.questions.length" class="mb-10 mt-5">
                    <v-progress-linear  
                        v-model="progressValue"
                        :active="show"
                        color="primary"
                        height="6"
                        :indeterminate="query"
                        :query="true">
                    </v-progress-linear>
                </div>
                <v-row>
                    <v-col v-if="this.step <= this.questions.length" cols="12" md="12" lg="12">
                        <div>
                            <v-form>
                                <v-row>
                                    <v-col cols="12">
                                        <div class="question-style text-center">
                                            <h3 class="color-primary">  {{  this.questions[this.activeQuestionIndex].question }} </h3>
                                        </div>
                                        <div v-if="activeQuestion.type =='text'">
                                            <v-text-field class="text-center" :rules="rulesRequired" v-model="answer"></v-text-field>
                                        </div>
                                        <div v-if="activeQuestion.type =='phone'">
                                            <v-text-field v-mask="'### ###-####'" :rules="rulesRequired" v-model="answer"></v-text-field>
                                        </div>
                                        <div v-if="activeQuestion.type =='email'">
                                            <v-text-field v-model="answer" :rules="rulesEmail"></v-text-field>
                                        </div>
                                        <div v-if="activeQuestion.type =='password'">
                                            <v-text-field autocomplete="false" v-model="answer" :rules="rulesRequired" type="password"></v-text-field>
                                        </div>
                                        <div v-if="activeQuestion.type =='radio_row'">
                                            <v-radio-group
                                                v-model="answer"
                                                row>
                                                <v-radio
                                                    v-for="(item,x) in activeQuestion.options" :key="x"
                                                    :label="item.text"
                                                    :value="item.value"
                                                ></v-radio>
                                            </v-radio-group>
                                            <!-- <InputAutocomplete @selected="selectedAnswers" :items="activeQuestion.options"/> -->
                                        </div>
                                        <div v-if="activeQuestion.type =='radio_with_text'" class="d-flex align-center">
                                            <v-text-field class="mt-3 mr-4" label="Value" v-model="radio_text"></v-text-field>
                                            <InputAutocomplete @selected="selectedAnswers" :items="activeQuestion.options"/>
                                        </div>
                                        <div>
                                            <p class="color-secondary" v-if="showError">{{errorMessage}}</p>
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <div class="d-flex justify-space-around" :class="step==1 ? '' : 'justify-space-between'">
                                            <v-btn rounded class="" v-if="step>0" @click="handleBack">Back</v-btn>
                                            <v-btn color="primary" rounded @click="handleNext">{{ questions.length > (activeQuestionIndex+1) ?'Next':'Submit'}}</v-btn>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </div>
                    </v-col>
                    <v-col v-else cols="12">
                        <div>
                            <h3 class="color-primary">Review</h3>
                            <div class="custom-bs pa-3">
                                <div v-for="(question,index) in questions" :key="index">
                                    <!-- <h4 class="text-capitalize color-secondary">{{ question.question}}</h4>
                                    <p class="f8-bold text-capitalize">{{ answers[index]}}</p> -->
                                    <p class="f8 text-capitalize ma-0">{{ question.question}}</p>
                                    <h4 class="text-capitalize mb-3">{{ answers[index] }}</h4>
                                </div>
                                <div class="d-flex justify-space-between">
                                    <v-btn @click="handleBack" rounded>Back</v-btn>
                                    <v-btn color="primary" @click="handleSubmit" rounded>{{ questions.length > step ?'Next':'Submit'}}</v-btn>
                                </div>
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </div>
        </v-container>
        <!-- <Bottomnavbar/> -->
    </v-container>
</template>
<script>
// import { SET_AUTH } from "@/core/services/store/auth.module";
// import { GET_LOGO } from "@/core/services/store/default_company.module";
import { mapActions } from 'vuex'
import { ApiService } from '@/core/services/api.service'
import JwtService from '@/core/services/jwt.service'
// import Bottomnavbar from '@/components/layout/NavbarBottom'
import logo from './logo.png'
import background from './login_banner.png'
import bug from './bug.png'
import { base_url } from '@/core/services/config'
import { mdiTwitter, mdiFacebook, mdiHome, mdiAccount, mdiChat,mdiChevronLeft } from '@mdi/js'
// import axios from "axios"
export default {
    data: () => ({
         value: 1,
        iconBack: mdiChevronLeft,
        iconFb: mdiFacebook,
        iconHome: mdiHome,
        iconProfile: mdiAccount,
        iconChat: mdiChat,
        terms:true,
        iconTw: mdiTwitter,
        background,
        logo,
        bug,
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
        rulesEmail: [
             v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
        rulesRequired: [
            //  v => !v || 'Required'
        ],
        showError:false,
        errorMessage:'Required',
        items: [
            {id:1, name:'',route:'',icon:'mdi-home', showText:false},
            {id:2, name:'',route:'about',icon:'mdi-information'},
            {id:3, name:'',route:'contact', icon:'mdi-notebook-check'},
            {id:4, name:'',route:'login', icon:'mdi-login'},
        ],
        questions:[
            {question:'Your Name',field:'name',type:'text',options:[]},
            {question:'Your Phone',field:'phone',type:'phone',options:[]},
            {question:'Your Email',field:'email',type:'email',options:[]},
            // {question:'Gender',field:'gender',type:'radio_row',options:[
            //     {text:'Male',value:'male'},
            //     {text:'Female',value:'female'}
            // ]},
            {question:'Password',field:'password',type:'password',options:[]},
        ],
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
        // Bottomnavbar,
    },
    watch: {
        serviceProvider(newval) {
            newval ? this.login_info.client = 0 : this.login_info.client = 1;
            if(newval) {
                localStorage.removeItem('destination');
            }
        }
    },
    mounted() {
        if(JwtService.getToken()) {
            this.$router.replace({name:'dashboardPage'});
        }
        this.fetchLogo();
        this.activeQuestion = this.questions[this.activeQuestionIndex];
        this.locateGeoLocation();
    },

    methods: {
         ...mapActions({
			registerClient:'auth/signUpClient'
		}),
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
                        this.$bus.$emit('SHOW_PAGE_LOADER');
                        ApiService.post('/check/email',{email: this.answer})
                        .then(() => {
                            this.answers[this.activeQuestionIndex] = this.answer;
                            this.answer = "";
                            this.updateStep();
                        })  
                        .catch((error) => {
                            this.$bus.$emit('HIDE_PAGE_LOADER');
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
            this.$bus.$emit('HIDE_PAGE_LOADER');
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
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError('Sorry, Something goes wrong');
            });
        },

        async submitt() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/register/client', {
                name: this.answers[0],
                phone_no: this.answers[1],
                email: this.answers[2],
                password: this.answers[3],
            })
            .then((resp) => {
                 this.messageSuccess("Registered Successfully");
                JwtService.saveToken(resp.token);
                JwtService.saveUtype(resp.user.table);
                this.fetchAddress();
                
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                if(error.response.data){
                    this.messageError(error.response.data.message);
                }else{
                    this.messageError(error.response.statusText);
                }
            })
        },
         async fetchAddress() {
            // this.$bus.$emit('SHOW_PAGE_LOADER');  
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
             this.$bus.$emit('SHOW_PAGE_LOADER');
             await ApiService.post('/location/save-current', this.location)
            .then(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.$router.replace({ name:'home'});
            })
            .catch((error) => {
                console.log(error);
                this.$bus.$emit('HIDE_PAGE_LOADER');
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
