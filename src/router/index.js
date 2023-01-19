import Vue from 'vue'
import VueRouter from 'vue-router'
// import JwtService from '@/core/services/jwt.service'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'home',
		component: () => import(/* webpackChunkName: "dashboardPage" */ '../views/dashboard/DashboardPage.vue'),
		meta: { requiresAuth: false },
	
	},

	{
		path: '/login',
		name: 'loginPage',
		component: () => import(/* webpackChunkName: "LoginPage" */ '../views/auth/LoginPage.vue'),
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next({
					name: 'home'
				});
			}else{
				next();
			}
		}
	},
	{
		path: '/password-forget',
		name: 'PasswordResetPage',
		component: () => import(/* webpackChunkName: "PasswordResetPage" */ '../views/auth/PasswordResetPage.vue'),
	},

	{
		path: '/signup-customer',
		name: 'signupCustomer',
		component: () => import(/* webpackChunkName: "signupCustomer" */ '../views/auth/SignupCustomer.vue'),
	},
	{
		path: '/signup-truck',
		name: 'signupTruck',
		component: () => import(/* webpackChunkName: "signupCustomer" */ '../views/auth/SignupTruck.vue'),
	},
	
	// new routes starts
	
	{
		path: '/client-orders',
		name: 'clientOrdersPage',
		component: () => import(/* webpackChunkName: "signupCustomer" */ '../views/client/order/ClientOrdersPage.vue'),
	},
	{
		path: '/client-order/:orderId',
		name: 'clientOrderDetailPage',
		component: () => import(/* webpackChunkName: "signupCustomer" */ '../views/client/order/ClientOrderDetailPage.vue'),
	},
	{
		path: '/client-profile',
		name: 'clientProfilePage',
		component: () => import(/* webpackChunkName: "signupCustomer" */ '../views/client/profile/ClientProfilePage.vue'),
	},
	{
		path: '/client-chat-list',
		name: 'clientChatList',
		component: () => import(/* webpackChunkName: "signupCustomer" */ '../views/client/chat/ClientChatListPage.vue'),
	},
	{
		path: '/client/conversation/:type/:id',
		name: 'ClientChatConversationPage',
		component: () => import(/* webpackChunkName: "ConversationPage" */ '../views/client/chat/ClientChatConversationPage.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},


	// new routes ends






	{
		path: '/profile',
		name: 'profilepage',
		component: () => import(/* webpackChunkName: "profilepage" */ '../views/profile/ProfilePage.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/change-password',
		name: 'ChnagePassword',
		component: () => import(/* webpackChunkName: "ChnagePassword" */ '../views/profile/ProfileChangePassword.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/setting',
		name: 'SettingPage',
		component: () => import(/* webpackChunkName: "SettingPage" */ '../views/profile/ProfileSetting.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/profile-update',
		name: 'ProfileUpdatePage',
		component: () => import(/* webpackChunkName: "ProfileUpdatePage" */ '../views/profile/ProfileUpdatePage.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/profile-truck',
		name: 'ProfileTruckPage',
		component: () => import(/* webpackChunkName: "ProfileTruckPage" */ '../views/profile/ProfileTruck.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/location-add',
		name: 'truckLocationPage',
		component: () => import(/* webpackChunkName: "truckLocationPage" */ '../views/profile/truck/TruckLocationAdd.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
		
	},
	{
		path: '/profile-menu',
		name: 'TruckMenuPage',
		component: () => import(/* webpackChunkName: "TruckMenuPage" */ '../views/profile/ProfileMenuPage.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/profile-menu-add',
		name: 'TruckMenuAddPage',
		component: () => import(/* webpackChunkName: "TruckMenuAddPage" */ '../views/profile/truck/TruckMenuAdd.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/truck-menu/:menuId',
		name: 'truckmenuDetail',
		component: () => import(/* webpackChunkName: "truckmenuDetail" */ '../views/profile/truck/TruckMenuView.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/menu-edit/:menuId',
		name: 'TruckMenuEditPage',
		component: () => import(/* webpackChunkName: "TruckMenuEditPage" */ '../views/profile/truck/TruckMenuEdit.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/truck-profile-location/:locationId',
		name: 'truckLocationEdit',
		component: () => import(/* webpackChunkName: "dashboardCustomer" */ '../views/profile/truck/TruckLocationEdit.vue'),
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/truck-profile/:truckId',
		name: 'TruckProfileForClient',
		component: () => import(/* webpackChunkName: "TruckProfileForClient" */ '../views/profile/truck/TruckProfileForClient.vue'),
		meta: { requiresAuth: false }
	},
	{
		path: '/truck-menu-item/:itemId',
		name: 'truckMenuItemDetail',
		component: () => import(/* webpackChunkName: "TruckMenuItemDetail" */ '../views/profile/truck/TruckMenuItemDetail.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/profile-address',
		name: 'ProfileAddressPage',
		component: () => import(/* webpackChunkName: "ProfileAddressPage" */ '../views/profile/ProfileAddressPage.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/profile-schedule',
		name: 'profileSchedulePage',
		component: () => import(/* webpackChunkName: "profileSchedulePage" */ '../views/profile/ProfileSchedulePage.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/profile-files',
		name: 'profileFilesPage',
		component: () => import(/* webpackChunkName: "profileFilesPage" */ '../views/profile/ProfileFilesPage.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/about-us',
		name: 'AboutUsPage',
		component: () => import(/* webpackChunkName: "AboutUsPage" */ '../views/AboutPage.vue'),
		meta: { requiresAuth: false }
	},
	{
		path: '/terms-condition',
		name: 'TermsConditionPage',
		component: () => import(/* webpackChunkName: "TermsConditionPage" */ '../views/TermsConditionPage.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/subscriptions',
		name: 'SubscriptionPage',
		component: () => import(/* webpackChunkName: "SubscriptionPage" */ '../views/subscription/SubscriptionPage.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/subscription/:packageid',
		name: 'SubscriptionDetailPage',
		component: () => import(/* webpackChunkName: "SubscriptionDetailPage" */ '../views/subscription/SubscriptionDetailPage.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/chat-list',
		name: 'ChatListPage',
		component: () => import(/* webpackChunkName: "TrucksAvailable" */ '../views/chat/ChatListPage.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/conversation/:type/:id',
		name: 'ChatConversationPage',
		component: () => import(/* webpackChunkName: "ConversationPage" */ '../views/chat/ChatConversationPage.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/orders',
		name: 'OrdersPage',
		component: () => import(/* webpackChunkName: "OrdersPage" */ '../views/order/OrdersPage.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	
	{
		path: '/order/:orderId',
		name: 'OrderDetailPage',
		component: () => import(/* webpackChunkName: "OrdersDetailCustomerPage" */ '../views/order/OrderDetailCustomer.vue'),
		meta: { requiresAuth: true },
		// beforeEnter: (to, from, next) => {
		// 	if (store.getters['auth/user']) {
		// 		next();
		// 	}else{
		// 		next({
		// 			name: 'home'
		// 		});
		// 	}
		// }
	},
	{
		path: '/carts',
		name: 'CartsPage',
		component: () => import(/* webpackChunkName: "OrdersPage" */ '../views/cart/CartsPage.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/cart-payment',
		name: 'CartPaymentDetail',
		component: () => import(/* webpackChunkName: "HomePage" */ '../views/cart/CartPayment.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user'] && localStorage.getItem('pcid')) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/checkout-address',
		name: 'CheckoutAddress',
		component: () => import(/* webpackChunkName: "CheckoutAddress" */ '../views/cart/CheckoutAddress.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/checkout-address/:id',
		name: 'addressnew',
		component: () => import(/* webpackChunkName: "CheckoutAddress" */ '../views/cart/CheckoutAddressAdd.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/checkout-address-note',
		name: 'checkoutAddressNote',
		component: () => import(/* webpackChunkName: "CheckoutAddress" */ '../views/cart/CheckoutAddressNote.vue'),
	},
	{
		path: '/checkout-payment-method',
		name: 'checkoutPaymentMethod',
		component: () => import(/* webpackChunkName: "CheckoutAddress" */ '../views/cart/CheckoutPaymentMethod.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/cart-order-completed',
		name: 'orderComplete',
		component: () => import(/* webpackChunkName: "CheckoutAddress" */ '../views/cart/CartPaymentSuccess.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/bookings',
		name: 'bookings',
		component: () => import(/* webpackChunkName: "Booking Page" */ '../views/booking/BookingPage.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/payout',
		name: 'payoutPage',
		component: () => import(/* webpackChunkName: "payoutPage Page" */ '../views/payout/PayoutPage.vue'),
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/payments',
		name: 'paymentPage',
		component: () => import(/* webpackChunkName: "payoutPage Page" */ '../views/payment_credneitials/PaymentPage.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		},
	},
	{
		path: '/payment-bank-add',
		name: 'PaymentBankAdd',
		component: () => import(/* webpackChunkName: "payoutPage Page" */ '../views/payment_credneitials/PaymentBankAdd.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/spot/:spotId',
		name: 'spotDetail',
		component: () => import(/* webpackChunkName: "SpotDetailPage" */ '../views/booking/BookingSpot.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/payouts',
		name: 'PayoutPage',
		component: () => import(/* webpackChunkName: "PayoutPage" */ '../views/payout/PayoutPage.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/reports',
		name: 'ReportPage',
		component: () => import(/* webpackChunkName: "PayoutPage" */ '../views/report/ReportPage.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/report-commission',
		name: 'commissionReport',
		component: () => import(/* webpackChunkName: "ReviewPage" */ '../views/report/ReportCommission.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/report-sales',
		name: 'salesReport',
		component: () => import(/* webpackChunkName: "ReviewPage" */ '../views/report/ReportSales.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/support',
		name: 'supportPage',
		component: () => import(/* webpackChunkName: "ReviewPage" */ '../views/support/SupportPage.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/support-add',
		name: 'SupportAddPage',
		component: () => import(/* webpackChunkName: "SupportAddPage" */ '../views/support/SupportAddPage.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '/support/:id',
		name: 'SupportViewPage',
		component: () => import(/* webpackChunkName: "SupportViewPage" */ '../views/support/EnqueryViewPage.vue'),
		meta: { requiresAuth: true },
		beforeEnter: (to, from, next) => {
			if (store.getters['auth/user']) {
				next();
			}else{
				next({
					name: 'loginPage'
				});
			}
		}
	},
	{
		path: '*',
		name: 'pageNotFound',
		component: () => import(/* webpackChunkName: "PageNotFound" */ '../views/PageNotFound.vue'),
		meta: { requiresAuth: false },
	},
]

const router = new VueRouter({
	// mode: 'history',
	base: process.env.BASE_URL,
	routes,
	scrollBehavior() {
		return { x: 0, y: 0 }
	}
})

export default router
