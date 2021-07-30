<template>
	<view class="setting-page">
		<btn-group class="btn-group">
			<button type="warn" @click="showConfirmModal">清空聊天记录</button>
			<button type="warn" @click="logout">退出登录</button>
		</btn-group>
	</view>
</template>

<script>
	import { clearChatCache } from '@/utils/chat-storage'
	import { chat } from '@/utils/chat.js'
	
	export default {
		data() {
			return {
			}
		},
		computed: {
			uid() {
				return this.$store.state.user.userInfo.id
			}
		},
		methods: {
			logout() {
				uni.reLaunch({ url: '/pages/login/login' })
			},
			showConfirmModal() {
				uni.showModal({
					title: '提示',
					content: '确定要清空所有聊天记录吗?',
					success: res => {
						if (res.confirm) {
							clearChatCache(this.uid)
							chat.refreshChatList()
							uni.showToast({ title: '已完成', duration: 2000 })
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color-grey;
	}
	.setting-page {
		
		.btn-group {
			margin: 20rpx 0;
		}
	}
</style>
