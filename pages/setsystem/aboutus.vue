<template>
	<view class="aboutus_wrap">
		<kfNav title="关于我们" />
		<view class="aboutus_content">
			<view class="flex-vertical">
				<image class="logo_pic" src="../../static/image/defaultpic/course_pic.png" mode=""></image>
				<text class="procedure_name">华夏康复学院</text>
				<text class="procedure_version">{{version}}</text>
			</view>
			<view class="about_describe">
				华夏出版社是一家综合性出版机构，以专业出版为特色，兼顾
				大众出版与教育出版，在经济、管理、西方哲学、传播学、
				社会学、人类学、医学等专业出版门类形成主题系列，规模优势与品牌优势，
				在图书市场占据较大的份额，在读
				者中享有良好的信誉和阅读忠诚度
				。曾系统推出“中国古典小说名著百
				部”、“中国现代文学百家”，成为文学经典阅读的基本文献。
			</view>
			<view class="flex-vertical">
				<view class="update_btn" @click="updateClick">版本更新</view>
				<view class="new_version">有新版本{{updateData.versionNumber}}</view>
			</view>
			<view class="copyright">Copyright © 2005 - 2016 </view>
		</view>
		<u-modal v-model="showUpate" :content-slot="true" :show-confirm-button="false" :show-cancel-button="false" :show-title="false" class="us_update_wrap">
			<view class="slot-content">
				<view class="update_warp">
					<view class="update_content" @tap.stop>
						<view v-if="updateData" class="update_bg" style="background-image: url(../../static/image/me/update_bg_top.png);">
							<view class="tit">发现新版本</view>
							<view class="verson_tit" >{{updateData.versionNumber}}</view>
						</view>
						
						<view class="update_bottom">
							<view class="explain_wrap">
								<view class="title">更新说明</view>
								<view class="update_detail">
									<!-- <view class="list">
							            1、更新APP图标
							        </view> -->
									<view class="list" v-if="updateData" v-html="updateData.description">
										
									</view>
								</view>
							</view>
							<view class="btn_wrap flex-center">
								<view class="btn" @click="showUpate=false">暂不升级</view>
								<view class="split_line"></view>
								<view class="btn update_now" @click="linkUpdate">立即升级</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</u-modal>
<!-- 		<u-mask :show="showUpate" @click="showUpate=false">
			
		</u-mask> -->
	</view>
</template>

<script>
	import kfNav from '@/components/kf-nav/kf-nav.vue';
	export default {
		components: { kfNav },
		data() {
			return {
				showUpate:false,
				platform:'',
				version:'',
				updateData:{}
			}
		},
		onLoad() {
			this.getSystemInfo();
		},
		methods: {
			updateClick(){
				this.showUpate=true;
				
			},
			getSystemInfo(){
				// #ifdef APP-PLUS
				this.version="V "+plus.runtime.version;
				uni.getSystemInfo({
				    success:(res)=> {
						this.platform=res.platform;
						if(this.platform=="android"){
							this.$u.get('/file/app/get/new/version?type=2',{
							}).then(res => {
								if(res.code==0){
									this.updateData=res.data;
								}
							})
						}else if(this.platform=="ios"){
							this.$u.get('/file/app/get/new/version?type=1',{
							}).then(res => {
								if(res.code==0){
									this.updateData=res.data
								}
							})
						}
				    }
				});
				// #endif
			},
			linkUpdate(){	
				if(this.updateData.filePath){
					plus.runtime.openURL(`${this.$websiteUrl}/file/${this.updateData.filePath}`); 
				}
			}
		}
	}
</script>

<style scoped lang="scss">
.aboutus_wrap{
	width: 100%;
	height: calc(100vh - var(--window-top));
	background-color: #FFFFFF;
	.logo_pic{
		width:120rpx;
		height:120rpx;
		border-radius:20rpx;
		margin-bottom: 24rpx;
		margin-top: 100rpx;
	}
	.procedure_name{
		font-size:32rpx;
		font-weight:500;
		color:#333333;
		margin-bottom: 10rpx;
	}
		
	.procedure_version{
		font-size:24rpx;
		font-weight:500;
		color:#BDC1CB;
	}
	.about_describe{
		padding: 60rpx;
		font-size:28rpx;
		font-weight:500;
		color:#878B94;
		line-height:46rpx;
	}
	.update_btn{
		width:178rpx;
		height:60rpx;
		border:2rpx solid #EFEFEF;
		border-radius:30rpx;
		line-height: 60rpx;
		text-align: center;
		font-size:28rpx;
		font-weight:500;
		color: #333333;
		margin-bottom: 24rpx;
	}
	.new_version{
		font-size:24rpx;
		font-weight:500;
		color:#FE1F22;
	}
	.copyright{
		font-size:22rpx;
		font-weight:400;
		color:#999999;
		text-align: center;
		position: fixed;
		width: 100%;
		bottom:40rpx;
		left: 0;
	}
}
.update_warp{
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	.update_content{
		width: 520rpx;
		border-radius: 0px  0px   20rpx  20rpx;
		overflow: hidden;
		.update_bottom{
			background-color: #FFFFFF;
		}
		.update_bg{
			width: 520rpx;
			height: 260rpx;
			background-repeat: no-repeat;
			background-size: 100%;
			padding: 80rpx 50rpx 0rpx;
			color: #fff;
		}
		.tit{
			font-size: 36rpx;
			margin-bottom: 20rpx;
		}
		.verson_tit{
			font-size: 24rpx;
		}
		.explain_wrap{
			padding:10rpx 50rpx 50rpx;
			.list{
				line-height: 40rpx;
			}
		}
		.title{
			font-size:34rpx;
			font-weight:bold;
			color:#333;
			margin-bottom: 40rpx;
			text-align: center;
		}
		.update_detail{
			font-size:28rpx;
			font-weight:500;
			color:#999999;
		}
		.btn_wrap{
			border-top: 1rpx solid #E8ECF4;
		}
		.split_line{
			width: 1rpx;
			height: 88rpx;
			background-color: #E8ECF4;
		}
		.btn{
			flex:1;
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			font-size:30rpx;
			color: #999;
		}
		.update_now{
			color: #25B4B5;
		}
	}
}
</style>
