<template>
    <v-container class="ma-0 pa-0 background-image h-100">
        <v-container>
            <div class="mt-10">
                <div class="mt-10">
                    <v-btn icon text color="primary" 
                        :to="{
                            name:'loginPage'
                        }">
                        <v-icon class="mr-0 pr-0">{{iconBack}}</v-icon>
                    </v-btn>
                </div>
            </div>
            <div>
                <v-row>
                    <v-col cols="12">
                        <div class="text-center mb-2">
                            <img :src="logo" width="90"/>
                        </div>
                    </v-col>
                </v-row>
            </div>
            <div class="pa-4 ma-4 login-container background-white bg-primary-light">
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
                                        <div v-if="activeQuestion.type =='select'">
                                              <InputAutocomplete @selected="selectedAnswers" label="Select" :items="activeQuestion.options"/>
                                        </div>
                                        <div v-if="activeQuestion.type =='email'">
                                            <v-text-field v-model="answer" :rules="rulesEmail"></v-text-field>
                                        </div>
                                        <div v-if="activeQuestion.type =='password'">
                                            <v-text-field v-model="answer" autocomplete="false" :rules="rulesRequired" type="password"></v-text-field>
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
import InputAutocomplete from '@/components/layout/InputAutocompleteSingleTextValue'
// import Bottomnavbar from '@/components/layout/NavbarBottom'
import logo from './logo.png'
import background from './login_banner.png'
import bug from './bug.png'
import { base_url } from '@/core/services/config'
// import { mdiTwitter, mdiFacebook} from '@mdi/js'
import { mdiTwitter, mdiFacebook, mdiHome, mdiAccount, mdiChat,mdiChevronLeft } from '@mdi/js'
// import axios from "axios"
export default {
    data: () => ({
        value: 1,
        base_url,
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
        items: [
            {id:1, name:'',route:'',icon:'mdi-home', showText:false},
            {id:2, name:'',route:'about',icon:'mdi-information'},
            {id:3, name:'',route:'contact', icon:'mdi-notebook-check'},
            {id:4, name:'',route:'login', icon:'mdi-login'},
        ],
        questions:[
            {question:'Truck Name',field:'truck_name',type:'text',options:[]},
            {question:'Truck No. Plate',field:'plate_no',type:'text',options:[]},
            {question:'Truck Model',field:'truck_model',type:'text',options:[]},
            {question:'Truck Type',field:'truck_type',type:'select',options: []},
            {question:'Your Name',field:'your_name',type:'text',options:[]},
            {question:'Your Phone',field:'phone',type:'phone',options:[]},
            {question:'Your Email',field:'email',type:'email',options:[]},
            {question:'Password',field:'password',type:'password',options:[]},
        ],
        lazy: false,
        name:'Buglogic',
        progressValue: 10,
        truckTypes:[],
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
        showError:false,
        errorMessage:'Required',
        location:{
            lat:0,
            lng:0,
            add1:'',
            city:'',
            state:'',
            zip_code:'',
            country:'',
        },
        phone:'',
    }),
    components: {
        // Bottomnavbar,
        InputAutocomplete,
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
        // if(JwtService.getToken()) {
        //     this.$router.replace({name:'homePage'});
        // }
        this.fetchLogo();
        this.activeQuestion = this.questions[this.activeQuestionIndex];
        this.fetchVendorTypes();
        this.locateGeoLocation();

    },

    methods: {
        ...mapActions({
			registerVendor:'auth/signUpVendor'
		}),
        async submit() {
            this.loaderShow();
            this.registerVendor({
                name: this.answers[0],
                vechicle_no: this.answers[1],
                model_no: this.answers[2],
                truck_type_id: this.answers[3],
                contact_name: this.answers[4],
                phone_no: this.answers[5],
                email: this.answers[6],
                password: this.answers[7],
            })
            .then(() => {
                this.fetchAddress();
            })
        },
        locateGeoLocation: function() {
            navigator.geolocation.getCurrentPosition(res => {
                this.location.lat = res.coords.latitude,
                this.location.lng = res.coords.longitude
            });
        },
        fetchVendorTypes() {
            ApiService.get('vendor/lookup/types')
            .then((resp) => {
                this.questions[3].options = resp.data;
            })
            .catch((error) => {
                console.log(error);
            })
        },
        handleBack() {
            if(this.step>0){
                this.step -=1;
                this.activeQuestionIndex -= 1;
                this.answer = this.answers[this.activeQuestionIndex];
                this.activeQuestion = this.questions[this.activeQuestionIndex];
                this.progressValue = (this.step/12)*100;
            }
        },
        selectedAnswers(data) {
            // this.answers.push(data.selected_data);  
            if(this.activeQuestion.type == 'radio_with_text'){
                // this.answers[this.activeQuestionIndex] = this.radio_text+ " "+data.selected_data;
                this.answer =  this.radio_text+ " "+data.selected_data;
            }else{
                // this.answers[this.activeQuestionIndex] = data.selected_data;
                this.answer =  this.radio_text+ " "+data.selected_data;
            }
            // console.log(this.answers);
        },
    
        handleNext() {
            switch(this.activeQuestion.field){
                case 'truck_name':
                case 'plate_no':
                case 'truck_model':
                case 'truck_type':
                case 'your_name':
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
            this.answer = "";
            this.step +=1;
            this.activeQuestionIndex += 1;
            this.activeQuestion = this.questions[this.activeQuestionIndex];
            this.progressValue = (this.step/ this.questions.length)*100;
            // console.log(this.answers);
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

        async submitted() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/register/vendor', {
                name: this.answers[0],
                vechicle_no: this.answers[1],
                model_no: this.answers[2],
                truck_type_id: this.answers[3],
                contact_name: this.answers[4],
                phone_no: this.answers[5],
                email: this.answers[6],
                password: this.answers[7],
            })
            .then((resp) => {
                // this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageSuccess("Registered successfully")
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
           this.$bus.$emit('SHOW_PAGE_LOADER');  
            ApiService.get('/getapikeys')
            .then( async (apiKeys) =>  {
                let googleApiKey = apiKeys.google;
                 await ApiService.post(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.location.lat},${this.location.lng}&key=${googleApiKey}`)
                .then((resp) => {
                    this.$bus.$emit('HIDE_PAGE_LOADER');
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
                    // this.$bus.$emit('HIDE_PAGE_LOADER');
                    this.updateLocation();
                })
            })
        },
        async updateLocation() {
            //  this.$bus.$emit('SHOW_PAGE_LOADER');
             await ApiService.post('/location/save-current', this.location)
            .then(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.$router.push({ name:'OrdersPage'});
            })
            .catch((error) => {
                console.log(error);
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.$router.push({ name:'OrdersPage'});
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
.follow-us{
    color:#fff;
    font-weight: 300;
    font-size: 0.9rem;
    // text-align: right;
    i{
        -webkit-transform: scaleX(-1);
        transform: scaleX(-1);
        color:#fff;
        margin-right: 4px;
        font-size:0.8rem;
    }

}
.social-links{
    // text-align:right;
    i{
        color:#fff;
        &:not(:last-child){
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
.footer-copyright{
    padding: 40px;
    bottom: 0;
    p{
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
