<template>
    <div>
       <div v-if="truckProfile.menus && truckProfile.menus.length">
            <v-row>       
                <v-col cols="6" md="4" v-for="(menu,index) in truckProfile.menus" :key="index">
                    <div class="custom-bs pa-4 text-center" @click="handleViewMenu(menu)">
                        <div class="w-100 d-flex align-center justify-space-around">
                            <v-img 
                            height="100"
                            width="100"
                            contain
                            :src="base_url+'/image-show/'+menu.profile_pic"></v-img>
                        </div>
                        <h5 class="primary--text text-uppercase pt-4">{{ menu.name }}</h5>
                        <p class="f8 text-uppercase mb-0">({{ menu.cusine }})</p>
                    </div> 
                </v-col>
            </v-row>
            <ModalMenuDetail :dialog-menu-detail="modal_menu_detail" @close="handleClose()" :menu="menu"/>
        </div>
        <div v-else class="pa-4 unavailable">
            <p>
                {{ message}}
            </p>
        </div>
    </div>
</template>
<script>
import { base_url } from '@/core/services/config'
export default {
    props:{
        truckProfile:{},
    },
    watch: {
        truckProfile(val) {
            if(!val.menus.length) {
                this.message= "No menus";
            }
        }
    },
    data() {
        return {
            base_url,
            message: 'Loading...',
            modal_menu_detail:false,
            menu:{}
        }
    },
    components:{
        ModalMenuDetail: () => import('@/views/vendor/profile/modal/ModalVendorMenuItemDetail')
    },
    methods: {
        handleViewMenu(menu){
            this.menu = menu;
            this.modal_menu_detail = true;
        },
        handleClose(){
            this.modal_menu_detail = false;
        },
        viewMenu(id){
            this.$router.push("/vendor-menu/"+id).catch(()=>{});
        }
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
.unittype{
    font-size: 0.8rem;
    text-transform: capitalize;
    font-weight: 400;
    color: #9a9a9a;
    margin-bottom:10px !important;
}
.item-wrapper{
    margin-bottom: 14px;
    // border-radius: 4px;
    padding: 0 15px;
    // &:not(:last-child) {
    //     border-bottom:1px solid #dadada;
    // }
    .abc{
        padding:16px 0;
    }
}
.menu-list{
    // background:#dadada;
    ul{
        list-style: none;
        padding: 0;
        display: flex;
        align-items: center;
        // justify-content: space-between;
        border-bottom:2px solid;
        margin-bottom: -2px;
        // padding-bottom:10px;
        li{
            text-transform: capitalize;
            font-weight: 600;
            font-size:0.9rem;
            padding:14px;
            border-bottom: 2px solid;
            margin-bottom: -2px;
            &:not(:last-child){
                // margin-right: 40px;
            }
        }
    }
}
.form-container{
    // .login-container{
    // background: #acfa95;
    border-radiu: 10px;
    margin-bottom: 60px !important;
    padding:20px;
    min-height: 330px;
// }
}
</style>