<template>
    <v-container class="ma-0 pa-0 background-image h-100">
        <Topnavbar :title="title" @back="handleBack"/>
        <div class="mb80">
            <div v-if="render">
                <v-container class="pa-0">
                    <div class="pa-4">
                        <div class="d-flex justify-space-between">
                            <div class="w-100  pa-4 custom-bs">
                                <div class="pt-4">
                                  
                                    <img
                                        :src="truckProfile && truckProfile.general && truckProfile.general.profile_pic ? base_url+'/image-show/'+(truckProfile.general.profile_pic !='null'?truckProfile.general.profile_pic:'default.jpg'):base_url+'/image-show/default.jpg'"
                                        alt="Profile Pic"
                                        height="100"
                                        >
                                </div>
                                <div class="">
                                    <h3 class="text-capitalize ma-0 primary--text">{{ truck.name}}</h3>
                                    <div class="rating-wrapper mb-2">
                                        <div class="d-flex align-center">
                                            <v-rating
                                                small
                                                readonly
                                                :value="truckProfile.review"
                                                bg-color="orange-lighten-1"
                                                color="success"
                                            ></v-rating>
                                            <div class="pt-1 pl-1">
                                                <pre>({{ truckProfile.review }})</pre>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="pb-4 d-flex">
                                        <div>
                                            <v-icon color="error">mdi-map-marker-radius</v-icon>
                                        </div>
                                        <div class="pl-1">

                                            <p class="mb-1" v-if="truckProfile && truckProfile.active_location">
                                                {{  truckProfile && truckProfile.active_location && truckProfile.active_location.add1 ? truckProfile.active_location.add1:'' }}
                                                {{  truckProfile && truckProfile.active_location && truckProfile.active_location.city ? truckProfile.active_location.city:'' }}<br>
                                                {{ truckProfile && truckProfile.active_location && truckProfile.active_location.state ? truckProfile.active_location.state:'' }} 
                                                {{  truckProfile && truckProfile.active_location && truckProfile.active_location.zip_code ? truckProfile.active_location.zip_code:'' }}
                                            </p>
                                            <p class="mb-1" v-else-if="truckProfile && truckProfile.address">
                                                {{  truckProfile && truckProfile.address && truckProfile.address.add1 ? truckProfile.address.add1:'' }},
                                                {{  truckProfile && truckProfile.address && truckProfile.address.city ? truckProfile.address.city:'' }},<br>
                                                {{ truckProfile && truckProfile.address && truckProfile.address.state ? truckProfile.address.state:'' }} 
                                                {{  truckProfile && truckProfile.address && truckProfile.address.zip ? truckProfile.address.zip:'' }},
                                            </p>
                                            <p v-else>Address Not available</p>
                                        </div>
                                    </div>
                                    <div class="pb-4 d-flex"  v-if="truckProfile && truckProfile.contact && truckProfile.contact.mobile_no">
                                        <div>
                                            <v-icon color="error">mdi-phone</v-icon>
                                        </div>
                                        <div class="pl-1">

                                            <p class="mb-2" v-if="truckProfile && truckProfile.active_location">
                                             {{ truckProfile.contact.mobile_no ? formatPhoneNumber(truckProfile.contact.mobile_no) : formatPhoneNumber(truckProfile.contact.phone_no) }}
                                            </p>
                                        
                                        </div>
                                    </div>
                                    <div class="w-100">
                                        <!-- <v-btn
                                        v-if="truckProfile && truckProfile.contact && truckProfile.contact.mobile_no"
                                        class="mr-3"
                                        fab
                                        color="primary"
                                        :href="`tel:${truckProfile.contact.mobile_no ? truckProfile.contact.mobile_no : truckProfile.contact.phone_no}`"
                                        >
                                        <v-icon large>mdi-phone</v-icon>
                                        </v-btn> -->
                                        <v-btn
                                        large
                                        block rounded
                                        link
                                        
                                        @click="handleChat(truck)"
                                        color="primary"
                                        >
                                        send message
                                        </v-btn>
                                    </div>
                                </div>
                            </div>
                            <div>
                            </div>
                        </div>
                    </div>
                    <div class="form-container">
                        <div class="menu-list">
                            <ul>
                                <li @click="changeItem(index)" 
                                    :class="activeItem==index?'primary--text':''" 
                                    v-for="(item,index) in menuitems" 
                                    :key="index">{{ item.name }}
                                </li>
                            </ul>
                        </div>
                        <div>
                            <component 
                            v-if="truckProfile && Object.keys(truckProfile).length"
                            :is="activeComponent" 
                            :truck="truck"
                            @fetchProfile="profileData"
                            @changeComponent="changeComponent"
                            :truck-profile="truckProfile"></component>
                        </div>
                        <!-- <div class="pt-4" v-if="activeComponent == 'review'">
                            <p>Coming soon</p>
                        </div> -->
                    </div>
                </v-container>
            </div>
            <div v-else class="unavailable">
                <ComponentLoadingVue/>
            </div>
        </div>
         <Bottomnavbar/>
    </v-container>
</template>
<script>
import { base_url } from '@/core/services/config'
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
import Bottomnavbar from '@/components/layout/NavbarBottomClient'
import Carousel from '@/components/layout/ComponentCarousel'
import Banner from '@/components/layout/ComponentBanner'
import TruckReview from './TruckReviews';
import TruckAbout from './TruckAbout';
import TruckLocation from './TruckLocation';
import TruckGallery from './TruckGallery';
import TruckMenu from './TruckMenuOnly.vue';
import TruckSchedules from './TruckSchedules';
// import InputUpload from '@/components/form-element/InputUpload'
// import ModalMenu from './menu/ModalMenu'
import { mapGetters } from 'vuex'
export default {
    name:'VendorProfile',
    data() {
        return {
            dialog:false,
            base_url,
            title:'',
            valid:true,
            bannerImage: 'noimage.png',
            maxHeight:100,
            render:false,
            available:true,
            truck: {
                name:'',
                description:'',
                profile_pic:'',
                type:'',
                id:'',
            },
            file_name:'',
            ruleRequired: [
                v => !!v || 'Required',
            ],
            rulesEmail: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid',
            ],
            update_input_file:true,
            src:'',
            items: [
            ],
            menuitems:[
                {name:'menu',component:'menus'},
                {name:'Schedules',component:'location'},
                {name:'Gallery',component:'gallery'},
                {name:'Review',component:'review'},
                // {name:'about',component:'about'},
            ],
            activeItem:0,
            activeComponent:'menus',
            truckId:'',
            truckProfile:{},
            orderDate:'',
            item:{},
            conversation_id:null,
        }
    },
    mounted() {
        this.truckId = this.$router.currentRoute.params.truckId;
        this.profileData();
        this.$bus.$on('changeComponent', (data) => {
            this.orderDate = data.date;
            this.activeComponent = data.component;
            this.activeItem = 0;
        })

        if(this.$router.currentRoute.query && Object.keys(this.$router.currentRoute.query).length){
            this.activeComponent = this.$router.currentRoute.query.cmp;
            this.menuitems.forEach((element, i) => {
                if(element.component == this.activeComponent){
                    this.activeItem = i;
                }
            });
        }
    },
    methods: {
        handleChat(truck){
            if(this.currentUser && Object.keys(this.currentUser).length){
                this.$router.push(`/client/conversation/vendors/${truck.id}/${this.conversation_id}`)
            }else{
                this.$router.push({
                    name:'loginPage'
                });
            }
        },
        handleClose(){
            this.dialog = false;
        },
        changeComponent(abc){
            console.log({abc});
        },
        changeItem(index) {
            this.activeItem  = index;
            this.activeComponent = this.menuitems[index].component;
        },
        handleBack(){
            this.$router.back();
        },
        changeImage(file){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            let formData = new FormData();
            formData.append("file",file.file);
            ApiService.post('/store-image', formData)
            .then((resp) => {
                 this.$bus.$emit('HIDE_PAGE_LOADER');
                 this.truck.profile_pic = resp.file_name;
                 this.hasFile = true;
            })
            .catch(() => {
                this.messageError("Failed ! choose image less than size 2mb");
                this.$bus.$emit('HIDE_PAGE_LOADER');
            });
        },
        async profileData() {
            // this.loaderShow();
            await ApiService.post('/truck/profile/'+ this.truckId)
            .then((resp) => {
                this.conversation_id = resp.conversation_id;
                this.render = true;
                this.truckProfile = resp;
                this.truck.id = resp.general.id;
                this.truck.name = resp.general.name;
                this.truck.profile_pic = resp.general.profile_pic;
                let desc =  document.createElement("div")
                desc.innerHTML = resp.general.description;
                this.truck.description = desc.textContent;
                this.truck.type = resp.others.truck_type;
                if(Object.keys(resp.attachments).length){
                    if(resp.attachments.slider && resp.attachments.slider.length){
                        resp.attachments.slider.forEach((item) => {
                            this.items.push({src: this.base_url+'/image-show/'+item.file_name});
                        });
                    }else if(resp.attachments.thumbnail && resp.attachments.thumbnail.length){
                        this.bannerImage = this.base_url+'/image-show/'+resp.attachments.thumbnail[0].file_name;
                    }
                }
                this.loaderHide();
            })
            .catch(() => {
                this.loaderHide();
            })
        },
        async updateGeneral(){

            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/self/profile/general', this.truck)
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageSuccess(resp.message);
                this.profileData();
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError('Failed to update profile');
            })
        }
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        Carousel,
        Banner,
        'about': TruckAbout,
        'review': TruckReview,
        'menus': TruckMenu,
        'location': TruckLocation,
        'gallery': TruckGallery,
        'schedule': TruckSchedules,
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
        })
    }
}
</script>
<style lang="scss" scoped>
.item-wrapper{
    &:not(:last-child) {
        border-bottom:1px solid #dadada;
    }
    .abc{
        padding:16px 0;
    }
}
.menu-list{
    // background:#dadada;
    ul{
        list-style: none;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom:2px solid;
        margin-bottom: -2px;
        // padding-bottom:10px;
        li{
            text-transform: capitalize;
            font-weight: 600;
            font-size:0.9rem;
            padding:14px;
            border-bottom: 2px solid;
            margin-bottom: -2px;
            // &:not(:last-child){
                // margin-right: 40px;
            // }
        }
    }
}
.form-container{
    // .login-container{
    // background: #acfa95;
    // border-radiu: 10px;
    margin-bottom: 54px !important;
    padding:20px;
    min-height: 330px;
// }
}
</style>