<template>
    <v-container class="pa-0 ma-0 page-container"> 
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container>
            <h3 class="mb-3">Notifications </h3>
            <div class="mb-4">
                <v-chip class="mr-3 text-capitalize" 
                    @click="handleChangeStatus(sta.value,index)" 
                    :color="index==activeStatus?'secondary':'primary'" 
                    v-for="(sta,index) in status" :key="index">
                    <span v-if="sta.name !=='all'">
                    {{ sta.name }} - {{sta.count}}
                    </span>
                    <span v-else>{{sta.name}}</span>
                </v-chip>
            </div>
            <v-row v-if="notifications && notifications.length">
                <v-col cols="12" v-for="(notification, index) in notifications" :key="index">
                    <div class="custom-bs pl-3 pr-3" @click="handleMarkRead(notification.notification_id)">
                        <div>
                            <div class="pa-3">
                                <p class="notification-date" :class="notification.is_seen==0 ?'color-primary':''">{{formatDateTime(notification.created_at)}}</p>
                                <h5>{{ notification.fname}} {{ notification.lname }}</h5>
                                <div class="content-style f8" v-html="notification.content"></div>

                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col>
                    <v-container class="page-not-found">
                        <h3>No notifications</h3>
                    </v-container>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { ApiService } from '@/core/services/api.service'
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
export default {
    data() {
        return {
            title:'',
            artists : [
                {id:1, name:"John Doe",phone:'98988888888', email:'example@email.com', address:'80 kane st', service:'Eye Brow Tinting'},
                {id:2, name:"Tina Rapsom",phone:'98988888888', email:'example@email.com', address:'80 kane st', service:'Threading'},
                {id:3, name:"Marshal M",phone:'98988888888', email:'example@email.com', address:'80 kane st', service:'Facials'},
                {id:4, name:"Devid Joe",phone:'98988888888', email:'example@email.com', address:'80 kane st', service:'Waxing'},
            ],
            notifications:[],
            status:[
                {name:'unread',value:'0'},
                {name:'read',value:'1'},
                {name:'all', value:''},
            ],
            activeStatus:0,
            readStatus:0,
        }
    },
    components: {
        Topnavbar
    },
    mounted() {
        this.fetchData();
    },
    methods: {
         handleChangeStatus(v,index){
             this.activeStatus = index;
            this.readStatus = v;
             console.log(this.readStatus);
            this.fetchData();
        },
        handleMarkRead(id) {
            console.log(id);
            this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.post('/notifications-read',{id: id})
            .then((resp) => {
                console.log(resp);
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.fetchData();
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                console.log(error);
            })
        },
        fetchData() {
            // if(this.sta)
            ApiService.post('/notifications',{read: this.readStatus})
            .then((resp) => {
                this.notifications = resp.data;
                this.status = resp.filter_data;
            })
            .catch((error) => {
                console.log(error);
            })
        },
        handleBack() {
            this.$router.back();
        },
        changeTab(param) {
            console.log(param, this.tab);
        },
        handleAppointment() {
            this.$router.push("/artist-appointment/"+1);
        },
        handleRoute(route){
            this.$router.push("/"+route);
        },
        messageCount() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.get('/messages/count/'+this.currentUser.vendor.id)
            .then((response) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.countMessages = response.total;
            })
            .catch(() => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
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
.notification-date {
    font-size: 0.8rem;
    margin: 0;
    font-weight: 500;
    color: #959595;
}
.page-not-found {
    height: calc(100vh - 300px);
    display: flex;
    align-items: center;
    justify-content: space-around;
    h3{
        color:#dadada;
        text-align: center;
    }
}
.content-style {
    p{
        padding:0 !important;
        margin:0 !important;
    }
}
    // .page-container{
    //     .item-wrapper{
    //         background:#f5f5f5;
    //         padding: 10px;
    //         text-align: center;
    //         min-height: 100px;
    //         display: flex;
    //         align-items: center;
    //         flex-direction: column;
    //         justify-content: space-between;
    //         border-radius: 0;
    //         i{
    //             font-size: 3.1rem;
    //             // color: #01a6bc;
    //         }
    //         p{
    //             margin: 0;
    //             padding: 0;
    //             text-align: center;
    //             font-weight: 500;
    //             color: #5a5a5a;
    //             text-transform: capitalize;
    //             font-size: 0.8rem;
    //             letter-spacing: 0.7px;
    //         }
    //     }
    // }
</style>