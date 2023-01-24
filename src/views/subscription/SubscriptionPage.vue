<template>
     <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mg56">
            <div v-if="render">
                <div class="pa-4 custom-bs">
                    <h3 class="mb-2">Subscription</h3>
                    <div v-if="paymentData && Object.keys(paymentData).length">
                        <div class="pt-4 pb-4">
                            <h4 class="mb-2 mr-3 text-capitalize">{{ currentUser.fname}} {{ currentUser.lname}}</h4> 
                            <div class="d-flex align-center">
                            <p class="mb-0 mr-3 f9">{{  paymentData.product.name }}</p>
                            <v-chip class="text-capitalize"  small :color="paymentData.status =='active'?'success':'error'">{{ paymentData.status}}</v-chip>
                            </div>
                        </div>
                        <v-divider></v-divider>
                        <div class="d-flex justify-space-between pt-4 pb-4">
                            <div>
                                <p class="f8 ma-0">Started</p>
                                <p class="f8-bold ma-0">{{ moment.unix(paymentData.plan.created).format('MM/DD/YYYY') }}</p>
                            </div>
                            <div>
                                <p class="f8 ma-0">Next Invoice</p>
                                <p class="f8-bold ma-0">{{  formatAmount(paymentData.plan.amount / 100) }} on {{ moment.unix(paymentData.current_period_end).format('MM/DD/YYYY') }}</p>
                            </div>
                        </div>
                        
                        <v-divider></v-divider>
                        <div class="pt-4 pb-4">
                            <h4>Subscription Detail</h4>
                            <div>
                                <table>
                                    <tr>
                                        <td class="f8 pb-3">Customer</td>
                                        <td class="f8-bold pl-4 pb-3 text-capitalize">{{ currentUser.fname}} {{ currentUser.lname}}</td>
                                    </tr>
                                    <tr>
                                        <td class="f8 pb-3">Created</td>
                                        <td class="f8-bold pl-4 pb-3">{{ moment.unix(paymentData.plan.created).format('MM/DD/YYYY') }}</td>
                                    </tr>
                                    <tr>
                                        <td class="f8 pb-3">Current Period</td>
                                        <td class="f8-bold pl-4 pb-3">{{ moment.unix(paymentData.created).format('MM/DD/YYYY') }} 
                                            to {{ moment.unix(paymentData.current_period_end).format('MM/DD/YYYY') }} </td>
                                    </tr>
                                    <tr>
                                        <td class="f8 pb-3">Type</td>
                                        <td class="f8-bold pl-4 pb-3">{{ paymentData.product.name }}</td>
                                    </tr>
                                    <tr>
                                        <td class="f8 pb-3">Price</td>
                                        <td class="f8-bold pl-4 pb-3">{{formatAmount(paymentData.product.price)}}/{{ paymentData.plan.interval }}</td>
                                    </tr>
                                    <tr>
                                        <td class="f8 pb-3">Convenience Fee</td>
                                        <td class="f8-bold pl-4 pb-3">{{formatAmount(paymentData.product.convenience_fee)}}</td>
                                    </tr>
                                    <tr>
                                        <td class="f8 pb-3">Total</td>
                                        <td class="f8-bold pl-4 pb-3">{{formatAmount(paymentData.product.total_cost ? paymentData.product.total_cost : paymentData.product.price)}}</td>
                                    </tr>
                                 
                                </table>
                            </div>
                        </div>
                      
                    </div>
                    <div v-else>
                        <v-row v-if="subscriptions && subscriptions.length">
                            <v-col cols="6" v-for="(subscription,index) in subscriptions" :key="index">
                                <div class="package-container">
                                    <div>
                                        <span class="price">{{ subscription.price }}</span><sup>$</sup>
                                    </div>
                                    <p class="mb-0" v-if="subscription.trial_days">{{formatTrialDays(subscription.trial_days)}}</p>
                                    <!-- <p class="mb-0" v-if="subscription.trial_days">{{formatTrialDays(32)}}</p> -->
                                    <div class="pt-6 pb-6">
                                        <p class="f9-bold ma-0 text-capitalize">{{ subscription.name }}</p>
                                        <p class="f9 ma-0">{{ subscription.type }}</p>
                                    </div>
                                    <v-btn depressed rounded style="gradient-bg" link :to="'/subscription/'+subscription.id">Upgrade</v-btn>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row v-else>
                            <v-col cols="12">
                                <div class="subscription">
                                    <h4>No Packages</h4>
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </div>
            <div v-else class="unavailable">
                <p>{{ message }}</p>
            </div>
        </v-container>
         <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
import Bottomnavbar from '@/components/layout/NavbarBottomVendor'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
    name:'SubscriptionPage',
    data() {
        return {
            title:'',
            moment,
            valid:true,
            maxHeight:100,
            customer: {
                fname:'',
                lname:'',
                phone_no:'',
                email:'',
                profile_pic:'',
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
            subscriptions:[],
            subscribed:{},
            hasSubscription:false,
            paymentData:{},
            render:false,
            message:'Loading...'
        }
    },
    mounted() {
        this.fetchProfile();
    },
    methods: {
        formatTrialDays(days){
            if(days<30) {
                return days+" days";
            }else{
                let month = Math.floor(days/30),
                mDay = (days%30);
                if(mDay) {
                    return (month > 1 ? month + " months " : month +' month ') + (mDay>1 ? mDay +' days': mDay +' day');
                }else{
                    return month > 1 ? month+ " months" : month+" month";
                }
            }
        },
        async fetchProfile() {
            this.loaderShow();
            await ApiService.post("profile")
            .then((response) => {
                if(response.data.owner.subscription === null){
                    this.fetchPlans();
                }else{
                    this.hasSubscription = true;
                    this.fetchSubscription(response.data.owner.subscription.id);
                }
			})
			.catch((error) => {
                console.log("no fetch", error.response.data);
                this.loaderHide();
			})
        },
        fetchPlans() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.post('/subscription/plans')
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.subscriptions = resp.filter((sub) => !sub.subscription);
                this.subscribed = resp.filter((sub) => sub.subscription);
                this.subscribed = this.subscribed[0];
            
                this.render = true;
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.render = true;
                this.message="Sorry, something goes wrong. Please contact to support";
            })
        },
        fetchSubscription(id) {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.post('/subscription/retrieve/'+ id)
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.paymentData = resp;
                this.render = true;
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.render = true;
                this.message="Sorry, something goes wrong. Please contact to support";
            })
        },
        handleBack(){
            this.$router.push({name:'vendorProfilePage'});
        },
        changeImage(file){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            let formData = new FormData();
            formData.append("file",file.file);
            ApiService.post('/store-image', formData)
            .then((resp) => {
                 this.$bus.$emit('HIDE_PAGE_LOADER');
                 this.src = resp.src;
                 this.customer.profile_pic = resp.src;
                 this.file_name = resp.file_name;
                 this.hasFile = true;
            })
            .catch(() => {
                this.messageError("Failed ! choose image less than size 2mb");
                this.$bus.$emit('HIDE_PAGE_LOADER');
            });
        },
        async profileData() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/profile').then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.customer.fname = resp.data.fname;
                this.customer.lname = resp.data.lname;
                this.customer.email = resp.data.email;
                this.src = resp.data.profile_pic;
                this.customer.phone_no = resp.data.phone_no;
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
        },
        async updateProfile(){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/update-profile', this.customer)
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageSuccess(resp.message);
                this.$router.push({name:'profilePage'});
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
.subscription {
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
.price{
    font-size: 1.2rem;
    font-weight: 600;
    color: #000000;
}
.package-container{
    background: #acfa95;
    border-radius: 10px;
    padding: 18px;
    text-align: center;
}
.form-container{
    // .login-container{
    background: #acfa95;
    border-radius: 10px;
    margin-top: 27px !important;
    padding:20px;
// }
}
</style>