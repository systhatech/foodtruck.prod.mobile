import moment from 'moment-timezone'
export default {
    data() {
        return {
        
        }
    },
    methods: { 
        parseGoogleResponse (components) {
            let newItem  = []; 
            components.map((item) => {
                if(item['types'][0]=='country'){
                    newItem['country'] = item.long_name;
                    newItem['country_code'] = item.short_name;
                }else{
                    newItem[item['types'][0]] = item.short_name;
                }
            });
            return newItem;
        },
        formatChatTime(date, prevDate, tz = '') {
            const instance = d => tz 
            ? (d ? moment.tz(d, 'America/Los_Angeles').clone().tz(tz) : moment.tz(tz)) 
            : (d ? moment(d) : moment());
            const prev = prevDate ? instance(prevDate) : instance();
            const now = instance(date);
            const m = Math.abs(now.diff(prev, "minutes"));
            let h = Math.abs(now.diff(prev, "hours"));
            const w = Math.abs(now.diff(prev, "weeks"));
            h = now.format("ddd") === prev.format("ddd") ? 11 : h;
            return m < 5
              ? ""
              : h < 12
              ? now.format("h:mm A")
              : w < 1
              ? now.format("ddd h:mm A")
              : now.format("MMM DD, YYYY, h:mm A");
        },
        formatChatListTime(date, tz = '') {
            const prevDate = null;
            const instance = d => tz 
            ? (d ? moment.tz(d, 'America/Los_Angeles').clone().tz(tz) : moment.tz(tz)) 
            : (d ? moment(d) : moment());
            const prev = prevDate ? instance(prevDate) : instance();
            const now = instance(date);
            const m = Math.abs(now.diff(prev, "minutes"));
            let h = Math.abs(now.diff(prev, "hours"));
            const w = Math.abs(now.diff(prev, "weeks"));
            h = now.format("ddd") === prev.format("ddd") ? 11 : h;
            return m < 5
              ? now.format("h:mm A")
              : h < 12
              ? now.format("h:mm A")
              : w < 1
              ? now.format("ddd h:mm A")
              : now.format("MMM DD, YYYY, h:mm A");
        },
        formatAmount(amount){
            if(amount === undefined) return '-';
            // console.log({amount});
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(amount)
        },
        formatAmount1(amount){
            if(amount === undefined) return '$0.00';
            // console.log({amount});
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(amount)
        },
        formatTimeOnly(date){
            if(moment(date).isValid()) {
                // return moment(date).format('ll');
                return date ? moment(date,'YYYY-MM-DD HH:mm:ss').format('h:mm a'):'n/a';
                // return moment(date).format('MMM');
            }else{
                return "";
            }
        },
        formatTimeOnly1(date){
            if(moment(date).isValid()) {
                // return moment(date).format('hh:mm:ss');
                // return date ? moment(date,'hh:mm:ss').format('hh:mm a'):'n/a';
                return moment(date).format('hh:mm a');
            }else{
                return "-";
            }
        },
        messageSuccess(message){
             this.$bus.$emit('SHOW_NOTIFICATION',{'message':message,'type':'success'});
            // this.$vToastify.success(message);
        },
        messageError(message){
             this.$bus.$emit('SHOW_NOTIFICATION',{'message':message,'type':'error'});
            // this.$vToastify.error(message);
        },
        messageWarning(message){
             this.$bus.$emit('SHOW_NOTIFICATION',{'message':message,'type':'warning'});
            // this.$vToastify.warning(message);
        },
        loaderShow() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
        },
        loaderHide() {
            this.$bus.$emit('HIDE_PAGE_LOADER');
        },
        // getCookie(c_name){
        //     return getCookie(c_name);
        // },
        // setCookie(c_name, payload){
        //     return setCookie(c_name,payload);
        // },
        // formatDateStandard(date){
        //     return moment(date).format('MM/DD/YYYY')
        // },
        onlyMonth(date){
             if(moment(date).isValid()) {
                // return moment(date).format('ll');
                return moment(date).format('MMM');
            }else{
                return "-";
            }
        },
        onlyDay(date){
             if(moment(date).isValid()) {
                // return moment(date).format('ll');
                return moment(date).format('DD');
            }else{
                return "-";
            }
        },
        onlyWeekDay(date){
             if(moment(date).isValid()) {
                // return moment(date).format('ll');
                return moment(date).format('ddd');
            }else{
                return "-";
            }
        },
        formatDateTime(date){
             if(moment(date).isValid()) {
                // return moment(date).format('ll');
                return moment(date).format('MM/DD/YYYY LT')
            }else{
                return "-";
            }
        },
        formatDateToDay(date){
             if(moment(date).isValid()) {
                // return moment(date).format('ll');
                return moment(date).format('ddd MMM Do')
            }else{
                return "";
            }
        },
        formatStandardUSDate(date){
             if(moment(date).isValid()) {
                // return moment(date).format('ll');
                return moment(date).format('MM/DD/YYYY')
            }else{
                return "-";
            }
        },
        formatStandardDate(date){
             if(moment(date).isValid()) {
                // return moment(date).format('ll');
                return moment(date).format('YYYY-MM-DD')
            }else{
                return "-";
            }
        },
        formatTime(date){
            if(moment(date).isValid()) {
                // return moment(date).format('ll');
                return moment(date).format('LT');
            }else{
                return "-";
            }
        },
       
        formatDateStandard(date){
            if(moment(date).isValid()) {
                return moment(date).format('ll');
            }else{
                return "-";
            }
        },
        formatTime12(){
            return  moment("15", "hh").format('LT');
        },
        formatPhoneNumber(str) {
            //Filter only numbers from the input
            let cleaned = ('' + str).replace(/\D/g, '');
            
            //Check if the input is of correct length
            let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
          
            if (match) {
              return '(' + match[1] + ') ' + match[2] + '-' + match[3]
            }
            return null
        },
    }
}