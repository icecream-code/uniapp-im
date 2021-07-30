<template>
	<view class="friend-request">
		<nav-bar>
			<text>新的朋友</text>
			<template slot="right">
				<span class="iconfont icon-add" style="font-size: 44rpx;" @tap="toFriendAddPage" />
			</template>
		</nav-bar>
		<c-list class="friend-request__list" v-if="list && list.length">
			<c-list-item
				v-for="item in list"
				:thumb="item.faceImage"
			>
				<view class="slot-main">
					<view class="nickname">{{ item.nickname }}</view>
					<view class="message">{{ item.message }}</view>
				</view>
				<view class="slot-extra" slot="extra">
					<template v-if="item.status === 0">
						<view style="display: flex; flex-direction: row;">
							<c-btn style="margin-right: 10rpx;" @click="handleFriendRequest(item.from, item.to, 1)">同意</c-btn>
							<c-btn type="error" @click="handleFriendRequest(item.from, item.to, 2)">拒绝</c-btn>
						</view>
					</template>
					<template v-else>
						{{ getStatusText(item.status) }}
					</template>
				</view>
			</c-list-item>
		</c-list>
	</view>
</template>

<script>
	import CList from '@/components/list/list.vue'
	import CListItem from '@/components/list/list-item.vue'
	import CBtn from '@/components/c-btn/c-btn.vue'
	import { chat } from '@/utils/chat.js'
	import { handleFriendRequest } from "@/apis/user-api.js"
	
	export default {
		components: {
			CList,
			CListItem,
			CBtn
		},
		data() {
			return {
				
			}
		},
		computed: {
			list() {
				return this.$store.state.user.requestList
			}
		},
		methods: {
			toFriendAddPage() {
				uni.navigateTo({ url: '/pages/friend-add/friend-add' })
			},
			handleFriendRequest(from, to, type) {
				handleFriendRequest(from, type).then(res => {
					// 更新状态
					this.$store.dispatch('user/updateRequestStatus', { fromId: from, status: type })
					// 不是同意返回
					if (type !== 1) {
						return
					}
					// 更新好友列表、快照列表
					this.$store.dispatch('user/fetchContactList').then(list => {
						// 发送通过好友请求消息
						chat.sendMsg({
							id: 'chat_msg_' + new Date().getTime(),
							type: 0,
							content: '我通过了你的朋友验证请求，现在我们可以开始聊天了',
							chatType: 0,
							from: to,
							to: from
						})
					})
				})
			},
			getStatusText(status) {
				if (status === 1) {
					return '已添加'
				}
				if (status === 2) {
					return '已拒绝'
				}
				if (status === 3) {
					return '已忽略'
				}
				if (status === 4) {
					return '已过期'
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.friend-request__list {
		.slot-main {
			display: flex;
			flex-direction: column;
			
			.nickname {
				font-size: 32rpx;
			}
			
			.message {
				font-size: 28rpx;
				color: $uni-text-color-placeholder;
			}
		}
		
		.slot-extra {
			// padding: 0 8rpx;
			font-size: 28rpx;
			color: $uni-text-color-disable;
		}
	}
</style>
