<template>
	<view class="register">
		<nav-bar />
		
		<view class="form">
			<uni-forms ref="form" :modelValue="formData" :rules="rules">
				<uni-forms-item name="username">
					<input v-model="formData.username" type="text" placeholder="用户名" />
				</uni-forms-item>
				<uni-forms-item name="password">
					<input v-model="formData.password" type="password" placeholder="密码" />
				</uni-forms-item>
				<uni-forms-item name="repassword">
					<input v-model="formData.repassword" type="password" placeholder="重复密码" />
				</uni-forms-item>
				
				<button type="primary" @click="submit">注册</button>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	import { register } from '@/apis/user-api.js'
	
	export default {
		data() {
			return {
				formData: {
					username: '',
					password: '',
					repassword: ''
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
					},
					repassword: {
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
		methods: {
			submit() {
				this.$refs.form.validate().then(res => {
					uni.showLoading()
					register(this.formData).then(res => {
						uni.hideLoading()
						uni.navigateBack()
					}).catch(e => {
						uni.hideLoading()
						uni.showToast({ title: '注册失败', duration: 2000 })
					})
				})
			},
			toRegisterPage() {
				uni.navigateTo({
					url: '/pages/register/register'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.register {
		.form {
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
	}
</style>
