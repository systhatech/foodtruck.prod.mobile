<template>
    <div>
        <v-row justify="center">
            <v-dialog v-model="dialogMenuAction" persistent width="300">
                <v-card class="pt-2 pb-2">
                    <v-card-title>
                        <div class="d-flex align-center justify-space-between w-100">
                            <span>Action</span>
                            <v-btn fab text small color="error" @click="handleClose"><v-icon>mdi-close</v-icon></v-btn>
                        </div>
                    </v-card-title>
                    <div>
                        <div class="pa-4 custom-bs">
                            <div>
                                <v-btn block large class="mb-6" color="primary" rounded @click="handleView()">add / remove menu item</v-btn>
                            </div>
                           <div>
                               <v-btn block large class="mb-6" color="warning" rounded @click="handleEdit()">edit menu</v-btn>
                           </div>
                           <div>
                               <v-btn block large color="error" rounded @click="handleDelete()">delete menu</v-btn>
                           </div>
                        </div>
                    </div>
                    <!-- <div class="pa-4 custom-bs" style="position: fixed;bottom: 0;width: 100%;z-index: 1;">
                        <div class="d-flex align-center justify-space-between">
                           <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptate, impedit?</p>
                        </div>
                    </div> -->
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>
<script>

import { mdiClose } from '@mdi/js'
// import { ApiService } from '@/core/services/api.service'
// import { base_url } from '@/core/services/config'
import { mapGetters } from 'vuex'
export default {
    props: {
        dialogMenuAction: {
            required: true,
            type: Boolean,
        },
    },

    data() {
        return {
            iconClose: mdiClose,
            
          
        }
    },
    methods: {
        handleView(){
            this.$emit('view')
        },
        handleEdit(){
            this.$emit('edit')
        },
        handleDelete(){
            this.$emit('delete')
        },
        handleClose() {
            this.$emit('close')
        },

    },
    components:{
        // InputUpload: ()=> import('@/components/form-element/InputUpload'),
        // InputAutocomplete: ()=> import('@/components/layout/InputAutocompleteSingleTextValue')
    },
    computed: {
        ...mapGetters({
            currentUser: 'auth/user',
        })
    }
}
</script>
<style lang="scss" scoped>
</style>