<template>
    <div>
        <div v-if="truckProfile && truckProfile.locations && Object.keys(truckProfile.locations).length">
            <ul class="location-list mt-6">
                <li class="" v-for="(location, index) in truckProfile.locations" :key="index">
                    <div class="pa-4 custom-bs p-relative">
                        <div>
                            <div class="d-flex align-center justify-space-between">
                                <h5 class="text-uppercase primary--text">date</h5>
                                <v-btn fab small color="error" text @click="handleDelete(location)"><v-icon>mdi-close</v-icon></v-btn>
                            </div>
                            <p class="mb-1"> {{ formatStandardUSDate(location.start_date)}} - {{ formatStandardUSDate(location.end_date)}}</p>
                            <p class="mb-4"> {{ formatTimeOnly(location.start_date)}} - {{ formatTimeOnly(location.end_date)}}</p>
                        </div>
                        <div>
                            <h5 class="text-uppercase primary--text">Location</h5>
                            <div>
                                <p class="ma-0">
                                    {{location.add1 ? location.add1:''}}
                                    {{location.city?location.city:''}}<br>
                                    {{location.state?location.state:''}}
                                    {{location.zip?location.zip:''}}
                                    {{location.country_code?location.country_code:''}}
                                </p>
                            </div>
                        </div>
                        <div class="pt-4">
                            <v-btn block large rounded color="warning" @click="handleRoute(location)">update</v-btn>
                        </div>
                    </div>
                </li>
            </ul>
            <ModalSchedule 
                :location="location"
                :dialogScheduleEdit="modal_schedule_edit"
                @close="handleClose"/>
            <DialogConfirm 
                :dialogConfirm="modal_confirm"
                @confirm="handleConfirmDelete"
                @close="handleClose"/>
        </div>
        <div v-else class="pa-4 unavailable">
            <p>No schedule available</p>
        </div>
    </div>
</template>
<script>
import { base_url } from '@/core/services/config'
import { mdiMapMarker, mdiCalendar,mdiClock, mdiAccount } from '@mdi/js'
import { mapActions } from 'vuex'
import { ApiService } from '@/core/services/api.service'
export default {
    props:{
        truckProfile:{},
    },
    data() {
        return {
            base_url,
            modal_schedule_edit:false,
            iconLocation:mdiMapMarker,
            iconDate:mdiCalendar,
            iconTime:mdiClock,
            iconAccount:mdiAccount,
            message:'Loading...',
            location:{},
            modal_confirm:false,
            selected_schedule:null,
        }
    },
    watch: {
        truckProfile(newval) {
            if(newval.locations.length) {
                this.message="";
            }else{
                 this.message="No schedule";
            }
        }
    },
    methods: {
        ...mapActions({
            'fetchProfile':'auth/fetchProfile'
        }),
        handleRoute(location) {
            this.location = location;
            this.modal_schedule_edit = true;
            // this.$router.push("/truck-profile-location/"+id);
        },
        handleClose(){
            this.modal_confirm = false;
            this.modal_schedule_edit = false;
        },
        handleDelete(data){
            this.selected_schedule = data;
            this.modal_confirm = true;
        },
        async handleConfirmDelete() {
            this.loaderShow();
            await ApiService.post("/vendor/location-delete", {
                location_id: this.selected_schedule.id,
            })
			.then(() => {
                this.fetchProfile();
				this.loaderHide();
				this.handleClose();
			})
			.catch(() => {
				this.loaderHide();
			});
        }
    },
    components:{
        ModalSchedule: ()=> import('@/views/vendor/profile/modal/ModalVendorScheduleEdit'),
        DialogConfirm: ()=> import('@/components/layout/DialogDeleteConfirm'),
    }
}
</script>
<style lang="scss" scoped>
.custom-bg-unavailable{
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #cbcbcb;
}
.location-list{
        list-style: none;
        padding: 0;
        li{
            text-transform: capitalize;
            position: relative;
            margin-bottom:20px;
            .btn-edit{
                position: absolute;
                right: 0;
                top: 10px;
            }
        }
}
</style>