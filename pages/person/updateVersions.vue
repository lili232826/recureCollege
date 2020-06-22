<template>
	<u-modal v-model="show" 
	class="vip_modal"
	title="权益迁移"
	:content-slot="true"
	:title-style="{fontWeight:'bold'}"
	:show-cancel-button="true"
	confirm-text="转移到新账号"
	cancel-text="转移到已有账号"
	confirm-color="#25B4B5"
	@cancel="cancel" 
	@confirm="confirm">
		<!-- <view class="u-update-content">
			<rich-text :nodes="content"></rich-text>
		</view> -->
		<view class="slot-vip_modal">
			<text class="warn_txt">您目前的会员权益仅能在本设备下使用，会员权益迁入康复学院账号后可跨设备使用</text>
			<u-icon class="close_modal" name="close" color="#AEB0B8" size="28" @click="closeModal"></u-icon>
		</view>
	</u-modal>
</template>

<script>
	export default {
		data() {
			return {
				show: true,
				content: `
					1. 修复badge组件的size参数无效问题<br>
					2. 新增Modal模态框组件<br>
					3. 新增压窗屏组件，可以在APP上以弹窗的形式遮盖导航栏和底部tabbar<br>
					4. 修复键盘组件在微信小程序上遮罩无效的问题
				`,
			}
		},
		onShow() {
			this.show = true;
		},
		methods: {
			cancel() {
				this.closeModal();
			},
			confirm() {
				this.closeModal();
			},
			closeModal() {
				uni.navigateBack();
			}
		}
	}
</script>

<style scoped lang="scss">
	.vip_modal{
		.slot-vip_modal{
			padding: 40rpx;
			position: relative;
		}
		.close_modal{
			position: absolute;
			top: -54rpx;
			right: 28rpx;
		}
		.warn_title{
			color: #333333;
			font-size: 34rpx;
			margin-bottom: 36rpx;
		}
		.warn_txt{
			color: #666666;
			font-size: 26rpx;
			line-height: 40rpx;
		}
	}
</style>
