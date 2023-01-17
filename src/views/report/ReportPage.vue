<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar :title="title" @back="handleBack()"/>
        <v-container class="mg56">
            <div class="text-right">
                <v-btn color="primary" block rounded @click="handleNewReport">new Report</v-btn>
            </div>
            <div class="custom-bs pa-4 mt-4 pb-0" v-if="reports && reports.length">
                <ul class="report-list">
                    <li v-for="(report, index) in reports" :key="index">
                        <div class="d-flex">
                            <span class="report_date">{{formatStandardUSDate(report.created_at)}}</span> 
                            <span class="report_name">{{report.report_name}}</span>
                        </div>
                        <div style="width:50px;">
                            <v-btn small tile text @click="resendReport(report)">
                                <v-icon color="primary">{{ iconRedo }}</v-icon>
                            </v-btn>
                        </div>
                    </li>
                </ul>
            </div>
            <div v-else class="unavailbable text-center pt-10">
                <p>{{ message }}</p>

            </div>
            <ReportNew 
                :default-title="action.title"
                :dialog-report-new="dialogReportNew"
                report-type="report_sales"
                @generate="generateReport" 
                @close="handleClose"/>
            <ReportResend
                :dialog-report-resend="dialogReportResend"
                :report="report"
                @generate="generateReport" 
                @close="closeResend"/>
        </v-container>
        <Bottomnavbar :value="indexValue"/>
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackCustom'
import ReportNew from './modal/ReportNew.vue'
import ReportResend from './modal/ReportResend.vue'
import { ApiService } from '@/core/services/api.service'
import { mapGetters } from 'vuex'
import { mdiRedoVariant} from '@mdi/js'
import Bottomnavbar from '@/components/layout/NavbarBottomFixed'
export default {
    data() {
        return {
            title:'',
            iconRedo: mdiRedoVariant,
            indexValue:1,
            reports:[],
            action:{
                title:'',
                hasAction:false,
                icon:'mdi-back',

            },
            dialogReportNew:false,
            dialogReportResend:false,
            report: {},
            message:'Loading..'

        }
    },
    components: {
        Topnavbar,
        ReportNew,
        ReportResend,
        Bottomnavbar
    },
    mounted() {
        this.fetchReport();
    },
    methods: {
        handleBack(){
            this.$router.push({name:'profilepage'});
        },
        handleNewReport(){
            this.dialogReportNew = true;
        },
        resendReport(report) {
            this.report = report;
            this.dialogReportResend = true;
        },
        handleClose() {
            this.dialogReportNew = false;
            this.fetchReport();
        },
        closeResend() {
            this.dialogReportResend = false;
        },
        generateReport(param) {
            console.log(param);
        },
        fetchReport(){
            this.$bus.$emit('SHOW_PAGE_LOADER');
            ApiService.get('/report/'+ this.currentUser.table_id+'/report_sales')
            .then((response) => {
                this.reports = response.data;
                if(!this.reports.length){
                    this.message ="No report generated";
                }
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch(() => {
                this.message ="Failed to fetch reports";
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
        },
    },
    computed:{
        ...mapGetters({
            currentUser:'auth/user',
        })
    }
}
</script>
<style lang="scss" scoped>
ul.report-list{
    list-style: none;
    padding:0;
    li{
        display: flex;
        justify-content: space-between;
        &:not(:last-child) {
            border-bottom:1px solid #dadada;
        }
        padding:12px 0;
        // p{
        //     margin-bottom:0;
        .report_date{
            font-size:14px;
            font-weight:400;
            margin-right:10px;
            color: #01a6bc;
        }
        .report_name{
            font-size:14px;
            font-weight: 400;
        }
    }
}
</style>