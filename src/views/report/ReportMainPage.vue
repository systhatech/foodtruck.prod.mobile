<template>
    <div class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title"/>
        <v-container class="mg56">
             <v-row>
                <v-col cols="6" sm="4" md="4" v-for="(item, index) in dashboardItems" :key="index">
                    <v-card elevation="1" class="item-wrapper" @click="handleRoute(item.route)">
                        <v-icon>{{ item.icon }}</v-icon>
                        <p>{{ item.name }}</p>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBack'
export default {
    data() {
        return {
            title:'Reports',
            dashboardItems: [
                {name:'Sales',icon:'mdi-notebook-check',component:'report-sales',route:'report-sales'},
                {name:'Commission',icon:'mdi-notebook-edit',component:'report-commission',route:'report-commission'},
            ],
        }
    },
    methods: {
        handleRoute(route){
            this.$router.push("/"+route);
        }
    },
    components: {
        Topnavbar
    }
}
</script>
<style lang="scss" scoped>
$color-primary: #01a6bc;
$color-secondary: #01a6bc;
.item-wrapper{
    background:#f5f5f5;
    padding: 10px;
    text-align: center;
    min-height: 100px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 0;
    i{
        font-size: 3.1rem;
        color: #01a6bc;
    }
    p{
        margin: 0;
        padding: 0;
        text-align: center;
        font-weight: 500;
        color: #5a5a5a;
        text-transform: capitalize;
        font-size: 0.8rem;
        letter-spacing: 0.7px;
    }
}
</style>