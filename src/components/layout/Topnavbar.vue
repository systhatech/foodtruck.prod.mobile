<template>
    <v-toolbar  color="primary" elevation="1" style="position: sticky;top: 0;px;z-index: 4;">
        <div class="pt-0" @click="handleRoute()">
            <v-avatar size="32" @click="viewProfile" v-if="currentUser && currentUser.profile_pic">
                <img
                :src="currentUser.profile_pic? base_url+'/avatar/'+currentUser.profile_pic:base_url+'/avatar/avatar.jpg'"
                alt="Profile Pic">
                </v-avatar>
                <v-avatar v-else size="32">
                    <v-icon dark>
                    {{iconAccount}}
                    </v-icon>
                </v-avatar>
        </div>
        <v-toolbar-title style="font-size:16px; font-weight: 500;color:#fff; margin-left:10px;">Hi, 
            <span class="text-capitalize">{{ currentUser? currentUser.fname :'welcome' }}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <ComponentCartCount/>
    </v-toolbar>
</template>
<script>
import { mapGetters } from 'vuex'
import { mdiAccountCircle } from '@mdi/js'
import { base_url } from '@/core/services/config'
export default {
    props: {
        // title: {
        //     type: String,
        //     required: true,
        // }
    },
    data() {
        return {
            base_url,
            iconAccount: mdiAccountCircle,
            count: 0,
        }
    },
    mounted() {
     
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user',
        })
    },
    methods: {
        handleRoute() {
            if (this.$router.currentRoute.name !== 'home') {
                this.$router.push("/");
            }
        },
       
        viewProfile() {
            if(this.currentUser.table == 'vendors'){
                this.$router.push('/vendor-profile').catch(() => { });
            }else if(this.currentUser.table =='clients'){
                this.$router.push('/client-profile').catch(() => { });
            }
        },
        handleBack() {
            this.$emit('back');
        },
    },
    components:{
        ComponentCartCount:()=>import('@/components/layout/ComponentCartCount.vue')
    }

}
</script>
<style lang="scss" scoped>
$colorprimary : #19477e !important;
$colorsecondary : #75ab26;

.section-top-navbar {
    background: $colorprimary;
    padding: 6px 24px;
    height: 52px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .page-title {
        margin: 0;
        font-weight: 500;
    }

    i {
        color: #fff !important;
    }
}
</style>