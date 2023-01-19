<template>
    <v-container class="ma-0 pa-0 h-100 background-image">
        <v-container>
            <div class="mt-10">
                <v-btn icon text color="primary" :to="{
                    name: 'home'
                }"><v-icon class="mr-0 pr-0">{{ icon_back }}</v-icon></v-btn>
            </div>
            <div class="pt-4">
                <v-row>
                    <v-col cols="12">
                        <div class="text-center mb-2">
                            <img :src="base_url+'/default-company/logo'" width="90" />
                        </div>
                    </v-col>
                </v-row>
            </div>
            <div class="pa-4 custom-bs bg-primary-light">
                <v-form ref="formLogin">
                    <v-row>
                        <v-col cols="12" class="pt-0">
                            <v-text-field label="Email" :rules="emailRules" v-model="login_info.email"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pt-0">
                            <v-text-field class="pt-0" :append-icon="
                                show_password ? 'mdi-eye' : 'mdi-eye-off'" :type="show_password ? 'text' : 'password'" name="password"
                                v-model="login_info.password" label="Password" :rules="rulesRequired" autocomplete="off"
                                required @click:append="show_password = !show_password"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="text-right pb-0 pt-0">
                            <v-btn tile small text link to="/password-forget">Forget Password?</v-btn>
                        </v-col>
                        <v-col cols="12">
                            <v-btn rounded color="primary" block class="mr-4" @click="submit">
                                sign in
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </div>
            <div class="text-center pa-6 ma-4">
                <p class="f8-bold" style="color:#4a4a4a;text-transform: uppercase;">sign up ?</p>
                <v-btn class="mb-4" link to="signup-customer" rounded color="primary" outlined>Customer</v-btn>
                <br>
                <v-btn link to="signup-truck" rounded color="primary" outlined>Truck</v-btn>
            </div>
        </v-container>

    </v-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { ApiService } from '@/core/services/api.service'
import { base_url } from '@/core/services/config'
import { mdiChevronLeft } from '@mdi/js'
export default {
    data: () => ({
        icon_back: mdiChevronLeft,
        base_url,
        logo:'',
        login_info: {
            email: "",
            password: "",
            lat: 0,
            lng: 0
        },
        show_password: false,
        emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        rulesRequired: [
            v => !!v || 'Required',
        ],
        location: {
            lat: 0,
            lng: 0,
            add1: '',
            city: '',
            state: '',
            zip_code: '',
            country: '',
        },
        destination: 'signup-customer',
        // VueCordova
    }),
    components: {
        // Bottomnavbar,
    },

    mounted() {
        // this.fetchLogo();
        this.locateGeoLocation();

    },
    computed: {
        ...mapGetters({
            currentUser: 'auth/user',
            authenticated: 'auth/authenticated'
        })
    },
    methods: {
        ...mapActions({
            signIn: 'auth/signIn'
        }),
        async submit() {
            this.loaderShow();
            this.signIn(this.login_info)
                .then(() => {
                    this.loaderHide();
                    if (this.currentUser.table == 'vendors') {
                        this.$router.replace({
                            name: 'OrdersPage',
                        })
                    } else {
                        this.$router.replace({
                            name: 'home',
                        })
                    }

                }).catch((error) => {
                    this.loaderHide();
                    if (error.response && error.response.data) {
                        this.messageError(error.response.data.message);
                    } else if (error.response.statusText) {
                        this.messageError(error.response.statusText);
                    } else {
                        this.messageError('Contact to support');
                    }
                })
        },

        locateGeoLocation: function () {

            navigator.geolocation.getCurrentPosition(res => {
                this.location.lat = res.coords.latitude;
                this.location.lng = res.coords.longitude;
            });

        },
        async fetchLogo() {
            this.$bus.$emit('SHOW_PAGE_LOADER')
            await ApiService.get("default-company/logo")
                .then((resp) => {
                    this.logo = resp;
                    this.loaderHide();
                })
                .catch(() => {
                    this.loaderHide();
                    this.messageError('Sorry, Something goes wrong');
                });
        },
        async fetchAddress() {
            this.loaderShow();
            ApiService.get('/getapikeys')
            .then(async (apiKeys) => {
                let googleApiKey = apiKeys.google;
                await ApiService.post(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.location.lat},${this.location.lng}&key=${googleApiKey}`)
                    .then((resp) => {
                        this.loaderHide();
                        for (let addr of resp.results) {
                            let address = this.parseGoogleResponse(addr.address_components);
                            this.location.add1 = address.street_number + " " + address.route;
                            this.location.city = address.locality;
                            this.location.state = address.administrative_area_level_1;
                            this.location.zip_code = address.postal_code;
                            this.location.country = address.country;
                            break;
                        }
                        this.updateLocation();

                    })
                    .catch(() => {
                        this.loaderHide();
                    })
            })
        },
        async updateLocation() {
            this.loaderShow();
            await ApiService.post('/location/save-current', this.location)
                .then(() => {
                    this.loaderHide();
                })
                .catch((error) => {
                    console.log(error);
                    this.loaderHide();

                })
        }
    },
};
</script>
<style lang="scss" scoped>

</style>
