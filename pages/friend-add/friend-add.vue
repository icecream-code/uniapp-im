<template>
	<view class="friend-add">
		<nav-bar fixed>添加朋友</nav-bar>
		<input
			v-model="value"
			class="friend-add__search"
			type="text"
			placeholder="账号搜索"
			@confirm="search"
		/>
		<view class="friend-add__result">
			<view v-if="message" class="friend-add__result--tip">
				{{ message }}
			</view>
			<view v-if="friend">
				<c-list-item :thumb="friend.faceImage || ''" @on-tap="toFriendPage(friend.id)">
					<view class="slot-main">
						<view>{{ friend.nickname }}</view>
					</view>
				</c-list-item>
			</view>
		</view>
	</view>
</template>

<script>
	import CListItem from '@/components/list/list-item.vue'
	import CBtn from '@/components/c-btn/c-btn.vue'
	import { searchByUsername } from '@/apis/user-api.js'
	
	export default {
		components: {
			CListItem,
			CBtn
		},
		data() {
			return {
				value: '',
				message: null,
				friend: null
			}
		},
		methods: {
			search() {
				const value = this.value
				if (!value.length) {
					return
				}
				this.friend = null
				this.message = null
				searchByUsername(value).then(res => {
					this.friend = res
				}).catch(e => {
					this.message = e.message
				})
			},
			toFriendPage(fid) {
				uni.navigateTo({ url: `/pages/friend/friend?fid=${fid}` })
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color-grey;
	}
	.friend-add {
		display: flex;
		flex-direction: column;
		
		&__search {
			height: 88rpx;
			padding: 0 16rpx;
			background-color: #fff;
		}
		
		&__result {
			margin: 32rpx 0;
			
			&--tip {
				text-align: center;
				color: $uni-text-color-grey;
			}
		}
	}
</style>
