<template>
    <v-row justify="center">
        <v-dialog
        v-model="modalBuy"
        persistent
        scrollable
        fullscreen>
        <v-card class="background-image" style="padding-top: 56px !important;">
            <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                <v-toolbar-title class="text-capitalize">{{ item ? item.event_name:'Buy Event'}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn text @click="handleClose">
                        Close
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <!-- <v-container> -->
                <div class="pa-4 pb82 background-white pb-16 mt-14">
                    <div class="custom-bs pa-4">
                        <div class="mb-4 text-center">
                            <p class="mb-0">Availabe Credit</p>
                            <h2 class="primary--text">{{  available_credit }}</h2>
                        </div>
                        <div class="text-center">
                            <p class="mb-0">Required Credit</p>
                            <h2 class="primary--text">{{  item.credit }}</h2>
                        </div>
                    </div>
                </div>
                <div class="pa-4 custom-bs pb-8" style="position: fixed;bottom: 0;width: 100%;z-index: 1;">
                    <div class="d-flex align-center justify-space-between">
                        <v-btn color="primary" :disabled="available_credit<item.credit" block large rounded @click="handleSubmit(item)">submit</v-btn>
                    </div>
                </div>
            <!-- </v-container> -->
        </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
import { mdiClose } from '@mdi/js'
import { base_url } from '@/core/services/config'
import { mapGetters } from 'vuex'
import { ApiService } from '@/core/services/api.service'
import moment from 'moment'
export default {
    props:{
        available_credit:{},
    },
    data(){
        return {
            base_url,
            modalBuy:false,
            moment,   
            iconClose: mdiClose,
            item:{}
        }
    },
    mounted(){
        this.$bus.$on("MODAL_OPEN", (data) => {
            this.item =data.item;
            this.modalBuy = true;
        });
    },
    methods: {
        
        handleClose(){
            this.modalBuy = false;
        },
        handleSubmit(){
            this.loaderShow();
            ApiService.post("/event_buy",{
                "id": this.item.id
            })
            .then((response) =>{
                this.handleClose();
                this.loaderHide();
                this.$emit('refreshData');
                console.log({response});
            })
            .catch((error)=>{
                this.loaderHide();
                console.log(error);
            })
        }
       
       
    },
    computed: {
        ...mapGetters({ 
            currentUser : 'auth/user',
         
        }),
    }
}
</script>
<style lang="scss" scoped>

.v-label {
    font-size: 0.9rem !important;
    text-transform: capitalize !important;
}
.flavour-list{
    list-style: none;
    padding-left: 16px;
}

.v-card__title{
    padding:16px 25px;
}
.quantity {
    width: 40px;
    padding: 4px 10px;
    text-align: center;
}
.cardBody{
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>