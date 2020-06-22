<template>
	<u-navbar :is-back="false" :background="{ background: bgColor }">
		<view class="kf-nav-wrap">
			<view class="inner_wrap">
				<view class="index_nav">
					<!-- <u-icon name="arrow-left" color="#666666"  class="arrow-left" size="34"></u-icon> -->
					<image class="nav_back_icon arrow-left" src="../../static/image/icon/icon_fanhui.png" alt=""  @click="goBack">
					<text class="title">{{title}}</text>
				</view>
			</view>
		</view>	
	</u-navbar>
</template>

<script>
	export default {
		props:{
			title:{
				type: String,
				default: ''
			},
			bgColor:{
				type: String,
				default: '#F8F8F8'
			}
			
		},
		data() {
			return {
				
			};
		},
			
		methods:{
				
			goBack(){
				
				uni.navigateBack() 
			}
		}
	}
</script>

<style lang="scss" scoped>
.kf-nav-wrap{
	width: 100%;
	.inner_wrap{
		width: 100%;
		// background-color: #F8F8F8;
		z-index: 991;
	}
	.index_nav{
		display: flex;
		align-items: center;
		padding: 0 24rpx;
		.search_icon,.menu_icon{
			width: 44rpx;
			height: 44rpx;
		}
		.arrow-left{
			position: absolute;
			left: 24rpx;
		}
		.title{
			flex: 1;
			font-size: 36rpx;
			text-align: center;
			font-weight: bold;
			color: #333333;
		}
	}
}
	
</style>
