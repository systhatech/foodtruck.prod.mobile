<template>
<div>
     <v-bottom-navigation fixed  color="primary" grow>
		<v-btn to="/">
			<span>Home</span>
			<v-icon>{{ iconHome }}</v-icon>
		</v-btn>
        <v-btn to="/client-truck-request-list" >
			<span>Request</span>
			<v-icon>mdi-truck</v-icon>
		</v-btn>
		<v-btn to="/client-orders">
			<span>Orders</span>
			<v-icon>{{ iconFood }}</v-icon>
		</v-btn>
       
		<v-btn to="/client-chat-list">
			<span>Message</span>
			<!-- <div class="d-flex">
				<v-icon>{{ iconChat }}</v-icon>
				<span class="color-secondary f8-bold ">{{
					count > 0 ? count : ""
				}}</span>
			</div> -->
            <div v-if="count>0">
                <v-badge
                    small
                    color="error"
                    :content="count"
                    >
                    <v-icon color="primary">{{ iconChat }}</v-icon>
                </v-badge>
            </div>
            <div v-else>
                <v-icon>{{ iconChat }}</v-icon>
            </div>
		</v-btn>
      
        <v-btn to="/client-profile" >
			<span>Account</span>
			<v-icon>{{ iconProfile }}</v-icon>
		</v-btn>
    </v-bottom-navigation>
</div>
</template>
<script>
import {mdiHome, mdiCart, mdiAccount, mdiChat,mdiHeadphones, mdiInformationVariant, mdiLogin, mdiBasket} from "@mdi/js";
import {ApiService} from "@/core/services/api.service";
// import JwtService from "@/core/services/jwt.service";
import {mapGetters} from "vuex";

export default {
    props: {
        // value: {},
        index: {},
    },
    data() {
        return {
            iconHome: mdiHome,
            iconCart: mdiCart,
            iconFood: mdiBasket,
            iconProfile: mdiAccount,
            iconSupport: mdiHeadphones,
            iconChat: mdiChat,
            iconLogin: mdiLogin,
            iconAbout: mdiInformationVariant,
            count: 0,
            fetchInterval: null,

            items:[],
            itemsIn: [
                {id: 1, name: 'Home', route: '', routeName:'homePage',icon: 'mdi-home'},
                {id: 2, name: 'orders', route: 'orders', routeName:'OrdersPage', icon: 'mdi-cart'},
                {id: 3, name: 'Chat', route: 'chat-list', routeName:'ChatListPage',icon: 'mdi-chat', count:true},
                {id: 4, name: 'Profile', route: 'profile',  routeName:'profilepage',icon: 'mdi-account'},
            ],
            itemsOut: [
                {id: 1, name: 'Login', route: 'login', routeName:'OrdersPage', icon: 'mdi-login'},
                {id: 2, name: 'About', route: 'about-us', routeName:'AboutUsPage', icon: 'mdi-information-variant'},
            ],
            isLoggedin:0,
            played:[],
        };
    },
    mounted() {
        if(this.currentUser){
            this.fetChats();
        }
    },
    beforeDestroy() {
        clearInterval(this.fetchInterval)
    },
    methods: {
        handleRoute(item) {
            if (item.route) {
                localStorage.setItem("destination", item.route);
            }
            // this.$router.push("/"+item.route);
            if(this.$router.currentRoute.name != item.routeName){
                // this.$router.replace({name: item.routeName});
                this.$router.replace({name: item.routeName}).catch(()=>{});
            }
        },
        fetChats() {
            if (!Object.keys(this.currentUser).length) {
                return;
            }
            // this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.post("/chat/members")
                .then((resp) => {
                    this.members = resp;
                    this.count = 0;
                    this.members.forEach(member => {
                        if (member.last_message.table_from !== this.currentUser.table) {
                            if (!member.last_message.is_seen) {
                                this.count++;
                            }
                        }
                    });
                    // this.count = 0;
                    // // this.members.forEach((member) => {
                    // //     if (!member.last_message) return;
                    // //     if (member.last_message.table_from !== this.currentUser.table) {
                    // //         if (!member.last_message.is_seen) {
                    // //             this.count++;
                    // //         }
                    // //     }
                    // // });
                    // this.members.forEach((member) => {
					// 	if (!member.last_message) return;
					// 	if (member.last_message.table_from !== this.currentUser.table) {
					// 		if (!member.last_message.is_seen) {
							
					// 			this.count++;
					// 			if(this.played.indexOf(member.id) === -1 ) {
					// 				this.played.push(member.id);
					// 				this.notify.play();
					// 			}
					// 		}else{
					// 			const c = this.played.indexOf(member.id);
					// 			this.played.splice(c,1);
					// 		}
					// 	}
					// });
                })
                .catch(() => {
                    this.$bus.$emit("HIDE_PAGE_LOADER");
                });
        },
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user'
        }),
    },
};
</script>

<style lang="scss" scoped>
.badge {
    position: absolute;
    right: 50%;
    top: 0;
    width: auto;
    height: auto;
    z-index: 99;
    transform: translateX(200%);
}
.mg-auto {
    margin: 0 !important;
    margin: 0 auto;
}
</style>
