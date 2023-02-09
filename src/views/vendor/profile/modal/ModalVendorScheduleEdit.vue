<template>
  <div>
      <v-row justify="center">
          <v-dialog v-model="dialogScheduleEdit" persistent scrollable fullscreen>
              <v-card style="padding-top: 56px !important;">
                  <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                      <v-toolbar-title class="pl-0 text-capitalize">Update Schedule</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-toolbar-items>
                          <v-btn text @click="handleClose">
                              Close
                          </v-btn>
                      </v-toolbar-items>
                  </v-toolbar>
                  <v-container>
                      <div class="background-image">
                        <div>
                          <div class="pa-4 custom-bs pt-6">
    
                            <v-form v-model="valid" ref="formLocation">
                                <v-row>
                                    <v-col
                                        cols="12"
                                        class="pb-0"
                                        md="12"
                                        >
                                        <InputAddress 
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
                                        required
                                    ></v-text-field>
                                    </v-col>
                                    <v-col
                                    cols="6"
                                    sm="6"
                                    class="pb-0 pt-0"
                                    >
                                    <label for="">Start Date</label>
                                    <DatePicker v-model="start_date" mode="dateTime">
                                        <template v-slot="{ inputValue, inputEvents }">
                                            <input
                                            class="custom-input"
                                            :value="inputValue"
                                            v-on="inputEvents"
                                            />
                                        </template>
                                    </DatePicker>
                                    </v-col>
                                    <v-col
                                    cols="6"
                                    sm="6"
                                    class="pb-0 pt-0"
                                    >
                                    <label for="">End Date</label>
                                    <DatePicker v-model="end_date" mode="dateTime">
                                        <template v-slot="{ inputValue, inputEvents }">
                                            <input
                                            class="custom-input"
                                            :value="inputValue"
                                            v-on="inputEvents"
                                            />
                                        </template>
                                    </DatePicker>
                                    </v-col>
                                    <!-- <v-col
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
                                    </v-col> -->
                                    <v-col cols="12" class="text-center">
                                        <div class="pt-4 pb-4">
                                            <v-btn color="primary" block  
                                            rounded 
                                            large
                                            @click="handleSubmit">Submit</v-btn>
                                        </div>
                                    </v-col>
                                
                                </v-row>
                            </v-form>
                                     
                          </div>
                        </div>
                          <DialogConfirm
                          :dialogConfirm="dialogConfirm"
                          @handleConfirm="handleDelete"
                          @close="handleClose"
                        />
                      </div>
                  </v-container>
              </v-card>
          </v-dialog>
      </v-row>
  </div>
</template>
<script>
import moment from 'moment'
import { ApiService } from "@/core/services/api.service";
import DialogConfirm from "@/components/layout/DialogConfirm";
import DatePicker from "v-calendar/lib/components/date-picker.umd";
import { base_url } from '@/core/services/config'
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
      dialogScheduleEdit: {
          required: true,
          type: Boolean,
      },
      location:{
        required: true,
      }
  },
  components: {
    DatePicker,
    InputAddress:()=>import('@/components/form-element/InputGoogleAddress'),
    DialogConfirm,
  },
  data() {
      return {
        valid:true,
            dialogConfirm:false,
            moment,
            start_date:  new Date(),
            end_date:  new Date(),
            title:'',
            base_url,
            schedules:[],
            requiredRules: [
                v => !!v || 'Required',
            ],
            defaultValue:'',
            address: {
                id:'',
                add1:'',
                city:'',
                state:'',
                zip:'',
                country:'',
                country_code:'',
                lat:'',
                lon:'',
            },
            selectedData:'',
      }
  },
  watch:{
    dialogScheduleEdit(newval){
      if(newval){
        this.address.id = this.location.id;
        this.address.add1 = this.location.add1;
        this.address.city = this.location.city;
        this.address.state = this.location.state;
        this.address.zip= this.location.zip;
        this.address.country = this.location.country;
        this.address.country_code = this.location.country_code;
        this.address.lat = this.location.lat;
        this.address.lon = this.location.lon;
        this.start_date = this.location.start_date;
        this.end_date = this.location.end_date;
        setTimeout(() => {
          this.defaultValue = this.address.add1;
        }, 500);
      }
    }
  },
  methods: {
    ...mapActions({
        fetchProfile:'auth/fetchProfile'
    }),
    handleClose() {
        this.$emit('close')
    },
    confirmDelete() {
        this.dialogConfirm = true;
    },
    // async fetchLocation() {
    //   this.loaderShow();
    //   this.locationId = this.$router.currentRoute.params.locationId;
    //   await ApiService.post("/vendor/location/find", {
    //     locationId: this.locationId,
    //   })
    //     .then((resp) => {
    //       this.address = resp.data;
    //       this.address.start_time = moment(
    //         resp.data.start_time,
    //         "YYYY-MM-DD HH:mm:ss"
    //       ).toDate();
    //       this.address.end_time = moment(
    //         resp.data.end_time,
    //         "YYYY-MM-DD HH:mm:ss"
    //       ).toDate();
    //       this.address.start_date = moment(
    //         resp.data.start_date,
    //         "YYYY-MM-DD HH:mm:ss"
    //       ).toDate();
    //       this.address.end_date = moment(
    //         resp.data.end_date,
    //         "YYYY-MM-DD HH:mm:ss"
    //       ).toDate();

    //       this.defaultValue = resp.data.add1;

    //       this.address.add1 = resp.data.add1;
    //       this.address.city = resp.data.city;
    //       this.address.state = resp.data.state;
    //       this.address.zip = resp.data.zip;
    //       this.address.vendor_id = resp.data.vendor_id;

    //       this.loaderHide();
    //     })
    //     .catch(() => {
    //       this.loaderHide();
    //       this.messageError("Failed to update address");
    //     });
    // },
    async handleDelete() {
      this.loaderShow();
      this.locationId = this.$router.currentRoute.params.locationId;
      await ApiService.post("/vendor/location-delete", {
        location_id: this.locationId,
      })
        .then((resp) => {
            this.loaderHide();
            this.messageSuccess(resp.message);
            this.fetchProfile();
        })
        .catch(() => {
          this.loaderHide();
          this.messageError("Failed to update address");
        });
    },
    handleBack() {
      this.$router.back();
    },
    addressSelected(addr) {
        this.address.add1 = addr.add1;
        this.address.city = addr.city;
        this.address.state = addr.state;
        this.address.zip = addr.zip_code;
        this.address.country = addr.country;
        this.address.country_code = addr.country_code;
        this.address.lat = addr.lat;
        this.address.lon = addr.lng;
    
        console.log(this.address);
        setTimeout(() => {
            this.defaultValue = addr.locality;
        }, 200);
    },
    handleSubmit(){
            let valid = this.$refs.formLocation.validate();
            if(!valid){
                this.messageError('Flease fillup form fields');
                return;
            }
            this.loaderShow();
            this.address.vendor_id = this.currentUser.table_id;
            let start_date = moment(this.start_date).format('YYYY-MM-DD HH:mm:ss');
            let end_date = moment(this.end_date).format('YYYY-MM-DD HH:mm:ss');
            ApiService.post('vendor/location-create',{
                ...this.address,
                start_date,
                end_date,
            })
            .then((resp) => {
                this.loaderHide();
                this.messageSuccess(resp.message);
                this.fetchProfile();
                this.handleClose();
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        }
    // handleUpdate() {
    //   let valid = this.$refs.formLocation.validate();
    //   if (!valid) {
    //     this.messsageError("Flease fillup form fields");
    //     return;
    //   }
    //   let selectedDate = moment(this.address.start_date).format("YYYY-MM-DD"),
    //     timeStart = moment(this.address.start_time).format("HH:mm:ss"),
    //     timeEnd = moment(this.address.end_time).format("HH:mm:ss");

    //   this.address.start_date = moment(this.address.start_date).format(
    //     "YYYY-MM-DD HH:mm:ss"
    //   );

    //   this.address.start_time = selectedDate + " " + timeStart;
    //   this.address.end_time = selectedDate + " " + timeEnd;
    //   this.address.vendor_id = this.currentUser.table_id;
    //   this.loaderShow();
    //   ApiService.post("vendor/location-create", this.address)
    //     .then((resp) => {
    //       this.loaderHide();
    //       this.messageSuccess(resp.message);
    //       this.$router.push("/profile-schedule");
    //     })
    //     .catch((error) => {
    //       this.loaderHide();
    //       console.log(error);
    //     });
    // },

  },
  computed: {
      ...mapGetters({
          currentUser: 'auth/user',
      })
  }
}
</script>
<style lang="scss" scoped>
.custom-input{
    border-bottom: 1px solid #afafaf;
    padding: 4px 0;
}
</style>