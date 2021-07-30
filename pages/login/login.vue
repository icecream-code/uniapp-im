<template>
	<view>
		<status-bar />
		<view class="login-form">
			<uni-forms ref="form" :modelValue="formData" :rules="rules">
				<uni-forms-item name="username">
					<input v-model="formData.username" type="text" placeholder="用户名" />
				</uni-forms-item>
				<uni-forms-item name="password">
					<input v-model="formData.password" type="password" placeholder="密码" />
				</uni-forms-item>
				
				<button type="primary" @click="submit">登录</button>
				<button type="default" @click="toRegisterPage">注册</button>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	import { login } from '@/apis/user-api.js'
	
	export default {
		data() {
			return {
				formData: {
					username: '',
					password: ''
				},
				rules: {
					username: {
						rules: [
							{ required: true, errorMessage: '请输入用户名' },
							{
								minLength: 2,
								maxLength: 16,
								errorMessage: '用户名长度在 {minLength} 到 {maxLength} 个字符'
							}
						]
					},
					password: {
						rules: [
							{ required: true, errorMessage: '请输入密码' },
							{
								minLength: 2,
								maxLength: 16,
								errorMessage: '密码长度在 {minLength} 到 {maxLength} 个字符'
							}
						]
					}
				}
			}
		},
		created() {
			this.$store.dispatch('user/logout')
		},
		methods: {
			submit() {
				this.$refs.form.validate().then(res => {
					this.login(res)
				}).catch(e => {
					console.log(e)
				})
			},
			login(data) {
				login(this.formData).then(token => {
					this.$store.dispatch('user/setToken', token)
					this.$store.dispatch('user/fetchUserInfo').then(() => {
						this.toIndexPage()
					})
				})
			},
			toRegisterPage() {
				uni.navigateTo({ url: '/pages/register/register' })
			},
			toIndexPage() {
				uni.switchTab({ url: '/pages/index/index' })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login-form {
		margin-top: 80rpx;
		padding: 0 16rpx;
		
		input {
			height: 68rpx;
			font-size: $uni-font-size-lg;
			font-weight: 500;
			border-bottom: 1px solid $uni-border-color;
			caret-color: $uni-color-success;
		}
		
		button {
			margin-top: 28rpx;
		}
	}
</style>
