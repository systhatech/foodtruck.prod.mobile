<template>
    <v-container class="ma-0 pa-0 h-100 background-image">
        <v-container class="d-flex align-center" style="height:700px">
            <div class="w-100">
                <div class="pt-14">
                    <v-row>
                        <v-col cols="12">
                            <div class="mt-10">
                                <v-btn icon text color="primary" :to="{
                                    name: 'home'
                                }"><v-icon class="mr-0 pr-0">{{ icon_back }}</v-icon></v-btn>
                            </div>
                            <div class="text-center mb-0 mt-6">
                                <img :src="base_url+'/default-company/logo'" width="200" />
                            </div>
                        </v-col>
                        <v-col cols="12" md="6" offset-md="3" lg="4" offset-lg="4">
                            <div class="pa-6 custom-bs bg-primary-light">
                                <v-form ref="formLogin">
                                    <v-row>
                                        <v-col cols="12" class="pt-0">
                                            <v-text-field label="Email" :rules="emailRules"
                                                v-model="login_info.email"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" class="pt-0">
                                            <v-text-field class="pt-0" :append-icon="
                                            show_password ? 'mdi-eye' : 'mdi-eye-off'" :type="show_password ? 'text' : 'password'"
                                                name="password" v-model="login_info.password" label="Password"
                                                :rules="rulesRequired" autocomplete="off" required
                                                @click:append="show_password = !show_password"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" class="text-right pb-0 pt-0">
                                            <v-btn tile small text to="/password-forget">Forget Password?</v-btn>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-btn rounded color="primary" large block class="mr-4" @click="submit">
                                                sign in
                                            </v-btn>
                                        </v-col>
                                       
                                    </v-row>
                                </v-form>
                            </div>
                            <div>
                                <div class="text-center ma-2">
                                    <p class="f8-bold" style="color:#4a4a4a;text-transform: uppercase;"></p>
                                    <div>
                                        <v-btn to="/signup-customer" class="mb-2" text color="primary">Sign up as Customer</v-btn>
                                        <v-btn to="/signup-truck" text color="primary">Sign up as Truck</v-btn>
                                    </div>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </div>
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
        logo: '',
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
            type:'create',
        },
    }),
    components: {
        // Bottomnavbar,
    },

    mounted() {
        // this.locateGeoLocation();
        // let route = this.$router.currentRoute.query;
        // console.log(route);

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
            if (!this.$refs.formLogin.validate()) return;
            this.loaderShow();
            this.signIn(this.login_info)
                .then((resp) => {
                    window.updateLatLng();
                    this.locateGeoLocation();
                    this.loaderHide();
                    if(resp && resp.verify){
                        console.log("here", {resp});
                        this.$router.push({ name:'VerifyEmailPage', query:{ email: resp.email, type:'clients'}});
                    }else{
                        this.fetchAddress();
                        if (this.$router.currentRoute.query) {
                            let route = this.$router.currentRoute.query;
                            if (route.page && route.id) {
                                this.$router.push("/" + route.page + "/" + route.id);
                            } else {
                                this.$router.replace({
                                    name: 'home',
                                })
                            }
                        } else {
                            this.$router.replace({
                                name: 'home',
                            })
                        }
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
