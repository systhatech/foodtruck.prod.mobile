<template>
    <div class="mt-4">
        <div v-if="success" class="text-center custom-bs pa-8">
            <h4 class="mb-4 primary--text">Thank you!</h4>
            <p>Your request has been successfully submitted</p>
            <v-btn rounded large color="primary" to="/">back to home</v-btn>
        </div>
        <div class="" v-else>
            <div>
                <h4 class="mb-4">Catering Service</h4>
            </div>
            <v-form ref="formCatering" id="formCatering">
                <v-row>
                    <v-col cols="12" v-if="step==1">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('event_name') ?'error--text':'primary--text'">Event Name</label>
                            <v-text-field class="mt-6 pt-0" :rules="rulesRequired" v-model="catering.event_name"></v-text-field>
                        </div>
                    </v-col>
                    <v-col cols="12" v-if="step==2">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('event_type') ?'error--text':'primary--text'">Select your Event Type</label>
                            <div class="mt-6 pl-12">
                                <!-- <InputAutocomplete :items="event_types" @selected="selectedEventType"/> -->
                                <v-radio-group class="pt-0 mt-0" v-model="catering.event_type" :rules="ruleEventType">
                                    <v-radio :value="type.value" v-for="(type, t) in event_types" :key="t">
                                        <template v-slot:label>
                                            <div class="pa-3"><h4>{{  type.name  }}</h4></div>
                                        </template>
                                    </v-radio>
                                </v-radio-group>
                            </div>
                        </div>
                    </v-col>
                     <v-col cols="12" v-if="step==3">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('people_expected') ?'error--text':'primary--text'">How many Minimum people are you expecting?</label>
                            <v-text-field class="mt-6" min="1" type="number" :rules="rulesRequiredNumber" v-model="catering.people_expected"></v-text-field>
                        </div>
                    </v-col>
                     <v-col cols="12" v-if="step==4">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('budget') ?'error--text':'primary--text'">Minimum Budget ?</label>
                            <v-text-field class="mt-6" min="1" type="number" :rules="rulesRequiredNumber" v-model="catering.budget"></v-text-field>
                        </div>
                        
                    </v-col>
                     <v-col cols="12" v-if="step==5">
                        <div class="custom-bs pa-4 pb-8 pt-6 w-100 text-center">
                            <label for="" class="text-center mb-6" :class="errors.includes('address') ?'error--text':'primary--text'">Address</label>
                            <div class="mt-6">
                                <GoogleAddress 
                                    :defaultValue="defaultValue" 
                                    label=""
                                    @selectedAddr="addressSelected"/>
                            </div>
                        </div>
                    </v-col>
                     <v-col cols="12" v-if="step==6">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('event_date') ?'error--text':'primary--text'">Event Date</label>
                            <div class="mt-6">
                                <DatePicker label=""  @selectedDate="dateStart" :minDate="minDate"/>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" v-if="step==7">
                        <div class="text-center custom-bs pa-6">
                            <label for="" :class="errors.includes('start_time') ?'error--text':'primary--text'">Start Time</label>
                            <div class="mt-6 mb-4">
                                <vue-timepicker format="hh:mm A" placeholder="" v-model="catering.start_time" manual-input></vue-timepicker>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" v-if="step==8">
                        <div class="text-center custom-bs pa-6 w-100">
                            <label for="" :class="errors.includes('end_time') ?'error--text':'primary--text'">End Time</label>
                            <div class="mt-6 mb-4">
                                <vue-timepicker format="hh:mm A" placeholder="" v-model="catering.end_time" manual-input></vue-timepicker>
                            </div>
                        </div>
                    </v-col>
                     <v-col cols="12" v-if="step==9">
                        <div class="custom-bs w-100 text-centerm-bs pa-4 pt-6"> 
                            <div class="text-center">
                                <label for="" :class="errors.includes('cuisines') ?'error--text':'primary--text'">Preferred Cuisine Type</label>
                                <div class="mt-6 pl-12">
                                    <v-checkbox v-for="(cuisine, index) in cuisineTypes" :key="index"
                                    v-model="catering.cuisines"
                                    class="pt-0 mt-1"
                                    :rules="validateCheckbox"
                                    :value="cuisine.value"
                                    >
                                        <template v-slot:label>
                                            <div class="text-capitalize">{{  cuisine.name  }}</div>
                                        </template>
                                    </v-checkbox>
                                </div>
                            </div>
                        </div>
                    </v-col>
                     <v-col cols="12">
                        <div class="d-flex align-center" :class="step==1?'justify-space-around':'justify-space-between'">
                            <v-btn color="primary" v-if="step>1" large rounded @click="handlePrevious()">previous</v-btn>
                            <v-btn color="primary" v-if="step==8" large rounded @click="handleSubmit()">submit</v-btn>
                            <v-btn color="primary" v-else large rounded @click="handleNext()">next</v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-form>
        </div>
    </div>
</template>
<script>
import {mapGetters} from'vuex'
// import InputAutocomplete from '@/components/form-element/InputAutocomplete';
import DatePicker from '@/components/form-element/InputDatePicker1';
import GoogleAddress from '@/components/form-element/InputGoogleAddress'
import moment from 'moment'
import {ApiService} from '@/core/services/api.service'

// time picker
import VueTimepicker from 'vue2-timepicker'
import 'vue2-timepicker/dist/VueTimepicker.css'
export default {
    props:{
        cuisineTypes:{}
    },
    data() {
        return {
            moment,
            success:false,
            minDate: new Date().toISOString().substr(0, 10),
            defaultValue:'',
            event_date:'',
            errors:["people"],
            rulesRequired: [
                v => !!v || 'Required',
            ],
            rulesRequiredNumber: [
                v => !!v || 'Required',
                v => v>0 || 'Mimimum value must be 1',
            ],
            catering:{
                event_name:'',
                event_type:'',
                people_expected:'',
                budget:'',
                address:'',
                event_date:'',
                start_time:'',
                end_time:'',
                cuisines:[],
            },
            event_types:[
                {name:'Event','value':'event'},
                {name:'Parties','value':'parties'},
                {name:'Neighborhood','value':'neighborhood'},
                {name:'Office','value':'office'},
                {name:'Wedding','value':'wedding'},
                {name:'Schools','value':'schools'},
                {name:'Other','value':'others'},
            ],
            step:1,
        }
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
        }),
        validateCheckbox () {
            return [this.catering.cuisines.length > 0 || "Select at least one!"]
        },
        ruleEventType () {
            return [this.catering.event_type.length > 0 || "Select at least one!"]
        }
    },
    created() {

    },
    mounted() {
      
    },
    methods: {
        handlePrevious(){
            this.step -=1;
        },
        handleNext(){
            switch(this.step){
                case 1:
                    if(!this.catering.event_name){
                        this.errors.push('event_name');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='event_name');
                        this.step+=1;
                    }
                    break;
                case 2:
                    if(!this.catering.event_type){
                        this.errors.push('event_type');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='event_type');
                        this.step+=1;
                    }
                    break;
                case 3:
                    if(!this.catering.people_expected){
                        this.errors.push('people_expected');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='people_expected');
                        this.step+=1;
                    }
                    break;
                case 4:
                    if(!this.catering.budget){
                        this.errors.push('budget');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='budget');
                        this.step+=1;
                    }
                    break;
                case 5:
                    if(!this.catering.address){
                        this.errors.push('address');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='address');
                        this.step+=1;
                    }
                    break;
                case 6:
                    if(!this.catering.event_date){
                        this.errors.push('event_date');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='event_date');
                        this.step+=1;
                    }
                    break;
                case 7:
                    if(!this.catering.start_time){
                        this.errors.push('start_time');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='start_time');
                        this.step+=1;
                    }
                    break;
                case 8:
                    if(!this.catering.end_time){
                        this.errors.push('end_time');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='end_time');
                        this.step+=1;
                    }
                    break;
                case 9:
                    if(!this.catering.cuisines.length){
                        this.errors.push('cuisines');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='cuisines');
                        console.log('submit');
                    }
                    break;
                default:
                    console.log("Invalid step");
                    this.messageError("Invalid step");
            }
            
        },
        dateStart(param) {
            this.catering.event_date = this.formatStandardDate(param.date);
        },
        selectedEventType(param){
            this.catering.event_type = param.selected_data;
        },
        addressSelected(addr) {
            this.catering.address = addr.add1+" "+addr.city+" "+addr.state+" "+addr.zip_code+" "+addr.country_code;
            setTimeout(() => {
                this.defaultValue = this.catering.address;
                console.log(this.catering.address);
            },200);
        },
        handleSubmit(){
            this.errors = [];
            for (const property in this.catering) {
                if(property =='cuisines'){
                    if(!this.catering[property].length){
                        this.errors.push(property);
                    }
                }
                if(!this.catering[property]){
                    this.errors.push(property);
                }
            }
            if(!this.$refs.formCatering.validate()) return;

            this.loaderShow();
            this.catering.type = "catering";
            ApiService.post('/event_request', this.catering)
            .then((resp) =>{
                this.loaderHide();
                this.success = true;
                console.log(resp);
            })
            .catch((error) =>{
                this.loaderHide();
                console.log(error);
            })
            console.log(this.catering);
        }
    },

    components: {
        DatePicker,
        // InputAutocomplete,
        GoogleAddress,
        VueTimepicker,
    }
}
</script>
<style scoped lang="scss">
label{
    font-size: 20px;
    font-weight: 600;
}
.vue__time-picker {
    display: inline-block;
    position: relative;
    font-size: 1em;
    width: 100%;
    font-family: sans-serif;
    vertical-align: middle;
    .input.display-time {
        border: none !important;
        border-bottom: 1px solid #d2d2d2 !important;
        width: 100% !important;
        height: 2.2em !important;
        padding: 0.3em 0.5em !important;
        font-size: 1.2em !important;
        text-align: center !important;
    }
}

</style>