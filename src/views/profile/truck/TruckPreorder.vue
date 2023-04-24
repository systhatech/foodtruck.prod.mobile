<template>
    <div>
        <v-row justify="center">
            <v-dialog v-model="dialog_preorder" persistent scrollable fullscreen>
                <v-card style="margin-top: 56px !important;">
                    <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                        <v-toolbar-title class="pl-0 text-capitalize">Menus</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn text @click="handleClose">
                                Close
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-container class="bg-white">
                        <div class="">
                          <div>
                            <div class="pt-6 mt-14">
                                <div v-if="scheduleDate" class="d-flex align-center justify-space-between">
                                    <h4 class="primary--text">You are ordering for</h4>
                                    <InputAddress :minDate="min_date" :maxDate="max_date" @selectedDate="dateSelected"/>
                                </div>
                                <div v-if="truckProfile && truckProfile.menus && truckProfile.menus.length">
                                    <div v-for="(menu,index) in truckProfile.menus" :key="index">
                                        <div v-if="menu && menu.categoryGroup && Object.keys(menu.categoryGroup).length">
                                            <h5 class="pb-0 mb-0 text-uppercase">{{ menu.name }}</h5>
                                            <div>
                                                <div v-for="(groupItem, index) in menu.categoryGroup" :key="index">
                                                    <h4 class="pb-0 mb-0 mt-2 text-capitalize primary--text">{{ index  }}</h4>
                                                    <div cols="6" v-for="(item,i) in groupItem" class="custom-bs pa-3 mb-4" :key="i">
                                                        <div class="d-flex align-center justify-space-between" @click="handleRoute(item)">
                                                            <div class="d-flex align-center"> 
                                                                <v-img
                                                                lazy-src="https://picsum.photos/id/11/10/6"
                                                                max-width="100"
                                                                width="100"
                                                                aspect-ratio="1.7"
                                                                contain
                                                                :src="item.profile_pic? base_url+'/image-show/'+item.profile_pic:'usericon'"
                                                                ></v-img>
                                                                <div class="pl-3 d-flex align-center justify-space-between w-100">
                                                                    <div>
                                                                        <p class="mb-0 text-capitalize primary--text">{{item.name}}</p>
                                                                        <div class="d-flex">
                                                                            <h4 class="ma-0 primary--text">{{ formatAmount(item.price)}}</h4> <span class="" v-if="item.unit">&nbsp;/{{ item.unit }}</span>
                                                                        </div>
                                                                        <p v-if="item.description">{{ shortText(item.description,40) }}</p>
                                                                    </div>
                                                                
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                       
                            </div>
                          </div>
                            <DialogConfirm
                            :dialogConfirm="dialogConfirm"
                            @handleConfirm="handleDelete"
                            @close="handleClose"
                          />

                          <ModalMenu 
                            v-if="scheduleDate"
                            :dialog="modal_menu_item" 
                            :vendorId="vendorId" 
                            :item="item" 
                            :truckProfile="truckProfile"
                            :pickup_date="pickup_date"
                            :pickup_start_date="scheduleDate.start_date"
                            :pickup_end_date="scheduleDate.end_date"
                            :locationId="scheduleDate.id"
                            @close="handleCloseItem"/>   
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
  import { base_url } from '@/core/services/config'
  import { mapGetters, mapActions } from 'vuex'
  import ModalMenu from './menu/ModalMenu'
  export default {
    props: {
        dialog_preorder: {
            required: true,
            type: Boolean,
        },
        truckProfile:{
        },
        scheduleDate:{
            required:true,
        }
    },
    watch: {
          dialog_preorder(newval) {
            let min_date = moment(this.start_date).format('YYYY-MM-DD HH:mm:ss');
            if(min_date > this.scheduleDate.start_date){
                this.min_date = moment(min_date).format('YYYY-MM-DD');
                this.pickup_date = this.min_date;
            }else{
                this.min_date = moment(this.scheduleDate.start_date).format('YYYY-MM-DD');
                this.pickup_date = this.min_date;
            }
            this.vendorId = this.$router.currentRoute.params.truckId;
            if (newval) {
              this.defaultValue = "";
          } else {
                setTimeout(() => {
                    this.defaultValue = "";
                }, 500);
                this.address = {
                    add1:'',
                    city:'',
                    state:'',
                    zip:'',
                    country:'',
                    country_code:'',
                    lat:'',
                    lon:'',
                }
            }
        }
    },
    components: {
      InputAddress:()=>import('@/components/layout/InputDatePicker'),
      DialogConfirm,
      ModalMenu,
    },
    data() {
        return {
            valid:true,
            dialogConfirm:false,
            modal_menu_item:false,
            item:{},
            moment,
            // selectedData:'',
           
            title:'',
            base_url,
            schedules:[],
            requiredRules: [
                v => !!v || 'Required',
            ],
            defaultValue:'',
            address: {
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
            file:{
                file_name:'',
                type:'gallery',
            },
            remove:false,
            maxHeight:300,
            vendorId:null,

            selected_date:'',
            start_date:  new Date(),
            end_date:  new Date(),
            min_date:'',
            max_date:'',
            pickup_date:'',
        }
    },
    mounted() {
      
    },
    methods: {
        ...mapActions({
            fetchProfile:'auth/fetchProfile'
        }),
        dateSelected(param){
            this.pickup_date = moment(param.date,'MM/DD/YYYY').format('YYYY-MM-DD');
        },
        handleRoute(item){
            this.item = item;
            this.$emit('fetchProfile');
            this.modal_menu_item = true;
        },
        handleCloseItem(){
            this.modal_menu_item = false;
        },
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
            this.address = {
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
            }
            this.defaultValue = "";
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
          setTimeout(() => {
              this.defaultValue = addr.add1;
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
          ApiService.post('/vendor/location-create',{
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
  $bg-gray : #f5f5f5;
  
  .qty {
    color: rgb(162 162 162);
    font-size: 0.8rem;
    text-transform: lowercase;
  }
  input#tj-datetime-input {
      /* min-width: 226px; */
      /* width: 100%; */
      /* height: 30px; */
      padding: 6px !important;
      border-bottom: 1px solid #b1b1b1 !important;
  }
  .text-bold {
    font-weight: 500;
    color: #01a6bc;
  }
  
  .testing {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  
    button {
        width: 50%;
    }
  }
  
  .h-100 {
    height: 100% !important;
  }
  
  .address-type {
    text-decoration: underline;
    cursor: pointer;
  }
  
  .box-bg {
    border: 1px solid #f5f5f5;
    padding: 20px;
    // height: 100%;
    position: relative;
    color: #000;
    margin-top: 30px;
  }
  
  .name-address {
    font-weight: 600;
    margin: 0px;
    font-size: 0.9rem;
  }
  
  .sub-text {
    margin: 0px;
    font-size: 0.9rem;
  }
  
  .order-item-wrapper {
    ul.main-items {
        list-style: none;
        padding: 0;
  
        li:not(:last-child) {
            margin-bottom: 16px;
            border-bottom: 1px solid #dadada;
            padding-bottom: 16px;
        }
  
        li {
            .item-description {
                width: 100%;
            }
  
            ul.additional-items {
                list-style: none;
                padding: 0;
  
                li {
                    border: 0;
                    padding: 0;
                    margin: 0;
                }
            }
        }
    }
  }
  
  .menu-name {
    font-size: 0.9rem !important;
    padding: 10px 16px !important;
  }
  
  .card-actions {
    padding: 0 14px 14px 14px !important;
  }
  .custom-input{
      border-bottom: 1px solid #afafaf;
      padding: 4px 0;
      max-width: 100%;
  }
  </style>