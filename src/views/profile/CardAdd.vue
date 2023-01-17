<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialogAddCard"
      persistent
    >
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
            <span>New Card</span>
            <v-icon @click="handleClose">mdi-close</v-icon>
        </v-card-title>
        <v-card-text class="mt-5">
            <p class="f8-bold">we only store token, we dont store card numbers</p>
            <div>
                <v-text-field label="Card Number" v-model="card_number" v-mask="'#### #### #### ####'"></v-text-field>
            </div>
            <v-row>
                <v-col cols="4">
                    <v-text-field label="Month" v-model="exp_month" maxLength="2"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Year" v-model="exp_year" maxLength="4"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="CVV" v-model="cvv" maxLength="4"></v-text-field>
                </v-col>
            </v-row>
            <div>
                <v-text-field label="Name on Card" v-model="name_on_card"></v-text-field>
            </div>
            <div>
                
                <v-row>
                <v-col cols="6">
                    <v-text-field label="ZIP Code" v-model="name_on_card"></v-text-field>
                </v-col>
                <v-col cols="6">
                     <v-checkbox label="Default"></v-checkbox>
                </v-col>

            </v-row>
            </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-space-around pa-4">
          <v-btn
            color="primary"
            :loading="loading"
            @click="handleConfirm"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
  export default {
    props:{
        dialogAddCard:{},
    },
    data: vm => ({
        zip_code:'',
        phone:'',
        loading:false,
        date: new Date().toISOString().substr(0, 10),
        dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        menu1: false,
        name:'',
        exp_year:'',
        exp_month:'',
        name_on_card:'',
        card_number:'',
        cvv:'',
    }),
    computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
      },
    },
    watch: {
        date (val) {
            this.dateFormatted = this.formatDate(this.date)
            console.log(val);
        },
        dialogConfirm: function(){
            this.loading = false;
        },
    },
    methods: {
        handleClose(){
            this.$emit('close');
        },
        handleConfirm(){
            this.$emit('submit',{1:this.name_on_card, card_number:this.card_number,cvv:this.cvv,month:this.exp_month,year:this.exp_year});
        },
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
    }
  }
</script>