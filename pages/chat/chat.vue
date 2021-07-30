<template>
	<view class="chat">
		<nav-bar>{{ title }}</nav-bar>
		<scroll-view
			class="chat-content"
			:scroll-y="true"
			:scroll-with-animation="true"
			:scroll-top="scrollTop"
		>
			<view class="msg-list">
				<msg-item
					v-for="message in msgList"
					:message="message"
					:avatar-right="uid === message.from"
					@avatar-tap="toFriendPage"
					@message-tap="handleMessageTap"
				/>
			</view>
		</scroll-view>
		<msg-input @send="sendMsg" @height-change="scrollToBottom" />
	</view>
</template>

<script>
	import { getChatHistory, updateChatHistorySnapshotUnread } from "@/utils/chat-storage"
	import { chat } from '@/utils/chat.js'
	
	export default {
		data() {
			return {
				msgList: [], // 消息列表
				fid: null, // 好友ID
				chatType: 0, // 聊天类型 0.单聊 1.群聊
				// scrollIntoView: '',
				scrollTop: 0,
			}
		},
		onLoad(option) {
			const { fid, chatType } = option
			
			chat.uid = this.uid
			this.fid = chat.fid = fid
			this.chatType = chat.chatType = chatType || 0
			
			this.readMsgs()
			
			uni.$on('on-chat-msg', this.receiveMsg)
		},
		onUnload() {
			chat.fid = null
			chat.chatType = null
			
			uni.$off('on-chat-msg', this.receiveMsg)
		},
		computed: {
			uid() {
				return this.$store.state.user.userInfo.id
			},
			title() {
				return this.contactMap[chat.fid].markName
			},
			contactMap() {
				return this.$store.state.user.contactMap
			},
			isFriend() {
				return this.$store.state.user.contactList.findIndex(item => item.id === this.fid) > -1
			},
			imgList() {
				return this.msgList.filter(m => m.type === 1)
			}
		},
		mounted() {
			this.scrollToBottom()
		},
		// updated() {
		// 	this.scrollToBottom()
		// },
		watch: {
			msgList() {
				this.scrollToBottom()
			}
		},
		methods: {
			_toChatMsg(msg) {
				const avatar = this.contactMap[msg.from].faceImage
				return { ...msg, avatar }
			},
			readMsgs() {
				const { uid, fid } = this
				// 加载消息列表
				this.msgList = getChatHistory(uid, fid).map(this._toChatMsg)
				// 更新聊天快照未读数
				updateChatHistorySnapshotUnread(uid, fid)
			},
			receiveMsg(msg) {
				// 判断是否是当前聊天
				if (msg.from === this.fid || msg.from === this.uid) {
					msg = this._toChatMsg(msg)
					this.msgList.push(msg)
				}
			},
			sendMsg(msg) {
				if (!this.isFriend) {
					uni.showToast({ title: '对方不是你的好友', icon: 'none' })
					return
				}
				chat.sendMsg({
					...msg,
					id: 'chat_msg_' + new Date().getTime(),
					from: this.uid,
					to: this.fid,
					chatType: this.chatType
				})
			},
			toFriendPage(msg) {
				let fid = this.uid
				if (fid !== msg.from) {
					fid = msg.from
				}
				uni.navigateTo({ url: '/pages/friend/friend?fid=' + fid })
			},
			handleMessageTap(msg) {
				if (msg.type === 1) {
					const index = this.imgList.indexOf(msg)
					const images = this.imgList.map(m => m.content)
					this.previewImage(index, images)
				}
			},
			// scrollToBottom() {
			// 	this.scrollIntoView = ''
			// 	this.$nextTick(() => {
			// 		const messages = this.messages
			// 		const len = messages.length
			// 		if (len) {
			// 			const lastId = messages[len - 1].id
			// 			this.scrollIntoView = 'chat_msg_' + lastId
			// 		}
			// 	})
			// },
			scrollToBottom() {
				this.$nextTick(() => {
					const query = uni.createSelectorQuery()
						.in(this)
						.select('.chat-content')
						.boundingClientRect()
						.select('.msg-list')
						.boundingClientRect()
								
					query.exec(res => {
						if (res[1].height > res[0].height) {
							this.scrollTop = res[1].height - res[0].height
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		background-color: $uni-bg-color-grey;
	}
	.chat {
		display: flex;
		height: 100%;
		flex-direction: column;
		overflow: hidden;
		
		&-content {
			flex: 1;
			flex-grow: 1;
			overflow: hidden;
		}
	}
</style>
