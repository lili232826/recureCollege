<template>
	<view class="video_wrap">
		<!-- 头部 -->
		<u-navbar :is-back="false" :border-bottom="false" :background="{ background: '#F8F8F8' }">
			<view class="video-nav-wrap">
				<view class="index_nav">
					<!-- <u-icon name="arrow-left" color="#666666" @click="goBack" size="34"></u-icon> -->
					<image class="nav_back_icon arrow-left" src="../../static/image/icon/icon_fanhui.png" alt=""  @click="goBack">
					<view class="title"><view class="name_txt  u-line-1">{{videoObj.name}}</view></view>
					<view class="nav_right">
						<image class="kf_collect_icon" src="../../static/image/icon/icon_schang@2x.png" mode="" v-if="videoObj.isCollection==0" @click="collectClick"></image>
						<image class="kf_collect_icon" src="../../static/image/icon/icon_shoucang_nor@2x.png" mode="" v-if="videoObj.isCollection==1" @click="collectClick"></image>
						<image class="kf_share_icon" src="../../static/image/icon/icon_share@2x.png" mode="" @click="shareShow=true"></image>
					</view>
				</view>
			</view>
		</u-navbar>
		<view class="video_content">
			<view class="play_wrap">
				<video class="kf_video"
					id="kfVideo"
					controls
					v-if="videoObj.messageCode==null&&playFleg"
				 :src="`${$websiteUrl}/file/${videoSrc}`"
				 @play="playHandle"
				 @pause="pauseHandle"
				 @ended="endedHandle"
				 @timeupdate="updateHandle"
				></video>
				<view v-else class="video_power">
					<image  class="video_cover" :src="posterSrc" mode=""></image>
					<image class="video_play_icon" src="../../static/image/icon/icon_shipin_play.png" mode="" @click="playClick"></image>
				</view>
			</view>
			<view class="content_wrap">
				<view class="title u-line-2">{{videoObj.name}}</view>
				<view class="cont_bottom">
					<view class="price_left">
						<view v-if="videoObj.realPrice==0" class="free_price">免费</view>
						<view class="price" v-if="videoObj.realPrice>0">￥<text class="big_price" >{{videoObj.realPrice.substring(0,videoObj.realPrice.indexOf("."))}}</text>.{{videoObj.realPrice.substring(videoObj.realPrice.length-2)}}</view>
						<view class="discount_price" v-if="videoObj.realPrice!=0&&videoObj.price">￥{{videoObj.price}}</view>
					</view>
					<view>
						<image class="kf_user_icon" src="../../static/image/icon/icon_renshu@2x.png" mode=""></image>
						<text class="describe_txt" v-if="videoObj.browseNum!=null||videoObj.browseNum!='null'">{{videoObj.browseNum|formatterLookNum}}人学过 | {{videoObj.formatUpdateTime}}</text>
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
				<view class="page_content" v-if="current==0">
					<view class="title">内容简介</view>
					<view class="text">
						<text v-html="videoObj.synopsis" v-if="videoObj.synopsis"></text>
						<view class="data_no_wrap flex-vertical" v-else>
							<image class="kf_nodata_pic" src="../../static/image/defaultpic/no_chart.png" mode=""></image>
							<text class="no_text">暂无详情~</text>
						</view>
					</view>
					<view class="flex-between">
						<view class="title">精选评论</view>
						<view class="kf_edit_btn"  @click="commentClick" v-if='this.$store.state.user.level!=2'>
							<image class="kf_edit_icon" src="../../static/image/icon/icon_pinglun.png"></image>
							写评论
						</view>
					</view>
					<view class="comment_wrap" v-if="commentList&&commentList.length>0">
						<view class="comment" v-for="(res, index) in commentList" :key="res.id" @click="linktoCommentDetails(res)">
							<view class="left">
								<image  v-if="res.userImg" :src="`${$filePath}?fileName=${res.userImg}`" mode="aspectFill"></image>
								<image v-else src="../../static/image/me/header_pic.png" mode="aspectFill"></image>
							</view>
							<view class="right">
								<view class="top">
									<view class="name">{{ res.userName }}</view>
									<view><u-rate disabled active-color="#FABA40" inactive-color="#DEDEDE" :count="5" :current="res.score" ></u-rate></view>
								</view>
								<view class="content u-line-5">{{ res.content }}</view>
								<view class="bottom">
									<view>{{res.releaseTime}}</view>
									<view class="bot_right flex-center">
										<view class="com_btn flex-center">
											<image class="kf_commreplay_icon" src="../../static/image/icon/icon_xinxi@2x.png"></image>
											<text v-if="res.replyNum">{{res.replyNum|formatterReplyNum}}</text>
										</view>
										<view class="zan_btn flex-center">
											<image class="kf_comzan_icon" src="../../static/image/icon/icon_zan_nor@2x.png" v-if="res.isAgree==0" @click.stop="agreeClick(res)"></image>
											<image class="kf_comzan_icon" src="../../static/image/icon/icon_zan_sel@2x.png" v-if="res.isAgree==1" @click.stop="agreeClick(res)"></image>
											<text>{{res.fabulousNum}}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="kf_comment_more" @click="linktoComment"><text v-if="commentTotal>5">查看更多评论>></text></view>
					</view>
					<view class="comment_no_wrap flex-vertical" v-if="commentList.length==0">
						<image class="kf_nocomment_pic" src="../../static/image/defaultpic/pic_pinglu@2x.png" mode=""></image>
						<text class="no_text">快来发表评论吧！</text>
					</view>
				</view>
				<view class="page_content" v-if="current==1">
					<view class="title">文本内容</view>
					<view class="text">
						<text v-html="videoObj.text" v-if="videoObj.text"></text>
						<view class="data_no_wrap flex-vertical" v-else>
							<image class="kf_nodata_pic" src="../../static/image/defaultpic/no_chart.png" mode=""></image>
							<text class="no_text">暂无文本内容~</text>
						</view>
					</view>
				</view>
				<view class="page_content" v-if="current==2">
					<view class="data_no_wrap flex-vertical" >
						<image class="kf_nodata_pic" src="../../static/image/defaultpic/no_chart.png" mode=""></image>
						<text class="no_text">暂无习题~</text>
					</view>
				</view>
				
			</view>
		</view>
		<view class="fixed_bottom" v-if="videoObj.messageCode!=null">
			<!-- <view class="audition_btn flex-centerH"><image class="kf_audition_icon" src="../../static/image/icon/shiting-ico@2x.png" mode=""></image>试听</view> -->
			<view class="pay_btn flex-centerH"  @click="payClick"><image class="kf_pay_icon" src="../../static/image/icon/zhifu-ico@2x.png" mode=""></image>立即支付</view>
			<view class="vip_btn flex-centerH" @click="linkToVip">VIP会员畅听</view>
		</view>
		<!-- 机构没有权限 -->
		<view class="fixed_bottom" v-if="videoObj.messageCode!=null&&this.$store.state.user.level==2">
			<view class="free_trybtn_disable flex-centerH" @click="playClick"><image class="kf_audition_icon" src="../../static/image/icon/edu-ico@2x.png" mode=""></image>开始学习</view>
		</view>
		<view class="fixed_bottom" v-if="videoObj.messageCode==null">
			<view class="free_trybtn flex-centerH" @click="playClick"><image class="kf_audition_icon" src="../../static/image/icon/edu-ico@2x.png" mode=""></image>开始学习</view>
		</view>
		<u-popup v-model="replyShow" mode="bottom" @close="closeReply">
			<view class="reply_wrap">
				 <view class="textarea_wrap">
					 <textarea class="reply_textarea" v-model="replyValue" :placeholder="replyPlace" maxlength='300'/>
					 <text class="all_num">{{computedLen}}/300</text>
				 </view>
				 <view class="sure_wrap flex-between">
					 <view class="rate_wrap">评星:<u-rate active-color="#FABA40" 
					 inactive-color="#DEDEDE" gutter="20" 
					 :count="5" :current="rateCount" @change="rateChange"></u-rate></view>
					 <button  class="kf_sure_btn" @click="sendComment" :disabled="disabledFleg">发送</button >
				 </view>
			</view>
		</u-popup>
		<u-popup v-model="shareShow" mode="bottom">
			<view class="sharePopup_wrap">
				<view class="share_title">分享到</view>
				<view class="share_popup_inner">
					<view class="share_list flex-vertical">
						<image class="share_outer_icon" src="../../static/image/icon/weixin_icon.png" mode="" @click="shareLink('weixin')"></image>
						<text>微信好友</text>
					</view>
					<view class="share_list flex-vertical">
						<image class="share_outer_icon" src="../../static/image/icon/qq_icon.png" mode="" @click="shareLink('qq')"></image>
						<text>QQ好友</text>
					</view>
					<view class="share_list flex-vertical">
						<image class="share_outer_icon" src="../../static/image/icon/xinlang_icon.png" mode="" @click="shareLink('xinlang')"></image>
						<text>新浪微博</text>
					</view>
				</view>
				<view class="share_cancle_wrap">
					<view class="share_cancle_btn" @click="shareShow=false">取消</view>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="payShow" mode="bottom" :closeable="true" @close="closepayPopup">
			<view class="payPopup_wrap">
				<view class="pay_title u-line-1">{{videoObj.name}}</view>
				<view class="pay_num">付款<text class="num">{{videoObj.realPrice}}</text></view>
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
	export default {	
		data() {
			return {
				current: 0,
				replyShow:false,
				shareShow:false,
				payShow:false,
				disabledFleg:false,
				replyValue:'',
				replyPlace:'留下你的想法...',
				rateCount:5,
				kfVideo:null,
				showVideo:false,
				tabList: [
					{
						name: '详情'
					},
					{
						name: '文本'
					},
					{
						name: '习题'
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
				payType:'1',
				agreeObj:{
					"commentId": '',
					"type": ''
				},
				commentList : [],
				commentTotal:0,
				playFleg:false,
				vId:"",
				videoSrc:'',
				posterSrc:'',//../../static/image/defaultpic/course_video.png
				videoObj:{
					messageCode:''
				},
				currentTime:0
				
			}
		},
		onLoad(options) {
			this.vId=options.oid;
			this.getDetail();
		},
		onReady() {
			 // 创建视频实例指向视频控件
			this.kfVideo = uni.createVideoContext("kfVideo", this);
		},
		onShow: function() {	
		},
		onHide: function() {
		},
		onUnload(){//页面卸载
			this.sendTime();//离开时发送观看记录
			this.sendTimeRate()//观看进度
		},
		computed: {
			computedLen() {
				return this.replyValue.length>300 ? 300 : this.replyValue.length
			}
		},
		methods: {
			getDetail(){
				this.$u.get('/resource/fg/video-library/get/'+this.vId,{
				}).then(res => {	
					if(res.data){
						this.videoObj=res.data;
						this.commentList=res.data.recommendCourseList||[];
						this.posterSrc=this.videoObj.img? this.$filePath+'?fileName='+this.videoObj.img : '../../static/image/defaultpic/course_video.png';
						this.getFilePath();
						this.getCommentList();
						this.videoObj.text=this.videoObj.text.replace("img",'img style="width:100%;height:auto" ')||''
					}	
				})
			},
			getFilePath(){
				///file/file/get/video/m3u8
				///file/file/getFilePath
				if(this.videoObj.video){
					this.$u.get('/file/file/get/video/m3u8?fileName='+this.videoObj.video,{
					}).then(res => {	
						if(res.data){
							this.videoSrc=res.data;
						}	
					})
				}
			},
			getCommentList(){
				this.$u.get('/sysuser/fg/comment/page',{
					pageNum:1,
					pageSize:5,
					resourceId:this.videoObj.id,
					resourceType:this.videoObj.resourceType
				}).then(res => {	
					if(res.data){
						this.commentList=res.data.list||[];
						this.commentTotal=res.data.total||0
					}	
				})
			},
			playClick(e){
				if(!this.$store.state.hasLogin){
					uni.navigateTo({
					     url: "/pages/login/index"
					});	
					return;
				};
				if(this.videoObj.messageCode!=null){
					this.$u.toast('暂无播放权限！');
					return;
				}else{
					this.playFleg=true;
					setTimeout(()=>{
						this.kfVideo.play();
					},300)
				}
				
			},
			//视频的事件start
			playHandle(e){
				// console.log('playHandle')
			},
			pauseHandle(e){
				// console.log('pauseHandle')
			},
			endedHandle(){
				this.sendTime();//离开时发送观看记录
				this.sendTimeRate()//观看进度
			},
			updateHandle(e){
				this.currentTime = Number(e.detail.currentTime)*1000;
				uni.setStorage({
					key: 'playObj',
					data: JSON.stringify({'currentTime':this.currentTime,'videoId':this.videoObj.id})
				});
			},
			//视频的事件end
			sendTime(){//观看时长
				this.$u.post('/resource/fg/video-library/timeLength/save',{
					  "time": this.currentTime,
					  "videoId": this.videoObj.id
				}).then(res => {
					if(res.code==0){
						uni.removeStorage({
							key: 'playObj'
						});
					}
				}).catch(res=>{
					
				})
			},
			sendTimeRate(){//观看进度
				this.$u.post('/resource/fg/video-library/schedule/save',{
					  "time": this.currentTime,
					  "videoId": this.videoObj.id
				}).then(res => {
					if(res.code==0){
						uni.removeStorage({
							key: 'playObj'
						});
					}
				}).catch(res=>{
					
				})
			},
			giveAgree(){
				this.$u.post('/sysuser/fg/comment/agree',{
					...this.agreeObj
				}).then(res => {
					
				})
			},
			commentClick(){
				if(this.$store.state.hasLogin){
					this.replyShow=true;
				}else{
					uni.navigateTo({
					     url: "/pages/login/index"
					});
				}
			},
			saveCollection(){
				this.$u.post('/resource/fg/member-collection/batch/save',{
					"goodsList": [
					    {
					      "id": this.videoObj.id,
					      "type": this.videoObj.resourceType
					    }
					  ]
				}).then(res => {
					this.$u.toast('收藏成功');
				}).catch(res=>{
					this.$u.toast('收藏失败，请重试');
				})	
			},
			delCollection(){
				this.$u.post('/resource/fg/member-collection/batch/delete',{
					"goodsList": [
					    {
					      "id": this.videoObj.id,
					      "type": this.videoObj.resourceType
					    }
					  ]
				}).then(res => {
					this.$u.toast('已取消收藏');
				}).catch(res=>{
					this.$u.toast('取消失败，请重试');
				})
			},
			agreeClick(res){//点赞
				if(this.$store.state.hasLogin){
					if(this.$store.state.user.level!=2){//机构用户不能评论
						this.agreeObj.type=res.isAgree;
						if(res.isAgree==0){
							res.isAgree=1;
							res.fabulousNum+=1
							this.agreeObj.type=res.isAgree;
						}else{
							res.isAgree=0;
							res.fabulousNum-=1;	
							this.agreeObj.type=res.isAgree;
						}
						this.agreeObj.commentId=res.id;
						this.giveAgree()
					}
				}else{
					uni.navigateTo({
					     url: "/pages/login/index"
					});
				}
			},
			collectClick(){//收藏
				if(this.$store.state.hasLogin){
					if(this.videoObj.isCollection==0){
						this.videoObj.isCollection=1;
						this.saveCollection()
					}else{
						this.videoObj.isCollection=0;
						this.delCollection()
					}
				}else{
					uni.navigateTo({
					     url: "/pages/login/index"
					});
				}	
			},
			closeReply(){
				this.replyShow=false;
				this.rateCount=5;
				this.replyValue=""
			},
			sendComment(){
				if(this.disabledFleg){
					return;
				}
				if(this.replyValue.trim().length>0){
					this.disabledFleg=true;
					this.$u.post('/sysuser/fg/comment/save',{
						"fatherId": 0,
						"mainId": 0,
						"resourceName": this.videoObj.name,
						"content": this.replyValue,
						"resourceId": this.videoObj.id,
						"resourceType": this.videoObj.resourceType,
						"score": this.rateCount
					}).then(res => {
						this.replyValue='';
						if(res.code==0){
							this.$u.toast('评论成功');
							this.getCommentList();
							this.replyShow=false;
							this.disabledFleg=false;
						}else{
							this.$u.toast('评论失败，请重试');
							this.disabledFleg=false;
						}
					}).catch(res=>{
						this.$u.toast('评论失败，请重试');
						this.disabledFleg=false;
					})
				}else{
					this.$u.toast('请填写评论内容');
				}
				
				// agreeObj
			},
			// tab栏切换
			change(index) {
				if((index==1||index==2)&&this.videoObj.messageCode!=null){//文本习题需要权限才可以
					this.$u.toast('暂无权限观看');
					return;
				}
				this.current = index;
			},
			linktoCommentDetails(res){
				uni.navigateTo({
				     url: "/pages/comment/details?commentId="+res.id
				});
			},
			linktoComment(){
				uni.navigateTo({
				     url: "/pages/comment/index?resourceId="+this.videoObj.id+"&resourceType="+this.videoObj.resourceType
				});
			},
			rateChange(value){
				this.rateCount=value;
			},
			linkToVip(){
				uni.navigateTo({
				     url: "/pages/person/vip"
				});
			},
			goBack(){
				this.kfVideo.pause();
				// this.sendTime();//离开时发送观看记录
				// this.sendTimeRate()//观看进度
				uni.navigateBack() 
			},
			radioChange(e) {
				this.payType=e.detail.value
			},
			shareLink(type){
				let _this=this;
				if(type=="xinlang"){
					uni.share({
					    provider: "sinaweibo",
					    scene: "WXSceneSession",
					    type: 0,
						"title":_this.videoObj.name,
						"href":this.$websiteUrl,
						"imageUrl":_this.$filePath+"?fileName="+this.videoObj.img,
					    summary: _this.videoObj.name,
					    success: function (res) {
					        console.log("success:" + JSON.stringify(res));
					    },
					    fail: function (err) {
					        console.log("fail:" + JSON.stringify(err));
					    }
					});
				}else if(type=="qq"){
					uni.share({
					    provider: "qq",
					    scene: "WXSceneSession",
					    type: 0,
						"title":this.videoObj.name,
						"href":this.$websiteUrl,
						"imageUrl":this.$filePath+"?fileName="+this.videoObj.img,
					    summary: this.videoObj.name,
					    success: function (res) {
					        console.log("success:" + JSON.stringify(res));
					    },
					    fail: function (err) {
					        console.log("fail:" + JSON.stringify(err));
					    }
					});
				}else{
					uni.share({
					    provider: "weixin",
					    scene: "WXSceneSession",
					    type: 0,
						"title":this.videoObj.name,
						"href":this.$websiteUrl,
						"imageUrl":this.$filePath+"?fileName="+this.videoObj.img,
					    summary: this.videoObj.name,
					    success: function (res) {
					        console.log("success:" + JSON.stringify(res));
					    },
					    fail: function (err) {
					        console.log("fail:" + JSON.stringify(err));
					    }
					});
				}
			},
			payClick(){
				if(this.$store.state.hasLogin){
					this.payShow=true;
				}else{
					uni.navigateTo({
					     url: "/pages/login/index"
					});
				}
			},
			closepayPopup(){
				uni.hideLoading();
			},
			payNow(){
				uni.showLoading({
				    title: '加载中'
				});
				this.$u.post('/order/fg/order/create-order-and-pay',{
					  "buyType":"1",
					  "goodsList": [
					    {
					      "goodsId":this.videoObj.id ,
					      "goodsType":this.videoObj.resourceType ,
					      "num": 1,
					      "salePrice":this.videoObj.realPrice
					    }
					  ],
					  "payType": this.payType,
					  "source": "2",
					  "wechatPayType": "2"
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
								  this.payShow=false;
								  this.getDetail();
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
				
			}
		}
	}
</script>

<style scoped lang="scss">
	.video_wrap{
		padding-bottom: 102rpx;
	}
	.video-nav-wrap{
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
	.play_wrap{
		width: 100%;
		height: 480rpx;
		.video_power{
			position: relative;
		}
		.video_cover{
			width: 100%;
			height: 480rpx;
			will-change: transform;
			position: relative;
			background-color: #eee;
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
		
		.kf_video{
			width: 100%;
			height: 480rpx;
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
		.big_price{
			font-size: 36rpx;
		}
		.free_price{
			color: #07B562;
			font-size: 36rpx;
			font-weight: bold;
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
			word-break: break-all;
		}
	}
	
.comment_wrap{
	.comment {
		display: flex;
		padding: 30rpx 0;
		border-bottom: 2rpx solid #EEEEEE;
		.left {
			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				background-color: #f2f2f2;
			}
		}
		.right {
			flex: 1;
			padding-left: 20rpx;
			font-size: 30rpx;
			.top {
				display: flex;
				align-items: center;
				margin-bottom: 32rpx;
				.name {
					color: #333333;
					font-size: 30rpx;
					font-weight: bold;
					margin-rigth:20rpx
				}
			}
			.content {
				font-size: 28rpx;
				color: #777777;
				line-height: 46rpx;
				margin-bottom: 10rpx;
			}
			.bottom{
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #BDC1CB;
				font-size: 24rpx;
			}	
			.com_btn{
				margin-right: 40rpx;
			}
		}
	}
}
.fixed_bottom{
	height: 102rpx;
	position: fixed;
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
	.free_trybtn_disable{
		width: 100%;
		height: 102rpx;
		color: #FFFFFF;
		font-size: 36rpx;
		background-color: #D6D6D6;
	}
}
.reply_wrap{
	.textarea_wrap{
		padding: 40rpx 28rpx;
		position: relative;
	}
	.sure_wrap{
		width: 100%;
		height: 99rpx;
		padding: 0 24rpx;
		border-top: 1rpx solid #E4E4E4;
	}
	.rate_wrap{
		color:#333333;
		font-size: 30rpx;
	}
	.reply_textarea{
		width: 694rpx;
		height: 320rpx;
	}
	.all_num{
		font-size:24rpx;
		font-weight:400;
		color:#D2D6E0;
		position: absolute;
		bottom: 8rpx;
		right: 26rpx;
	}
}
</style>
