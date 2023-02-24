<template>
    <div>
        <div v-if="truckProfile.menus && truckProfile.menus.length">
            <div v-for="(menus, k) in truckProfile.menu_all" :key="k" class="pt-8">
               <!-- <h5 class="mb-4 primary--text text-uppercase"> {{ k == 0 ?'Active Menus':'Inactive Menus' }}</h5> -->
                <v-row>
                    <v-col cols="12" sm="6" md="6" v-for="(menu, index) in menus" :key="index">
                        <div class="custom-bs pa-4" @click="handleMenuAction(menu)">
                            <div>
                                <div class="w-100 text-right" style="position: relative;">
                                    <v-menu offset-y left>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn dark icon v-bind="attrs" v-on="on">
                                                <v-icon color="primary">mdi-dots-vertical</v-icon>
                                            </v-btn>
                                        </template>

                                        <v-list>
                                            <v-list-item>
                                                <v-list-item-title @click="handleView(menu)"><v-icon
                                                        color="primary">mdi-eye</v-icon>&nbsp;&nbsp;&nbsp;View</v-list-item-title>
                                            </v-list-item>
                                            <v-list-item>
                                                <v-list-item-title @click="handleEdit(menu)"> <v-icon
                                                        color="warning">mdi-pencil</v-icon>&nbsp;&nbsp;&nbsp;
                                                    Update</v-list-item-title>
                                            </v-list-item>
                                            <v-list-item>
                                                <v-list-item-title @click="handleDelete(menu)"> <v-icon
                                                        color="error">mdi-trash-can</v-icon>&nbsp;&nbsp;&nbsp;
                                                    Delete</v-list-item-title>
                                            </v-list-item>
                                            <v-list-item>
                                                <v-list-item-title @click="handleActive(menu)" class="pb-2"> <v-btn block
                                                        large rounded :color="menu.is_active ? 'error' : 'primary'">{{
                                                            menu.is_active ? 'Make Inactive' : 'Make Active'
                                                        }}</v-btn></v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </div>
                                <div class="text-center">
                                    <div @click="handleView(menu)">
                                        <div class="w-100 d-flex align-center justify-space-around">
                                            <v-img height="100" width="100" contain
                                                :src="base_url + '/image-show/' + menu.profile_pic"></v-img>
                                        </div>
                                        <h5 class="primary--text text-uppercase pt-4">{{ menu.name }}</h5>
                                        <p class="f8 text-uppercase">({{ menu.cusine }})</p>
                                    </div>
                                    <v-chip :color="menu.is_active ? 'primary' : 'error'">{{ menu.is_active ? 'Active Menu':'Inactive' }}</v-chip>

                                </div>
                            </div>

                        </div>
                    </v-col>
                </v-row>
            </div>
            <ModalMenuDetail @close="handleCloseDetail()" :dialog-menu-detail="modal_menu_detail" :menu="menu" />

            <!-- <ModalMenuAction 
            :dialogMenuAction="modal_menu_action" 
            @view="handleView"
            @edit="handleEdit"
            @delete="handleDelete"
            @close="handleClose()" :menu="menu"/>  -->

            <ModalDelete :dialogConfirm="modal_confirm" @handleConfirm="handleDeleteConfirm" @close="handleCloseDelete" />
            <ModalDelete :dialogConfirm="modal_confirm_active" @handleConfirm="handleConfirmActive"
                @close="handleCloseDelete" />
        </div>
        <div v-else class="pa-4 text-center">
            <!-- <div v-if="loading"> -->
            <ComponentLoadingVue />
            <!-- </div> -->
            <!-- <div v-else class="unavailable">
                <p>
                    {{ message}}
                </p>
            </div> -->
        </div>
    </div>
</template>
<script>
import { base_url } from '@/core/services/config'
import { ApiService } from '@/core/services/api.service'
export default {
    props: {
        truckProfile: {},
    },
    watch: {
        truckProfile(val) {
            if (!val.menus.length) {
                this.message = "No menus";
            }
        }
    },
    data() {
        return {
            base_url,
            loading: false,
            modal_confirm: false,
            message: 'Loading...',
            modal_menu_action: false,
            modal_menu_detail: false,
            modal_confirm_active: false,
            menu: {},
            // switch1:1,
        }
    },
    components: {
        // ModalMenuAction: () => import('@/views/vendor/profile/modal/ModalMenuAction'),
        ModalMenuDetail: () => import('@/views/vendor/profile/modal/ModalVendorMenuDetail.vue'),
        ModalDelete: () => import('@/components/layout/DialogConfirm'),
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
    },
    methods: {
        handleActive(menu) {
            this.menu = menu;
            this.modal_confirm_active = true;
        },
        handleConfirmActive() {
            ApiService.post("/menu-active", {
                id: this.menu.id
            })
                .then((resp) => {
                    this.loaderHide();
                    this.messageSuccess(resp.message);
                    this.handleClose();
                    this.$emit('fetch');
                })
                .catch((error) => {
                    this.loaderHide();
                    console.log(error);
                })
        },
        handleView(menu) {
            this.$router.push("/vendor-profile-menu/" + menu.id);
        },
        handleEdit(item) {
            // this.modal_menu_action = false;
            this.$bus.$emit('VENDOR_MENU_EDIT', item);
        },
        handleDelete(menu) {
            this.menu = menu;
            // this.modal_menu_action = false;
            this.modal_confirm = true;
        },
        handleDeleteConfirm() {
            this.loaderShow();
            ApiService.post("/menu/delete", {
                id: this.menu.id
            })
                .then((resp) => {
                    this.loaderHide();
                    this.messageSuccess(resp.message);
                    this.handleCloseDelete();
                    this.$emit('fetch');
                })
                .catch((error) => {
                    this.loaderHide();
                    console.log(error);
                })
        },
        handleMenuAction(menu) {
            this.menu = menu;
            this.modal_menu_action = true;
        },
        handleCloseDetail() {
            this.modal_menu_detail = false;
        },
        handleCloseDelete() {
            this.modal_confirm = false;
            this.modal_confirm_active = false;
        },
        handleClose() {
            this.modal_confirm_active = false;
        },
        viewMenu(id) {
            this.$router.push("/vendor-menu/" + id).catch(() => { });
        }
    }
}
</script>
<style lang="scss" scoped>
.custom-bg-unavailable {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #cbcbcb;
}

.unittype {
    font-size: 0.8rem;
    text-transform: capitalize;
    font-weight: 400;
    color: #9a9a9a;
    margin-bottom: 10px !important;
}

.item-wrapper {
    margin-bottom: 14px;
    // border-radius: 4px;
    padding: 0 15px;

    // &:not(:last-child) {
    //     border-bottom:1px solid #dadada;
    // }
    .abc {
        padding: 16px 0;
    }
}

.menu-list {

    // background:#dadada;
    ul {
        list-style: none;
        padding: 0;
        display: flex;
        align-items: center;
        // justify-content: space-between;
        border-bottom: 2px solid;
        margin-bottom: -2px;

        // padding-bottom:10px;
        li {
            text-transform: capitalize;
            font-weight: 600;
            font-size: 0.9rem;
            padding: 14px;
            border-bottom: 2px solid;
            margin-bottom: -2px;

            &:not(:last-child) {
                // margin-right: 40px;
            }
        }
    }
}

.form-container {
    // .login-container{
    // background: #acfa95;
    border-radiu: 10px;
    margin-bottom: 60px !important;
    padding: 20px;
    min-height: 330px;
    // }
}</style>