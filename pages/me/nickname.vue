<template>
	<text-input
		title="设置名字"
		:initValue="nickname"
		@cancel="back"
		@done="setNickName"
	/>
</template>

<script>
	import { setNickname } from '@/apis/user-api.js'
	
	export default {
		data() {
			return {
				nickname: ''
			}
		},
		onLoad(option) {
			this.nickname = option.nickname
		},
		methods: {
			async setNickName(nickname) {
				await setNickname(nickname)
				await this.$store.dispatch('user/fetchUserInfo')
				this.$store.dispatch('user/fetchContactList')
				this.back()
			},
			back() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color-grey;
	}
</style>
