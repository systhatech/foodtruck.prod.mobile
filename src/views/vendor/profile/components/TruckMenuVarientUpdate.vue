<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialogVarientUpdate"
      persistent
      scrollable
    >
      <v-card>
        <v-card-title class="text-capitalize d-flex align-center justify-space-between">
          <span>
            {{ menuName }}
          </span>
          <v-icon small color="error" @click="handleClose">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
            <v-form class="mt-4" ref="formVarient">
                <div class="d-flex align-center">
                  <v-text-field 
                    label="Group Name" 
                    :rules="rulesRequired" 
                    v-model="varient.name">
                  </v-text-field>
                </div>
                  <div>
                    <div class="d-flex align-center justify-space-between mb-3">
                      <div>
                        <p class="ma-0 pa-0">Items</p>
                        <v-checkbox
                            v-model="varient.select_single"
                            label="Select Single"
                          ></v-checkbox>
                      </div>
                      <v-btn fab x-small color="accent" @click="addItem()"><v-icon>mdi-plus</v-icon></v-btn>
                    </div>
                    <div>
                    
                      <v-row class="mb-0 mt-0 pt-0 pb-0" v-for="(item, i) in varient.items" :key="i">
                        <v-col cols="6" class="mb-0 mt-0 pt-0 pb-0"><v-text-field v-model="item.name"   label="Name"></v-text-field></v-col>
                        <v-col cols="4" class="mb-0 mt-0 pt-0 pb-0"> <v-text-field v-model="item.value" type="number" label="Price"></v-text-field></v-col>
                        <v-col cols="2" class="text-center">
                          <!-- <v-btn fab x-small color="accent" @click="addItem(i)" v-if="i==0"><v-icon>mdi-plus</v-icon></v-btn> -->
                          <v-btn fab x-small color="error" :disabled="varient.items.length==1" @click="removeItem(item, i)"><v-icon>mdi-minus</v-icon></v-btn>
                        </v-col>
                      </v-row>
                      <DialogConfirm 
                      :message="message"
                      @handleConfirm="handleDelete"
                      @close="close"
                      :dialogConfirm="modalConfirm"/>
                    </div>
                  </div>
            </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="secondary"
            text
            @click="handleClose"
          >
            cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="handleUpdate"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { ApiService } from '@/core/services/api.service'
import DialogConfirm from '@/components/layout/DialogConfirm'
  export default {
    props:{
        menuName:{},
        menuId:{},
        dataGroup:{},
        dialogVarientUpdate:{},
        message:{}
    },
    data () {
      return {
        name:'',
        select_single:false,
        rulesRequired: [
            v => !!v || 'Required',
        ],
        varient:{
          name:'',
          items:[
            {name:'',value:''},
          ],
        },
        modalConfirm:false,
        itemDelete:{},
      }
    },
    watch:{
        dialogVarientUpdate: function(val){
          if(!val) {
            this.varient = {
              items:[
                {name:'',value:''},
              ],
            }
          }else{
            if(this.dataGroup.items.length) {
              this.varient = this.dataGroup;
            }else{
              this.varient.name = this.dataGroup.name;
              this.varient.items = [{name:'',value:''}];
            }
          }
        },
        dataGroup(newData) {
          this.varient = newData;
        }
    },
    methods: {
        async handleDelete() {
            this.loaderShow();
            await ApiService.get('/varient/delete/'+this.itemDelete.id)
            .then(() => {
                this.loaderHide();
                this.$emit('reloadNow');
                this.handleClose();
                this.close();
            })
            .catch(() => {
                this.loaderHide();
            });
           
        },
        close() {
            this.modalConfirm = false;
        },
        handleClose(){
            this.$emit('close');
        },
        addItem() {
           this.varient.items.unshift({name:'',value:''});
        },
        removeItem(item,i) {
          if(item.id) {
            this.itemDelete = item;
            this.modalConfirm = true;
          }else{
            this.varient.items.splice(i,1);
          }
        },
        async handleUpdate(){
            this.loaderShow();
            let validate = this.$refs.formVarient.validate();
            if(!validate) return;
            let data = new FormData();
            data.append("name", this.varient.name);
            data.append("menu_id", this.menuId);
            data.append("id", this.varient.id);
            data.append("select_single", this.varient.select_single == true ? 1 : 0);
            this.varient.items.forEach((item,i) => {
              if(item.name) {
                if(item.id) {
                  data.append(`item[${i}][id]`, item.id);
                }
                data.append(`item[${i}][name]`, item.name);
                data.append(`item[${i}][value]`, item.value);
              }
            });
            await ApiService.post('/varient/group/add', data)
            .then((resp) => {
                this.loaderHide();
     
                this.messageSuccess(resp.message);
                 this.$emit('reloadNow');
                this.handleClose();
            })
            .catch((error) => {
                this.loaderHide();
                console.log(error);
            })
        }
    },
    components: {
        DialogConfirm,
    }
  }
</script>