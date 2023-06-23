<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar/>
        <v-container class="mg56 pa-0">
            <div class="custom-bs pa-4 ma-4">
                <div class="">
                    <div class="d-flex align-center justify-space-between">
                        <div>
                            <h4>User List</h4>
                        </div>
                        <div v-if="currentUser.is_default">
                            <v-btn fab color="primary" small @click="handleUserAdd()"><v-icon>mdi-plus</v-icon></v-btn>
                        </div>
                    </div>
                </div>
                <div class="pt-4">
                    <v-divider></v-divider>
                </div>
                <div v-if="currentUser && members && members.length" class="">
                    <ul class="chat-lists pt-2">
                        <li v-for="(member, index) in members" :key="index" @click="handleRoute(member)" class="d-flex align-center justify-space-between pa-2 pt-4 pb-5">
                            <div class="d-flex align-center justify-space-between pl-3 pr-3">
                                <div class="d-flex">
                                    <v-avatar tile v-if="member.profile_pic">
                                        <v-img alt="avatar" contain :src="base_url + '/image-show/' + member.profile_pic"
                                            v-if="member.profile_pic" tile></v-img>
                                    </v-avatar>
                                    <v-avatar tile v-else>
                                        <v-icon color="primary">
                                            {{ iconAccount }}
                                        </v-icon>
                                    </v-avatar>
    
                                    <div class="pl-4">
                                        <h4 class="text-capitalize">{{ member.fname }} {{ member.lname }}</h4>
                                        <p class="mb-0 f9">{{ formatPhoneNumber(member.phone_no) }}</p>
                                    </div>
                                </div>
                            </div>
                            <div v-if="currentUser.is_default">
                                <v-btn fab text small><v-icon color="primary">mdi-pencil</v-icon></v-btn>
                            </div>
                        </li>
                    </ul>
                </div>
                <div v-else>
                    <div class="w-100 text-center">
                        <div v-if="loading">
                            <ComponentLoadingVue/>
                        </div>
                     
                        <div v-else class="unavailable">
                            <p>No chats available</p>
                        </div>
                    </div>
                </div>
            </div>
            <DialogConfirm
                :dialogConfirm="dialogConfirm"
                :message="message"
                @handleConfirm="handleArchive"
                @close="handleClose"
            />
            <ModalVendorUser @close="fetchMembers()"/>
        </v-container>
        <Bottomnavbar/>
    </v-container>
</template>
<script>
import {base_url} from '@/core/services/config';
import Topnavbar from '@/components/layout/Topnavbar'
import {ApiService} from "@/core/services/api.service";
import Bottomnavbar from "@/components/layout/NavbarBottomVendor";
import DialogConfirm from "@/components/layout/DialogConfirm";
import {mapGetters, mapActions} from "vuex";
import { mdiPhone, mdiArchiveOutline, mdiChat, mdiAccount} from '@mdi/js';

export default {
    name: "ChatList",
    data() {
        return {
            loading:false,
            iconPhone: mdiPhone,
            iconArchive: mdiArchiveOutline,
            iconChat: mdiChat,
            iconAccount: mdiAccount,
            base_url,
            title: "",
            indexValue: 2,
            valid: true,
            maxHeight: 100,
            dialogConfirm: false,
            message: "Do you want to archive?",
            tz: "",
            customer: {
                fname: "",
                lname: "",
                phone_no: "",
                email: "",
                profile_pic: "",
                is_default:0,
            },
            file_name: "",
            ruleRequired: [(v) => !!v || "Required"],
            rulesEmail: [
                (v) => !!v || "E-mail is required",
                (v) => /.+@.+/.test(v) || "E-mail must be valid",
            ],
            update_input_file: true,
            src: "",
            members: [],
            archive: {
                table_name: "",
                table_id: "",
            },
            modal_vendor_user:false,
        };
    },
    mounted() {
        this.fetchMembers();
        // this.initTimezone();
    },
    methods: {
        ...mapActions({
            'fetchCurrentUser': 'auth/fetchProfile',
        }),
        handleUserAdd(){
            this.$bus.$emit('MODAL_VENDOR_USER',{});
        },
        handleRoute(user) {
            this.$bus.$emit('MODAL_VENDOR_USER',user);
        },
        messageText(message) {
            let text = message.message;
            if (message.table_from_id == this.currentUser.table_id && message.table_from == this.currentUser.table) {
                text = 'You: ' + text;
            }
            return text.substr(0, 25);
        },
        async initTimezone() {
            let timezone_offset_minutes = new Date().getTimezoneOffset();
            timezone_offset_minutes =
                timezone_offset_minutes === 0 ? 0 : -timezone_offset_minutes;

            try {
                let res = await ApiService.get("timezone/" + timezone_offset_minutes);
                this.tz = res.tz
            } catch (error) {
                console.error(error);
            }
        },
        handleClose() {
            this.dialogConfirm = false;
            this.modal_vendor_user = false;
        },
        handleOpenArkive(param) {
            this.archive.table_name = param.table;
            this.archive.table_id = param.table_id;
            this.dialogConfirm = true;
        },
        handleArchive() {
            this.$bus.$emit("SHOW_PAGE_LOADER");
            ApiService.post("/chat/archive", this.archive)
                .then((resp) => {
                    this.$bus.$emit("HIDE_PAGE_LOADER");
                    this.messageSuccess(resp.message);
                    this.handleClose();
                    this.fetchMembers();
                })
                .catch(() => {
                    this.$bus.$emit("HIDE_PAGE_LOADER");
                    this.messageError("Failed to archive");
                });
        },
        handleBack() {
            this.$router.back();
        },
      
        fetchMembers() {
            this.loading = true;
            ApiService.post("/vendor/users")
            .then((resp) => {
                this.loading = false;
                this.$bus.$emit("HIDE_PAGE_LOADER");
                this.members = resp.data;
            })
            .catch(() => {
                this.loading = false;
                this.$bus.$emit("HIDE_PAGE_LOADER");
                this.message("Failed to fetch members");
            });
            this.fetchCurrentUser();
        },
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        DialogConfirm,
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
        ModalVendorUser: () => import('@/views/vendor/profile/modal/ModalVendorUser.vue'),
    },
    computed: {
        ...mapGetters({currentUser:'auth/user'}),
    },
};
</script>
<style lang="scss" scoped>
.badge {
    font-size: 90%;
}

.chat-lists {
    list-style: none;
    padding: 0;
    margin: 0px;

    li {
        // padding-bottom: 20px;

        &:not(:last-child) {
            margin-bottom: 0px;
            border-bottom: 1px solid #dadada;
        }

        .last_msg {
            margin: 0;
            font-size: 0.9rem;
            // font-weight: 600;
        }

        .last_msg_date {
            margin: 0;
            font-size: 0.9rem;
            // font-style: italic;
            color: #757575;
        }
    }
}

.price {
    font-size: 3rem;
    color: #000000;
}

.package-container {
    background: #acfa95;
    border-radius: 10px;
    padding: 18px;
    text-align: center;
}

.form-container {
    // .login-container{
    background: #acfa95;
    border-radius: 10px;
    margin-top: 27px !important;
    padding: 20px;
    // }
}
</style>
