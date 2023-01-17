<template>
    <div class="section-top-navbar">
        <div><v-icon @click="handleBack">mdi-chevron-left</v-icon> <span class="page-title">{{ title }}</span></div>
        <div></div>
    </div>
</template>
<script>
export default {
    props:{
        title:{
            type:String,
            required:true,
        }
    },
    data() {
        return {
            // title:'Dashboard',
        }
    },
    methods: {
        handleBack() {
            // this.$router.back();
            this.$emit('close');
        }
    }
}
</script>
<style lang="scss" scoped>
.v-icon--link {
    color: #fff !important;
}
.section-top-navbar{
    background: #01a6bc !important;
    padding: 6px;
    height: 52px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 1;
    .page-title{
        margin: 0;
        font-weight: 500;
        padding: 0 20px;
    }
    i{
        color:#fff !important;
    }
}
</style>