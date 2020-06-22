<template>
<view class="outer_wrap">
	<view class="course_wrap">
		<!-- 头部 -->
		<u-navbar :is-back="false" :border-bottom="false" :background="{ background: '#F8F8F8' }">
			<view class="course-nav-wrap">
				<view class="index_nav">
					<view class="nav-left">
						<image class="nav_back_icon arrow-left" src="../../static/image/icon/icon_fanhui.png" alt=""  @click="goBack">
						<!-- <u-icon name="arrow-left" color="#666666" @click="goBack" size="34"></u-icon> -->
					</view>
					<view class="title"><view class="name_txt  u-line-1">{{courseObj.name}}</view></view>
					<view class="nav_right">
						<!-- <image class="kf_collect_icon" src="../../static/image/icon/icon_schang@2x.png" mode="" v-if="courseObj.isCollection==0" @click="collectClick"></image>
						<image class="kf_collect_icon" src="../../static/image/icon/icon_shoucang_nor@2x.png" mode="" v-if="courseObj.isCollection==1" @click="collectClick"></image>
						<image class="kf_share_icon" src="../../static/image/icon/icon_share@2x.png" mode="" @click="shareClick"></image> -->
					</view>
				</view>
			</view>
		</u-navbar>
		<view class="course_content">
			<view class="course_cover_bg">
				<image v-if="courseObj.img" class="course_cover" :src="`${$filePath}?fileName=${courseObj.img}`" mode=""></image>
				<image v-else class="course_cover" src="../../static/image/defaultpic/course_video.png" mode=""></image>
				<image class="video_play_icon" src="../../static/image/icon/icon_shipin_play.png" mode="" @click="linkToLiveOuter"></image>
			</view>
			<view class="content_wrap">
				<view class="title u-line-2">{{courseObj.name}}</view>
				<view class="cont_bottom">
					<view class="price_left">
						<view class="free_price" v-if="courseObj.realPrice==0">免费</view>
						<view class="price" v-if="courseObj.realPrice>0">￥<text class="big_price" >{{courseObj.realPrice.substring(0,courseObj.realPrice.indexOf("."))}}</text>.{{courseObj.realPrice.substring(courseObj.realPrice.length-2)}}</view>
						<view class="discount_price" v-if="courseObj.price">￥{{courseObj.price}}</view>
					</view>
					<view>
						<image class="kf_time_icon" src="../../static/image/icon/icon_time@2x.png" mode=""></image>
                        <text class="describe_txt" v-if="courseObj.formatUpdateTime"> 开始时间 : {{courseObj.formatUpdateTime}}</text>
					</view>
				</view>
			</view>
			<view class="line"></view>
			<view class="tab_wrap">
				<view class="tab_bar">
					<u-tabs 
					:list="tabList" 
					:is-scroll="false" 
					:current="current" 
					active-color="#25B4B5" 
					inactive-color="#333333" 
					font-size="32"
					bar-width="144"
					bar-height="4"
					@change="change"></u-tabs>
				</view>
				<!-- 内容简介 -->
				<view class="page_content" v-if="current==0">
					<view class="title">内容简介</view>
					<view class="text" v-html="courseObj.synopsis"></view>
					<view class="data_no_wrap flex-vertical" v-if="!courseObj.synopsis">
						<image class="kf_nodata_pic" src="../../static/image/defaultpic/no_chart.png" mode=""></image>
						<text class="no_text">暂无简介~</text>
					</view>	
				</view>
			</view>
		</view>
		<view class="fixed_bottom" v-if="courseObj.messageCode!=null">
			<view class="pay_btn flex-centerH" @click="payShow=true"><image class="kf_pay_icon" src="../../static/image/icon/zhifu-ico@2x.png" mode=""></image>立即支付</view>
			<view class="vip_btn flex-centerH" @click="linkToVip">VIP会员畅听</view>
		</view>
		<!-- 机构没有权限 -->
		<view class="fixed_bottom" v-if="courseObj.messageCode!=null&&this.$store.state.user.level==2" >
			<view class="free_trybtn_disable flex-centerH">进入直播</view>
		</view>
		<view class="fixed_bottom" v-if="courseObj.messageCode==null">
			<view class="free_trybtn flex-centerH" @click="linkToLiveOuter">进入直播</view>
		</view>
		<u-popup v-model="payShow" mode="bottom" :mask-close-able="false" :closeable="true">
			<view class="payPopup_wrap">
				<view class="pay_title">{{courseObj.name}}</view>
				<view class="pay_num">付款<text class="num">{{courseObj.realPrice}}</text></view>
				<view class="pay_popup_inner">
					<radio-group class="pay_radio" @change="radioChange">
						<view class="pay_list flex-center" v-for="(item,index) in radioItems" :key="index">
							<view>
								<radio :id="item.name" :value="item.value" :checked="item.checked"></radio>
							</view>
							<label class="label-2-text" :for="item.name">
								<view class="flex-center right_list">
									<image class="pay_outer_icon" :src="item.icon" mode=""></image>
									<text class='pay_name'>{{item.name}}</text>
								</view>
							</label>
						</view>
					</radio-group>
				</view>
				<view class="pay_btn">
					<button type="primary"  class="pay_btn" @click="payNow">去支付</button>
				</view>
			</view>
		</u-popup>
	</view>
</view>
</template>

<script>
	export default {	
		data() {
			return {
				payShow:false,
				current: 0,
				tabList: [
					{
						name: '简介'
					}
				],
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
				payType:"1",
				courseObj:{
					messageCode:''
				},
			}
		},
		onLoad(option) {
			this.oid=option.oid;
			this.getDetail();
		},
		onShow: function() {
			
		},
		onHide: function() {
		},
		methods: {
			getDetail(){
				this.$u.get('/live/fg/live/get/info?id='+this.oid,{
				}).then(res => {	
					if(res.data){
						this.courseObj=res.data||{};
						this.courseObj.synopsis=this.courseObj.synopsis.replace(/img/gi, function (match, capture) {
							return match+' style="max-width:100%;height:auto;"'
						})
					}	
				})
			},
			radioChange(e) {
				var checked = e.detail.value
				console.log(checked)
			},
			payNow(){
				console.log('success:999999999999');
				uni.getProvider({
				    service: 'payment',
				    success: function (res) {
				        console.log(res.provider)
						uni.requestPayment({
						    provider: res.provider[1],
						    orderInfo: 'orderInfo', //微信、支付宝订单数据
						    success: function (res) {
						        console.log('success:' + JSON.stringify(res));
						    },
						    fail: function (err) {
						        console.log('fail:' + JSON.stringify(err));
						    }
						});
				    }
				});
				uni.requestPayment({
				    provider: 'wxpay',
				    orderInfo: 'orderInfo', //微信、支付宝订单数据
				    success: function (res) {
				        console.log('success:' + JSON.stringify(res));
				    },
				    fail: function (err) {
				        console.log('fail:' + JSON.stringify(err));
				    }
				});
				

				// this.$u.post('/order/fg/order/create-order-and-pay',{
				// 	  "buyType":"1",
				// 	  "goodsList": [
				// 	    {
				// 	      "goodsId":this.courseObj.id ,
				// 	      "goodsType":this.courseObj.resourceType ,
				// 	      "num": 1,
				// 	      "salePrice":this.courseObj.realPrice
				// 	    }
				// 	  ],
				// 	  "payType": this.payType,
				// 	  "source": "1",
				// 	  "wechatPayType": "2"
				// }).then(res => {
				// 	if(res.code==0){
				// 		if(res.data.url){
				// 			// window.open(res.data.url)
				// 			plus.runtime.openURL(res.data.url);
				// 		}
				// 		console.log(res,'微信支付')	
				// 	}else{
				// 		console.log(res,'微信支付失败')
				// 	}
				// }).catch(res=>{
				// 	console.log(res,'微信支付失败2')
				// })
				
			},
			// tab栏切换
			change(index) {
				this.current = index;
			},
			goBack(){
				uni.navigateBack() 
			},
			linkToLiveOuter(){
				if(this.courseObj.messageCode==null){
					// 跳转到内部窗口并且传递链接
					let url=`https://live.vhall.com/webinar/inituser/`+this.courseObj.whId
					uni.navigateTo({
						url: `/pages/webview/webview?url=${url}`
					})
					// plus.runtime.openURL(url);
				}else{
					this.$u.toast('暂无权限观看');
				}
				
			},
			linkToVip(){
				uni.navigateTo({
				     url: "/pages/person/vip"
				});
			}
		}
	}
</script>

<style scoped lang="scss">
		
.outer_wrap{
	position: absolute;
	top:0;
	bottom: 0;
	left: 0;
	right: 0;
}
.course_wrap{
	padding-bottom: 102rpx;
	height: 100%;
	height: 100%;
	overflow-y: scroll;
	.kf_time_icon{
		width: 24rpx;
		height: 24rpx;
	}
}
.course-nav-wrap{	
	width: 100%;
	.index_nav{
		display: flex;
		align-items: center;
		padding: 0 24rpx;
	}
	.kf_collect_icon{
		margin-right: 34rpx;
	}
	.title{
		flex: 1;
		text-align: center;
		font-weight: bold;
		font-size: 36rpx;
		color: #333333;
		display: flex;
		justify-content: center;
		.name_txt{
			max-width:243rpx;
		}
	}
	.nav-left{
		width: 120rpx;
	}	
	.nav_right{
		width: 120rpx;
		display: flex;
		align-items: center;
	}
}
	
.course_cover_bg{
	position: relative;	
	.course_cover{
		width: 100%;
		height: 480rpx;
	}
	.video_play_icon{
		width: 96rpx;
		height: 96rpx;
		position: absolute;
		left: 50%;
		top:50%;
		margin-left: -48rpx;
		margin-top: -48rpx;
		z-index: 99;
	}
}

.content_wrap{
	padding: 32rpx;	
	.title{
		color: #121212;
		font-size: 36rpx;
		font-weight: bold;
		line-height: 56rpx;
		margin-bottom: 32rpx;
	}	
	.cont_bottom{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.price_left{
		display: flex;
		align-items: center;
	}	
	.price{
		color:#E40000;
		font-size: 32rpx;
		font-weight: bold;
		margin-right: 16rpx;
	}
	.free_price{
		color: #07B562;
		font-size: 36rpx;
		font-weight: bold;
		margin-right: 16rpx;
	}
	.big_price{
		font-size: 36rpx;
	}
	.discount_price{
		color: #999999;
		font-size: 28rpx;
		text-decoration: line-through;
	}
	.describe_txt{
		font-size: 22rpx;
		color: #9C9D9C;
		margin-left: 11rpx;
	}
}
.tab_wrap{	
	.tab_bar{
		padding: 0 53rpx;
		border-bottom:2rpx solid #E6EAF2;
	}
	.page_content{
		padding: 56rpx 30rpx 0rpx;
	}
	.title{
		color: #333333;
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 40rpx;
	}
		
	.text{
		color: #565656;
		font-size: 30rpx;
		line-height: 52rpx;
		margin-bottom: 95rpx;
		text-align: justify;
		text-justify: newspaper;
		word-break: break-all;
	}
		
	.course_sort_btn{
		width: 100rpx;
		height: 40rpx;
		border-radius: 6rpx;
		background-color: #F3F3F3;
		color: #666666;
		font-size: 24rpx;
		float: right;
		.course_sort_icon{
			width: 24rpx;
			height: 24rpx;
		}
	}
}
.fixed_bottom{
	height: 102rpx;
	position: absolute;
	bottom: 0;
	width: 100%;
	display: flex;
	border-top:2rpx solid #E1E1E1;
	font-size: 30rpx;
	background-color: #fff;
	.audition_btn{
		height: 102rpx;
		width: 250rpx;
		flex-shrink: 0;
		border-right:2rpx solid #E1E1E1;
		color: #333333;
		background-color: #fff;
	}
	.pay_btn{
		height: 102rpx;
		flex:1;
		color: #25B4B5;
	}
	.vip_btn{
		height: 102rpx;
		flex:1;
		color: #fff;
		background-color: #5AC5C6;
	}
	.free_trybtn{
		width: 100%;
		height: 102rpx;
		color: #FFFFFF;
		font-size: 36rpx;
		background-color: #5AC5C6;
		.kf_audition_icon{
			margin-right: 16rpx;
		}
	}
	.free_trybtn{
		width: 100%;
		height: 102rpx;
		color: #FFFFFF;
		font-size: 36rpx;
		background-color: #5AC5C6;
	}
	.free_trybtn_disable{
		width: 100%;
		height: 102rpx;
		color: #FFFFFF;
		font-size: 36rpx;
		background-color: #D6D6D6;
	}
}

</style>
