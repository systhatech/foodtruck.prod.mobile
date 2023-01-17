<template>
    <div>
        <Topnavbar :action="action"/>
        <v-container>
            <div class="text-right">
                <v-btn tile color="primary" small @click="handleNewReport">new Report</v-btn>
            </div>
            <div>
                <ul class="report-list mt-4">
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
        </v-container>
        <ReportNew 
            :default-title="action.title"
            :dialog-report-new="dialogReportNew"
            report-type="report_commission"
            @generate="generateReport" 
            @close="handleClose"/>
        <ReportResend
            :dialog-report-resend="dialogReportResend"
            :report="report"
            @generate="generateReport" 
            @close="closeResend"/>
    </div>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarAction'
import ReportNew from './modal/ReportNew.vue'
import ReportResend from './modal/ReportResend.vue'
import { ApiService } from '@/core/services/api.service'
import { mapGetters } from 'vuex'
import { mdiRedoVariant} from '@mdi/js'
export default {
    data() {
        return {
            iconRedo: mdiRedoVariant,
            reports:[],

            action:{
                title:'Commission Report',
                hasAction:false,
                icon:'mdi-back',

            },
            dialogReportNew:false,
            dialogReportResend:false,
            report: {},

        }
    },
    components: {
        Topnavbar,
        ReportNew,
        ReportResend
    },
    mounted() {
        this.fetchReport();
    },
    methods: {
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
            ApiService.get('/report/'+ this.currentUser.vendor.id+'/report_commission')
            .then((response) => {
                this.reports = response.data;
                this.$bus.$emit('HIDE_PAGE_LOADER');
            })
            .catch(() => {
                this.messageError('Failed to fetch report');
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