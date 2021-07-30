<template>
	<view :style="{height: statusBarHeight + 'px'}" />
</template>

<script>
	export default {
		name: 'status-bar',
		data() {
			return {
				statusBarHeight: 0
			}
		},
		created() {
			const sysInfo = uni.getSystemInfoSync()
			this.statusBarHeight = sysInfo.statusBarHeight
		}
	}
</script>

<style>

</style>
