<template>
<div>
     <v-bottom-navigation fixed  color="primary" grow v-if="isLoggedin">
		<v-btn link to="/">
			<span>Home</span>
			<v-icon>{{ iconHome }}</v-icon>
		</v-btn>
		<v-btn link to="/orders">
			<span>Orders</span>
			<v-icon>{{ iconFood }}</v-icon>
		</v-btn>
       
		<v-btn link to="/chat-list">
			<span>Chat </span>
			<div class="d-flex">
				<v-icon>{{ iconChat }}</v-icon>
				<span class="color-secondary f8-bold ">{{
					count > 0 ? count : ""
				}}</span>
			</div>
		</v-btn>
        <v-btn link to="/profile" >
			<span>Profile</span>
			<v-icon>{{ iconProfile }}</v-icon>
		</v-btn>
        <!-- <v-btn link to="/support" >
			<span>support</span>
			<v-icon>{{ iconSupport }}</v-icon>
		</v-btn> -->
    </v-bottom-navigation>
     <v-bottom-navigation  v-else fixed color="primary" grow>
        <v-btn link to="/login">
			<span>Login</span>
			<v-icon>{{ iconLogin }}</v-icon>
		</v-btn>
		<v-btn link to="/about-us">
			<span>About</span>
			<v-icon>{{ iconAbout }}</v-icon>
		</v-btn>
    </v-bottom-navigation>
</div>
</template>
<script>
import {mdiHome, mdiCart, mdiAccount, mdiChat, mdiFood,mdiHeadphones, mdiInformationVariant, mdiLogin} from "@mdi/js";
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
            iconFood: mdiFood,
            iconProfile: mdiAccount,
            iconChat: mdiChat,
            iconSupport: mdiHeadphones,
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
            this.fetchInterval = setInterval(() => {
                this.fetChats();
            }, 1e4);
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
                    this.members.forEach((member) => {
						if (!member.last_message) return;
						if (member.last_message.table_from !== this.currentUser.table) {
							if (!member.last_message.is_seen) {
							
								this.count++;
								if(this.played.indexOf(member.id) === -1 ) {
									this.played.push(member.id);
									this.notify.play();
								}
							}else{
								const c = this.played.indexOf(member.id);
								this.played.splice(c,1);
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
        ...mapGetters({currentUser:'auth/user'}),
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
