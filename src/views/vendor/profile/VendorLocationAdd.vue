<template>
     <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mg56">
           <div class="pa-4 custom-bs">
                <v-form v-model="valid" ref="formLocation">
                    <v-row>
                        <v-col
                            cols="12"
                            class="pb-0"
                            md="12"
                            >
                            <GoogleAddress 
                                :defaultValue="defaultValue" 
                                @selectedAddr="addressSelected"/>
                        </v-col>
                        <v-col
                        cols="12"
                        >
                        <v-text-field
                            v-model="address.city"
                            :rules="requiredRules"
                            label="City"
                            required
                        ></v-text-field>
                        </v-col>
                       
                        <v-col
                        cols="6"
                        class="pb-0 pt-0"
                        >
                        <v-text-field
                            v-model="address.state"
                            :rules="requiredRules"
                            label="State"
                            required
                        ></v-text-field>
                        </v-col>

                       <v-col
                        cols="6"
                        sm="6"
                        class="pb-0 pt-0"
                        >
                        <v-text-field
                            v-model="address.zip"
                            v-mask="'#########'"
                            label="ZIP"
                            :rules="requiredRules"
                            required
                        ></v-text-field>
                        </v-col>
                       <v-col
                        cols="6"
                        sm="6"
                        class="pb-0 pt-0"
                        >
                        <v-text-field
                            v-model="address.country"
                            label="Country"
                            :rules="requiredRules"
                            required
                        ></v-text-field>
                        </v-col>
                       <v-col
                        cols="6"
                        sm="6"
                        class="pb-0 pt-0"
                        >
                        <v-text-field
                            v-model="address.country_code"
                            label="Country Code"
                        ></v-text-field>
                        </v-col>
                        <v-col
                        cols="12"
                        sm="12"
                        >
                        <div>
                            <p class="ma-0 cl">Date</p>
                            <DatePicker v-model="start_date" mode="date">
                                <template v-slot="{ inputValue, inputEvents }">
                                    <input
                                    class="custom-input"
                                    :value="inputValue"
                                    v-on="inputEvents"
                                    />
                                </template>
                            </DatePicker>
                        </div>
                        </v-col>
                        <v-col
                        cols="12"
                        sm="12"
                        >
                        <div>
                            <p class="ma-0 cl">Start Time</p>
                            <DatePicker v-model="start_time" mode="time">
                                <template v-slot="{ inputValue, inputEvents }">
                                    <input
                                    class="custom-input"
                                    :value="inputValue"
                                    v-on="inputEvents"
                                    />
                                </template>
                            </DatePicker>
                        </div>
                        </v-col>
                        <v-col
                        cols="12"
                        sm="12"
                        >
                        <div>
                            <p class="ma-0 cl">End Time</p>
                            <DatePicker v-model="end_time" mode="time">
                                <template v-slot="{ inputValue, inputEvents }">
                                    <input
                                    class="custom-input"
                                    :value="inputValue"
                                    v-on="inputEvents"
                                    />
                                </template>
                            </DatePicker>
                        </div>
                        </v-col>
                        <v-col cols="12" class="text-center">
                            <v-btn color="primary" block  
                            rounded 
                            @click="handleSubmit">Submit</v-btn>
                        </v-col>
                      
                    </v-row>
                </v-form>
           </div>
        </v-container>
         <Bottomnavbar value="0"/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
// import InputAddress from '@/components/form-element/InputAddress'
import GoogleAddress from '@/components/form-element/InputGoogleAddress'
import { ApiService } from '@/core/services/api.service'
import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
import { base_url } from '@/core/services/config'
import DatePicker from 'v-calendar/lib/components/date-picker.umd'
import moment from 'moment'
// import InputUpload from '@/components/form-element/InputUpload'
import { mapActions, mapGetters } from 'vuex'
export default {
    name:'EditProfile',
    data() {
        return {
            valid:true,
            start_date: new Date(),
            start_time: new Date(),
            end_time: new Date(),
            moment,
            title:'',
            base_url,
            schedules:[],
            requiredRules: [
                v => !!v || 'Required',
            ],
            defaultValue:'',
            address: {
                name:'',
                add1:'',
                city:'',
                state:'',
                zip:'',
                country:'',
                country_code:'',
                lat:'',
                lng:'',
                start_date:'',
                end_date:'',
                vendor_id:'',
            },
            selectedData:'',
        }
    },
    watch: {
        start_time(val) {
            console.log(val);
        },
        end_time(val) {
            console.log(val);
        }
    },
    methods: {
        ...mapActions({
            fetchProfile:'auth/fetchProfile'
        }),
        handleBack(){
            this.$router.back();
        },
        addressSelected(addr) {
            this.address.add1 = addr.add1;
            this.address.city = addr.city;
            this.address.state = addr.state;
            this.address.lat = addr.lat;
            this.address.lng = addr.lng;
            this.address.zip = addr.zip_code;
            this.address.country = addr.country;
            this.address.country_code = addr.country_code;
            setTimeout(() => {
                this.defaultValue = addr.add1;
            },200);
        },
        handleSubmit(){
            let valid = this.$refs.formLocation.validate();
            if(!valid){
                this.messageError('Flease fillup form fields');
                return;
            }
            this.$bus.$emit('SHOW_PAGE_LOADER');
            let selectedDate = moment(this.start_date).format('YYYY-MM-DD'),
            timeStart = moment(this.start_time).format('HH:mm:ss'),
            timeEnd = moment(this.end_time).format('HH:mm:ss');

            this.address.start_date = moment(this.start_date).format('YYYY-MM-DD HH:mm:ss');
            this.address.start_time = selectedDate+ " "+timeStart; 
            this.address.end_time = selectedDate+ " "+ timeEnd; 
            this.address.vendor_id = this.currentUser.table_id;
            ApiService.post('vendor/location-create',this.address)
            .then((resp) => {
                this.loaderHide();
                this.messageSuccess(resp.message);
                this.fetchProfile();
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        }
    },
    components: {
        Topnavbar,
        DatePicker,
        Bottomnavbar,
        GoogleAddress
        // InputUpload
    },

    computed: {
        ...mapGetters({
            currentUser:'auth/user',
        })
    }
}
</script>
<style lang="scss" scoped>
.cl{
    color: #828282;
    font-size: 0.9rem;
    padding-bottom: 10px;
}
.custom-input{
    border: 1px solid #dadada;
    padding: 10px 12px;
}
.schedule {
    text-align: center;
    padding: 10px;
    color: #b5b5b5;
    background: #fff;
    height: 180px;
    border-radius: 20px;
    align-items: center;
    justify-content: space-around;
    display: flex;
}
.schedule-wrapper{
    background: #ffffff;
    border-radius:10px;
    padding:10px;
    margin-bottom: 70px;
}
.schedulte-item-wrapper{
    padding:10px;
    // border:1px solid #dadada;
    margin-bottom: 14px;
    border-radius:10px;
    -webkit-box-shadow: 3px 5px 28px -7px rgba(184,184,184,0.52);
    -moz-box-shadow: 3px 5px 28px -7px rgba(184,184,184,0.52);
    box-shadow: 3px 5px 28px -7px rgba(184,184,184,0.52);
}
.form-container{
    // .login-container{
    // background: #acfa95;
    border-radius: 10px;
    // margin-top: 27px !important;
    padding:20px;
// }
}
</style>