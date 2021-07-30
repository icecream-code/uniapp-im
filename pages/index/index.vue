<template>
	<view>
		<chat-list :list="list" @on-chat-item-click="toChatPage" />
	</view>
</template>

<script>
	import tabarBadgeMixin from '@/mixins/tabar-badge-mixin.js'
	import { chat } from '@/utils/chat.js'
	import { showTimePipe } from '@/utils/common.js'
	
	export default {
		mixins: [tabarBadgeMixin],
		data() {
			return {
				list: []
			}
		},
		onLoad() {
			if (!this.userId) {
				uni.reLaunch({ url: '/pages/login/login' })
			} else {
				this.$store.dispatch('user/fetchContactList')
				
				chat.initWebsocket()
				chat.fetchRequestList()
			}
		},
		onShow() {
			// 更新快照
			chat.refreshChatList()
		},
		onUnload() {
			chat.closeWebsocket()
		},
		computed: {
			userId() {
				return this.$store.state.user.userInfo.id
			},
			contactMap() {
				return this.$store.state.user.contactMap
			},
			chatList() {
				return this.$store.state.chat.chatList
			}
		},
		watch: {
			contactMap() {
				this.getList()
			},
			chatList() {
				this.getList()
			}
		},
		methods: {
			toChatPage(item) {
				const { uid } = item
				const chatType = 1 // TODO
				uni.navigateTo({
					url: `/pages/chat/chat?fid=${uid}&chatType=${chatType}`
				})
			},
			getList() {
				this.list = this.chatList.map(c => {
					const info = this.contactMap[c.uid] || {
						avatar: '/static/logo.png',
						nickname: c.uid,
						markName: c.uid
					}
					return {
						...c,
						time: showTimePipe(c.time),
						avatar: info.faceImage || '/static/logo.png',
						nickname: info.nickname,
						markName: info.markName
					}
				})
			}
		}
	}
</script>
