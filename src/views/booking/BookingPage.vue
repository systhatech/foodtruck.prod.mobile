<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mg56">
            <v-row class="h-100">
                    <v-col cols="12" md="12" sm="12" lg="12" xl="12">
                        <div class="h-100">
                            <div>
                                <h4>Spot Bookings</h4>
                            </div>
                            <v-divider></v-divider>
                            <div class="custom-bs">
                                <v-tabs
                                v-model="tab"
                                align-with-title
                                >
                                <v-tabs-slider color="primary"></v-tabs-slider>

                                    <v-tab
                                        v-for="(menu, index) in tabItems"
                                        @click="changeTab(menu.component)"
                                        :key="index"
                                    >
                                        {{ menu.name }}
                                    </v-tab>
                                </v-tabs>
                            </div>
                            <div>
                                <component :is="activeComponent"></component>
                            </div>
                        </div>
                    </v-col>
            </v-row>
        </v-container>
        <Bottomnavbar/>
    </v-container>
</template>
<script>
import BookingAvailable from './BookingAvailable'
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import BookingList from './BookingList'
import { mapGetters } from 'vuex'
import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
export default {
    data: () => ({
        selection: 1,
        activeComponent:'booking-list',
        title:'',
        tab: null,
        tabItems:[
            {
                name:'Spot Booked', 
                component:'booking-list'
            },
            {
                name:'Spot Available',
                component:'booking-available'
            },
        ],
    }),
    async created() {
        // await this.$store.dispatch('locationBookings',{ 
        //     start_date: this.start_date,
        //     end_date: this.end_date,
        //     zip_code: this.zip_code,
        //     city: this.city,
        //     vendor_id: this.currentUser.vendor.id,
        // });

        // axiosWeb.get(`/admin/location-bookings/all?start_date=${this.start_date}&&end_date=${this.end_date}&&zip=${this.zip_code}&&city=${this.city}`)
        // .then((resp) => {
        //     this.bookings = resp.data;
        // }) 
        // .catch((error) => {
        //     console.log(error);
        // });
    
    },
    methods: {
        handleBack() {
            this.$router.back();
        },
        changeTab (component) {
            this.activeComponent = component;
        },
    },
    components: {
        'booking-available' : BookingAvailable,
        'booking-list' : BookingList,
        Topnavbar,
        Bottomnavbar
    },
    computed: {
          ...mapGetters({
            currentUser:'auth/user',
        })
    }
}
</script>
<style lang="scss" scoped>
.v-application--is-ltr .v-tabs--align-with-title > .v-tabs-bar:not(.v-tabs-bar--show-arrows):not(.v-slide-group--is-overflowing) > .v-slide-group__wrapper > .v-tabs-bar__content > .v-tab:first-child, .v-application--is-ltr .v-tabs--align-with-title > .v-tabs-bar:not(.v-tabs-bar--show-arrows):not(.v-slide-group--is-overflowing) > .v-slide-group__wrapper > .v-tabs-bar__content > .v-tabs-slider-wrapper + .v-tab {
    margin-left: 0px !important;
}
.v-tabs-slider-wrapper {
    left: 0px !important;
}
.v-tab {
    letter-spacing: 0 !important;
}
.menu-lists{
    list-style: none;
    padding:0;
}
</style>