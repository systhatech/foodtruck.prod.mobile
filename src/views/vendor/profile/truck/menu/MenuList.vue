<template>
    <v-row>
        <v-col cols="12">
             <div class="pb-5 d-flex align-center justify-space-between">
                <h4 class="ma-0 pa-0">Available Menus</h4>
                <v-btn color="primary" small @click="addNewMenu" tile> <v-icon>mdi-plus</v-icon> Add Menu</v-btn>
            </div>
            <v-divider></v-divider>
            <ModalNewMenu :dialogNewMenu="dialogNewMenu" :menu="currentMenu" @close="handleClose"/>
        </v-col>
        <v-col cols="12" sm="12" md="4" lg="3" xl="2" v-for="(menu, index) in menus" :key="index">
            <v-card
                class="card-custom-bs"
                max-width="374"
                >
                <v-img
                height="100"
                :src="menu.thumbnail"
                ></v-img>

                <v-card-title class="menu-name">{{ menu.name }}</v-card-title>
                <v-card-actions class="card-actions">
                <v-btn
                    color="deep-purple lighten-2"
                    text
                    @click="handleView(menu)">
                    View
                </v-btn>
                <v-btn
                    color="deep-purple lighten-2"
                    text
                    @click="handleEdit(menu)">
                    Edit
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
import ModalNewMenu from './ModalNewMenu'
import { mapGetters } from 'vuex'
export default {
    data() {
       return  {
            dialogNewMenu:false,
            currentMenu:{},
       }
    },
    async created() {
        this.$bus.$emit('SHOW_PAGE_LOADER');
        await this.$store.dispatch('vendorMenus',{vendor_id: this.currentUser.vendor.id});
        this.$bus.$emit('HIDE_PAGE_LOADER');
    },
    mounted() {
        this.$bus.$on('MODAL_NEW_MENU_VENDOR_MENUS', (payload) => {
           this.$store.dispatch('vendorMenus',{vendor_id: this.currentUser.vendor.id});
        })
    },
   methods: {
        handleView(menu){
            this.$bus.$emit('MENU_LIST_VIEW_ITEMS', menu);
        },
        handleEdit(menu){
            this.currentMenu = menu;
            this.dialogNewMenu = true;
        },
        handleClose(){
            this.dialogNewMenu = false;
        },
        addNewMenu(){
            this.currentMenu = {},
            this.dialogNewMenu = true;
        }
   },
   computed: {
       ...mapGetters({
            currentUser:'auth/user',
            menus:'truck/menus',
        })
   },
   components: {
       ModalNewMenu,
   }
}
</script>
<style lang="scss" scoped>
$bg-gray : #f5f5f5;

.menu-name{
    font-size: 0.9rem !important;
    padding: 10px 16px !important;
    text-transform: capitalize;
}
.card-actions{
    padding: 0 14px 14px 14px !important;
}
</style>
