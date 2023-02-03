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
                primary: '#59A4BD',
                primaryello:'#32b595',
                primarylight: '#32b595',
                secondary: "#F1ADB5",
                white: colors.shades.white,
                accent: "#4CAF50",
                error: colors.red.accent3,
            },
            dark: {
                primary: "#59A4BD",
                secondary: "#F1ADB5",
                white:'#fff',
                grayc:'#989898',
            }
        }
    }
};
export default new Vuetify(opts);
