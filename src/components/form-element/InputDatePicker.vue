<template>
    <div>
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="mt-3"
              v-model="computedDateFormatted"
              :label="label"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            no-title
            :min="minDate" 
            :max="maxDate" 
            @input="menu = false"
          ></v-date-picker>
        </v-menu>
    </div>
</template>
<script>
import { mdiCalendar } from '@mdi/js'
import moment from 'moment'
  export default {
    props:{
      label:{},
      name:{},
      minDate:{},
      maxDate:{},
      clearable:{},
    },
    data: vm => ({
        moment,
        iconCalendar:mdiCalendar,
        date: new Date().toISOString().substr(0, 10), 
        dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        menu: false,
    }),

    computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
      },
    },

    watch: {
      date () {
        if(this.dateFormatted == null){
          this.date = "";
        }else{
          this.dateFormatted = this.formatDate(this.date)
          this.$emit('selectedDate',{date: this.dateFormatted, name: this.name});
        }
      },
      clearable(val){
        if(val){
          this.date = "";
        }
      }

    },

    methods: {
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
      parseDate (date) {
        if (!date) return null
        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
    },
  }
</script>
<style lang="scss" scoped>

</style>