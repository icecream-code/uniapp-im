<template>
	<view class="emoji-wrapper">
		<template v-for="emoji in emojis">
			<view class="emoji-item" @click="handleClick(emoji)">{{ emoji }}</view>
		</template>
	</view>
</template>

<script>
	export default {
		name: 'emoji',
		emits: ['on-select'],
		data() {
			return {
				emojis: [
					'😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
					'🙂', '🙃', '😉', '😊', '😇', '😍', '🤩', '😘',
					'😗', '☺️', '😚', '😙', '😋', '😛', '😜', '🤪',
					'😝', '🤑', '🤗', '🤭', '🤔', '🤨', '😐', '😶',
					'😏', '😒', '🙄', '😬', '😌', '😪', '😴', '😷',
					'🤒', '😵', '😎', '😕', '🙁', '😮', '😯', '😳',
					'😧', '😥', '😭', '😱', '😖', '😞', '😓', '😤',
					'😡', '👿', '👻', '💘', '💕', '💔', '❤️', '🧡',
					'💚', '💙', '💜', '👄', '👶', '🧒', '👦', '👧',
					'👨', '👩', '🙅‍♀️', '👨‍👩‍👧‍👦'
				]
			}
		},
		methods: {
			handleClick(emoji) {
				this.$emit('on-select', emoji)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.emoji-wrapper {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		
		.emoji-item {
			width: 16.66666%;
			margin: 10rpx 0;
			font-size: 48rpx;
			text-align: center;
		}
	}
</style>
