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
                    <v-container>
                        <div class="background-image">
                            <div>
                                <div class="pa-4 custom-bs pt-6">

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
                                                <InputAutocomplete @selected="selectedAnswers"
                                                    :defaultValue="defaultValue" label="Category" :items="categories" />
                                            </v-col>
                                            <v-col cols="6" class="pb-0 pt-0" md="6">
                                                <InputAutocomplete @selected="selectedType"
                                                    :defaultValue="defaultValueUnitType" label="Unit Type"
                                                    :items="unit_type" />
                                            </v-col>
                                            <v-col cols="6" class="pb-0 pt-0" md="6">
                                                <v-text-field v-model="menu.unit" :rules="requiredRules" label="Unit"
                                                    type="number" v-mask="'####'" required></v-text-field>
                                            </v-col>

                                            <v-col cols="12" class="pb-0 pt-0" md="12">
                                                <v-textarea v-model="menu.description" :rules="requiredRules"
                                                    label="Description" required></v-textarea>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-btn color="primary" block class="mb-6" rounded
                                                    @click="handleSubmit">Update</v-btn>
                                                <v-btn rounded block outlined color="error"
                                                    @click="confirmDelete">Delete</v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-form>

                                </div>
                            </div>
                            <DialogConfirm :dialogConfirm="dialogConfirm" @handleConfirm="handleDelete"
                                @close="handleCloseDelete" />
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
        InputUpload
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
                description: "",
                profile_pic: "noimage.png",
                category_id: "",
                vendor_id: "",
            },
            selectedData: "",
            src: "noimage.png",
            categories: [],
            unit_type: [],
        }
    },
    watch: {
        dialogMenuItemEdit(newval) {
            if (newval) {
                this.fetchCategory();
            }
        }
    },
    methods: {
        ...mapActions({
            fetchProfile: 'auth/fetchProfile'
        }),
        selectedType(data) {
            this.menu.unit_type = data.selected_data;
        },
        confirmDelete() {
            this.dialogConfirm = true;
        },
        handleCloseDelete(){
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
            console.log(data);
            this.menu.category_id = data.selected_data;
        },
        fetchCategory() {
            this.loaderShow();
            ApiService.get("lookup/food-menu-item-category")
                .then((resp) => {
                    this.loaderHide();
                    this.categories = resp.food_category;
                    this.unit_type = resp.unit_type;

                    this.menu = this.item;
                    this.menu.profile_pic = this.item.profile_pic
                        ? this.item.profile_pic
                        : "noimage.png";
                    this.defaultValue = this.item.category_id;
                    this.defaultValueUnitType = this.item.unit_type;
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