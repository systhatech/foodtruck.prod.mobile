<template>
    <div>
       <div v-if="truckProfile.menus && truckProfile.menus.length">
            <div v-for="(menu,index) in truckProfile.menus" :key="index">
                <div v-for="(groupItem, index) in menu.itemsGroup" :key="index">
                    <h4 class="pb-3 mt-6 text-uppercase">{{ index }}</h4>
                    <div cols="6" v-for="(item,i) in groupItem" class="custom-bs item-wrapper" :key="i">
                        <div class="d-flex align-center abc" @click="viewMenu(item.id)"> 
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
                                    <p class="ma-0 f8-bold text-capitalize">{{item.name}}</p>
                                    <p class="ma-0 f8 text-capitalize">{{item.description ? item.description:'No description'}}</p>
                                </div>
                                <div>
                                    <h4 class="ma-0">
                                        {{ formatAmount(item.price)}}
                                    </h4>
                                    <p class="ma-0"><span class="unittype">({{ item.unit_type}})</span></p>
                                    <p class="ma-0"><span class="unittype">{{ item.unit}} item</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    
            </div>
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
        }
    },
    methods: {
        viewMenu(id){
            // this.$router.push("/menu-edit/"+id).catch(()=>{});
            this.$router.push("/truck-menu/"+id).catch(()=>{});
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