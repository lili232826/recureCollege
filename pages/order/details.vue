<template>
	<view class="order_details_wrap">
		<kfNav class="order_nav" title="订单详情" bgColor="#fff"/>
		<view style="position: relative;">
			<image class="order_bgtop" src="../../static/image/me/bg_dingdan@2x.png" mode=""></image>
			<view class="order_details_content" style="background-image: url()">
				<view class="status_top">
					<image v-if="orderObj.status==6" class="success_icon" src="../../static/image/me/icon_wancheng@2x.png" mode=""></image>
					<image v-if="orderObj.status==0" class="no_icon" src="../../static/image/me/dingdan_icon_fukuan@2x.png" mode=""></image>
					<image v-if="orderObj.status==-1" class="cancle_icon" src="../../static/image/me/dingdan_icon_quxiao@2x.png" mode=""></image>
					<text class="status_txt">{{orderObj.statusZh}}</text>
				</view>
				<view class="order_details">
					<view class="flex cover_wrap">
						<image v-if="orderObj.infoList&&orderObj.infoList[0].cover" class="cover" :src="`${$filePath}?fileName=${orderObj.infoList[0].cover}`" mode="" @click="linkToPage"></image>
						<image v-else class="cover" src="../../static/image/defaultpic/course_pic.png" mode=""></image>
						<view class="title" v-if="orderObj['infoList']">{{orderObj['infoList'][0].name}}</view>
					</view>
					<view class="flex-between details_line">
						<view class="sub_tit">金额：</view>
						<view class="sub_price">￥{{orderObj.orderPayment&&orderObj.orderPayment.toFixed(2) }}</view>
					</view>
					<view class="flex-between details_line">
						<view class="sub_tit">优惠：</view>
						<view class="sub_price">￥{{orderObj.discountTotal&&orderObj.discountTotal.toFixed(2) }}</view>
					</view>
					<view class="flex-between details_line">
						<view class="sub_title">实付款：</view>
						<view class="price">￥<text class="price_num">{{orderObj.payment&&orderObj.payment.toFixed(2)}}</text></view>
					</view>
				</view>
				<view class="order_sub_details">
					<view class="bot_line">
						<text class="sub_tit">支付方式：</text><text>{{orderObj.payTypeZh}}</text>
					</view>
					<view class="bot_line">
						<text class="sub_tit">下单时间：</text><text>{{orderObj.payTime}}</text>
					</view>
					<view  class="bot_line">
						<text class="sub_tit">订单编号：</text><text>{{orderObj.code}}</text>
					</view>
				</view>
				
			</view>
			<view class="order_details_bottom" v-if="orderObj.status==0">
				<view class="pay_btn" @click="payShow=true">立即支付</view>
			</view>
		</view>
		<u-popup v-model="payShow" mode="bottom" :mask-close-able="false" :closeable="true">
			<view class="payPopup_wrap">
				<view class="pay_title">{{orderObj['infoList']&&orderObj['infoList'][0].name}}</view>
				<view class="pay_num">付款<text class="num" >{{orderObj.payment&&orderObj.payment.toFixed(2)}}</text></view>
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
		
</template>

<script>	
	import kfNav from '@/components/kf-nav/kf-nav.vue';
	export default {
		components: { kfNav },
		data() {
			return {
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
				orderId:'',
				orderObj:{}
			}
		},
		onLoad(options) {
			this.orderId=options.orderId;
			this.getDetails();
			console.log(options.orderId,)
		},
		methods: {
			getDetails(){
				this.$u.get('/order/fg/order/'+this.orderId,{
					...this.orderParmes
				}).then(res => {	
					if(res.data){
						this.orderObj=res.data;
						// this.orderObj.status=0
						// console.log(res.data,'888888')
					}	
				})
			},
			radioChange(e) {
				var checked = e.detail.value
			},
			payNow(){
				this.$u.post('/order/fg/order/create-order-and-pay',{
					  "buyType":"1",
					  "goodsList": [
					    {
					      "goodsId":this.courseObj.id ,
					      "goodsType":this.courseObj.resourceType ,
					      "num": 1,
					      "salePrice":this.courseObj.realPrice
					    }
					  ],
					  "payType": this.payType,
					  "source": "1",
					  "wechatPayType": "2"
				}).then(res => {
					if(res.code==0){
						if(res.data.url){
							// window.open(res.data.url)
							plus.runtime.openURL(res.data.url);
						}
						console.log(res,'微信支付')	
					}else{
						console.log(res,'微信支付失败')
					}
				}).catch(res=>{
					console.log(res,'微信支付失败2')
				})
				
			},
			linkToPage(item){
				// console.log(item,'9999999999999999999')
				let resourceType=item.infoList[0]['type'];
				let oid=item.infoList[0]['goodsid'];
				if(resourceType==5){
					uni.navigateTo({
						url: "/pages/video/index?oid="+oid
					});
				}
				if(resourceType==6){
					uni.navigateTo({
						url: "/pages/course/index?oid="+oid
					});
				}	
			},	
			goBack(){
				uni.navigateBack() 
			}
		}
	}
</script>

<style scoped lang="scss">
	.order_details_wrap{
		background-color: #f8f8f8;
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
		.order_details_content{
			padding: 76rpx 24rpx 0 24rpx;
			// background-repeat: no-repeat;
			// background-position: top left;
			// background-size: 100% 281rpx;
			position: relative;
		}
		.order_bgtop{
			width: 100%;
			height: 281rpx;
			position: absolute;
			top: 0;
			left: 0;
			
		}
		.status_top{
			margin-bottom: 46rpx;
			display: flex;
			align-items: center;
		}
		.cover_wrap{
			margin-bottom: 26rpx;
		}
		.details_line{
			margin-bottom: 20rpx;
		}
		.success_icon,.cancle_icon{
			width: 36rpx;
			height: 36rpx;
			margin-right: 6rpx;
		}
		.no_icon{
			width: 38rpx;
			height: 36rpx;
			margin-right: 6rpx;
		}
		.status_txt{
			color: #f8f8f8;
			font-size: 36rpx;
		}
		.book{
			width: 120rpx;
			height: 170rpx;
			flex-shrink: 0;
			margin-left: 40rpx;
			margin-right: 40rpx;
			
		}
		.cover{
			width: 256rpx;
			height: 170rpx;
			flex-shrink: 0;
			margin-right: 29rpx;
		}
		.title{
			color:#202021;
			font-size: 30rpx;
			font-weight: bold;
			padding-top: 20rpx;		
		}
		.order_details{
			color: #999999;
			background-color: #fff;
			padding: 30rpx;
			border-radius: 20rpx;
			margin-bottom: 20rpx;
		}
		.sub_tit{
			font-size: 24rpx;
		}
		.sub_title{
			font-size: 30rpx;
			color: #333333;
		}
		.sub_price{
			font-size: 26rpx;
		}
		.order_sub_details{
			background-color: #fff;
			padding:0 30rpx;
			border-radius: 20rpx;
			.bot_line{
				padding: 30rpx 0;
				border-bottom:1rpx solid #EBEBEB;
				color: #333;
				&:last-child{
					border:0
				}
			}
			.sub_tit{
				color: #999;
			}
		}
		.price{
			color: #FE2023;
		}
		.price_num{
			font-weight: bold;
			font-size: 34rpx;
		}
		.order_details_bottom{
			width: 100%;
			height: 98rpx;
			background-color: #fff;
			padding: 0 25rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			.pay_btn{
				width: 160rpx;
				height: 60rpx;
				color: #333;
				line-height: 60rpx;
				text-align: center;
				border: 1px solid #F3F3F3;
				border-radius: 30rpx;
				}
		}
	}
</style>
