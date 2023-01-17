<template>
    <v-container class="pa-0 ma-0 page-container"> 
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <div class="d-flex align-center">
                        <v-text-field label="Search" class="mr-4" v-model="search"></v-text-field>
                        <v-btn x-small fab color="primary"><v-icon>mdi-filter</v-icon></v-btn>
                    </div>
                </v-col>
            </v-row>
            <v-row v-if="appointments.length">
                <v-col cols="12" v-for="(appointment, index) in appointments" :key="index">
                    <v-card class="no-border-radius custom-bs" @click="viewPest(appointment.id)">
                        <div class="d-flex align-center justify-space-between">
                            <div class="d-flex align-center">
                                <div class="appointment-date">
                                    <p class="f8 ma-0">{{onlyMonth(appointment.start_date)}}</p>
                                    <p class="f9-bold day-style">{{onlyDay(appointment.start_date)}}</p>
                                    <p class="f8 ma-0">{{onlyWeekDay(appointment.start_date)}}</p>
                                </div>
                                <div class="pa-3 d-flex align-cneter">
                                    <div>
                                        <h5 class="text-uppercase">{{appointment.appointment_no}}</h5>
                                        <div class="f8">
                                            <v-icon color="secondary" class="f1">mdi-clock</v-icon> {{formatTimeOnly(appointment.start_time)}} - {{formatTimeOnly(appointment.end_time)}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="pr-2">
                                <v-icon>mdi-chevron-right</v-icon>
                            </div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col cols="12">
                    <div class="no-data">
                        <p>No appointment yet</p>
                    </div>
                </v-col>
            </v-row>
        </v-container>
         <Bottomnavbar :items="items" :value="indexValue"/>
    </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { ApiService } from '@/core/services/api.service'
// import Banner from '@/components/layout/ComponentBanner'
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import Bottomnavbar from '@/components/layout/Bottomnavbar'
export default {
    name:'QuotePage',
    data() {
        return {
            title:'',
            indexValue:0,
            id:'',
            appointments:{},
            base_url:'',
            search:'',
            items: [
                {id:2, name:'Dashboard',route:'dashboard',icon:'mdi-view-dashboard'},
                {id:3, name:'Pest Control',route:'pest-control', icon:'mdi-spider'},
                {id:4, name:'Inspection',route:'inspection', icon:'mdi-clipboard-text-multiple'},
            ],
        }
    },
    components: {
        Topnavbar,
        Bottomnavbar
        // Banner
    },
    mounted() {
        this.id = this.$router.currentRoute.params.id;
        this.fetchAppointments(this.id);
    },
    methods: {
        charactersLeft(text,max) {
            return text.length > 25 ? text.slice(0,max) + "..." : text;
        },
        getTotal(data) {
            
            let amount = 0;
            let taxRate = data.taxes ? data.taxes[0].value: 13;
            data.quote_services.forEach((item) => {
                amount+=item.price;
            });
            let tax = (taxRate / amount) *  100;

            return this.formatAmount(amount+tax);
        },
        viewPest(id) {
            this.$router.push('/appointment/'+id);
        },
        handleBack() {
            this.$router.back();
        },
        async fetchAppointments(){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/pest-appointments')
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.appointments = resp.data;
                // console.log(resp.data);
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(error);
            });
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
    $color-primary: #01a6bc;
    $color-secondary: #01a6bc;
    .appointment-date{
        background: #99cc00;
        width: 60px;
        color: #fff;
        text-align: center;
        padding: 0 10px;
    }
    .card-custom{
        border-bottom: 1px solid #dadada;
    }
    .day-style {
        font-size: 1.2rem;
        font-weight: 500;
        margin:0;
    }
    .date-wrapper{
        display:flex; 
        align-items: center;
        color:#99cc00 !important;
        margin-bottom: 10px;
        i{
            font-size:1.2rem;
        }
    }

    .text{
        margin-bottom: 0;
    }
    .f1{
        font-size:1rem;
    }
    .no-data {
        height: calc(100vh - 300px);
        display: flex;
        align-items: center;
        justify-content: space-around;
        h3,p{
          color:#dadada;
          text-align: center;
          text-transform: uppercase;
        }
    }
</style>