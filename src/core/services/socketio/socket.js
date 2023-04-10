// let io = require('socket.io-client');
// import io from 'socket.io-client'
import io from 'socket.io-client'
let moment = require('moment')
let $ = require('../dollor');
import { base_socket_url, key } from '../config'
import {ApiService} from '../api.service'

let socketHandler = {
    initiated : false,
    log : false,
    socket: io(base_socket_url,{transports :['polling'], query : {key}}),
    channelOne: "chat.message",
    channelTwo: "chat.read",
    channelThree: "chat.online",
    channelFour: "chat.online.check",

    messagePreviewLength: 25,
    timezone_offset_minutes : 0,
    tz : '',

    container: $("#chatMessages"),
    textbox: $("#messagetosend"),
    sendButton: $("#sendbutton"),
    chatUsers: $(".user--list--item"),
    activeStatus: $(".chat--active--status"),
    dropzone: $("#chat---dropzone"),
    dropFiles: $(".attachments--chat"),
    conversation_id: null,
    table_from: null,
    table_from_id: null,
    table_to: null,
    table_to_id: null,

    on(key, func) {
        if (typeof func === 'function') {
            this[key] = func.bind(this);
        } else {
            this[key] = func;
        }
    },

    initChat({table_from, table_from_id, table_to, table_to_id, conversation_id, seen_client=0, seen_vendor=0}) {
        if(!this.initiated) {
            this.init()
        }
        this.initTimezone();
        this.container = $("#chatMessages");
        this.textbox = $("#messagetosend");
        this.sendButton = $("#sendbutton");
        this.chatUsers = $(".user--list--item");
        this.activeStatus = $(".chat--active--status");
        this.table_from = table_from;
        this.table_from_id = table_from_id;
        this.table_to = table_to;
        this.table_to_id = table_to_id;
        this.conversation_id = conversation_id;
        this.seen_client = seen_client;
        this.seen_vendor = seen_vendor;
        this.handleTextBox();
        this.scrollToBottom();
        this.onlineStatus();
        this.socket.emit("chat.online.check", {});
    },
    timezone(tz) {
        this.tz = tz;
    },
    async initTimezone() {
        let timezone_offset_minutes = new Date().getTimezoneOffset();
        timezone_offset_minutes =
            timezone_offset_minutes === 0 ? 0 : -timezone_offset_minutes;
        try {
            let res = await ApiService.get('timezone/' + timezone_offset_minutes);
            this.timezone(res.tz);
        } catch (error) {
            console.error(error);
        }
    },
    init() {
        this.initiated = true;
        this.socket.on(
            this.channelOne,
            function (data) {
                const bottom = this.containerAtBottom();
                this.isForMe(data)
                    ? this.isMyMessage(data)
                        ? this.messageReceived(data)
                        : this.appendMyMessage(data.message)
                    : null;
                this.updateUserList(data);
                bottom ? this.scrollToBottom() : null;
            }.bind(this)
        );
        //online/offline
        this.socket.on(
            this.channelThree,
            function (data) {
                if (
                    this.table_to === data.table &&
                    Number(this.table_to_id) === Number(data.id)
                ) {
                    const key = `${data.table}${data.id}`;
                    if (!data.offline) {
                        clearInterval(this.offlineUsers[key]);
                        this.activeStatus.text("Active Now").addClass("active");
                    } else {
                        this.offlineTime(key)
                        this.activeStatus.removeClass("active");
                    }
                }
            }.bind(this)
        );
        this.socket.on(
            this.channelFour,
            function () {
                this.onlineStatus();
            }.bind(this)
        );
    },
    isForMe(data) {
        return (
            (Number(data.table_to_id) === Number(this.table_from_id) &&
                data.table_to === this.table_from &&
                Number(data.table_from_id) === Number(this.table_to_id) &&
                data.table_from === this.table_to) ||
            (Number(data.table_to_id) === Number(this.table_to_id) &&
                data.table_to === this.table_to &&
                Number(data.table_from_id) === Number(this.table_from_id) &&
                data.table_from === this.table_from)
        );
    },
    isMyMessage(data) {
        return (
            Number(data.table_to_id) === Number(this.table_from_id) &&
            data.table_to === this.table_from &&
            Number(data.table_from_id) === Number(this.table_to_id) &&
            data.table_from === this.table_to
        );
    },
    containerAtBottom() {
        return (
            this.container.prop("offsetHeight") + this.container.prop("scrollTop") >=
            this.container.prop("scrollHeight")
        );
    },
    scrollToBottom() {
        this.container.scrollTop(this.container.prop("scrollHeight"));
        $(".chat--message--item img")
            .one(
                "load",
                function () {
                    this.container.scrollTop(this.container.prop("scrollHeight"));
                }.bind(this)
            )
            .each(function () {
                if (this.complete) {
                    $(this).trigger("load"); // For jQuery >= 3.0
                }
            });
    },
    messageReceived(data) {
        if(this.log) console.log(data)
    },
    isInMyInbox(data) {
        return (
            (Number(data.table_to_id) === Number(this.table_from_id) &&
                data.table_to === this.table_from) ||
            (Number(data.table_from_id) === Number(this.table_from_id) &&
                data.table_from === this.table_from)
        );
    },
    updateUserList(data) {
        if (!this.isInMyInbox(data)) return;
    },
    handleTextBox() {
        this.sendButton.off("click").on(
            "click",
            function (e) {
                // if (e.which !== 13) return;
                // if (e.shiftKey && e.which === 13) return;
                e.preventDefault();
                if (
                    this.textbox.val().trim() == ""
                    //   &&!$(".attachments--chat").children().length
                ) {
                    return;
                }
                this.handleMessageSend();
                this.localEventAfterSend();
            }.bind(this)
        );
    },
    handleMessageSend() {
        console.log({
            table_from: this.table_from,
            table_from_id: this.table_from_id,
            table_to: this.table_to,
            table_to_id: this.table_to_id,
            conversation_id: this.conversation_id,
            message: this.textbox.val().trim(),
        });
        this.socket.emit(this.channelOne, {
            table_from: this.table_from,
            table_from_id: this.table_from_id,
            table_to: this.table_to,
            table_to_id: this.table_to_id,
            conversation_id: this.conversation_id,
            seen_client: this.seen_client,
            seen_vendor: this.seen_vendor,
            message: this.textbox.val().trim(),
            files: $(".attachments--chat input")
                .get()
                .map((x) => ({
                    name: x.value,
                    mime: x.getAttribute("data-mime"),
                    id: x.getAttribute("data-id"),
                    text: x.getAttribute("data-name"),
                })),
        });
    },
    handleMessageRead() {
        this.socket.emit(this.channelTwo, {});
    },
    localEventAfterSend() {
        const message = this.textbox.val();
        this.appendMyMessage(message);
        // this.appendMyMessage(this.textbox.val());
        // $(".attachments--chat").empty();
        // $("#chat---dropzone").remove();
        // this.scrollToBottom();
        this.textbox.val("");
    },
    messageTime() {
        if (!$(".chat--message--item:last-child").length) return "";
        const prev = moment($(".chat--message--item:last-child").attr("data-at"));
        const now = moment();
        const m = now.diff(prev, "minutes");
        let h = now.diff(prev, "hours");
        const w = now.diff(prev, "weeks");
        h = now.format("ddd") === prev.format("ddd") ? 11 : h;
        return m < 5
            ? ""
            : h < 12
                ? now.format("h:mm A")
                : w < 1
                    ? now.format("ddd h:mm A")
                    : now.format("MMM DD, YYYY, h:mm A");
    },
    appendMyMessage(message) {
        if (this.log) console.log(message)
    },
    onlineStatus(data = null) {
        if (!this.initiated) {
            this.init()
        }
        if (this.socket.disconnected) {
            this.socket.connect()
        }
        this.socket.emit(this.channelThree, data !== null ? data : {
            id: this.table_from_id,
            table: this.table_from,
        });
    },
    offlineUsers: {},
    offlineTime(key) {
        const prev = moment();
        this.offlineUsers[key] = setInterval(() => {
            const now = moment();
            const m = now.diff(prev, "minutes");
            let h = now.diff(prev, "hours");
            const w = now.diff(prev, "weeks");
            // h = now.format('ddd') === prev.format('ddd') ? 11 : h;
            const text =
                m < 60
                    ? `${m} minutes ago`
                    : h < 24
                        ? `${h} hours ago`
                        : w < 1
                            ? now.format("ddd h:mm A")
                            : now.format("MMM DD, YYYY, h:mm A");
            this.activeStatus.text("Last Active: " + text);
        }, 6e4);
    },
    disconnect() {
        this.socket.disconnect();
        // this.initiated = false
    }
};

socketHandler.init();

export { socketHandler }