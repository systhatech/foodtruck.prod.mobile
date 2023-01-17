<template>
    <div>
        <v-row>
            <v-col cols="12">
                <h4 class="text-capitalize">{{ menu.name }}</h4>
            </v-col>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                <div>
                    <v-img
                    lazy-src="https://picsum.photos/id/11/10/6"
                    max-height="150"
                    gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
                    :src="menu.thumbnail"
                    ></v-img>
                </div>
            </v-col>
        </v-row>
        <div v-for="(menuItem, index) in menu.itemTest" :key="index">
            <h4 class="text-capitalize ma-4">{{ index }}</h4>
            <v-row>
                <v-col cols="12" sm="12" md="5" lg="6" xl="3"
                v-for="(item,i) in menuItem" :key="i">
                <v-card outlined>
                        <div class="d-flex flex-no-wrap justify-space-between">
                        <div>
                            <v-card-title
                            class="item-title text-primary text-capitalize"
                            v-text="item.name"
                            ></v-card-title>
                            <p class="sub-title text-secondary">Unit : {{ item.unit }}</p>
                            <p class="sub-title text-secondary">Rate : {{ formatAmount(item.price)}}</p>
                            <v-btn
                                tile
                                small
                                depressed
                                :title="item.is_active ?'Make inactive':'Make active'"
                                class="ml-4 mt-1 mb-4"
                                :color="item.is_active ? 'primary' : 'secondary'"
                                @click="toggleActive(item)"
                            >{{ (item.is_active == 1) ?'Active':'Inactive'}}</v-btn>

                        </div>

                        <div class="item-background-image" title="Click to change picture">
                            <InputUpload :src="item.thumbnail"
                                         :item-id="item.id"
                                         type="menu_item_image"
                                         @changeImage="changeImage"/>
                        </div>
<!--                        <v-avatar-->
<!--                            class="ma-3"-->
<!--                            size="125"-->
<!--                            tile-->
<!--                        >-->
<!--                            <v-img :src="item.thumbnail"></v-img>-->
<!--                        </v-avatar>-->
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </div>
</template>
<script>
import  { axios } from '../../../../utils/axios'
import InputUpload from '../../../components/InputUpload'
export default {
    props: {
        menu:{
        }
    },
    components:{
        InputUpload,
    },
    data(){
        return  {
            activeStatus:''
        }
    },
    created() {

    },
    methods: {
        toggleActive(item){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            axios.get('/menuitem/toggle-active/'+item.id)
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.$bus.$emit('MENU_LIST_VIEW_ITEMS', resp.data);
                this.messageSuccess(resp.message);
            })
            .catch((error)=> {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError('Failed to toggle active');
            })
        },
        changeImage(file){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            let formData = new FormData();
            formData.append("file",file.file);
            formData.append("id",file.itemId);
            axios.post('/menuitem/update-image', formData)
            .then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageSuccess(resp.message);
            })
            .catch((error) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.messageError('Failed to update picture');
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.item-title{
    font-size: 1rem;
    font-weight: 500;
}
.sub-title{
    font-size:0.9rem;
    padding:0 15px;
    font-weight:500;
    margin:0;
}
.item-background-image{
    height: 110px;
    width: 180px;
    background: #f5f5f5;
    text-align: center;
    align-items: center;
    display: flex;
    justify-content: space-around;
    margin-top: 13px;
    margin-right: 13px;
}
</style>
