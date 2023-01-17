<template>
	<v-bottom-navigation fixed :value="value" color="primary" grow>
		<span class="cart"><v-icon>mdi-cart</v-icon>Cart</span>
	</v-bottom-navigation>
</template>
<script>
import { mdiHome,mdiCart, mdiAccount, mdiChat } from "@mdi/js";
import { ApiService } from "@/core/services/api.service";
import { mapGetters } from "vuex";
export default {
	props: {
		items: {},
		value: {},
		index: {},
	},
	data() {
		return {
			iconHome: mdiHome,
			iconCart: mdiCart,
			iconProfile: mdiAccount,
			iconChat: mdiChat,
			count: 0,
			fetchInterval: null,
		};
	},
	mounted() {
		this.fetChats();
		this.fetchInterval = setInterval(() => {
			this.fetChats();
		}, 1e4);
	},
    beforeDestroy() {
        clearInterval(this.fetchInterval)
    },
	methods: {
		handleRoute(item) {
			if (item.destination) {
				localStorage.setItem("destination", item.destination);
			}
			this.$router.push("/" + item.route).catch(() => {});
		},
		fetChats() {
			if (!Object.keys(this.currentUser).length) {
				return;
			}
			// this.$bus.$emit('SHOW_PAGE_LOADER');
			ApiService.post("/chat/members")
				.then((resp) => {
					// this.$bus.$emit('HIDE_PAGE_LOADER');
					this.members = resp;
					this.count = 0;
					this.members.forEach((member) => {
						if (!member.last_message) return;
						if (member.last_message.table_from !== this.currentUser.table) {
							if (!member.last_message.is_seen) {
								this.count++;
							}
						}
					});
				})
				.catch(() => {
					this.$bus.$emit("HIDE_PAGE_LOADER");
				});
		},
	},
	computed: {
		...mapGetters(["currentUser"]),
	},
};
</script>

<style lang="scss" scoped>
.cart{
    width: 100%;
    text-align: center;
    padding: 16px 0;
}
.mg-auto {
	margin: 0 !important;
	margin: 0 auto;
}
</style>
