<template>
    <div class="mt-4">
        <div>
        </div>
        <div v-if="success" class="text-center custom-bs pa-8">
            <h4 class="mb-4 primary--text">Thank you!</h4>
            <p>Your request has been successfully submitted</p>
            <v-btn rounded large color="primary" to="/">back to home</v-btn>
        </div>
        <div class="" v-else>
            <h4 class="mb-4">Regular Event Request</h4>
            <v-form ref="formRegularEvent" id="formRegularEvent">
                <v-row>
                    <v-col cols="12" v-if="step==1">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('event_name') ?'error--text':'primary--text'">Event Name</label>
                            <v-text-field class="mt-6 pt-0" :rules="rulesRequired" v-model="event.event_name"></v-text-field>
                        </div>
                    </v-col>
                    <v-col cols="12" v-if="step==2">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('event_payer') ?'error--text':'primary--text'">Who will pay for Event</label>
                            <div class="mt-6">
                                <v-radio-group class="pt-0 mt-6" v-model="event.event_payer">
                                    <v-radio :value="type.value" v-for="(type, t) in event_payers" :key="t">
                                        <template v-slot:label>
                                            <div class="pa-2">{{  type.name  }}</div>
                                        </template>
                                    </v-radio>
                                </v-radio-group>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" v-if="step==3">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('event_frequency') ?'error--text':'primary--text'">Frequency of Truck Services?</label>
                            <div class="pl-4">
                                <v-radio-group class="pt-0 mt-6" v-model="event.event_frequency">
                                    <v-radio :value="type.value" v-for="(type, t) in event_frequency" :key="t">
                                        <template v-slot:label>
                                            <div class="pa-2">{{  type.name  }}</div>
                                        </template>
                                    </v-radio>
                                </v-radio-group>
                            </div>
                        </div>
                    </v-col>
            
                    <v-col cols="12" v-if="step==4">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('event_date') ?'error--text':'primary--text'">Event Date</label>
                            <div class="mt-6">
                                <DatePicker label=""  @selectedDate="eventDateSelected" :minDate="minDate"/>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" v-if="step==5">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('start_time') ?'error--text':'primary--text'">Start Time</label>
                            <div class="mt-6 pb-4">
                                <vue-timepicker format="hh:mm A" placeholder="" v-model="event.start_time" manual-input></vue-timepicker>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" v-if="step==6">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('end_time') ?'error--text':'primary--text'">End Time</label>
                            <div class="mt-6 pb-4">
                                <vue-timepicker format="hh:mm A" placeholder="" v-model="event.end_time" manual-input></vue-timepicker>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" v-if="step==7">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('address') ?'error--text':'primary--text'">Address</label>
                            <div class="mt-6 pb-4">
                                <GoogleAddress 
                                    :defaultValue="defaultValue" 
                                    @selectedAddr="addressSelected"/>
                            </div>
                        </div>
                    </v-col>
                
                    <v-col cols="12" v-if="step==8">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('min_guerantee_sales') ?'error--text':'primary--text'">Minimum sales guerantee</label>
                            <div>
                                <p>If host is not going to pay, are you in a position to guerantee minimum sale of $800-$1000?</p>
                                <v-radio-group class="pt-0 mt-6" v-model="event.min_guerantee_sales" :rules="ruleEventType" row>
                                    <v-radio :value="type.value" v-for="(type, t) in minimum_guerantee" :key="t">
                                        <template v-slot:label>
                                            <div class="pa-2 text-capitalize">{{  type.name  }}</div>
                                        </template>
                                    </v-radio>
                                </v-radio-group>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" v-if="step==9">
                        <div class="custom-bs w-100 text-centerm-bs pa-4 pt-6"> 
                            <div class="text-center">
                                <label for="" :class="errors.includes('cuisines') ?'error--text':'primary--text'">Preferred Cuisine Type</label>
                                <div class="mt-6 pl-12">
                                    <v-checkbox v-for="(cuisine, index) in cuisine_types" :key="index"
                                    v-model="event.cuisines"
                                    class="pt-0 mt-1"
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
                    <v-col cols="12" v-if="step==10">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('additional_details') ?'error--text':'primary--text'">Additional Details</label>
                        <v-textarea class="pt-0 mt-6" v-model="event.additional_details"></v-textarea>
                        </div>
                    </v-col>
                    <v-col cols="12">
                        <div class="d-flex align-center" :class="step==1?'justify-space-around':'justify-space-between'">
                            <v-btn color="primary" v-if="step>1" large rounded @click="handlePrevious()">previous</v-btn>
                            <v-btn color="primary" v-if="step==10" large rounded @click="handleSubmit()">submit</v-btn>
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
import DatePicker from '@/components/form-element/InputDatePicker1';
// import InputAutocomplete from '@/components/form-element/InputAutocomplete';
import GoogleAddress from '@/components/form-element/InputGoogleAddress'
import moment from 'moment'
import {ApiService} from '@/core/services/api.service'
// time picker
import VueTimepicker from 'vue2-timepicker'
import 'vue2-timepicker/dist/VueTimepicker.css'
export default {
    data() {
        return {
            moment,
            success:false,
            minDate: new Date().toISOString().substr(0, 10),
            defaultValue:'',
            event_date:'',
            start_time:'',
            end_time:'',
            errors:["people"],
            rulesRequired: [
                v => !!v || 'Required',
            ],
            rulesRequiredNumber: [
                v => !!v || 'Required',
                v => v>0 || 'Mimimum value must be 1',
            ],
            event:{
                event_name:'',
                event_payer:'',
                event_frequency:'',
                event_date:'',
                start_time:'',
                end_time:'',
                address:'',
                cuisines:[],
                additional_details:'',
                min_guerantee_sales:'',
                type:'regular_event'
            },
            event_frequency:[
                {name:'Once a month','value':'Once a month'},
                {name:'Twice a month','value':'Twice a month'},
                {name:'Weekly','value':'Weekly'},
                {name:'Daily','value':'Daily'},
                {name:'Not sure yet','value':'Not sure yet'}
            ],
            event_payers:[
                {name:'Catered Event, Host will pay customer do not pay themself','value':'Catered Event, Host will pay customer do not pay themself'},
                {name:'Customer will pay themself','value':'Customer will pay themself'},
            ],
            minimum_guerantee:[
                {name:'yes','value':'yes'},
                {name:'no','value':'no'},
                {name:'may be','value':'may be'},
            ],
            step:1,
            cuisine_types:[],
        }
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
        }),

        ruleEventFrequency () {
            return [this.event.event_frequency.length > 0 || "Select at least one!"]
        },
        ruleEventPayer () {
            return [this.event.event_payer.length > 0 || "Select at least one!"]
        },
        
        ruleEventType () {
            return [this.event.min_guerantee_sales.length > 0 || "Select at least one!"]
        }
    },
    created() {

    },
    mounted() {
      this.fetchCuines();
    },
    methods: {
        fetchCuines(){
            ApiService.post("/vendor-lookup-all")
            .then((resp) =>{
                this.cuisine_types = resp.data;
            })
            .catch((error) =>{
                console.log({error});
            })
        },
        handlePrevious(){
            this.step -=1;
        },
        handleNext(){
            switch(this.step){
                case 1:
                    if(!this.event.event_name){
                        this.errors.push('event_name');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='event_name');
                        this.step+=1;
                    }
                    break;
                case 2:
                    if(!this.event.event_payer){
                        this.errors.push('event_payer');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='event_payer');
                        this.step+=1;
                    }
                    break;
                case 3:
                    if(!this.event.event_frequency){
                        this.errors.push('event_frequency');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='event_frequency');
                        this.step+=1;
                    }
                    break;
                case 4:
                    if(!this.event.event_date){
                        this.errors.push('event_date');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='event_date');
                        this.step+=1;
                    }
                    break;
                case 5:
                    if(!this.event.start_time){
                        this.errors.push('start_time');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='start_time');
                        this.step+=1;
                    }
                    break;
                case 6:
                    if(!this.event.end_time){
                        this.errors.push('end_time');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='end_time');
                        this.step+=1;
                    }
                    break;
                case 7:
                    if(!this.event.address){
                        this.errors.push('address');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='address');
                        this.step+=1;
                    }
                    break;
                case 8:
                    if(!this.event.min_guerantee_sales){
                        this.errors.push('min_guerantee_sales');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='min_guerantee_sales');
                        this.step+=1;
                    }
                    break;
                case 9:
                    if(!this.event.cuisines){
                        this.errors.push('cuisines');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='cuisines');
                        this.step+=1;
                    }
                    break;
                case 10:
                    if(!this.event.additional_details){
                        this.errors.push('additional_details');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='additional_details');
                        console.log('submit');
                    }
                    break;
                default:
                    console.log("Invalid step");
                    this.messageError("Invalid step");
            }
            
        },
        selectedEventFrequency(param){
            this.event.event_frequency = param.selected_data;
        },
        eventDateSelected(param) {
            this.event.event_date = this.formatStandardDate(param.date);
        },
        addressSelected(addr) {
            this.event.address = addr.add1+" "+addr.city+" "+addr.state+" "+addr.zip_code+" "+addr.country_code;
            setTimeout(() => {
                this.defaultValue = this.event.address;
                console.log(this.event.address);
            },200);
        },
        handleSubmit(){

            if(!this.$refs.formRegularEvent.validate()) return;

            console.log(this.event);
            this.loaderShow();
            ApiService.post('/event_request', this.event)
            .then((resp) =>{
                this.loaderHide();
                this.success = true;
                console.log(resp);
            })
            .catch((error) =>{
                this.loaderHide();
                console.log(error);
            })

        }
    },

    components: {
        DatePicker,
        GoogleAddress,
        // InputAutocomplete,
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