<template>
    <div class="pt-4 ">
        <div v-if="truckProfile && truckProfile.menus && truckProfile.menus.length">
            <div v-for="(menu,index) in truckProfile.menus" :key="index">
                <div v-for="(groupItem, index) in menu.itemsGroup" :key="index">
                    <h5 class="pb-2 mt-8 text-uppercase">{{ index }}</h5>

                    <div cols="6" v-for="(item,i) in groupItem" class="custom-bs pa-3 mb-4" :key="i">
                        <div class="d-flex align-center justify-space-between" @click="handleRoute(item)">
                            <div class="d-flex align-center"> 
                                <v-img
                                lazy-src="https://picsum.photos/id/11/10/6"
                                max-width="100"
                                width="100"
                                aspect-ratio="1.7"
                                contain
                                :src="item.profile_pic? base_url+'/image-show/'+item.profile_pic:'usericon'"
                                ></v-img>
                                <div class="pl-3 d-flex align-center justify-space-between w-100">
                                    <div>
                                        <p class="mb-0 text-capitalize primary--text">{{item.name}}</p>
                                        <p style="font-size:14px" v-if="item.description">{{ shortText(item.description,40) }}</p>
                                    </div>
                                    <!-- <div>
                                        
                                        <p class="ma-0"><span class="unittype">({{ item.unit_type}})</span></p>
                                        <p class="ma-0"><span class="unittype">{{ item.unit}} item</span></p>
                                    </div> -->
                                </div>
                            </div>
                            <div>
                                <h4 class="ma-0 primary--text">{{ formatAmount(item.price)}}</h4>
                                <!-- <v-btn fab small color="primary" @click="handleRoute(item)"><v-icon>{{ icon_right }}</v-icon></v-btn> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalMenu :dialog="dialog" :vendorId="vendorId" :item="item" @close="handleClose"/>   
        </div>
        <div v-else class="unavailable">
            <p>Menu not available</p>
        </div>
    </div>
</template>
<script>
import { base_url } from '@/core/services/config'
import { mdiChevronRight } from '@mdi/js';
import ModalMenu from './menu/ModalMenu'
export default {
    props:{
        truckProfile:{},
    },
    data() {
        return {
            base_url,
            icon_right: mdiChevronRight,
            message:'Loading...',
            item:{},
            dialog:false,
            vendorId:null,
        }
    },
    components:{
        ModalMenu,
    },
    mounted() {
        this.vendorId = this.$router.currentRoute.params.truckId;
    },
    watch: {
        truckProfile (newData) {
            if(!newData.menus.length) {
                this.message = "No menu available";
            }
        }
    },
    methods: {
        handleRoute(item){
            this.item = item;
            this.dialog = true;
        },
        handleEdit(id){
            this.$router.push("/menu-edit/"+id).catch(()=>{});
        },
        handleClose() {
            this.dialog = false;
        }
    }
}
</script>
<style lang="scss" scoped>
.unittype{
    font-size: 0.8rem;
    text-transform: capitalize;
    font-weight: 400;
    color: #9a9a9a;
    margin-bottom:10px !important;
}
.item-wrapper{
    margin-bottom: 14px;
    border-radius: 4px;
    padding: 0 15px;
    // border: 1px solid #dadada;
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