<template>
    <div class="mt-4">
        <div>
            <h4 class="mb-4">Food Truck Request</h4>
        </div>
        <div v-if="success" class="text-center custom-bs pa-8">
            <h4 class="mb-4 primary--text">Thank you!</h4>
            <p>Your request has been successfully submitted</p>
            <v-btn rounded large color="primary" to="/">back to home</v-btn>
        </div>
        <div class="" v-else>  
            <v-form ref="formEvent" id="formEvent">
                <v-row>
                    <v-col cols="12" v-if="step==1">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('event_name') ?'error--text':'primary--text'">Event Name</label>
                            <v-text-field class="mt-6 pt-0" :rules="rulesRequired" v-model="event.event_name"></v-text-field>
                        </div>
                    </v-col>
                    <v-col cols="12" v-if="step==2">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('event_type') ?'error--text':'primary--text'">Select your event type</label>
                            <div class="mt-6 pl-12">
                                <!-- <InputAutocomplete :items="event_types" @selected="selectedEventType"/> -->
                                <v-radio-group class="pt-0 mt-0" v-model="event.event_type" :rules="ruleEventType">
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
                            <label for="" class="text-center mb-6" :class="errors.includes('people_expected') ?'error--text':'primary--text'">How many Minimum people are you expecting ?</label>
                            <v-text-field class="mt-6 pt-0" min="1" type="number" :rules="rulesRequiredNumber" v-model="event.people_expected"></v-text-field>
                        </div>
                    </v-col>
                    <v-col cols="12" v-if="step==4">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('address') ?'error--text':'primary--text'">Address</label>
                            <div class="mt-6">
                                <GoogleAddress 
                                    :defaultValue="defaultValue" 
                                    @selectedAddr="addressSelected"/>
                            </div>
                        </div>
                    </v-col>
                    <!-- <v-col cols="12" v-if="step==5"> -->
                        <!-- <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('additional_info') ?'error--text':'primary--text'">Additional Details</label>
                           <v-textarea class="pt-0 mt-6" v-model="event.additional_info"></v-textarea>
                        </div> -->
                    <!-- </v-col> -->
                    <v-col cols="12" v-if="step==5">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('event_date') ?'error--text':'primary--text'">Event Date</label>
                            <div class="mt-6">
                                <DatePicker label=""  @selectedDate="eventDateSelected" :minDate="minDate"/>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" v-if="step==6">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('start_time') ?'error--text':'primary--text'">Start Time</label>
                            <div class="mt-6">
                                <vue-timepicker format="hh:mm A" placeholder="" v-model="event.start_time" manual-input></vue-timepicker>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" v-if="step==7">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('end_time') ?'error--text':'primary--text'">End Time</label>
                            <div class="mt-6">
                                <vue-timepicker format="hh:mm A" placeholder="" v-model="event.end_time" manual-input></vue-timepicker>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" v-if="step==8">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('sales_guerantee') ?'error--text':'primary--text'">Minimum sales guerantee</label>
                            <!-- <div class="mt-6">
                                <v-radio-group class="pt-0 mt-0" v-model="event.min_guerantee_sales" :rules="ruleSalesGuerantee">
                                    <v-radio :value="type.value" v-for="(type, t) in sales_guerantee" :key="t">
                                        <template v-slot:label>
                                            <div class="pa-2">{{  type.name  }}</div>
                                        </template>
                                    </v-radio>
                                </v-radio-group>
                            </div> -->
                            <v-checkbox v-model="event.min_guerantee_sales" value="$1000">
                                <template v-slot:label>
                                    <div>I agree $1000 minimum guerantee, if the truck does not make $100, you will need to convert difference</div>
                                </template>
                            </v-checkbox>
                        </div>
                    </v-col>
                    <v-col cols="12" v-if="step==9">
                        <div class="custom-bs pa-4 w-100 text-center pt-6">
                            <label for="" class="text-center mb-6" :class="errors.includes('additional_info') ?'error--text':'primary--text'">Additional Details</label>
                           <v-textarea class="pt-0 mt-6" v-model="event.additional_info"></v-textarea>
                        </div>
                    </v-col>
                    <v-col cols="12" v-if="step==10">
                        <KeepAlive>
                            <div class="custom-bs w-100 text-centerm-bs pa-4 pt-6"> 
                                <div class="text-center">
                                    <label for="" :class="errors.includes('email') ?'error--text':'primary--text'">Email</label>
                                    <div>
                                        <v-text-field v-model="event.email"></v-text-field>
                                    </div>
                                </div>
                            </div>
                        </KeepAlive>
                    </v-col>
                     <v-col cols="12" v-if="step==11">
                        <div class="custom-bs w-100 text-centerm-bs pa-4 pt-6"> 
                            <div class="text-center">
                                <label for="" :class="errors.includes('phone') ?'error--text':'primary--text'">Phone</label>
                                <div>
                                    <v-text-field v-mask="'(###)-###-####'" v-model="event.phone" :rules="rulesRequired"></v-text-field>
                                </div>
                            </div>
                        </div>
                    </v-col>
     
                    <v-col cols="12">
                        <div class="d-flex align-center" :class="step==1?'justify-space-around':'justify-space-between'">
                            <v-btn color="primary" v-if="step>1" large  rounded @click="handlePrevious()">previous</v-btn>
                            <v-btn color="primary" v-if="step==11" large  rounded @click="handleSubmit()">submit</v-btn>
                            <v-btn color="primary" v-else large  rounded @click="handleNext()">next</v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-form>
            <DialogPhoneVerify 
            :resp="resp"
            @close="handleClose()"
            @handleConfirm="handleVerify"
            :dialog_verify_phone="modal_verify_phone"/>
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
            checkbox:'',
            success:false,
            modal_verify_phone:false,
            step:1,
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
                event_type:'',
                people_expected:'',
                address:'',
                additional_info:'',
                event_date:'',
                start_time:'',
                end_time:'',
                email:'',
                phone:'',
                min_guerantee_sales:'',
                type:'event',
            },
            event_types:[
                {name:'Conference','value':'conference'},
                {name:'Expo','value':'expo'},
                {name:'Hospital','value':'hospital'},
                {name:'Neighborhood','value':'neighborhood'},
                {name:'Parties','value':'parties'},
                {name:'Schools','value':'schools'},
                {name:'Office','value':'office'},
            ],
            sales_guerantee:[
                {name:'$700 pre-order sales not meet 48 hours prior to start time, truck may cancel the event','value':'$700'},
                {name:'I agree $1000 minimum guerantee, if the truck does not make $100, you will need to convert difference','value':'$1000'},
            ],
            resp:{},
        }
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
        }),

        ruleEventType () {
            return [this.event.event_type.length > 0 || "Select at least one!"]
        },
        ruleSalesGuerantee () {
            return [this.event.min_guerantee_sales.length > 0 || "Select at least one!"]
        }
    },
 
    mounted() {
        if(this.currentUser){
            this.event.email = this.currentUser.email;
        }
    },
    methods: {
        handleClose(){
            this.modal_verify_phone = false;
        },
        handleVerify(param){
            this.loaderShow();
            ApiService.post('/event_request_verify', {
                "id": this.resp.id,
                "code": param.code,
            })
            .then(() =>{
                this.loaderHide();
                this.success = true;
                this.handleClose();
            })
            .catch((error) =>{
                this.loaderHide();
                this.messageError(error.response.data.error);
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
                    if(!this.event.event_type){
                        this.errors.push('event_type');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='event_type');
                        this.step+=1;
                    }
                    break;
                case 3:
                    if(!this.event.people_expected){
                        this.errors.push('people_expected');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='people_expected');
                        this.step+=1;
                    }
                    break;
                case 4:
                    if(!this.event.address){
                        this.errors.push('address');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='address');
                        this.step+=1;
                    }
                    break;
                // case 5:
                //     if(!this.event.additional_info){
                //         this.errors.push('additional_info');
                //     }else{
                //         this.errors = this.errors.filter((item) => item !=='additional_info');
                //         this.step+=1;
                //     }
                //     break;
                case 5:
                    if(!this.event.event_date){
                        this.errors.push('event_date');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='event_date');
                        this.step+=1;
                    }
                    break;
                case 6:
                    if(!this.event.start_time){
                        this.errors.push('start_time');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='start_time');
                        this.step+=1;
                    }
                    break;
                case 7:
                    if(!this.event.end_time){
                        this.errors.push('end_time');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='end_time');
                        this.step+=1;
                    }
                    break;
                case 8:
                    if(!this.event.min_guerantee_sales){
                        this.errors.push('sales_guerantee');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='sales_guerantee');
                        this.step+=1;
                        console.log('submit');
                    }
                    break;
                case 9:
                    if(!this.event.additional_info){
                        this.errors.push('additional_info');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='additional_info');
                        this.step+=1;
                    }
                    break;
                case 10:
                    if(!this.event.email){
                        this.errors.push('email');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='email');
                         this.step+=1;
                    }
                    break;
                case 11:
                    if(!this.event.phone){
                        this.errors.push('phone');
                    }else{
                        this.errors = this.errors.filter((item) => item !=='phone');
                        console.log('submit');
                    }
                    break;
                default:
                    console.log("Invalid step");
                    this.messageError("Invalid step");
            }
            
        },
        selectedEventType(param){
            this.event.event_type = param.selected_data;
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

            if(!this.$refs.formEvent.validate()) return;
            
            if(!this.event.phone) return;
            
            this.errors = [];
            for (const property in this.event) {
                if(property =='selected_cuisine'){
                    if(!this.event[property].length){
                        this.errors.push(property);
                    }
                }
                if(!this.event[property]){
                    this.errors.push(property);
                }
            }
            if(!this.$refs.formEvent.validate()) return;

            this.loaderShow();
            ApiService.post('/event_request', this.event)
            .then((resp) =>{
                this.loaderHide();
                this.event.id = resp.data.id;
                this.resp = resp.data;
                this.modal_verify_phone = true;
            })
            .catch((error) =>{
                this.loaderHide();
                console.log(error);
            })
            console.log(this.event);

        }
    },

    components: {
        DatePicker,
        GoogleAddress,
        // InputAutocomplete,
        VueTimepicker,
        DialogPhoneVerify: ()=> import('@/views/client/truck_request/ModalVerifyPhone.vue'),
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