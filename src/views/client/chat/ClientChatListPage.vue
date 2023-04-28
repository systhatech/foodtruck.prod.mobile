<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar />
        <v-container class="mg56 pa-0">
            <div v-if="currentUser && members && members.length">
                <ul class="chat-lists custom-bs pt-0">
                    <li v-for="(member, index) in members" :key="index" class="d-flex align-center justify-space-between pa-2 pt-4" @click="handleRoute(member)">
                        <div class="d-flex align-center justify-space-between pt-0 pb-2 pl-3 pr-3">
                            <div class="d-flex">
                                <v-avatar class="mt-2">
                                    <v-img alt="avatar" contain tile :src="base_url + '/image-show/' + (member && member.profile_pic ? member.profile_pic:'default.jpg')" rounded></v-img>
                                </v-avatar>
                                <div class="pl-4">
                                    <div v-if="member.unread_messages_count">
                                        <v-badge
                                            class="text-capitalize"
                                            color="error"
                                            :content="member.unread_messages_count">
                                            {{ member.name }}
                                        </v-badge>
                                    </div>
                                    <div v-else>
                                        <h4 class="mb-0 primary--text text-capitalize">{{ member.name }}</h4>
                                    </div>
                                    <div class="last_msg"
                                        :class="!member.last_message.is_seen && currentUser.table != member.last_message.table_from ? 'f8-bold' : ''">
                                        <div v-html="messageText(member.last_message)"></div>
                                    </div>
                                    <p class="last_msg_date pb-0">{{formatChatListTime(member.last_message.created_at, tz)}}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <v-btn fab text small><v-icon color="primary">mdi-chevron-right</v-icon></v-btn>
                        </div>
                        <!-- <div class="text-right pt-3">
                            <v-btn fab small color="primary" class="mr-3" @click="handleRoute(member.id)">
                                <v-icon>{{ iconChat }}</v-icon>
                            </v-btn>
                            <v-btn fab small color="primary" link :href="
                                `tel:${member.contact.phone_no ? member.contact.phone_no.replace(/[^\d]/g, '') : member.contact.mobile_no.replace(/[^\d]/g, '')}`
                            " class="mr-3">
                                <v-icon>{{ iconPhone }}</v-icon>
                            </v-btn>
                            <v-btn fab small color="error" @click="handleOpenArkive(member.contact)">
                                <v-icon>{{ iconArchive }}</v-icon>
                            </v-btn>
                        </div> -->
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
            <DialogConfirm :dialogConfirm="dialogConfirm" :message="message" @handleConfirm="handleArchive"
                @close="handleClose" />
        </v-container>
        <Bottomnavbar />
    </v-container>
</template>
<script>
import { base_url } from '@/core/services/config';
import Topnavbar from '@/components/layout/Topnavbar'
import { ApiService } from "@/core/services/api.service";
import Bottomnavbar from "@/components/layout/NavbarBottomClient";
import DialogConfirm from "@/components/layout/DialogConfirm";
import { mapGetters } from "vuex";
import { mdiPhone, mdiArchiveOutline, mdiChat, mdiAccountCircle } from '@mdi/js';

export default {
    name: "ChatList",
    data() {
        return {
            iconPhone: mdiPhone,
            iconArchive: mdiArchiveOutline,
            iconChat: mdiChat,
            iconAccount: mdiAccountCircle,
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
            loading:false,
        };
    },
    mounted() {
        this.fetchTrucks();
        this.initTimezone();
    },
    methods: {
        messageText(message) {
            let text = message.message;
            if (message.table_from_id == this.currentUser.table_id && message.table_from == this.currentUser.table) {
                text = 'You: ' + text;
            }
            return text.substr(0, 18);
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
                    this.fetchTrucks();
                })
                .catch(() => {
                    this.$bus.$emit("HIDE_PAGE_LOADER");
                    this.messageError("Failed to archive");
                });
        },
        handleBack() {
            this.$router.back();
        },
        handleRoute(conv) {
            this.$router.push("/client/conversation/vendors/" + conv.vendor_id+'/'+conv.id);
        },
        fetchTrucks() {
            this.loading = true;
            // this.$bus.$emit("SHOW_PAGE_LOADER");
            ApiService.post("/chat/members")
                .then((resp) => {
                    this.loading = false;
                    this.$bus.$emit("HIDE_PAGE_LOADER");
                    this.members = [];
                    resp.data.forEach((item) => {
                        if(this.currentUser.table =='vendors'){
                            item['profile_pic'] = item.client.contact.profile_pic;
                            item['name'] = item.client.fullName;
                            item['unread_messages_count'] = item.unread_vendor_messages_count;
                        }else if(this.currentUser.table =='clients'){
                            item['profile_pic'] = item.vendor.profile_pic;
                            item['name'] = item.vendor.name;
                            item['unread_messages_count'] = item.unread_client_messages_count;
                        }
                        if(item.last_message){
                            this.members.push(item);
                        }
                    })
                })
                .catch(() => {
                    this.loading = false;
                    this.$bus.$emit("HIDE_PAGE_LOADER");
                    this.message("Failed to fetch members");
                });
        },
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        DialogConfirm,
        ComponentLoadingVue: () => import('@/components/ComponentLoading.vue'),
        // InputUpload
    },
    computed: {
        ...mapGetters({ currentUser: 'auth/user' }),
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
