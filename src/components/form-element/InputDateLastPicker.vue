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
            @input="menu = false"
          ></v-date-picker>
        </v-menu>
    </div>
</template>
<script>
import { mdiCalendar } from '@mdi/js'
  export default {
    props:{
      label:{}
    },
    data: vm => ({
        iconCalendar:mdiCalendar,
        date: new Date(new Date().getFullYear(),new Date().getMonth() + 1, 0).toISOString().substr(0, 10), 
        // date: '', 
        dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        menu: false,
    }),

    computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
      },
    },

    watch: {
      date (val) {
          console.log(val);
          this.dateFormatted = this.formatDate(this.date);
          this.$emit('dateSelected',{date: this.dateFormatted, name: this.name});
      },
    },

    methods: {
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        // return `${month}/${day}/${year}`
        return `${month}/${day}/${year}`;
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