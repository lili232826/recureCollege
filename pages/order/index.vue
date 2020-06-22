<template>
	<view class="order_wrap">
		<kfNav class="order_nav" title="我的订单" bgColor="#fff"/>
		<view class="order-tabs-box">
			<u-tabs
			activeColor="#25B4B5" 
			inactive-color="#333333"
			bg-color="transparent"
			:show-bar="false"
			ref="tabs" 
			:list="tabList" 
			:current="current" 
			@change="change" 
			:is-scroll="false" 
			swiperWidth="750"></u-tabs>
		</view>
		<view class="order_content">
			<view class="scroll_order_page">
				<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom" @scroll="scroll" :scroll-top="scrollTopNum">
					<view class="scroll_page">
						<view class="order_block" v-for="(item,index) in list" :key="index" @click="linkToPage(item)">
							<view class="flex-between top">
								<text class="time">{{item.createTime}}</text>
								<text class="status" v-if="item.status==6">{{item.statusZh}}</text>
								<text class="status cancle" v-if="item.status==-1">{{item.statusZh}}</text>
							</view>
							<view class="details">
								<image v-if="item.infoList[0].cover&&item.infoList[0].type!=1" class="cover" :src="`${$filePath}?fileName=${item.infoList[0].cover}`" mode=""></image>
								<image v-if="!item.infoList[0].cover&&item.infoList[0].type!=1" class="cover" src="../../static/image/defaultpic/course_pic.png" mode=""></image>
								<image v-if="item.infoList[0].cover&&item.infoList[0].type==1" class="book" :src="`${$filePath}?fileName=${item.infoList[0].cover}`" mode=""></image>
								<image v-if="!item.infoList[0].cover&&item.infoList[0].type==1" class="book" src="../../static/image/defaultpic/course_pic.png" mode=""></image>
								<view>
									<view class="title u-line-2">{{item.infoList&&item.infoList[0].name}}</view>
								</view>
							</view>
							<view class="bottom flex-between">
								<view class="price_left">
									实付款：<text class="price_num">￥{{item.payment }}</text>
								</view>
								<view class="flex-centerH">								
									<view class="order_cancel" v-if="item.status==0" @click.stop="cancleOrder(item.id)">取消订单</view>
									<view class="order_btn" v-if="item.status==0" @click.stop="payClick(item)">立即支付</view>
									<view class="order_btn" v-if="item.status==6||item.status==-1" @click.stop="linktoDetails(item)">查看详情</view>
								</view>
							</view>
						</view>
						<u-loadmore v-if="list&&list.length>0" :status="status" :load-text="loadText" color="#D5D7E0" bg-color="#F8F8F8" margin-top="40" margin-bottom='40'/>
						<view class="data_no_wrap flex-vertical" v-if="list.length==0">
							<image class="kf_nodata_pic" src="../../static/image/defaultpic/no_chart.png" mode=""></image>
							<text class="no_text">暂无数据~</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
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
////1图书、2文献、3文章、4专家、5视频、6系列课、7直播、8文件、9图片、10音频 
	import kfNav from '@/components/kf-nav/kf-nav.vue';
	export default {
		components: { kfNav },
		data() {
			return {
				current: 0,
				swiperCurrent: 0,
				tabList:[
					{
						name: '已支付订单',
						status:6
					},
					{
						name: '未支付订单',
						status:0
					}
				],
				orderParmes:{
					pageNum:1,
					pageSize:50,
					status:6,//0未支付6已支付
				},
				pageCount:0,
				scrollTopNum:0,
				old: {
					scrollTopNum: 0
				},
				list: [],
				status: 'nomore',
				loadText: {
					loading: '正在加载中...',
					nomore: '这是我的底线'
				},
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
				payObj:{
					
				}
			}
		},
		onLoad() {
			this.getList();
		},
		methods: {
			getList(){
				this.$u.get('/order/fg/order/page',{
					...this.orderParmes
				}).then(res => {	
					if(res.data){
						this.list=res.data.list;
						this.pageCount=res.data.pages;
						this.scrollTopNum = this.old.scrollTopNum
						this.$nextTick(function() {
							this.scrollTopNum = 0
						});
						// console.log(res.data.list,'888888')
					}	
				})
			},
			getMoreList(){
				this.$u.get('/order/fg/order/page',{
					...this.orderParmes
				}).then(res => {	
					if(res.data){
						this.list=this.list.concat(res.data.list);
						this.pageCount=res.data.pages;
					}	
				})
			},
			scroll: function(e) {
				this.old.scrollTopNum = e.detail.scrollTop
			},
			payClick(item){
				this.payObj=item;				
				this.payShow=true;
				// console.log(this.payObj,'HAHHAHAHA')
			},
			closepayPopup(){
				uni.hideLoading();
			},
			payNow(type){
				this.payType=type;
				uni.showLoading({
				    title: '加载中'
				});
				this.$u.get('order/fg/order/pay',{
					  "orderCode":this.payObj.code,
					  "payType": this.payType,
					  "source": "2",
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
								   this.orderParmes.pageNum=1;
								   this.getList();
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
									this.payShow=false;
									this.orderParmes.pageNum=1;
									this.getList();
									this.$u.toast("支付成功");
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
			cancleOrder(id){
				this.$u.post("order/fg/order/update/"+id+"/cancel",{
				}).then(res => {	
					if(res.code==0){
						this.orderParmes.pageNum=1;
						this.getList()
						this.$u.toast('取消成功')	
					}else{
						this.$u.toast('取消失败')	
					}
				}).catch(res=>{
					this.$u.toast('取消失败')	
				})
			},
			// tab栏切换
			change(index) {
				this.current=index;
				this.orderParmes.status=this.tabList[index]['status'];
				this.getList();
			},
			reachBottom(){
				if(this.orderParmes.pageNum<this.pageCount){
					this.orderParmes.pageNum++;
					this.getMoreList();
					this.status="loading"
				}else{
					this.status="nomore"
				}
				// console.log(88)
			},
			linkToPage(item){
				
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
			linktoDetails(item){
				uni.navigateTo({
					url: "/pages/order/details?orderId="+item.id
				});
			},
			goBack(){
				uni.navigateBack() 
			}
		}
	}
</script>

<style scoped lang="scss">
	.order_wrap{
		display: flex;
		flex-direction: column;
		height: calc(100vh);
		width: 100%;
	}
	.order-tabs-box{
		height:80rpx;
		flex-shrink: 0;
	}
	.order_nav{
		flex-shrink: 0;
	}
	.order_content{
		flex:1;
		// padding: 20rpx 24rpx;
		background-color: #F8F8F8;
	}
	.scroll_order_page{
		height: 100%;
		position: relative;
	}
	.scroll_page{
		padding: 20rpx 24rpx;
		position: absolute;
		width: 100%;
		height: 100%;
	}
	.order_block{
		padding: 30rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
		.top{
			color: #999;
			border-bottom: 2rpx solid #EBEBEB;
			padding-bottom: 30rpx;
		}
		.time{
			
			font-size:24rpx;
		}			
		.status{
			font-size:28rpx;
			&.cancle{
				color: #FE2023;
			}
		}
		.book{
			width: 120rpx;
			height: 170rpx;
			flex-shrink: 0;
			margin-left: 40rpx;
			margin-right: 40rpx;
			
		}
		.details{
			display: flex;
			padding: 30rpx 0;
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
			
		}
		.price_left{
			font-size: 28rpx;
			color: #999;
		}
		.price_num{
			color: #FE2023;
			font-weight: bold;
		}
		.order_btn{
			width: 160rpx;
			height: 60rpx;
			font-size: 26rpx;
			color: #25B4B5;
			text-align: center;
			line-height: 60rpx;
			border:2rpx solid #D3F0F0;
			border-radius: 30rpx;
			margin-left: 20rpx;
		}
		.order_cancel{
			width: 160rpx;
			height: 60rpx;
			font-size: 26rpx;
			color: #333;
			text-align: center;
			line-height: 60rpx;
			border:2rpx solid #F3F3F3;
			border-radius: 30rpx;
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
