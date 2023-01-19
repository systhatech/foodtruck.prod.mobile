import Vue from 'vue';
// import Vuetify from 'vuetify/lib/framework';
import Vuetify from 'vuetify';
import colors from "vuetify/lib/util/colors";
import 'vuetify/dist/vuetify.min.css'
Vue.use(Vuetify);

const opts = {
    theme: {
        themes: {
            light: {
                // primary: '#32b595',
                // primary: '#f16739',
                primary: '#39b597',
                // primary: '#ffff00',
                primaryello:'#32b595',
                primarylight: '#32b595',
                secondary: "#000",
                white: colors.shades.white,
                accent: "#4CAF50",
                error: colors.red.accent3,
            },
            dark: {
                primary: "#32b595",
                secondary: "#000",
                white:'#fff',
                grayc:'#989898',
            }
        }
    }
};
export default new Vuetify(opts);
