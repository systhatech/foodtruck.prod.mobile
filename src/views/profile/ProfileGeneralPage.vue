<template>
    <v-container class="ma-0 pa-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <div class="mb50">
            <div class="pa-8 color-white">
                <p class="pa-0 ma-0" style="font-weight: 300;font-size: 1.3rem;">My</p>
                <p class="pa-0 ma-0" style="font-size: 1.3rem;font-weight: 500;">Profile</p>
            </div>
             <v-card class="profile-top-wrapper">
                <v-avatar size="60" tile class="avatar-container">
                <img
                    :src="currentUser.profile_pic? base_url+'/image-show/'+currentUser.profile_pic:usericon"
                    alt="Profile Pic"
                    >
                </v-avatar>
                <div class="mt-1 ml-3" v-if="currentUser.table == 'clients'">
                    <div class="edit-absolute">
                         <v-btn link to="/profile-update" x-small text tile color="secondary">edit</v-btn>
                    </div>
                    <h3 class="">{{ general ? general.name : '' }}</h3>
                    <p class="f8-bold">{{ currentUser.phone_no}}</p>
                </div>
                <div class="mt-1 ml-3" v-if="currentUser.table == 'vendors'">
                    <div class="edit-absolute">
                         <v-btn link to="/profile-update" x-small text tile color="secondary">edit</v-btn>
                    </div>
                    <h3 class="">{{ general ? general.name : '' }}</h3>
                    <p class="f8-bold">{{ general.vendor }}</p>
                </div>
                <div class="profile-list" v-if="currentUser.table == 'vendors'">
                    <div v-for="(item,index) in itemVendor" :key="index" @click="changeIndexVendor(index)">
                        <p :class="index== activeItemIndex ? 'activeItem':''">{{ item.name }}</p>
                    </div>
                </div>
                <div class="profile-list" v-if="currentUser.table == 'clients'">
                    <div v-for="(item,index) in itemClient" :key="index" @click="changeIndexClient(index)">
                        <p :class="index== activeItemIndex ? 'activeItem':''">{{ item.name }}</p>
                    </div>
                </div>
            </v-card>
            <div class="custom-card pa-7" >
                <div v-if="activeComponent =='general'">
                     <div class="mb-4 mt-4" v-if="currentUser.table == 'vendors'">
                        <div class="d-flex align-center justify-space-between">
                            <h5><v-icon color="secondary">{{ iconAccount }}</v-icon>Contact Person</h5>
                            <v-btn link to="/profile-update" x-small text tile color="secondary">edit</v-btn>
                        </div>
                        <p>{{ contact.fname }} {{ contact.lname}}</p>
                        <v-divider></v-divider>
                    </div>
                    <div class="mb-4 mt-4">
                        <div class="d-flex align-center justify-space-between">
                            <h5><v-icon color="secondary">{{ iconAddress }}</v-icon>Address</h5>
                            <v-btn x-small text tile color="secondary">edit</v-btn>
                        </div>
                        <p>{{ address.add1 }} {{ address.city}} {{ address.state}} {{ address.zip}}</p>
                    </div>
                    <v-divider></v-divider>
                    <div class="mb-4 mt-4">
                        <div class="d-flex align-center justify-space-between">
                            <h5><v-icon color="secondary">{{ iconPhone }}</v-icon>Mobile</h5>
                            <v-btn link to="/profile-update" x-small text tile color="secondary">edit</v-btn>
                        </div>
                        <p>{{ contact ? contact.phone_no :'unavailable'}}</p>
                    </div>
                    <v-divider></v-divider>
                    <div class="mt-4">
                        <h5><v-icon>{{ iconEmail }}</v-icon>Email</h5>
                        <p>{{ contact ? contact.email :'unavailable'}}</p>
                    </div>
                </div>
                <div v-if="activeComponent=='attachments'">
                    Unavailable
                </div>
                <div v-if="activeComponent=='schedule'">
                        <div
                            class="schedulte-item-wrapper"
                            v-for="(item, index) in schedules"
                            :key="index"
                                >
                                <div class="text-capitalize d-flex aling-center justify-space-between">
                                    <h5 class="pa-0 ma-0">{{ item.day }}</h5>
                                    <v-switch
                                        class="pa-0 ma-0"
                                        v-model="item.is_open"
                                        @change="handleBlur()"
                                        flat
                                    ></v-switch>
                                </div>
                                <div>
                                    <div class="d-flex justify-space-between align-center">
                                        <input type="time" @blur="handleBlur" v-model="item.open"  :disabled="!item.is_open"/> <span> - </span>
                                        <input type="time" @blur="handleBlur" v-model="item.close"  :disabled="!item.is_open"/>
                                    </div>
                                </div>
                                <!-- <td class="text-right align-center"><v-btn small tile color="primary" @click="handleUpdate(index, item)">Update</v-btn></td> -->
                            </div>
                        <!-- </tbody>
                        </template>
                    </v-simple-table> -->
                </div>
                <div v-if="activeComponent=='other'">
                    <div class="mb-8" v-if="currentUser.table=='vendors'">
                        <h5><v-icon>{{ iconTruck }}</v-icon>Truck Type</h5>
                        <p>{{ others.truck_type ? others.truck_type :'Unavailable' }}</p>
                    </div>
                    <div class="mb-8" v-if="currentUser.table=='vendors'">
                        <h5><v-icon>{{ iconTruck }}</v-icon>Subscription</h5>
                        <v-btn class="mt-3" link to="/subscriptions" small rounded outlined color="secondary">Subscribe Now</v-btn>
                        <!-- <p>{{ others.truck_type ? others.truck_type :'Unavailable' }}</p> -->
                    </div>
                    <div class="mb-8" v-else>
                        Unavailable
                    </div>
                </div>
            </div>
        </div>
        <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import Bottomnavbar from '@/components/layout/NavbarBottom'
import { mapGetters } from 'vuex';
import  JwtService from '@/core/services/jwt.service';
import { base_url } from '@/core/services/config'
import  { ApiService } from '@/core/services/api.service';
import { mdiChevronRight, mdiMapMarker, mdiPhone, mdiEmail, mdiAccount, mdiDumpTruck } from '@mdi/js'
export default {
    name:'InspectionPage',
    data() {
        return {
            base_url,
            title:'',
            iconAddress: mdiMapMarker,
            iconTruck: mdiDumpTruck,

            iconPhone: mdiPhone,
            iconEmail: mdiEmail,
            iconAccount: mdiAccount,
            iconNavigate: mdiChevronRight,
            indexValue:3,
            usericon:'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png',
            menusClient: [
                {name:'Update Profile',icon:'mdi-account-reactivate',route:'profile-update'},
                {name:'Terms & Conditions',icon:'mdi-shield-key',route:'terms-condition'},
                {name:'About Us',icon:'mdi-clipboard-list',route:'about-us'},
                {name:'Logout',icon:'mdi-logout',route:'logout'},
             ],
            menusVendor: [
                {name:'General',icon:'mdi-truck-check',route:'profile-truck'},
                {name:'Contact',icon:'mdi-account-reactivate',route:'profile-update'},
                {name:'Address',icon:'mdi-account-reactivate',route:'profile-update'},
                // {name:'Files',icon:'mdi-gallery',route:'file-upload'},
                {name:'Working Hours',icon:'mdi-account-reactivate',route:'profile-update'},
                {name:'Other',icon:'mdi-account-reactivate',route:'profile-update'},
                {name:'Subscription',icon:'mdi-map-marker',route:'subscriptions'},
                {name:'Terms & Conditions',icon:'mdi-shield-key',route:'terms-condition'},
                {name:'About Us',icon:'mdi-clipboard-list',route:'about-us'},
                {name:'Logout',icon:'mdi-logout',route:'logout'},
             ],
            utype:'',
            itemVendor:[
                {name:'General', type:'general'},
                {name:'schedule', type:'schedule'},
                {name:'Other', type:'other'},
            ],
            itemClient:[
                {name:'General', type:'general'},
                {name:'Attachments', type:'attachments'},
            ],
            activeItemIndex:0,
            activeComponent:'general',
            schedules: [],
            general: [],
            others: [],
            contact: [],
            address: [],
            attachments: [],
        }
    },
    mounted() {
       this.utype = JwtService.getUtype();
       this.fetProfileData();
    },
    components: {
        Topnavbar,
        Bottomnavbar
    },
    methods: {
        fetProfileData() {
            ApiService.post('self/profile')
            .then((resp) => {
                this.schedules = resp.working_hours;
                this.general = resp.general;
                this.address = resp.address;
                this.contact = resp.contact;
                this.others = resp.others;
            })
            .catch(() => {
                // console.log(error);
            })
        },
        changeIndexClient(index){
            this.activeItemIndex = index;
            this.activeComponent = this.itemClient[index].type;
        },
        changeIndexVendor(index){
            this.activeItemIndex = index;
            this.activeComponent = this.itemVendor[index].type;
        },
        handleBack() {
            this.$router.back();
        },
        navigatePage(route) {
            this.$router.push('/'+route);
        },
        handleBlur(){

        },
        handleUpdate(index, schedule){
            console.log(index,schedule);
            // axios.post('vendor/schedule-update', schedule)
            // .then((resp) => {
            //     this.$vToastify.success(resp.message);
            // })
            // .catch((error) => { 
            //     console.log({error});
            // })
        }
    },
    computed: {
          ...mapGetters({
            currentUser:'auth/user',
        })
    }
}
</script>
<style lang="scss" scoped>
.edit-absolute{
    position: absolute;
    right: 10px;
    top: 10px;
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
.avatar-container {
    height: 60px;
    min-width: 60px;
    width: 60px;
    margin-top: -50px;
    
}
.profile-list {
    border-top:1px solid #dadada;
    padding:20px;
    display:flex;
    align-items:center;
    justify-content: space-between;
    text-transform: capitalize;
    P{
        font-size:0.9rem;
        font-weight: 500;
        color:#acacac;
        text-transform: capitalize;
        padding:0;
        margin:0;
    }
    .activeItem{
        color:rgb(172, 0, 0);
        font-weight: 500;
    }
    // ul{
    //     list-style: none;
    //     display:flex;
    //     align-items:center;
    //     justify-content: space-between;
    //     padding:0;
    //     margin:0;
    //     li{
    //         font-size:0.8rem;
    //         font-weight: 500;
    //         color:#acacac;
    //         text-transform: capitalize;
    //     }
    // }
}
.profile-top-wrapper{
    text-align:center;
    border-radius:8px;
    // display:flex;
    // align-center:center;
    // padding:10px 0;
    background:#fff;
    margin:0px 30px;
    z-index: 1;
    -webkit-box-shadow: 0px 8px 21px -8px rgba(184,184,184,0.61) !important;
    -moz-box-shadow: 0px 8px 21px -8px rgba(184,184,184,0.61) !important;
    box-shadow: 0px 8px 21px -8px rgba(184,184,184,0.61) !important;
}
.custom-card{
    background: #fff;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    margin-top: -100px;
    padding-top: 136px !important;
    height: 100%;
    min-height: 400px;
    span,
    h5{
        color:#b21110;
    }
    p{
        padding-left:20px;
        font-size:0.9rem;
        font-weight: 600;
    }
}
.mb50{
    margin-bottom: 50px;
}
.name-wrapper{
    align-items: unset;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.setting-list{
    ul{
        list-style: none;
        // margin-top:25px;
        padding:0;
        li{
            // background: #fff;
            // color:#fff;
            padding: 20px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0;
            &:not(:last-child) {
                border-bottom:1px solid #d2d5d4
            }
            span{
                font-size: 0.9rem;
                font-weight: 400;
            }
        }
    }
}
</style>