<template>
	<v-container class="ma-0 pa-0 background-image h-100">
		<Topnavbar :title="title" @back="handleBack" />
		<v-container class="mg56">
		<div class="custom-bs pa-4 mb-16">
			<v-form v-model="valid" ref="formLocation">
			<v-row>
				<v-col cols="12" class="pb-0 pt-4" md="12">
				<div style="height: 100px; width: 120px; margin: 0 auto">
					<InputUpload
					:src="base_url + '/image-show/' + menu.profile_pic"
					type="menu_image"
					:max-height="maxHeight"
					label="Change"
					@changeImage="changeImage"
					/>
				</div>
				</v-col>
				<v-col cols="12" class="pb-0 pt-0" md="12">
				<v-text-field
					v-model="menu.name"
					:rules="requiredRules"
					label="Name"
					required
				></v-text-field>
				</v-col>
				<v-col cols="6" class="pb-0 pt-0" md="6">
				<v-text-field
					v-model="menu.price"
					type="number"
					:rules="requiredRules"
					label="Price"
					required
				></v-text-field>
				</v-col>
				<v-col cols="6" class="pb-0 pt-0" md="6">
				<InputAutocomplete
					@selected="selectedAnswers"
					:defaultValue="defaultValue"
					label="Category"
					:items="categories"
				/>
				</v-col>
				<v-col cols="6" class="pb-0 pt-0" md="6">
				<!-- <v-text-field
									v-model="menu.unit_type"
									:rules="requiredRules"
									label="Unit Type"
									required
								></v-text-field> -->
				<InputAutocomplete
					@selected="selectedType"
					:defaultValue="defaultValueUnitType"
					label="Unit Type"
					:items="unit_type"
				/>
				</v-col>
				<v-col cols="6" class="pb-0 pt-0" md="6">
				<v-text-field
					v-model="menu.unit"
					:rules="requiredRules"
					label="Unit"
					type="number"
					v-mask="'####'"
					required
				></v-text-field>
				</v-col>

				<v-col cols="12" class="pb-0 pt-0" md="12">
				<v-textarea
					v-model="menu.description"
					:rules="requiredRules"
					label="Description"
					required
          auto-grow
          outlined
				></v-textarea>
				</v-col>
				<v-col cols="12">
				<v-btn
					color="primary"
					block
					class="mb-6"
					rounded
          large
					@click="handleSubmit"
					>Update</v-btn
				>
				<v-btn rounded block outlined color="error" @click="confirmDelete"
					>Delete</v-btn
				>
				</v-col>
			</v-row>
			</v-form>
		</div>
		<DialogConfirm
			:dialogConfirm="dialogConfirm"
			@handleConfirm="handleDelete"
			@close="handleClose"
		/>
		</v-container>
		<!-- <Bottomnavbar value="0" /> -->
	</v-container>
</template>
<script>
import Topnavbar from "@/components/layout/TopnavbarBackCustom";
import DialogConfirm from "@/components/layout/DialogConfirm";
import { ApiService } from "@/core/services/api.service";
// import Bottomnavbar from "@/components/layout/NavbarBottomFixed";
import { base_url } from "@/core/services/config";
import InputAutocomplete from "@/components/layout/InputAutocompleteSingleTextValue";
import moment from "moment";
import InputUpload from "@/components/form-element/InputUpload";
import { mapGetters } from "vuex";
export default {
  name: "MenuEditpage",
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
    };
  },
  mounted() {
    this.fetchMenuData();
    this.fetchCategory();
  },
  methods: {
    selectedType(data) {
      this.menu.unit_type = data.selected_data;
    },
    confirmDelete() {
      this.dialogConfirm = true;
    },
    handleClose() {
      this.dialogConfirm = false;
    },
    async handleDelete() {
      this.$bus.$emit("SHOW_PAGE_LOADER");
      this.menuId = this.$router.currentRoute.params.menuId;
      await ApiService.post("/menuitem/delete", { id: this.menuId })
        .then((resp) => {
          this.$bus.$emit("HIDE_PAGE_LOADER");
          this.messageSuccess(resp.message);
          this.$router.push("/profile-menu");
        })
        .catch(() => {
          this.$bus.$emit("HIDE_PAGE_LOADER");
          this.messageError("Failed to update address");
        });
    },
    selectedAnswers(data) {
      console.log(data);
      this.menu.category_id = data.selected_data;
    },
    fetchCategory() {
      this.$bus.$emit("SHOW_PAGE_LOADER");
      ApiService.get("lookup/food-menu-item-category")
        .then((resp) => {
          this.$bus.$emit("HIDE_PAGE_LOADER");
          this.categories = resp.food_category;
          this.unit_type = resp.unit_type;
        })
        .catch((error) => {
          this.$bus.$emit("HIDE_PAGE_LOADER");
          console.log(error);
        });
    },
    fetchMenuData() {
      this.menuId = this.$router.currentRoute.params.menuId;
      this.$bus.$emit("SHOW_PAGE_LOADER");
      ApiService.get("menuitem/" + this.menuId)
        .then((resp) => {
          this.$bus.$emit("HIDE_PAGE_LOADER");
          this.menu = resp.data;
          this.menu.profile_pic = resp.data.profile_pic
            ? resp.data.profile_pic
            : "noimage.png";
          this.defaultValue = resp.data.category_id;
          this.defaultValueUnitType = resp.data.unit_type;

        })
        .catch((error) => {
          this.$bus.$emit("HIDE_PAGE_LOADER");
          console.log(error);
        });
    },
    handleBack() {
      this.$router.back();
    },
    changeImage(file) {
      this.$bus.$emit("SHOW_PAGE_LOADER");
      let formData = new FormData();
      formData.append("file", file.file);
      ApiService.post("/store-image", formData)
        .then((resp) => {
          this.$bus.$emit("HIDE_PAGE_LOADER");
          this.menu.profile_pic = resp.file_name;
        })
        .catch(() => {
          this.messageError("Failed ! choose image less than size 2mb");
          this.$bus.$emit("HIDE_PAGE_LOADER");
        });
    },
    handleSubmit() {
      let valid = this.$refs.formLocation.validate();
      if (!valid) {
        this.messsageError("Flease fillup form fields");
        return;
      }
      this.$bus.$emit("SHOW_PAGE_LOADER");

      // console.log(this.menu);
      this.menu.vendor_id = this.currentUser.table_id;
      ApiService.post("menuitem/create/only", this.menu)
        .then((resp) => {
          this.$bus.$emit("HIDE_PAGE_LOADER");
          this.messageSuccess(resp.message);
          this.$router.push("/profile-menu");
        })
        .catch((error) => {
          this.$bus.$emit("HIDE_PAGE_LOADER");
          console.log(error);
        });
    },
  },
  components: {
    Topnavbar,
    // DatePicker,
    // Bottomnavbar,
    // InputAddress,
    DialogConfirm,
    InputUpload,
    InputAutocomplete,
    // InputUpload
  },

  computed: {
    ...mapGetters({
        currentUser: "auth/user",
    }),
  },
};
</script>
<style lang="scss" scoped>
.form-container {
  border-radius: 10px;
  padding: 20px;
}
</style>