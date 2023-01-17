<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack"/>
        <v-container class="mb50">
            <div class="form-container" > 
                <div class="setting-list bg-primary-light border-radius-10">
                    <ul>
                        <li>
                            <div>
                                <span class="f8-bold">Cash Payment</span>
                            </div>
                            <v-switch
                            v-model="switch1"
                            ></v-switch>
                        </li>
                        <li>
                            <div>
                                <span class="f8-bold">Testing</span>
                            </div>
                            <v-switch
                            v-model="switch1"
                            ></v-switch>
                        </li>
                       
                    </ul>
                </div>
            </div>
        </v-container>
        <Bottomnavbar :value="indexValue"/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import { ApiService } from '@/core/services/api.service'
import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
import { base_url } from '@/core/services/config'
// import InputUpload from '@/components/form-element/InputUpload'
// import { mapGetters } from 'vuex'
export default {
    name:'EditProfile',
    data() {
        return {
            title:'',
            switch1: true,
            indexValue:0,
            base_url,
            valid:true,
            schedules:[],
            rulesRequired: [
                v => !!v || 'Required',
            ],
            password: {
                new_password:'',
                confirm_password:'',
            }
        }
    },
    mounted() {

    },
    methods: {
        handleBlur(){

        },
        handleBack(){
            this.$router.back();
        },
        async handleUpdate() {
            let valid = this.$refs.formPassword.validate();
            if(!valid) {
                this.messageError('Field is empty');
                return;
            }
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/change_password',this.password).then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageSuccess(resp.message);
                this.$refs.formPassword.reset();
                this.$router.push({name:'profilepage'});
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError(error.response.data.message);
            })
        },
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        // InputUpload
    },
    computed: {
        // ...mapGetters({
        //     currentUser:'auth/user',
        // })
    }
}
</script>
<style lang="scss" scoped>
.setting-list{
    ul{
        list-style: none;
        // margin-top:25px;
        padding:0;
        margin:0;
        li{
            padding: 10px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0;
            &:not(:last-child) {
                border-bottom:1px solid #d2d5d4
            }
            span{
                font-size: 0.9rem;
                font-weight: 400;
            }
        }
    }
}
.schedule {
    text-align: center;
    padding: 10px;
    color: #b5b5b5;
    background: #fff;
    height: 180px;
    border-radius: 20px;
    align-items: center;
    justify-content: space-around;
    display: flex;
}
.schedule-wrapper{
    background: #ffffff;
    border-radius:10px;
    padding:10px;
    margin-bottom: 70px;
}
.schedulte-item-wrapper{
    padding:10px;
    // border:1px solid #dadada;
    margin-bottom: 14px;
    border-radius:10px;
    -webkit-box-shadow: 3px 5px 28px -7px rgba(184,184,184,0.52);
    -moz-box-shadow: 3px 5px 28px -7px rgba(184,184,184,0.52);
    box-shadow: 3px 5px 28px -7px rgba(184,184,184,0.52);
}
.form-container{
    background: #fff;
    border-radius: 10px;
    padding:20px;
}
</style>