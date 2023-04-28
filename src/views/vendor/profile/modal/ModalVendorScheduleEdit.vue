<template>
  <div>
      <v-row justify="center">
          <v-dialog v-model="dialogScheduleEdit" persistent scrollable fullscreen>
              <v-card style="margin-top: 56px !important;">
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
                                        md="12">
                                        <div style="height:200px; margin:0 auto;" class="pt-5">
                                            <InputUpload 
                                            :src="base_url+'/image-show/'+ (address.banner ? address.banner :'noimage.png')" 
                                            type="vendor_schedule" 
                                            :max-height="maxHeight"
                                            label="select"
                                            :remove="remove"
                                            @changeImage="changeImage"/>
                                        </div>
                                    </v-col>

                                    <v-col
                                        cols="12"
                                        class="pb-0"
                                        md="12">
                                        <v-text-field label="Location/Event" v-model="address.name"></v-text-field>
                                    </v-col>
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
                                        class="pa-0"
                                    ></v-text-field>
                                    </v-col>
    
                                <v-col
                                    cols="6"
                                    sm="6"
                                    class="pb-0 pt-0 "
                                    >
                                    <v-text-field
                                        v-model="address.zip"
                                        v-mask="'#########'"
                                        label="ZIP"
                                        class="pa-0"
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
                                            :value="moment(inputValue).format('M/D/YY h:mm a')"
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
                                            :value="moment(inputValue).format('M/D/YY h:mm a')"
                                            v-on="inputEvents"
                                            />
                                        </template>
                                    </DatePicker>
                                    </v-col>
                                  
                                    <v-col cols="12" class="text-center">
                                        <div class="pt-4 pb-4">
                                            <v-btn color="primary" block  
                                            rounded 
                                            large
                                            @click="handleSubmit">update</v-btn>
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
import InputUpload from '@/components/form-element/InputUpload'
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
    InputUpload,
  },
  data() {
      return {
        indexValue:0,
        maxHeight:300,
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
            name:'',
            banner:'',
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
        remove:false,
      }
  },
  watch:{
    dialogScheduleEdit(newval){
      if(newval){
        this.address.id = this.location.id;
        this.address.name = this.location.name;
        this.address.banner = this.location.banner;
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
    changeImage(file){
        this.loaderShow();
        let formData = new FormData();
        formData.append("file",file.file);
        ApiService.post('/store-image', formData)
        .then((resp) => {
            this.loaderHide();
            this.address.banner = resp.file_name;
        })
        .catch(() => {
            this.messageError("Failed ! choose image less than size 2mb");
            this.loaderHide();
        });
    },
    handleClose() {
        this.$emit('close')
    },
    confirmDelete() {
        this.dialogConfirm = true;
    },
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
    max-width: 100%;
}
</style>