<template>
    <v-container class="ma-0 pa-0">
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container class="mb-12">
            <h3 class="mb-4">Appointment Detail</h3>
            <!-- <v-btn block outlined color="primary" link to="/write-review" class="mb-5" rounded>Write Review</v-btn> -->
            <v-card class="custom-bs pa-4">
                <v-row>
                    <v-col cols="6">
                        <div>
                            <p class="ma-0 f8-bold">Reference</p>
                            <p class="ma-0 f8">{{ detail.appointment_no }}</p>
                        </div>
                    </v-col>
                    <v-col cols="6">
                        <div class="text-right" v-if="detail && detail.services && detail.services.length">
                            <p class="ma-0 f8-bold">Total</p>
                            <p class="ma-0 f8">{{getTotal(detail.services)}}</p>
                        </div>
                    </v-col>
                </v-row>
            </v-card>
            <h4 class="mt-5 mb-4">Service Summary</h4>
            <v-card class="custom-bs pa-4">
                <v-row>
                    <v-col cols="6" class="ma-0">
                        <p class="f8 ma-0" style="width:50%">Service Date</p>
                        <p class="f8-bold ma-0">{{ formatDateStandard(detail.start_date)}}</p>
                    </v-col>
                    <v-col cols="6" class="ma-0">
                        <p class="f8 ma-0">Start Time </p>
                        <p class="f8-bold ma-0">{{ formatTimeOnly(detail.start_time)}}</p>
                    </v-col>
                    <v-col cols="6" class="ma-0">
                        <p class="f8 ma-0">End Time </p>
                        <p class="f8-bold ma-0">{{ formatTimeOnly(detail.end_time)}}</p>
                    </v-col>
                    <v-col cols="12">
                        <p class="f8 ma-0">Service Location </p>
                        <div v-if="detail && detail.client && detail.client.address">
                            {{ detail.client.address ? detail.client.address.add1 : ''}} 
                            {{detail && detail.client.address && detail.client.address.city ?detail.client.address.city:""}} 
                            {{ detail && detail.client.address && detail.client.address.state}} 
                            {{ detail && detail.client.addresss? detail.client.address.zip:''}}
                        </div>
                        <div v-else>
                            <p class="f8-bold ma-0">Not available</p>
                        </div>
                    </v-col>
                    <v-col cols="12">     
                        <p class="f8 ma-0">Service Providers</p>
                        <div v-if="serviceProviders && serviceProviders.length">
                            <div v-for="(provider, index) in serviceProviders" :key="index" class="custom-border-bottom">
                                <p class="f8 ma-0">{{  provider.fullName}}</p>
                                <p class="f8 ma-0 text-right">{{  provider.contact.phone_no ? provider.contact.phone_no: 'No contact' }}</p>
                            </div>
                        </div>
                        <div v-else>
                            <p class="f8-bold ma-0">Not available.</p>
                        </div>
                    </v-col>
                </v-row>
            </v-card>
           
            <div v-if="detail && detail.services && detail.services.length">
            
                <v-row>
                    <v-col cols="12" md="12" lg="12">
                        <h4 class="mb-2 mt-4">Payment Summary</h4>
                        <v-card class="no-border-radius custom-bs">
                            <v-card-text>
                                <div v-if="detail && detail.services">
                                        <table class="w-100" v-for="(service, index) in detail.services" :key="index">
                                            <tr>
                                                    <td><p class="f9-bold mb-0 text-capitalize">{{ service.service_name}}</p></td>
                                                <td class="f8-bold pb-2 text-right">{{formatAmount(service.price)}}</td>
                                            </tr>
                                        </table>
                                        <div>
                                            <v-divider></v-divider>
                                            <table class="w-100">
                                                <tr>
                                                    <td class="f8-bold text-right">Sub Total </td>
                                                    <td class="f8-bold pb-2 text-right">{{calculatePrice(detail.services)}}</td>
                                                </tr>
                                                <tr>
                                                    <td class="f8-bold text-right">Tax ({{ tax }}%)</td>
                                                    <td class="f8-bold pb-2 text-right">{{calculateTax(detail.services)}}</td>
                                                </tr>
                                                <tr>
                                                    <td class="f9-bold text-right color-primary">Total</td>
                                                    <td class="f9-bold pb-2 text-right color-primary">{{getTotal(detail.services)}}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                            </v-card-text>
                            
                        </v-card>
                    </v-col>
                </v-row>
            </div>
        </v-container>
         <Bottomnavbar :items="items" :value="indexValue"/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
import Bottomnavbar from '@/components/layout/Bottomnavbar'
// import InputUpload from '@/components/form-element/InputUpload'
export default {
    name:'InspectionPage',
    data() {
        return {
            indexValue:0,
            title:'',
            label:'Choose',
            usericon:'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png',
            valid:true,
            customer: {
                first_name:'',
                last_name:'',
                title:'',
                phone:'',
                email:'',
                license_number:'',
            },
             items: [
                {id:2, name:'Dashboard',route:'dashboard',icon:'mdi-view-dashboard'},
                {id:3, name:'Pest Control',route:'pest-control', icon:'mdi-spider'},
                {id:4, name:'Inspection',route:'inspection', icon:'mdi-clipboard-text-multiple'},
            ],
            ruleRequired: [
                v => !!v || 'Required',
            ],
            rulesEmail: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid',
            ],
            update_input_file:true,
            maxHeight:300,
            src:'',
            services:[
                {id:1, name:'Interior General Pest Control'},
                {id:2, name:'Exterior General Pest Control'},
                {id:3, name:'Rodent Control'},
                {id:4, name:'Bed Bug Service'},
                {id:5, name:'Mosquitoes'},
            ],
            action:{
                title:'',
                icon:'mdi-plus',
                hasAction:true,
                title_action:'Add Note'
            },
            dialogPestNote:false,
            dialogConfirm:false,
            images: [

            ],
            index: null,
            appointmentId:null,
            detail: {},
            url:'',
            dialogService:false,
            serviceId:null,
            dates:[],
            quoteId:null,
            tax:0,
            serviceProviders:[],
        }
    },
    components: {
        Topnavbar,
        Bottomnavbar
        // InputUpload
    },
    mounted() {
        this.appointmentId = this.$router.currentRoute.params.id;
        localStorage.removeItem('destination');
        this.fetchPest();
    },
    methods: {
        calculatePrice(data) {
            let amount = 0;
            data.forEach((item) => {
                amount+=item.price;
            });
            return this.formatAmount(amount);
        },
        calculateTax(data) {
            let amount = 0;
            data.forEach((item) => {
                amount+=item.price;
            });
            return this.formatAmount((this.tax / amount) *  100);
        },
        getTotal(data) {
            console.log("services",data.services);
            if(data.length){
                let amount = 0;
                data.forEach((item) => {
                    amount+=item.price;
                });
                let tax = (this.tax / amount) *  100;
                return this.formatAmount(amount+tax);
            }else {
                return this.formatAmount(0);
            }
        },
        handleCloseConfirm(){
            this.dialogConfirm = false;
        },
        handleProceed(quoteId) {
            console.log("Test");
            this.quoteId = quoteId;
            console.log(this.quoteId);
            this.dialogConfirm = true;
        },
        handleChange(quoteId){
            this.quoteId = quoteId;
            this.source = "quotes";
            this.dialogPestNote = true;
        },
        async handleConfirm() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('pest-quote-unavailable-dates',{
                quoteId: this.quoteId,
            })
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.dates = resp.data;
                this.handleCloseConfirm();
                this.dialogService = true;
                console.log(resp);
            })
            .catch((err) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(err);
            });
        },
        async submitNote(note) {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('pest-note-create',{
                note: note.note, 
                source: this.source, 
                quoteId: this.quoteId,
                id: this.appointmentId
            })
            .then(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.fetchPest();
                this.handleClose();
            })
            .catch((err) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(err);
            });
        },
        async fetchPest() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('appointment/'+this.appointmentId)
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.detail = resp.data;
                this.tax = resp.tax.value;
                this.serviceProviders = resp.providers;
                console.log(resp.data);
                // this.detail = resp.data;
                // this.url = resp.data.images.url;
                // resp.data.images.files.forEach((item)=> {
                //     this.images.push(this.url+"/api/image/"+item.file_name);
                // });
                // console.log(resp);
                // this.detail = resp.data;
                // this.tax = resp.tax.value;
            })
            .catch((err) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(err);
            });
        },
        handleClose(){
            this.dialogPestNote = false;
        },
        handleCloseService(){
            this.dialogService = false;
        },
        onSuccessSubmit(){
            this.fetchPest();
        },
        handleSubmit() {
            this.handleClose();
            console.log("test");
        },
        handleAddNote() {
            this.source="identifyDetail";
            this.dialogPestNote = true;
        },
        handleArticleView(aa) {
            console.log("Test",aa);
        },
        handleOpenCamera() {
            this.$router.push('/pest-identify-camera');
        },
        handleBack(){
            this.$router.back();
        },
        handleTreatment(test){
            console.log("test",test)
        },
        inspectionView(test){
            console.log("Test",test);
        },
        changeImage(file){
            // this.$bus.$emit('SHOW_PAGE_LOADER');
            console.log(file);
            // let formData = new FormData();
            // formData.append("file",file.file);
            // ApiService.post('/store-image', formData)
            // .then((resp) => {
            //      this.$bus.$emit('HIDE_PAGE_LOADER');
            //      this.src = resp.src;
            //      this.file_name = resp.file_name;
            //      this.hasFile = true;
            // })
            // .catch(() => {
            //     this.messageError("Failed ! choose image less than size 2mb");
            //     this.$bus.$emit('HIDE_PAGE_LOADER');
            // });
        },
    }
}
</script>
<style lang="scss" scoped>
.custom-border-bottom{
    display:flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    &:not(:last-child) {
        border-bottom: 1px solid #e9e9e9 !important;
    }
}
.service-item-container {
    display: flex;
    align-items: center;
    margin: 24px 0;
    padding: 14px 16px;
    border-radius: 10px;
    border: 1px solid #a0cbff91;
    .icon-wrapper {
            padding: 10px;
            background: #19477ede;
            border-radius: 9px;
        i {
            color: #fff;
        }
    }
    .text-wrapper {
        padding: 0 12px;
        .text-heading {
            padding: 0 12px;
            color: #000;
            font-weight: 400;
            margin-bottom: 4px !important;
        }
        .text-sub-heading {
            font-size: 0.8rem;
        }
    }
}
</style>