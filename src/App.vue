<template>
  <v-app>
    <Spinner/>
    <router-view></router-view>
    <Notification/>
  </v-app>
</template>
<script>
import Notification from '@/components/notification/SnackbarNotification';
import Spinner from '@/components/layout/Spinner';
import { mapActions, mapGetters } from 'vuex'
export default {
	name: 'App',
	data: () => ({
		snackbar:true,
		timeout:5000,
		text:"snackbar",
	}),
	mounted() {
		if(this.currentUser){
			this.fetchCarts({email: this.currentUser.email});
		}
	},
	methods: {
		...mapActions({
			fetchCarts:'truck/fetchCarts',
		})
	},
	computed: {
		...mapGetters({
			currentUser:'auth/user'
		})
	},
	components: {
		Notification,
		Spinner
	}
};
</script>
<style lang="scss">
// Main demo style scss
@import "assets/sass/style.scss";
</style>
