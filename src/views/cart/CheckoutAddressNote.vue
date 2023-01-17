<template>
     <v-container class="pa-0 ma-0 page-container background-image h-100"> 
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container class="pb-10"> 
            <v-form class="background-white pa-4">
                <v-row>
                    <v-col cols="12">
                        <v-textarea label="Note" outlined></v-textarea>
                        <v-btn color="primary" rounded block>Save</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>
        <Bottomnavbar :value="indexValue"/>
    </v-container >
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import Bottomnavbar from "@/components/layout/NavbarBottom";
export default {
    data() {
        return {
            title:'',
            phone:'',
            indexValue:1,
        }
    },
    methods:{
        handleBack() {
            this.$router.back();
        }
    },
    components: {
        Topnavbar,
        Bottomnavbar
    }
}
</script>
<style lang="scss" scoped>
.add-address {
    width: 100%;
    border: 3px dashed #83b441;
    text-align: center;
    padding: 20px 10px;
    display: flex;
    color:#83b441;
    align-items: center;
    margin-bottom: 20px;
}
</style>