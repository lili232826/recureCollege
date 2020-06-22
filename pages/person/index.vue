<template>
	<view class="me_wrap">
		<view class="me_top" style="background-image: url(../../static/image/me/bg_top@2x.png);">
			<image src="../../static/image/me/bg_top@2x.png" mode="" class="me_bg"></image>
			<u-navbar :is-back="false" :border-bottom="false" :background="{ background: 'transparent' }">
				<view class="nav-slot-wrap">
					<view class="me_nav">
						<image src="../../static/image/me/icon_shezhi@2x.png" mode="" class="user_set" @click="linktoSet"></image>
						<view class="user_msg_box">
							<image src="../../static/image/me/icon_xiaoxi@2x.png" mode="" class="user_msg" @click="linktoNews"></image>
							<u-badge type="error" :is-dot="true" :offset='[0,0]' v-if="newNum>0"></u-badge>
						</view>
					</view>
				</view>
			</u-navbar>
			
			<view class="header_wrap">
				<view class="header_block">
					<image v-if="userObj.img" class="user_pic" :src="`${$filePath}?fileName=${userObj.img}`" mode="" @click="chooseAvatar"></image>
					<image v-if="!userObj.img" src="../../static/image/me/header_pic.png" mode="" class="user_pic" @click="chooseAvatar"></image>
					<image src="../../static/image/me/icon_vip.png" mode="" class="vip_pic" v-if="userObj.vip==1"></image>
					<image src="../../static/image/me/icon_huiyuan_huise.png" mode="" class="vip_pic" v-if="userObj.vip==2"></image>
				</view>
				<text class="name">{{userObj.account||"游客"}}</text>
			</view>
		</view>
		<view class="me_content">
			<view class="vip_content" v-if="userObj.vip==1||userObj.vip==2">
				<view class="vip_cont">
					 <!-- <image class="vip_bg" src="../../static/image/me/bg_huiyuan@2x.png" mode=""></image> -->
					<view class="vip_right"><text class="tit">当前设备已开通VIP会员</text><text class="tip">将权益迁移到账号可在各设备上享受会员服务</text></view>
					<view class="vip_btn" @click="clickModal">立即迁移</view>
				</view>
			</view>
			<view class="me_block" v-for="(item,index) in listArr" :key="index" v-if="!(index==0&&userObj.level==2)">
				<view class="me_line" v-for="(list,ind) in item" :key="ind" @click="linktoPage(list)">
					<image class="icon" :src="list.src" mode=""></image>
					<view class="me_right">
						<view class="title">{{list.name}}
							<text class="vip_time" v-if="list.name=='VIP会员'&&userObj.vip==1&&userObj.vip!=2">{{userObj.vipEndTime&&userObj.vipEndTime.split(/\s/)[0]}}到期</text>
						</view>
						<u-icon class="arrow-right" name="arrow-right" color="#AEB0B8" ></u-icon>
					</view>
				</view>
			</view>
		</view>
		<u-modal v-model="showModal" class="vip_modal" 
			title="权益迁移" 
			:content-slot="true"
			:title-style="{fontWeight:'bold'}"
			:show-cancel-button="true"
			confirm-text="转移到新账号"
			cancel-text="转移到已有账号"
			confirm-color="#25B4B5"
			>
			<view class="slot-vip_modal">
				<text class="warn_txt">您目前的会员权益仅能在本设备下使用，会员权益迁入康复学院账号后可跨设备使用</text>
				<u-icon class="close_modal" name="close" color="#AEB0B8" size="28" @click="closeModal"></u-icon>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				showModal:false,
				userObj:{},
				newNum:0,
				avatar:'_doc/uniapp_temp_1590463421927/canvas/1590463449753.jpg',
				backgroundImg:'../../static/image/me/bg_top@2x.png',
				listArr: [
					[{
						name: "VIP会员",
						path: "/pages/person/vip",
						src: '../../static/image/me/icon_huiyuan@2x.png',
					  }, {
						name: "我的订单",
						path: "/pages/order/index",
						src:'../../static/image/me/icon_mrtx@2x.png',
					  }
					], [{
						name: "我的书房",
						//name:"换绑手机",
						path: "/pages/person/bookshelf",
						src:'../../static/image/me/icon_shufang@2x.png',
					  },
					  {
						name: "我的收藏",
						path: "/pages/person/collection",
						src: '../../static/image/me/icon_shoucang@2x.png',
					  }
					],[{
						name: "模拟练习",
						path: "/practice",
						src: '../../static/image/me/icon_lianxi@2x.png',
						hasLogin:this.$store.state.hasLogin
					  }
					]
				]
			}
		},
		created() {
			// 监听从裁剪页发布的事件，获得裁剪结果
			uni.$on('uAvatarCropper', path => {
				// 可以在此上传到服务端
				uni.uploadFile({
					url: this.$fileUpload,
					filePath: path,
					name: 'file',
					success: (res) => {
						let userPic=res.data;
						this.$u.post('member/fg/personal-center/update/member/img?img='+res.data,{
							
						}).then(res => {	
							if(res.code==0){
								this.changeAvatar(userPic);
							}
						}).catch(res=>{
							this.$u.toast(`修改失败，稍后重试`);
						})
					}
				});
			})
		},
		onLoad() {
		},
		onReady(){
		},
		onShow(){
			this.userObj=this.$store.state.user;
			this.getPerson();
			this.getNewnum();
			// console.log('00')
		},
		methods: {
			...mapMutations(['changeAvatar']),
			getPerson(){
				if(this.$store.state.hasLogin){
					this.$u.get('/member/fg/personal-center/get/member',{
					}).then(res => {	
						if(res.code==0){
							this.userObj=res.data;
							// this.userObj.vip=2
							// this.vipList=res.data;
						}	
					})
				}
				
			},
			getNewnum(){
				this.newNum=0;
				if(this.$store.state.hasLogin){
					this.$u.get('/member/fg/pm/count',{
					}).then(res => {	
						if(res.data){
							this.newNum=res.data;
						}	
					})
				}
			},
			chooseAvatar() {
				if(this.$store.state.hasLogin){
					// 此为uView的跳转方法，详见"文档-JS"部分，也可以用uni的uni.navigateTo
					this.$u.route({
						// 关于此路径，请见下方"注意事项"
						url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
						// 内部已设置以下默认参数值，可不传这些参数
						params: {
							// 输出图片宽度，高等于宽，单位px
							destWidth: 300,
							// 裁剪框宽度，高等于宽，单位px
							rectWidth: 200,
							// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
							fileType: 'jpg',
						}
					})
				}else{
					uni.navigateTo({
					     url: "/pages/login/index"
					});
				}
			},
			clickModal(){
				// #ifdef APP-PLUS
					this.$u.route("/pages/person/updateVersions");
				// #endif
				// this.showModal=true;
				// #ifdef H5
				    this.showModal=true;
				// #endif
			},
			linktoPage(list){
				let path=list.path;
				if(path=='/practice'||path=='/pages/person/bookshelf'){
					this.$u.toast(`敬请期待`);
				}else if(path=="/pages/person/vip"){
					uni.navigateTo({
						url: path
					});
				}else{
					if(this.$store.state.hasLogin){
						uni.navigateTo({
							url: path
						});
					}else{
						uni.navigateTo({
							url: "/pages/login/index"
						});
					}
				}	
			},
			linktoNews(){
				if(this.$store.state.hasLogin){
					uni.navigateTo({
						url: "/pages/news/index"
					});	
				}else{
					uni.navigateTo({
					     url: "/pages/login/index"
					});
				}
			},
			linktoSet(){
				console.log('88')
				uni.navigateTo({
					url: "/pages/setsystem/index"
				});
			},
			closeModal(){
				this.showModal=false;
			}
		}
	}
</script>

<style scoped lang="scss">

.me_wrap{
	width: 100%;
	height: calc(100vh);
	background-color:#f8f8f8 ;
	.me_top{
		width: 100%;
		height: 400rpx;
		position: relative;
		margin-bottom: 26rpx;
		background-repeat: no-repeat;
		background-size: 100%;
		.me_bg{
			position: absolute;
			top:0;
			left: 0;
			width: 100%;
			height: 400rpx;
		}
	}
	.me_nav{
		display: flex;
		align-items: center;
		flex-direction: row-reverse;
		padding-right: 26rpx;
	}
	.header_wrap{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.name{
			color: #FFFFFF;
			font-size: 36rpx;
			font-weight: bold;
			z-index: 999;
			padding-top: 26rpx;
		}
	}
	.header_block{
		position: relative;
		width: 116rpx;
		height: 116rpx;
	}
	.user_pic{
		width: 116rpx;
		height: 116rpx;
		border-radius: 50%;
		border:6rpx solid #fff;
		
	}
	.vip_pic{
		width: 36rpx;
		height: 36rpx;
		position: absolute;
		bottom: -8rpx;
		right: -10rpx;
	}
	.user_msg_box{
		width: 44rpx;
		height: 44rpx;
		margin-right: 40rpx;
		position: relative;
	}
	.user_msg{
		width: 44rpx;
		height: 44rpx;
	}
	.user_set{
		width: 44rpx;
		height: 44rpx;
	}
}	
.me_content{
	padding: 0 30rpx;
	.me_block{
		background-color:#fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}
	.me_line{
		display: flex;
		align-items: center;
		height: 108rpx;
		padding-left: 28rpx;
		.me_right{
			flex:1;
			height: 107rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 18rpx;
			border-bottom:1rpx solid #EBEBEB
		}
		&:last-child{
			.me_right{
				border-bottom: 0;
			}
		}
		.icon{
			width: 44rpx;
			height: 44rpx;
		}
		.title{
			color:#333333;
			font-size: 30rpx;
			padding-left: 26rpx;
			flex:1
		}
		.vip_time{
			float: right;
			color: #999999;
			font-size: 24rpx;
			margin-right: 14rpx;
		}
		
	}
	.vip_content{
		position: relative;
		// padding: 0 30rpx;
		.vip_bg{
			width: 692rpx;
			// height: 138rpx;
			position: absolute;
			top: 0;
			right: 0;
		}
		.vip_cont{
			z-index: 999;
			min-height: 138rpx;
			border-radius: 20rpx;
			background-color:rgb(255,222,162);
			padding: 32rpx;
			display: flex;
			justify-content: space-between;
			margin-top: -60rpx;
			margin-bottom: 20rpx;
			.vip_right{
				display: flex;
				flex-direction: column;
			}
			.tit{
				z-index: 999;
				color: #FF5400;
				font-size: 28rpx;
				font-weight: bold;
				margin-bottom: 16rpx;
			}
			.tip{
				z-index: 999;
				color: #C89229;
				font-size: 22rpx;
			}
			.vip_btn{
				width: 120rpx;
				height: 50rpx;
				text-align: center;
				line-height: 50rpx;
				background-color: #0F1330;
				color: #FFDB92;
				font-size: 20rpx;
				border-radius: 10rpx;
			}
		}
		
	}
}
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
