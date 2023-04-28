<template>
    <div>
        <v-row justify="center">
            <v-dialog v-model="dialogMenuItemEdit" persistent scrollable fullscreen>
                <v-card style="padding-top: 56px !important;">
                    <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                        <v-toolbar-title class="pl-0 text-capitalize">Update Item</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn text @click="handleClose">
                                Close
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-container class="pa-0">
                        <div class="background-image">
                            <div>
                                <div class="pa-4 custom-bs mt-14 ma-4 mb-14">

                                    <v-form v-model="valid" ref="formLocation">
                                        <v-row>
                                            <v-col cols="12" class="pb-0 pt-4" md="12">
                                                <div style="height: 100px; width: 120px; margin: 0 auto">
                                                    <InputUpload :src="base_url + '/image-show/' + menu.profile_pic"
                                                        type="menu_image" :max-height="maxHeight" label="Change"
                                                        @changeImage="changeImage" />
                                                </div>
                                            </v-col>
                                            <v-col cols="12" class="pb-0 pt-0" md="12">
                                                <v-text-field v-model="menu.name" :rules="requiredRules" label="Name"
                                                    required></v-text-field>
                                            </v-col>
                                            <v-col cols="6" class="pb-0 pt-0" md="6">
                                                <v-text-field v-model="menu.price" type="number" :rules="requiredRules"
                                                    label="Price" required></v-text-field>
                                            </v-col>
                                            <v-col cols="6" class="pb-0 pt-0" md="6">
                                                <v-text-field v-model="menu.unit" :rules="requiredRules" label="Quantity"
                                                    type="number" v-mask="'####'" required></v-text-field>
                                            </v-col>
                                            <!-- <v-col cols="6" class="pb-0 pt-0" md="6">
                                                <InputAutocomplete @selected="selectedAnswers"
                                                    :defaultValue="defaultValue" label="Category" :items="categories" />
                                            </v-col>
                                            <v-col cols="6" class="pb-0 pt-0" md="6">
                                                <InputAutocomplete @selected="selectedType"
                                                    :defaultValue="defaultValueUnitType" label="Unit Type"
                                                    :items="unit_type" />
                                            </v-col> -->
                                            <v-col
                                            cols="12"
                                            class="pb-0 pt-0"
                                            md="6"
                                            >
                                            <div class="d-flex align-center w-100">
                                            <div style="flex-grow:1">
                                                    <InputAutocomplete 
                                                        @selected="selectedAnswers" 
                                                        :defaultValue="defaultValue"
                                                        label="Category" 
                                                        :items="categories"/>
                                                </div>
                                                <div class="ml-4">
                                                    <v-btn small color="primary" fab @click="handleAddLookup('menu_item_category','Category Name')"><v-icon>mdi-plus</v-icon></v-btn>
                                                </div>
                                            </div>
                                            </v-col>
                                            <v-col
                                            cols="12"
                                            class="pb-0 pt-0"
                                            md="6"
                                            >
                                            <div class="d-flex align-center w-100">
                                            <div style="flex-grow:1">
                                                    <InputAutocomplete 
                                                    label="Unit Type" 
                                                    @selected="selectedType" 
                                                    :defaultValue="defaultValueUnitType"
                                                    :items="unit_type"/>
                                                </div>
                                                <div class="ml-4">
                                                    <v-btn small color="primary" fab @click="handleAddLookup('unit_type','Unit Type')"><v-icon>mdi-plus</v-icon></v-btn>
                                                </div>
                                            </div>
                                            </v-col>
                                            <v-col
                                            cols="12"
                                            class="pb-0 pt-0"
                                            md="6"
                                            >
                                            <div class="w-100">
                                                <v-checkbox
                                                v-model="menu.is_special"
                                                label="Today's Special"
                                                ></v-checkbox>
                                            </div>
                                            </v-col>
                                          

                                            <v-col cols="12" class="pb-0 pt-0" md="12">
                                                <v-textarea v-model="menu.description" :rules="requiredRules"
                                                    label="Description" required></v-textarea>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-btn color="primary" block class="mb-6" rounded large
                                                    @click="handleSubmit">Update</v-btn>
                                                <v-btn rounded block outlined color="error" large
                                                    @click="confirmDelete">Delete</v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-form>

                                </div>
                            </div>
                            <DialogConfirm :dialogConfirm="dialogConfirm" @handleConfirm="handleDelete"
                                @close="handleCloseDelete" />
                                <ModalCuisineType 
                                :availableCuisines="lookup_values"
                                :code="lookup_code"
                                :label="lookup_label"
                                :dialogCuisineType="modal_vendor_lookup" 
                                @fetchCuisines="fetchVendorLookups"
                                @close="handleCloseCuisineType()"/>
                        </div>
                    </v-container>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>
<script>
import DialogConfirm from "@/components/layout/DialogConfirm";
import { ApiService } from "@/core/services/api.service";
// import Bottomnavbar from "@/components/layout/NavbarBottomFixed";
import { base_url } from "@/core/services/config";
import InputAutocomplete from "@/components/layout/InputAutocompleteSingleTextValue";
import moment from "moment";
import InputUpload from "@/components/form-element/InputUpload";
import { mapGetters, mapActions } from "vuex";
export default {
    props: {
        dialogMenuItemEdit: {
            required: true,
            type: Boolean,
        },
        item: {
            required: true,
        }
    },
    components: {
        // Topnavbar,
        // DatePicker,
        // Bottomnavbar,
        // InputAddress,
        DialogConfirm,
        InputAutocomplete,
        InputUpload,
        ModalCuisineType: ()=> import('@/views/vendor/profile/modal/ModalCuisineType')
    },
    data() {
        return {
            valid: true,
            start_date: new Date(),
            end_date: new Date(),
            moment,
            maxHeight: 100,
            dialogConfirm: false,
            title: "",
            base_url,
            schedules: [],
            requiredRules: [(v) => !!v || "Required"],
            defaultValue: "",
            defaultValueUnitType: "",
            menu: {
                name: "",
                price: "",
                unit_type: "",
                unit: "",
                is_special:0,
                description: "",
                profile_pic: "noimage.png",
                item_category_id: "",
                vendor_id: "",
            },
            selectedData: "",
            src: "noimage.png",
            categories: [],
            unit_type: [],
            lookup_code:'',
            lookup_label:'',
            modal_vendor_lookup:false,
            lookup_values:[],

        }
    },
    watch: {
        dialogMenuItemEdit(newval) {
            if (newval) {
                this.menu = this.item;
                this.fetchCategory();
                this.fetchUnitType();
            }
        }
    },
    methods: {
        ...mapActions({
            fetchProfile: 'auth/fetchProfile'
        }),
        handleCloseCuisineType(){
            this.modal_vendor_lookup = false;
        },
        fetchVendorLookups(param){
            if(param.code =='menu_item_category'){
                this.fetchCategory();
            }else if(param.code=='unit_type'){
                this.fetchUnitType();
            }
        },
        fetchCategory() {
            this.loaderShow();
            ApiService.post("/vendor-lookup-values",{'code': 'menu_item_category'})
                .then((resp) => {
                    this.loaderHide();
                    this.categories = resp.data;
                    this.lookup_values = this.categories;
                    let selected = this.categories.filter((item)=>item.id == this.menu.item_category_id);
                    setTimeout(() => {
                        this.defaultValue = selected[0];
                    }, 200);
                })
                .catch((error) => {
                    this.loaderHide();
                    console.log(error);
                });
        },
        fetchUnitType() {
            this.loaderShow();
            ApiService.post("/vendor-lookup-values",{'code': 'unit_type'})
            .then((resp) => {
                this.loaderHide();
                this.unit_type = resp.data;
                this.lookup_values = this.unit_type;
                let selected = this.unit_type.filter((item)=>item.id == this.menu.unit_type);
                setTimeout(() => {
                    this.defaultValueUnitType = selected[0];
                }, 200);
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            });
        },
        handleAddLookup(code, label){
            if(code == 'unit_type'){
                this.lookup_values = this.unit_type;
            }
            if(code == 'menu_item_category'){
                this.lookup_values = this.categories;
            }
            this.lookup_code = code;
            this.lookup_label = label;
            this.modal_vendor_lookup = true;
        },
        selectedType(data) {
            this.menu.unit_type = data.selected_data;
        },
        confirmDelete() {
            this.dialogConfirm = true;
        },
        handleCloseDelete() {
            this.dialogConfirm = false;
            this.$emit('close');
        },
        handleClose() {
            this.$emit('close');
        },
        async handleDelete() {
            this.loaderShow();
            this.menuId = this.$router.currentRoute.params.menuId;
            await ApiService.post("/menuitem/delete", { id: this.menuId })
                .then((resp) => {
                    this.loaderHide();
                    this.messageSuccess(resp.message);
                    this.fetchProfile();
                    this.handleCloseDelete();
                    this.$router.back();
                })
                .catch(() => {
                    this.loaderHide();
                    this.messageError("Failed to update address");
                });
        },
        selectedAnswers(data) {
            this.menu.item_category_id = data.selected_data;
        },
        // fetchCategory() {
        //     this.loaderShow();
        //     ApiService.get("lookup/food-menu-item-category")
        //         .then((resp) => {
        //             this.loaderHide();
        //             this.categories = resp.food_category;
        //             this.unit_type = resp.unit_type;

        //             this.menu = this.item;
        //             this.menu.profile_pic = this.item.profile_pic
        //                 ? this.item.profile_pic
        //                 : "noimage.png";
        //             this.defaultValue = this.item.category_id;
        //             this.defaultValueUnitType = this.item.unit_type;
        //         })
        //         .catch((error) => {
        //             this.loaderHide();
        //             console.log(error);
        //         });
        // },
        handleBack() {
            this.$router.back();
        },
        changeImage(file) {
            this.loaderShow();
            let formData = new FormData();
            formData.append("file", file.file);
            ApiService.post("/store-image", formData)
                .then((resp) => {
                    this.loaderHide();
                    this.menu.profile_pic = resp.file_name;
                })
                .catch(() => {
                    this.messageError("Failed ! choose image less than size 2mb");
                    this.loaderHide();
                });
        },
        handleSubmit() {
            let valid = this.$refs.formLocation.validate();
            if (!valid) {
                this.messsageError("Flease fillup form fields");
                return;
            }
            this.loaderShow();

            // console.log(this.menu);
            this.menu.vendor_id = this.currentUser.table_id;
            ApiService.post("menuitem/create/only", this.menu)
                .then((resp) => {
                    this.loaderHide();
                    this.messageSuccess(resp.message);
                    this.fetchProfile();
                    this.handleClose();
                })
                .catch((error) => {
                    this.loaderHide();
                    console.log(error);
                });
        },
    },

    computed: {
        ...mapGetters({
            currentUser: 'auth/user',
        })
    }
}
</script>
<style lang="scss" scoped>
.custom-input {
    border-bottom: 1px solid #afafaf;
    padding: 4px 0;
}
</style>