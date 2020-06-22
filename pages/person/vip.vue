<template>
	<view class="vip_wrap">
		<u-navbar :is-back="false" :border-bottom="false" :background="{ background: '#2D2A2D' }">
			<view class="kf-nav-wrap">
				<view class="inner_wrap">
					<view class="index_nav">
						<!-- <u-icon name="arrow-left" color="#FFF" @click="goBack" class="arrow-left" size="34"></u-icon> -->
						<image class="nav_back_icon arrow-left" src="../../static/image/icon/icon_fanhui_white.png" alt=""  @click="goBack">
						<text class="title">我的VIP会员</text>
					</view>
				</view>
			</view>
		</u-navbar>
		<view class="vip_user flex-between" style="background-image: url(../../static/image/me/vip_bg_top.png);">
			<view class="user_msg flex-centerH">
				<image v-if="userObj.img" class="vip_header_pic" :src="`${$filePath}?fileName=${userObj.img}`" mode=""></image>
				<image v-if="!userObj.img" class="vip_header_pic" src="../../static/image/me/header_pic.png" mode=""></image>
				<view class="user_msg_wrap">
					<view class="vip_name">{{userObj.account||"游客"}}
						<image  v-if="userObj.vip==1" class="vip_icon" src="../../static/image/me/icon_huiyuann@2x.png" mode=""></image>
						<image  v-if="userObj.vip==2" class="vip_icon" src="../../static/image/me/icon_huiyuann_huise@2x.png" mode=""></image>
					</view>
					<view class="vip_time" v-if="userObj.vip==1">{{userObj.vipEndTime&&userObj.vipEndTime.split(/\s/)[0]}}到期</view>
					<view class="vip_time" v-if="userObj.vip==2">会员于{{userObj.vipEndTime&&userObj.vipEndTime.split(/\s/)[0]}}已过期</view>
					<view class="vip_time" v-if="!$store.state.hasLogin">登录享跨平台服务</view>
					<view class="vipouter_tip" v-if="userObj.vip==2">为获得更好阅读体验，建议您尽快续费哟~</view>
				</view>
				
			</view>
			<view>
				<view class="btn_login" v-if="!$store.state.hasLogin" @click="linkToLogin">立即登录</view>
			</view>
		</view>
		<view class="vip_content">
			<view class="vip_title">续费延长VIP有效期</view>
			<view class="scroll_wrap">
				<scroll-view class="scroll_view_vip" scroll-x="true" >
					<view class="money_block_wrap"  v-for="(list,index) in vipList" :key="index" >
						<view class="money_block" v-if="index==0" :class="activeIndex==index ? 'active' : ''" @click="chooseVip(list,index)">
							<view class="open_time">{{list.name}}</view>
							<view  class="price_wrap">
								<view class="price">￥<text class="price_num">{{list.sellprice}}</text></view>
								<view class="old_price">￥{{list.price}}</view>
							</view>
							<view class="save_money">立省{{list.price*1-list.sellprice}}元</view>
							<image class="first_choose_icon" src="../../static/image/me/icon_tuijian@2x.png" mode=""></image>
						</view>
						<view class="money_block" v-else :class="activeIndex==index ? 'active' : ''" @click="chooseVip(list,index)">
							<view class="open_time">{{list.name}}</view>
							<!-- <view class="old_price">￥{{list.price1}}</view> -->
							<view class="price_wrap">
								<view class="price">￥<text class="price_num">{{list.sellprice}}</text></view>
							</view>
							<!-- <view class="save_money">立省{{list.price3}}元</view> -->
							<!-- <image class="first_choose_icon" src="../../static/image/me/icon_tuijian@2x.png" mode=""></image> -->
						</view>
					</view>
				</scroll-view>
			</view>
			<view>
				<view class="open_btn" v-if="userObj.vip==2||userObj.vip==1" @click="vipClick">立即续费</view>
				<view class="open_btn" v-else @click="vipClick">立即开通</view>
			</view>
		</view>
		<view class="vip_agreement">
			<view class="vip_title">会员服务</view>
			<view class="agreement_content" v-html="vipObj.value">
				
				<!-- <view>1.平台会员分为普通会员和VIP会员；</view>
				<view>2.会员可以免费学习平台所有课程、图书、文献资源；</view>
				<view>3.会员可以观看所有带VIP标识的课程，普通会员不能观看VIP会员课程；</view>
				<view>4.由于平台内所有资源为虚拟内容，购买以后不能进行退款；</view>
				<view>5.所有资源支持反复观看、阅读；</view> -->
			</view>
		</view>
		<view class="vip_help">
			<view class="vip_title">帮助服务</view>
			<view class="help_content">    
				<view class="top_text">您可以通过查看<text class="help_xy" @click="vipShow=true">会员服务协议</text>了解详细内容哦~</view>
				<view class="text"> {{helpObj.value}}</view>
			</view>
		</view>
		<!-- 会员协议 -->
		<u-popup v-model="vipShow" mode="center" border-radius="14">
			<view class="vip_popup_wrap">		
				<scroll-view scroll-y="true" style="width: 100%;height: 100%;">
					<view class="inner_content" v-html="agreementObj.value"></view>
				</scroll-view>	
			</view>
		</u-popup>
		<!-- 支付弹框 -->
		<u-popup v-model="payShow" mode="center" border-radius="24" :closeable="true" @close="closepayPopup">
			<view class="vippayPopup_wrap">		
				<view class="pay_title">支付方式</view>
				<view class="pay_list flex-center" v-for="(item,index) in radioItems" :key="index" @click="payNow(item.value)">
					<image class="pay_outer_icon" :src="item.icon" mode=""></image>
					<text class='pay_name'>{{item.name}}</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex:0,
				userObj:{
					account:"游客"
				},
				agreementObj:{},
				helpObj:{},
				vipObj:{},
				vipList:[],
				vipShow:false,
				payShow:false,
				radioItems:[{
					name: '微信支付',
					value: "1",
					checked: 'true',
					icon:'../../static/image/me/weipay_icon.png'
				},
				{
					name: '支付宝支付',
					value: "0",
					icon:'../../static/image/me/baopay_icon.png'
					
				}],
				payType:'1',
				payParmes:{
					id:'',
					sellPrice :''
				}
			}
		},
		onLoad() {
			this.getVipList();
			this.getAgreement();
			this.getVipAgreement();
			this.getHelpAgreement();
		},
		onShow(){
			this.userObj=this.$store.state.user;
			this.getPerson();
			// console.log(this.$store.state.user,'this.$store.state.user',uni.getStorageSync("user"))
		},
		methods: {
			getPerson(){
				if(this.$store.state.hasLogin){
					this.$u.get('/member/fg/personal-center/get/member',{
					}).then(res => {	
						if(res.data){
							this.userObj=res.data;
							// this.userObj.vip=2
							// this.vipList=res.data;
						}	
					})
				}
			},
			getVipList(){
				this.$u.get('/member/fg/vip/page?',{
				}).then(res => {	
					if(res.data){
						this.vipList=res.data;
					}	
				})
			},
			closepayPopup(){
				uni.hideLoading();
			},
			payNow(type){
				this.payType=type;
				uni.showLoading({
				    title: '加载中'
				});
				this.$u.post('/order/fg/order/create-vip-order',{
					"id": this.payParmes.id,
					"payType": this.payType,
					"sellPrice": this.payParmes.sellPrice,
					"source": "2"
				}).then(res => {
					if(res.data.url){
						uni.hideLoading();
						let orderInfo=res.data.url;
						if(this.payType=='0'){
							uni.requestPayment({
							    provider:'alipay',
							    orderInfo: orderInfo, //支付宝订单数据
							    success: (res)=> {
							       this.$u.toast("支付成功");
								   this.payShow=false;
								   this.getDetail();
							    },
							    fail: (err)=> {
									this.$u.toast("支付失败，请稍后重试");
							    }
							})
						}else if(this.payType=='1'){
							let orderInfo2=orderInfo.split('&');
							let wxObj = {
							    appid: 'wx09e8e76176a7b2fd',  
							    noncestr: orderInfo2[1].split('=')[1],  
							    package: 'Sign=WXPay', // 固定值，以微信支付文档为主  
							    partnerid:orderInfo2[3].split('=')[1],  
							    prepayid: orderInfo2[4].split('=')[1],  
							    timestamp: orderInfo2[5].split('=')[1],  
							    sign: orderInfo2[7].split('=')[1] // 根据签名算法生成签名  
							};  
							uni.requestPayment({
							    provider: 'wxpay',
							    orderInfo: JSON.stringify(wxObj), //微信订单数据
							    success: (res)=> {
							       this.$u.toast("支付成功");
								   uni.redirectTo.redirectTo({
										url: "/pages/course/index"
								   })
							    },
							    fail: (err)=> {
									this.$u.toast("支付失败，请稍后重试");
							    }
							})
						} 
					}
				}).catch(res=>{
					uni.hideLoading();
					this.$u.toast('支付唤起失败，请稍后重试')	
				})
				
			},
			getAgreement(){
				this.$u.get('/sysuser/fg/dictionary/dictionary',{
					cnkey:"会员服务协议"
				}).then(res => {	
					if(res.data){
						this.agreementObj=res.data;
					}	
				})
			},
			getVipAgreement(){
				this.$u.get('/sysuser/fg/dictionary/dictionary',{
					cnkey:"会员服务"
				}).then(res => {	
					if(res.data){
						this.vipObj=res.data;
					}	
				})
			},
			getHelpAgreement(){
				this.$u.get('/sysuser/fg/dictionary/dictionary',{
					cnkey:"帮助服务"
				}).then(res => {	
					if(res.data){
						this.helpObj=res.data;
						// console.log(res.data,'888888')
					}	
				})
			},
			vipClick(){
				if(this.$store.state.hasLogin){
					this.payShow=true;
				}else{
					uni.navigateTo({
					     url: "/pages/login/index"
					});
				}
			},
			chooseVip(list,index){
				this.activeIndex=index;
				this.payParmes.id=list.id;
				this.payParmes.sellPrice =list.sellprice
			},
			linktoNews(){
				uni.navigateTo({
					url: "/pages/news/index"
				});
			},
			linkToLogin(){
				uni.navigateTo({
					url: "/pages/login/index"
				});
			},
			goBack(){
				uni.navigateBack() 
			}
		}
	}
</script>

<style scoped lang="scss">
page{
	width: 100%;
	height: 100%;
}
.vip_wrap{
	width: 100%;
	height: 100%;
	
	.kf-nav-wrap{
		width: 100%;
		height:88rpx ;
		.inner_wrap{
			position: fixed;
			width: 100%;
			background-color: #2D2A2D;
			z-index: 991;
		}
		.index_nav{
			display: flex;
			height: 88rpx;
			line-height: 88rpx;
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
				// font-weight: bold;
				color: #FFF;
			}
		}
	}
	.user_msg_wrap{
		display: flex;
		flex-direction: column;
	}
	.vip_user{
		padding: 0 32rpx;
		background-color: #2D2A2D;
		height: 312rpx;
		background-repeat: no-repeat;
		background-size: 100%;
		.btn_login{
			width: 120rpx;
			height: 50rpx;
			line-height: 50rpx;
			text-align: center;
			color: #fff;
			font-size: 20rpx;
			border-radius: 10rpx;
			background: linear-gradient(to right, #ECB385, #BB865C); 
		}
		.vip_name{
			color: #FFFFFF;
			font-size: 38rpx;
			margin-bottom: 20rpx;
		}
			
		.vip_header_pic{
			width: 102rpx;
			height: 102rpx;
			border-radius: 50%;
			margin-right: 30rpx;
			
		}
		.vip_time{
			color:#D8D2D5;
			font-size: 22rpx;
		}
		.vipouter_tip{
			color:#D8D2D5;
			font-size: 22rpx;
			padding-top: 10rpx;
		}
		.vip_icon{
			width: 31rpx;
			height: 26rpx;
			margin-left: 10rpx;
		}
	}
	.vip_content{
		padding: 48rpx 0rpx 48rpx 32rpx;
		border-radius: 20rpx 20rpx 0 0;
		margin-top: -20rpx;
		background-color: #fff;
		z-index: 999;
		.scroll_wrap{
			margin-bottom: 58rpx;
		}
	}
	.vip_title{
		color: #333333;
		font-size: 32rpx;
		margin-bottom: 36rpx;
		font-weight: bold;
		
		
	}
	.scroll_view_vip{
		white-space: nowrap; // 滚动必须加的属性
	}
	.money_block_wrap{
		display: inline-block;
	}
	.first_choose_icon{
		width: 60rpx;
		height: 32rpx;
		position: absolute;
		top:0;
		left:0
	}
	.money_block{
		width: 200rpx;
		height: 242rpx;
		position: relative;
		border: 2rpx solid #E9E9E9;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-right: 14rpx;
		&.active{
			border-color: #F78139;
			background-color: #FFFAF0;
			box-shadow:0px 3px 10px 0px rgba(0, 0, 0, 0.1);
		}
		.open_time{
			color: #333;
			font-size: 30rpx;
			margin-bottom: 18rpx;
			padding-top: 36rpx;
			font-weight: bold;
		}
		.price_wrap{
			height: 80rpx;
			display: flex;
			flex-direction: column-reverse;
			align-items: center;
			justify-content: space-between;
		}
		.old_price{
			color: #999999;
			font-size: 18rpx;
			text-decoration: line-through;
		}
		.price{
			color: #EB5D29;
			font-size: 24rpx;
			margin-bottom: 12rpx;
		}
		.price_num{
			font-size: 42rpx;
			line-height: 30rpx;
			font-weight: bold;
			
		}
		.save_money{
			width: 176rpx;
			height: 46rpx;
			color: #fff;
			background-color: #FFA771;
			border-radius: 12rpx;
			text-align: center;
			line-height: 46rpx;
			font-size: 22rpx;
		}
	}
	.open_btn{
		width:690rpx;
		height:87rpx;
		line-height: 87rpx;
		text-align: center;
		color: #fff;
		font-size: 32rpx;
		border-radius:44rpx;
		background: linear-gradient(to right, #ECB485, #BA855B); 
	}
	.vip_agreement{
		padding: 0 32rpx;
		margin-bottom: 60rpx;
		.agreement_content{
			padding: 30rpx;
			background-color: #FFFAF0;
			color: #D07327;
			font-size: 26rpx;
			line-height: 52rpx;
		}
	}
	.vip_help{
		padding: 0 32rpx 50rpx 32rpx;
		.help_content{
			width: 582rpx;
			font-size: 28rpx;
			color: #333;
			line-height: 42rpx;
		}
		.help_xy{
			color: #EB5D29;
		}
		.top_text{
			margin-bottom: 30rpx;
		}
		.text{
			color:#888888
		}
	}
}
.vip_popup_wrap{
	width: 680rpx;
	height: 1000rpx;
	.inner_content{
		padding: 30rpx;
		font-size:28rpx;
		font-weight:500;
		color:#333333;
	}
}
.vippayPopup_wrap{
	width: 600rpx;
	padding:40rpx 30rpx;
	// height: 150rpx;
	.pay_title{
		font-size:36rpx;
		font-weight:bold;
		height: 80rpx;
		line-height: 80rpx;
		color:#121212;
		margin-bottom: 20rpx;
		padding-left: 60rpx;
		padding-right: 60rpx;
		text-align: center;
	}
	.pay_outer_icon{
		width: 50rpx;
		height: 50rpx;
		margin-right: 20rpx;
		// margin-bottom: 10rpx;
	}
	.pay_list{
		height: 100rpx;
		border-top: 1rpx solid #eee;
	}
	.right_list{
		padding-left: 20rpx;
	}
}
</style>
