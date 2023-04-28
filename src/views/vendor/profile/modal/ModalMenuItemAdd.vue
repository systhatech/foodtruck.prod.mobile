<template>
    <div>
        <v-row justify="center">
            <v-dialog v-model="dialogMenuItemAdd" persistent scrollable fullscreen>
                <v-card style="padding-top: 56px !important;">
                    <v-toolbar dark color="primary" style="position: fixed;top: 0;width: 100%;z-index: 1;">
                        <v-toolbar-title class="pl-0 text-capitalize">Add Menu Item</v-toolbar-title>
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
                                <div class="pa-4 custom-bs ma-4 mb-14">

                                    <v-form v-model="valid" ref="formLocation">
                                        <v-row>
                                            <v-col
                                            cols="12"
                                            class="pb-0 pt-4"
                                            md="12"
                                            >
                                                <div style="height:100px; width:120px; margin:0 auto;">
                                                    <InputUpload :src="base_url+'/image-show/'+(menu ? menu.profile_pic:'noimage.png')" 
                                                    type="menu_image" 
                                                    :max-height="maxHeight"
                                                    label="Change"
                                                    @changeImage="changeImage"/>
                                                </div>
                                            </v-col>
                                            <v-col
                                            cols="12"
                                            class="pb-0 pt-0"
                                            md="12"
                                            >
                                                <v-text-field
                                                    v-model="menu.name"
                                                    :rules="requiredRules"
                                                    label="Name"
                                                    required
                                                ></v-text-field>
                                            </v-col>
                                            <v-col
                                            cols="6"
                                            class="pb-0 pt-0"
                                            md="6"
                                            >
                                                <v-text-field
                                                    v-model="menu.price"
                                                        type="number"
                                                    :rules="requiredRules"
                                                    label="Price"
                                                    required
                                                ></v-text-field>
                                            </v-col>
                                            <v-col
                                            cols="6"
                                            class="pb-0 pt-0"
                                            md="6"
                                            >
                                                <v-text-field
                                                    v-model="menu.unit"
                                                    :rules="requiredRules"
                                                    label="Quantity"
                                                    v-mask="'####'"
                                                    required
                                                ></v-text-field>
                                            </v-col>
                                            <v-col
                                            cols="12"
                                            class="pb-0 pt-0"
                                            md="6"
                                            >
                                            <div class="d-flex align-center w-100">
                                            <div style="flex-grow:1">
                                                    <InputAutocomplete @selected="selectedAnswers" label="Category" :items="categories"/>
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
                                                    <InputAutocomplete @selected="selectedType" label="Unit Type" :items="unit_type"/>
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
                                           


                                            <v-col
                                            cols="12"
                                            class="pb-0 pt-0"
                                            md="12"
                                            >
                                                <v-textarea
                                                    v-model="menu.description"
                                                    :rules="requiredRules"
                                                    label="Description"
                                                    required
                                                ></v-textarea>
                                            </v-col>
                                            <v-col cols="12" class="text-center">
                                                <v-btn color="primary" block  large
                                                rounded @click="handleSubmit">Submit</v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-form>

                                </div>
                            </div>
                            <DialogConfirm :dialogConfirm="dialogConfirm" @handleConfirm="handleDelete"
                                @close="handleClose" />
                        </div>
                    </v-container>
                    <ModalCuisineType 
                    :availableCuisines="lookup_values"
                    :code="lookup_code"
                    :label="lookup_label"
                    :dialogCuisineType="modal_vendor_lookup" 
                    @fetchCuisines="fetchVendorLookups"
                    @close="handleCloseCuisineType()"/>
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
        dialogMenuItemAdd: {
            required: true,
            type: Boolean,
        },
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
                is_special:false,
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
            // lookup_seleted:[],
        }
    },
    watch: {
        dialogMenuItemAdd(newval) {
            if (newval) {
                this.fetchCategory();
                this.fetchUnitType();
            }else{
                this.menu = {
                    name: "",
                    price: "",
                    unit_type: "",
                    unit: "",
                    description: "",
                    profile_pic: "noimage.png",
                    item_category_id: "",
                    vendor_id: "",
                }
                this.categories = [];
                this.unit_type = [];
                this.lookup_values = [];
            }
        }
    },
    methods: {
        ...mapActions({
            fetchProfile: 'auth/fetchProfile'
        }),
        fetchVendorLookups(param){
            if(param.code =='menu_item_category'){
                this.fetchCategory();
            }else if(param.code=='unit_type'){
                this.fetchUnitType();
            }
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
        handleCloseCuisineType(){
            this.modal_vendor_lookup = false;
            // this.fetchCuisineTypes();
        },
        selectedType(data) {
            this.menu.unit_type = data.selected_data;
        },
        confirmDelete() {
            this.dialogConfirm = true;
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
                    this.$router.push("/profile-menu");
                })
                .catch(() => {
                    this.loaderHide();
                    this.messageError("Failed to update address");
                });
        },
        selectedAnswers(data) {
            console.log(data);
            this.menu.item_category_id = data.selected_data;
        },
        fetchCategory() {
            this.loaderShow();
            ApiService.post("/vendor-lookup-values",{'code': 'menu_item_category'})
                .then((resp) => {
                    this.loaderHide();
                    this.categories = resp.data;
                    this.lookup_values = this.categories;
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
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            });
        },
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
            this.menu.menu_id = this.$router.currentRoute.params.menuId;
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