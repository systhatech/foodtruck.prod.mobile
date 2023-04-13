<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container class="mg56">
           <div v-if="type=='c'">
                <FormCatering :cuisineTypes="cuisine_types"/>
           </div>
           <div v-else-if="type=='e'">
                <FormEvent :cuisineTypes="cuisine_types"/>
           </div>
           <!-- <div v-else-if="type=='re'">
                <FormRegularEvent :cuisineTypes="cuisine_types"/>
           </div> -->
        </v-container>
        <Bottomnavbar/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import Bottomnavbar from '@/components/layout/NavbarBottomClient'
import {ApiService} from '@/core/services/api.service'
import { mapGetters } from 'vuex'
export default {
    name:'TruckRequestFormPage',
    data() {
        return {
            title:'',
            start_request:false,
            type:'',
            cuisine_types:[],
        }
    },
    mounted() {
        this.type =  this.$router.currentRoute.query.type;
        this.fetchCuines();
    },
    methods: {
        handleBack(){
            this.$router.back();
        },
        handleClick(param){
            console.log(param);
            this.$router.push("/test");
        },
        fetchCuines(){
            ApiService.post("/vendor-lookup-all")
            .then((resp) =>{
                console.log({resp})
                this.cuisine_types = resp.data;
            })
            .catch((error) =>{
                console.log({error});
            })
        }
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        FormCatering:()=> import('@/views/client/truck_request/FormCatering.vue'),
        FormEvent:()=> import('@/views/client/truck_request/FormEvent.vue'),
        // FormRegularEvent:()=> import('@/views/client/truck_request/FormRegularEvent.vue'),
    },
    computed: {
        ...mapGetters({currentUser:'auth/user'}),
    }
}
</script>
<style lang="scss" scoped>

</style>