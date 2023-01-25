<template>
    <v-container class="ma-0 pa-0 h-100">
        <Topnavbar :receiver="receiver" @back="handleBack"/>
        <v-container class="pt-0 content-cs">
            <main class="msger-chat" :style="{ height: customheight + 'px' }" id="chatMessages" ref="messageContainer">
                <div class="chat--message--item msg" :class="sentByMe(message)?'right-msg':'left-msg abc'"
                     v-for="(message,index) in messages" :key="index">
                    <div class="msg-bubble">
                        <div class="msg-info">
                            <div class="msg-info-time">
                                {{ formatChatTime(message.created_at, prevMessageDate(index), tz) }}
                            </div>
                        </div>

                        <div class="msg-text" @click="handleOrder(message.message)" v-html="message.message">
                            <!-- {{ message.message }} -->
                        </div>
                    </div>

                </div>
            </main>
            <div class="chat-box d-flex align-center justify-space-between" ref="chatbox">
                <v-textarea
                    id="messagetosend"
                    v-model='message'
                    auto-grow
                    outlined
                    rows="1"
                    class="ma-0 pa-0"
                    color="primary"
                ></v-textarea>
                <div class="text-center">
                    <v-btn color="primary" block rounded id="sendbutton">send</v-btn>
                </div>
            </div>
        </v-container>
        <!-- <Bottomnavbar/> -->
       
    </v-container>
</template>
<script>
import Topnavbar from '@/components/layout/TopnavbarBackChat'
import {ApiService} from '@/core/services/api.service'
import {mapGetters} from 'vuex';
import { socketHandler } from '@/core/services/socketio/socket';
import moment from "moment";

export default {
    name: 'ChatPage',
    data() {
        return {
            customheight:'',
            moment,
            message: '',
            tz : '',
            title: '',
            valid: true,
            maxHeight: 100,
            customer: {
                fname: '',
                lname: '',
                phone_no: '',
                email: '',
                profile_pic: '',
            },
            file_name: '',
            ruleRequired: [
                v => !!v || 'Required',
            ],
            rulesEmail: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid',
            ],
            update_input_file: true,
            src: '',
            table_to: '',
            table_to_id: '',
            pageNo: 1,
            messages: [],
            receiver:{
                name:'',
                profile_pic:'',
            },
        }
    },
    mounted() {
        let plugin = this;
      
        this.table_to = this.$router.currentRoute.params.type;
        this.table_to_id = this.$router.currentRoute.params.id;

        socketHandler.on('timezone', function(tz) {
            plugin.tz = tz;
        });
    
        socketHandler.initChat({
            table_from: this.currentUser.table,
            table_from_id: this.currentUser.table_id,
            table_to: this.table_to,
            table_to_id: this.table_to_id,
        });

        socketHandler.on('appendMyMessage', function (message) {
            plugin.message = '';
            plugin.messages.push({
                message,
                created_at: moment().tz(plugin.tz).format('YYYY-MM-DD HH:mm:ss'),
                table_from: plugin.currentUser.table,
                table_from_id: plugin.currentUser.table_id
            });

            ApiService.post('/firebase/offline/notification', {
                table_to : this.table_to,
                table_to_id : this.table_to_id,
                message
            })
        });
        socketHandler.on('messageReceived', function (message) {
            plugin.messages.push({...message, created_at : moment().tz(plugin.tz).format('YYYY-MM-DD HH:mm:ss')})
            
        });
        socketHandler.on('scrollToBottom', function () {
            setTimeout(() => {
                plugin.$refs.messageContainer.scrollTop = plugin.$refs.messageContainer.scrollHeight;
            },500);
        });
        // this.customheight = this.$refs.messageContainer.scrollHeight - 00;
        this.fetchMessage();
    },
    watch : {
        messages() {
            this.scrollToBottom();
        }
    },
    methods: {

        handleOrder(message) {
            if(!message.includes('href'))return;
            let href = message.match(/\/order\/[\d]+/);
            if(!(0 in href)) return;
            let  orderId = href[0].replace(/[^\d]/g, '')
            this.$router.replace({name:'OrderDetailPage',params: { orderId: orderId}});
        },
        scrollToBottom(){
            setTimeout(() => {
                this.customheight = "";
                this.$refs.messageContainer.scrollTop = this.$refs.messageContainer.scrollHeight;
            }, 500);
        },
        sentByMe(message) {
            return this.currentUser.table === message.table_from && Number(this.currentUser.table_id) === Number(message.table_from_id);
        },
        prevMessageDate(index) {
            if (index === 0) return null;
            return this.messages[index - 1].created_at;
        },
        fetchMessage() {
            this.loaderShow();
            ApiService.post('/chat-messages', {
                table_from: this.currentUser.table,
                table_from_id: this.currentUser.table_id,
                table_to: this.table_to,
                table_to_id: this.table_to_id,
                page: this.pageNo,
            })
                .then((resp) => {
                    this.loaderHide();
                    this.messages = resp.data;
                    this.receiver =  resp.meta;
                })
                .catch((error) => {
                    this.loaderHide();
                    console.log(error);
                })

        },
        handleBack() {
            this.$router.back();
        },
        changeImage(file) {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            let formData = new FormData();
            formData.append("file", file.file);
            ApiService.post('/store-image', formData)
                .then((resp) => {
                    this.$bus.$emit('HIDE_PAGE_LOADER');
                    this.src = resp.src;
                    this.customer.profile_pic = resp.src;
                    this.file_name = resp.file_name;
                    this.hasFile = true;
                })
                .catch(() => {
                    this.messageError("Failed ! choose image less than size 2mb");
                    this.$bus.$emit('HIDE_PAGE_LOADER');
                });
        },
        async profileData() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/profile').then((resp) => {
                this.$bus.$emit('HIDE_PAGE_LOADER');
                this.customer.fname = resp.data.fname;
                this.customer.lname = resp.data.lname;
                this.customer.email = resp.data.email;
                this.src = resp.data.profile_pic;
                this.customer.phone_no = resp.data.phone_no;
            })
                .catch(() => {
                    this.$bus.$emit('HIDE_PAGE_LOADER');
                })
        },
        async updateProfile() {
            this.$bus.$emit('SHOW_PAGE_LOADER');
            await ApiService.post('/update-profile', this.customer)
                .then((resp) => {
                    this.$bus.$emit('HIDE_PAGE_LOADER');
                    this.messageSuccess(resp.message);
                    this.$router.push({name: 'profilePage'});
                })
                .catch(() => {
                    this.$bus.$emit('HIDE_PAGE_LOADER');
                    this.messageError('Failed to update profile');
                })
        }
    },
    components: {
        Topnavbar,
        // Bottomnavbar,
        // InputUpload
    },
    computed: {
        ...mapGetters({
            currentUser:'auth/user'
        }),
    }
}
</script>
<style lang="scss" scoped>
.content-cs{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100vh - 140px);
}
:root {
    //   --body-bg: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    //   --msger-bg: #fff;
    //   --border: 2px solid #ddd;
    //   --left-msg-bg: #ececec;
    //   --right-msg-bg: #579ffb;
}
.msg-text{
    font-size:0.8rem !important;
}

.chat-box {
    padding-top:20px;
    width: 100%;
    background: #fff;
    -webkit-box-shadow: 0px -7px 7px -10px rgb(184 184 184);
    -moz-box-shadow: 0px -7px 7px -10px rgba(184,184,184,1);
    box-shadow: 0px -7px 7px -10px rgb(184 184 184);
}
.msger {
    display: flex;
    flex-flow: column wrap;
    justify-content: space-between;
    width: 100%;
    max-width: 867px;
    margin: 25px 10px;
    // height: calc(100% - 50px);
    height: calc(100% - 50px);
    border: var(--border);
    border-radius: 5px;
    background: var(--msger-bg);
    box-shadow: 0 15px 15px -5px rgba(0, 0, 0, 0.2);
}

.msger-header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: var(--border);
    background: #eee;
    color: #666;
}

.msger-chat {
    flex: 1;
    overflow-y: auto;
    padding: 10px 0;
    // margin-bottom: 160px;
    height: calc(100vh - 250px);
    // height: calc(100vh - 155px);
    // height: 400px;
}
//
//.msger-chat::-webkit-scrollbar {
//    width: 6px;
//}
//
//.msger-chat::-webkit-scrollbar-track {
//    background: #ddd;
//}
//
//.msger-chat::-webkit-scrollbar-thumb {
//    background: #bdbdbd;
//}

.msg {
    display: flex;
    align-items: flex-end;
    margin-bottom: 10px;
}

.msg:last-of-type {
    margin: 0;
}

.msg-img {
    width: 50px;
    min-width: 50px;
    height: 50px;
    margin-right: 10px;
    background: #ddd;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 50%;
}

.msg-bubble {
    max-width: 450px;
    padding: 15px;
    border-radius: 15px;
    background: #ececec;
}

.msg-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.msg-info-name {
    margin-right: 10px;
    font-weight: bold;
}

.msg-info-time {
    font-size: 0.8em;
    color: #ff5d5d;
    font-weight: 500;
}

.left-msg .msg-bubble {
    border-bottom-left-radius: 0;
}

.right-msg {
    flex-direction: row-reverse;
}

.right-msg .msg-bubble {
    background: #ffdada;
    // color: #fff;
    border-bottom-right-radius: 0;
}

.right-msg .msg-img {
    margin: 0 0 0 10px;
}

.msger-inputarea {
    display: flex;
    padding: 10px;
    border-top: var(--border);
    background: #eee;
}

.msger-inputarea * {
    padding: 10px;
    border: none;
    border-radius: 3px;
    font-size: 1em;
}

.msger-input {
    flex: 1;
    background: #ddd;
}

.msger-send-btn {
    margin-left: 10px;
    background: rgb(0, 196, 65);
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.23s;
}

.msger-send-btn:hover {
    background: rgb(0, 180, 50);
}
</style>