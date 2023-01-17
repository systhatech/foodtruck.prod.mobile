<template>
     <v-container class="pa-0 ma-0 page-container"> 
        <Topnavbar :title="title"/>
        <v-container class="pb-10 mb-14">
            <v-form>
                <v-row>
                    <v-col cols="6" class="pt-0 pb-0">
                        <v-text-field label="First Name"></v-text-field>
                    </v-col>
                    <v-col cols="6" class="pt-0 pb-0">
                        <v-text-field label="Last Name"></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pt-0 pb-0">
                        <v-text-field label="Phone" v-model="phone" v-mask="'(###) ###-####'"></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pt-0 pb-0">
                        <v-text-field label="Address"></v-text-field>
                    </v-col>
                    <v-col cols="6" class="pt-0 pb-0">
                        <v-text-field label="City"></v-text-field>
                    </v-col>
                    <v-col cols="6" class="pt-0 pb-0">
                        <v-text-field label="State"></v-text-field>
                    </v-col>
                    <v-col cols="6" class="pt-0 pb-0">
                        <v-text-field label="ZIP"></v-text-field>
                    </v-col>
                    <v-col cols="6" class="pt-0 pb-0">
                        <v-text-field label="Label for Delivery" placeholder="home / office"></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pt-0 pb-0">
                        <v-checkbox
                            label="Make default shipping address"
                        ></v-checkbox>
                    </v-col>
                    <v-col cols="12">
                        <v-btn color="primary" rounded block>Save</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBack'
export default {
    data() {
        return {
            title:'',
            phone:'',
        }
    },
    components: {
        Topnavbar,
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