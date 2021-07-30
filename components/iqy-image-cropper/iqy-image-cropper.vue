<template>
	<view class="image-cropper" v-show="show">
		<view class="image-cropper__image">
			<image ref="crop-image" :src="src" :style="imageStyle" class="crop-image" />
		</view>
		
		<view class="image-cropper__modal" />
		
		<view class="image-cropper__crop"
			@touchstart.stop.prevent="imageTouchStart"
			@touchmove.stop.prevent="imageTouchMove"
			@touchend.stop.prevent="imageTouchEnd"
		>
			<view class="crop-view" :style="cropStyle">
				<image :src="src" :style="imageStyle" class="crop-image" />
			</view>
			
			<view class="crop-box" :style="cropStyle">
				<view class="crop-box-item"></view>
				<view class="crop-box-item"></view>
				<view class="crop-box-item"></view>
				<view class="crop-box-item"></view>
				<view class="crop-box-item"></view>
				<view class="crop-box-item"></view>
				<view class="crop-box-item"></view>
				<view class="crop-box-item"></view>
				<view class="crop-box-item"></view>
			</view>
		</view>
		
		<canvas canvas-id="canvas" class="image-cropper__canvas" :style="cropStyle" />
		
		<view class="image-cropper__opt">
			<view class="opt-btn">
				<text @tap="cancel">取消</text>
			</view>
			<view class="opt-btn">
				<text @tap="init">还原</text>
			</view>
			<view class="opt-btn">
				<text @tap="copyToCanvas">确定</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'iqy-image-cropper',
		emits: ['ok', 'cancel'],
		props: {
			src: {
			    type: String,
			}
		},
		data() {
			const sysInfo = uni.getSystemInfoSync()
			
			return {
				windowWidth: sysInfo.windowWidth,
				windowHeight: sysInfo.windowHeight,
				pixelRatio: sysInfo.pixelRatio,
				show: false,
				image: {
					width: 0,
					height: 0,
					ratio: 1
				},
				// imageWidth: 0, // 图片宽度
				// imageHeight: 0, // 图片高度
				// imageRatio: 0, // 图片宽高比
				scale: 0,
				lastScale: 1,
				isScale: false,
				tx: 0,
				ty: 0,
				startX: 0,
				startY: 0,
				startTx: 0,
				startTy: 0,
				imageNodeRef: null,
				startL: 0,
				originX: '50%',
				originY: '50%'
			}
		},
		computed: {
			imageStyle() {
				return {
					width: this.imageWidth + 'px',
					height: this.imageHeight + 'px',
					transform: `scale(${this.scale}, ${this.scale}) translate3d(${this.tx / this.scale}px, ${this.ty / this.scale}px, 0)`,
					transformOrigin: `${this.originX} ${this.originY}`
				}
			},
			cropStyle() {
				return {
					width: this.cropWidth + 'px',
					height: this.cropWidth + 'px'
				}
			},
			imageWidth() {
				return this.windowWidth
			},
			imageHeight() {
				return this.imageWidth / this.image.ratio
			},
			cropWidth() {
				return Math.min(this.imageWidth, this.imageHeight)
			}
		},
		watch: {
			src(val) {
				val && val.length && this.loadImage(val)
			}
		},
		methods: {
			init() {
				this.scale = 1
				this.isScale = false
				this.lastScale = 1
				this.tx = -(this.imageWidth / 2)
				this.ty = -(this.imageHeight / 2)
				this.startX = 0
				this.startY = 0
				this.startTx = 0
				this.startTy = 0
				this.startL = 0
				this.originX = '50%'
				this.originY = '50%'
			},
			loadImage(src) {
				this.init()
				uni.showLoading()
				uni.getImageInfo({
				    src: src,
				    success: res => {
				        uni.hideLoading()
						this.show = true
						this.image = {
							width: res.width,
							height: res.height,
							ratio: res.width / res.height
						}
						this.tx = -(this.imageWidth / 2)
						this.ty = -(this.imageHeight / 2)
				    },
				    fail: e => {
				        this.show = false
				        uni.hideLoading()
				        uni.showModal({ title: '提示', content: '图片加载失败' })
				    }
				})
			},
			imageTouchStart(e) {
				if (e.touches.length == 2) {
				    this.lastScale = this.scale
				    this.isScale = true
				    this.startL = this.computeMoveDeltal(e)
				} else {
				    this.startX = e.touches[0].pageX - this.tx
				    this.startY = e.touches[0].pageY - this.ty
					this.startTx = this.tx
					this.startTy = this.ty
				}
				uni.createSelectorQuery().in(this)
					.select('.crop-image')
					.boundingClientRect(res => this.imageNodeRef = res)
					.exec()
			},
			imageTouchMove(e) {
				if (this.isScale) { // 缩放
					const moveL = this.computeMoveDeltal(e)
					const delta = moveL - this.startL
					
					const coe = Math.min(1 / this.imageWidth, 1 / this.imageHeight)
					const num = coe * delta * 2
					const maxScale = 4.5
					
					let scale = this.lastScale
					if (delta > 0) { // 放大
					    scale += Math.abs(num)
						if (scale > maxScale) {
							scale = maxScale
						}
					} 
					if (delta < 0) { // 缩小
					    scale > Math.abs(num) ? (scale -= Math.abs(num)) : scale
						if (scale < 1) {
							scale = 1
						}
					}
					this.computeTransformOrigin(e)
					this.scale = scale
				} else { // 拖动
					const moveX = e.touches[0].pageX - this.startX
					const moveY = e.touches[0].pageY - this.startY
					this.tx = moveX
					this.ty = moveY
				}
			},
			imageTouchEnd(e) {
				setTimeout(() => {
					this.isScale = false
					this.endMove(e)
				}, 100)
			},
			computeMoveDeltal(e) {
				const x = e.touches[0].pageX - e.touches[1].pageX
				const y = e.touches[0].pageY - e.touches[1].pageY
				const hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))	
				return Math.max(x, y, hypotenuse)
			},
			computeTransformOrigin(e) {
				let x = (e.touches[0].pageX + e.touches[1].pageX) / 2
				let y = (e.touches[0].pageY + e.touches[1].pageY) / 2
				
				const { left, top, right, bottom } = this.imageNodeRef
				x = Math.abs((x - left) / (right - left))
				y = Math.abs((y - top) / (bottom - top))
				
				this.originX = x * 100 + '%'
				this.originY = y * 100 + '%'
			},
			endMove(e) {
				this.createSelectorQuerys(['.crop-box', '.crop-image'], res => {
					const cropView = res[0]
					const imageView = res[1]
					const prevImageView = this.imageNodeRef
					const tx = this.tx
					const ty = this.ty
					const startTx = this.startTx
					const startTy = this.startTy
					
					if (imageView.left > cropView.left) {
						this.tx = (cropView.left - prevImageView.left) + startTx
					}
					if (imageView.right < cropView.right) {
						this.tx = (cropView.right - prevImageView.right) + startTx
					}
					if (imageView.top > cropView.top) {
						this.ty = (cropView.top - prevImageView.top) + startTy
					}
					if (imageView.bottom < cropView.bottom) {
						this.ty = (cropView.bottom - prevImageView.bottom) + startTy
					}
				})
			},
			createSelectorQuerys(selectors, fn) {
				const query = uni.createSelectorQuery().in(this)
				for (let i = 0; i < selectors.length; i++) {
					query.select(selectors[i]).boundingClientRect()
				}
				query.exec(fn)
			},
			copyToCanvas() {
				this.createSelectorQuerys(['.crop-box', '.crop-image'], res => {
					const cropView = res[0]
					const imageView = res[1]
					const dx = -(cropView.left - imageView.left)
					const dy = -(cropView.top - imageView.top)
					const dw = this.imageWidth * this.scale
					const dh = this.imageHeight * this.scale
					
					this.imageToCanvas(this.src, dx, dy, dw, dh)
				})
			},
			imageToCanvas(image, dx, dy, dw, dh) {
				const canvasId = 'canvas'
				const ctx = uni.createCanvasContext(canvasId, this)

                ctx.drawImage(image, dx, dy, dw, dh)
				ctx.draw(false, () => {
				    uni.canvasToTempFilePath({
				        canvasId: canvasId,
				        success: res => {
							this.ok(res.tempFilePath)
				        },
				        fail: e => {
				            uni.showToast({ title: '裁剪失败', icon: 'none' })
				        }
				    }, this)
				})
			},
			ok(tempFilePath) {
				this.show = false
				this.$emit('ok', tempFilePath)
			},
			cancel() {
				this.show = false
				this.$emit('cancel')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.image-cropper {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		// bottom: constant(safe-area-inset-bottom);
		// bottom: env(safe-area-inset-bottom);
		left: 0;
		z-index: 998;
		box-sizing: border-box;
		user-select: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		background-color: #000;
		
		&__image,
		&__modal,
		&__crop {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			user-select: none;
			z-index: 998;
		}
		
		&__modal {
			background: rgba(0, 0, 0, 0.6);
		}
		
		.crop-image {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			user-select: none;
		}
		
		&__crop {
			.crop-view,
			.crop-box {
				position: absolute;
				left: 50%;
				top: 50%;
				width: 100%;
				height: 100%;
				transform: translate(-50%, -50%);
			}
			
			.crop-view {
				overflow: hidden;
				user-select: none;
			}
			
			.crop-box {
				display: flex;
				flex-wrap: wrap;
				border: 1px solid #fff;
				box-sizing: border-box;
				z-index: 999;
				
				.crop-box-item {
					flex: 33.3333%;
					flex-grow: 1;
					margin-right: -1px;
					margin-bottom: -1px;
					border-right: 1px solid #fff;
					border-bottom: 1px solid #fff;
				}
			}
		}
		
		&__canvas {
			position: absolute;
			top: -9999px;
			left: -9999px;
			z-index: -998;
		}
		
		&__opt {
			display: flex;
			height: 96rpx;
			align-items: center;
			position: absolute;
			bottom: 0;
			bottom: constant(safe-area-inset-bottom);
			bottom: env(safe-area-inset-bottom);
			left: 0;
			right: 0;
			z-index: 998;
			border-top: .5px solid #999;
			
			.opt-btn {
				flex: 1;
				text-align: center;
				color: #fff;
			}
		}
	}
</style>
