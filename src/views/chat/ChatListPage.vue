<template>
    <v-container class="ma-0 pl-0 pr-0 pt-0 h-100 background-image">
        <Topnavbar/>
        <v-container class="mg56">
            <div v-if="currentUser && members && members.length">
                <ul class="chat-lists custom-bs pa-4">
                    <li v-for="(member, index) in members" :key="index">
                        <div class="d-flex align-center justify-space-between">
                            <div class="d-flex">
                                <v-avatar color="indigo">
                                    <v-img alt="avatar" :src="base_url +'/image-show/'+ member.profile_pic" v-if="member.profile_pic"></v-img>
                                    <v-img alt="avatar" :src="base_url +'/image-show/'+ member.contact.profile_pic" v-else-if="member.contact && member.contact.profile_pic"></v-img>
                                    <v-icon dark v-else>
                                        {{iconAccount}}
                                    </v-icon>
                                </v-avatar>
                                <div class="pl-4">
                                    <h4 class="text-capitalize" :class="!member.last_message.is_seen && currentUser.table != member.last_message.table_from ? '' : 'font-weight-light'">
                                        {{ member.name }}
                                        <i class="color-secondary font-weight-light badge" v-if="member.unread_messages_count">{{ member.unread_messages_count }} New Message</i>
                                    </h4>
                                    <div
                                        class="last_msg"
                                        :class="!member.last_message.is_seen && currentUser.table != member.last_message.table_from ? 'f8-bold' : ''"
                                        >
                                        <div v-html="messageText(member.last_message)">
                                        <!-- {{ }} -->
                                        </div>
                                    </div>
                                    <p class="last_msg_date">
                                        {{
                                            formatChatListTime(member.last_message.created_at, tz)
                                        }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="text-right pt-3">
                            <v-btn
                                fab
                                small
                                outlined
                                color="primary"
                                class="mr-3"
                                @click="handleRoute(member.id)"
                            >
                                <v-icon>{{iconChat}}</v-icon>
                            </v-btn
                            >
                            <v-btn
                                fab
                                small
                                outlined
                                color="primary"
                                link
                                :href="
									`tel:${member.contact.phone_no ? member.contact.phone_no.replace(/[^\d]/g, '') : member.contact.mobile_no.replace(/[^\d]/g, '')}`
								"
                                class="mr-3"
                            >
                                <v-icon>{{iconPhone}}</v-icon>
                            </v-btn
                            >
                            <v-btn
                                fab
                                small
                                outlined
                                color="error"
                                @click="handleOpenArkive(member.contact)"
                            >
                                <v-icon>{{iconArchive}}</v-icon>
                            </v-btn
                            >
                        </div>
                    </li>
                </ul>
            </div>
            <div v-else class="mt-3">
                <div class="custom-bs pa-4">
                    <p>No chat history</p>
                </div>
            </div>
            <DialogConfirm
                :dialogConfirm="dialogConfirm"
                :message="message"
                @handleConfirm="handleArchive"
                @close="handleClose"
            />
        </v-container>
        <Bottomnavbar :value="indexValue"/>
    </v-container>
</template>
<script>
import {base_url} from '@/core/services/config';
import Topnavbar from '@/components/layout/Topnavbar'
import {ApiService} from "@/core/services/api.service";
import Bottomnavbar from "@/components/layout/NavbarBottomFixed";
import DialogConfirm from "@/components/layout/DialogConfirm";
import {mapGetters} from "vuex";
import { mdiPhone, mdiArchiveOutline, mdiChat, mdiAccountCircle} from '@mdi/js';

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
        handleRoute(id) {
            if (this.currentUser.table == "vendors") {
                this.$router.push("/conversation/clients/" + id);
            } else {
                this.$router.push("/conversation/vendors/" + id);
            }
        },
        fetchTrucks() {
            this.$bus.$emit("SHOW_PAGE_LOADER");
            ApiService.post("/chat/members")
                .then((resp) => {
                    this.$bus.$emit("HIDE_PAGE_LOADER");
                    this.members = resp;
                })
                .catch(() => {
                    this.$bus.$emit("HIDE_PAGE_LOADER");
                    this.message("Failed to fetch members");
                });
        },
    },
    components: {
        Topnavbar,
        Bottomnavbar,
        DialogConfirm,
        // InputUpload
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
            margin-bottom: 20px;
            border-bottom: 1px solid #dadada;
        }

        .last_msg {
            margin: 0;
            font-size: 0.8rem;
            // font-weight: 600;
        }

        .last_msg_date {
            margin: 0;
            font-size: 0.7rem;
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
