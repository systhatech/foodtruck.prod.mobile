<template>
    <div class="">
        <div v-if="leads && leads.length">
            <div v-for="(item,index) in leads" :key="index">
                <div v-if="item.type =='catering'">
                    <div class="custom-bs pa-4 mb-4">
                        <ItemCatering :item="item"/>
                    </div>
                </div>
                <div v-if="item.type == 'event'">
                    <div class="custom-bs pa-4 mb-4">
                        <ItemEvent :item="item"/>
                    </div>
                </div>
                <div v-if="item.type =='regular_event'">
                    <div class="custom-bs pa-4 mb-4">
                        <ItemRegularEvent :item="item"/>
                    </div>
                </div>
            </div>
            <div v-if="this.last_page >= this.next_page" class="pa-4 text-center">
                <v-btn :disabled="fetching_data" outlined large color="primary" rounded @click="loadMore()">{{fetching_data ?'Loading...':'load more'}}</v-btn>
            </div>
        </div>
        <div v-else class="unavailable">
            <p>No response found</p>
        </div>
    </div>
</template>
<script>
import {mapGetters} from'vuex'
import moment from 'moment'
import { ApiService } from "@/core/services/api.service";

export default {

    data() {
        return {
            moment,
            leads:[],

            next_page:1,
            last_page:0,
            fetching_data: false,
        }
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
        }),
    },
    created() {

    },
    mounted() {
        this.fetchResponse();
    },
    methods: {
        loadMore(){
            if(this.last_page >= this.next_page){
                if(!this.fetching_data)
                this.fetchResponse();
            }
        },
        fetchResponse(){
            ApiService.post("/event_response?page="+this.next_page)
            .then((resp) =>{
                // this.leads = resp.data;

                resp.data.data.forEach(element => {
                    this.leads.push(element);
                });
 
                this.last_page  = resp.data.last_page;
				if(this.next_page <= this.last_page){
					this.next_page += 1
				}
  
                if(!this.leads.length) {
                    this.message="No items";
                }
                this.loaderHide();
                this.fetching_data = false;
            })
            .catch((error)=>{
                console.log(error);
            })
        }
    },

    components: {
        ItemCatering:() => import('@/views/vendor/truck_request/ItemCatering.vue'),
        ItemEvent:() => import('@/views/vendor/truck_request/ItemEvent.vue'),
        ItemRegularEvent:() => import('@/views/vendor/truck_request/ItemRegularEvent.vue'),
    }
}
</script>
<style scoped lang="scss">

</style>