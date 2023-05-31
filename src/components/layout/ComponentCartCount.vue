<template>
    <div>
        <div @click="handleRouteCart"
            v-if="currentUser && carts && carts.length && (currentUser.table == 'clients')" class="pt-3 pr-4">
            <v-badge small color="error" :content="Object.keys(carts).length">
                <v-icon color="white">{{ iconCart }}</v-icon>
            </v-badge>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { mdiCart } from '@mdi/js'
export default {
    data() {
        return {
            iconCart: mdiCart,
            count: 0,
        }
    },
    mounted() {
        if(this.currentUser){
            this.dispatchCarts();
        }
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
            carts: 'truck/getCarts',
        })
    },
    methods: {
        ...mapActions({
            fetchCarts: 'truck/fetchCarts',
        }),
        dispatchCarts() {
            this.fetchCarts();
        },
        handleRoute() {
            if (this.$router.currentRoute.name !== 'home') {
                this.$router.push("/");
            }
        },
        handleRouteCart() {
            if (this.$router.currentRoute.name != 'CartsPage') {
                this.$router.push({ name: 'CartsPage' });
            }
        },
    },

}
</script>