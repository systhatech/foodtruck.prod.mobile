import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth.module";
import defaultCompany from "./default_company.module";
import vendor from "./vendor.module";
// import profile from "./profile.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    defaultCompany,
    vendor
    // profile
  }
});
