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
						<image class="kf_collect_icon" src="../../static/image/icon/icon_schang@2x.png" mode="" v-if="courseObj.isCollection==0" @click="collectClick"></image>
						<image class="kf_collect_icon" src="../../static/image/icon/icon_shoucang_nor@2x.png" mode="" v-if="courseObj.isCollection==1" @click="collectClick"></image>
						<image class="kf_share_icon" src="../../static/image/icon/icon_share@2x.png" mode="" @click="shareClick"></image>
					</view>
				</view>
			</view>
		</u-navbar>
		<view class="course_content">
			<view class="course_cover_bg">
				<image class="course_cover" :src="coverSrc" mode=""></image>
				<!-- <image v-else class="course_cover" src="../../static/image/defaultpic/course_cover.png" mode=""></image> -->
			</view>
			<view class="content_wrap">
				<view class="title u-line-2">{{courseObj.name}}</view>
				<view class="cont_bottom">
					<view class="price_left">
						<view class="free_price" v-if="courseObj.realPrice==0">免费</view>
						<view class="price" v-if="courseObj.realPrice>0">￥<text class="big_price" >{{courseObj.realPrice.substring(0,courseObj.realPrice.indexOf("."))}}</text>.{{courseObj.realPrice.substring(courseObj.realPrice.length-2)}}</view>
						<view class="discount_price" v-if="courseObj.realPrice!=0&&courseObj.price">￥{{courseObj.price}}</view>
					</view>
					<view>
						<image class="kf_user_icon" src="../../static/image/icon/icon_renshu@2x.png" mode=""></image>
                        <text class="describe_txt" v-if="courseObj.browseNum">{{courseObj.browseNum|formatterLookNum}}人学过 | {{courseObj.formatUpdateTime}}</text>
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
					<view class="text" v-html="courseObj.synopsis">
					</view>
					<view class="data_no_wrap flex-vertical" v-if="!courseObj.synopsis">
						<image class="kf_nodata_pic" src="../../static/image/defaultpic/no_chart.png" mode=""></image>
						<text class="no_text">暂无简介~</text>
					</view>
					<view class="flex-between">
						<view class="title">精选评论</view>
						<view class="kf_edit_btn edit_input" @click="commentClick" v-if='this.$store.state.user.level!=2'>
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
						<view class="kf_comment_more"><text v-if="commentTotal>5" @click="linktoComment()">查看更多评论>></text></view>
					</view>
					<view class="comment_no_wrap flex-vertical" v-if="commentList.length==0">
						<image class="kf_nocomment_pic" src="../../static/image/defaultpic/pic_pinglu@2x.png" mode=""></image>
						<text class="no_text">快来发表评论吧！</text>
					</view>
				</view>
				<!-- 目录 -->
				<view class="page_content" v-if="current==1">
					<view style="height: 80rpx;" v-if="catalogList&&catalogList.length>0">
						<view class="course_sort_btn flex-centerH" @click="sortClick">
							{{sortText}}
							<image class="course_sort_icon" src="../../static/image/icon/paixu@2x.png" mode=""></image>
						</view>
					</view>
					<view class="catalog_wrap" v-if="catalogList&&catalogList.length>0">
						<view class="catalog_block flex-between" v-for="(list,index) in catalogList" :key="index" @click="linkToVideo(list)">
							<view class="catelog_left">
								<view class="top" :class="{'lock':list.messageCode!=null}">
									<!-- <text class="number_txt" v-if="catalogParmes.orderBy=='sort'||catalogParmes.orderBy==''">第{{index+1}}章</text>
									<text class="number_txt" v-else="">第{{catalogList.length-index}}章</text> -->
									<text class="">{{list.name}}</text>
								</view>
								<view class="bottom flex-center">
									<text class="time" v-if="list.updateTime">{{list.timeLength}} {{list.formatUpdateTime}}</text>
									<view class="study_num">
										<image class="kf_course_playicon" src="../../static/image/icon/icon_bofang@2x.png" mode=""></image>
										<text>{{list.browseNum|formatterLookNum}}次学习</text>
									</view>
									<!-- <text class="complete_text">已播{{list.schedule}}%</text> -->
								</view>
							</view>
							<view>
								<!-- 有权限的 -->
								<view class="catelog_right flex-vertical" v-if="list.messageCode==null||list.messageCode=='null'">
									<image class="kf_course_playbtn" src="../../static/image/icon/play_course_icon.png" mode=""></image>
								</view>
								<!-- 没有权限的 -->
								<view class="catelog_right flex-vertical" v-if="list.messageCode!=null">
									<image class="kf_course_suobtn" src="../../static/image/icon/suo_course_ico.png" mode=""></image>
								</view>
							</view>
						</view>
					</view>
					<view class="data_no_wrap flex-vertical" v-if="catalogList.length==0" >
						<image class="kf_nodata_pic" src="../../static/image/defaultpic/no_chart.png" mode=""></image>
						<text class="no_text">暂无目录~</text>
					</view>
				</view>
				<!-- 习题 -->
				<view class="page_content" v-if="current==2">
					<view class="data_no_wrap flex-vertical" >
						<image class="kf_nodata_pic" src="../../static/image/defaultpic/no_chart.png" mode=""></image>
						<text class="no_text">暂无习题~</text>
					</view>
				</view>
				
			</view>
		</view>
		<view class="fixed_bottom" v-if="courseObj.messageCode!=null&&this.$store.state.user.level!=2" >
			<view class="audition_btn flex-centerH" @click="tryListen"><image class="kf_audition_icon" src="../../static/image/icon/shiting-ico@2x.png" mode=""></image>试听</view>
			<view class="pay_btn flex-centerH" @click="payClick"><image class="kf_pay_icon" src="../../static/image/icon/zhifu-ico@2x.png" mode=""></image>立即支付</view>
			<view class="vip_btn flex-centerH" @click="linkToVip">VIP会员畅听</view>
		</view>
		<!-- 机构没有权限只有试听 -->
		<view class="fixed_bottom" v-if="courseObj.messageCode!=null&&this.$store.state.user.level==2" >
			<view class="audition_btn_jg flex-centerH" @click="tryListen"><image class="kf_audition_icon" src="../../static/image/icon/shiting-ico@2x.png" mode=""></image>试听</view>
		</view>
		<view class="fixed_bottom" v-if="courseObj.messageCode==null">
			<view class="free_trybtn flex-centerH" @click="freelinkToVideo"><image class="kf_audition_icon" src="../../static/image/icon/edu-ico@2x.png" mode=""></image>开始学习</view>
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
					 <!-- <view class="kf_sure_btn" @click="sendComment">发送</view> -->
					 <button  class="kf_sure_btn" @tap="sendComment" :disabled="disabledFleg">发送</button >
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
		<u-popup v-model="payShow" mode="bottom"  :closeable="true"  @close="closepayPopup">
			<view class="payPopup_wrap">
				<view class="pay_title u-line-1">{{courseObj.name}}</view>
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
				replyShow:false,
				shareShow:false,
				payShow:false,
				disabledFleg:false,
				replyValue:'',
				replyPlace:'留下你的想法...',
				current: 0,
				rateCount:5,
				tabList: [
					{
						name: '详情'
					},
					{
						name: '目录(0)'
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
				payType:"1",
				coverSrc:'',
				courseObj:{
					messageCode:''
				},
				catalogList:[],
				sortText:"正序",
				catalogParmes:{
					id:"",
					resourceType:'',
					orderBy:'sort asc'
				},
				agreeObj:{
					"commentId": '',
					"type": ''
				},
				commentTotal:0,
				commentList : [],
				
			}
		},
		onLoad(option) {
			this.oid=option.oid;
			this.catalogParmes.id=option.oid;
			this.getDetail();
		},
		onShow: function() {
			
		},
		onHide: function() {

		},
		computed: {
			computedLen() {
				return this.replyValue.length>300 ? 300 : this.replyValue.length
			}
		},
		methods: {
			getDetail(){
				this.$u.get('/resource/fg/course-library/get/'+this.oid,{
				}).then(res => {	
					if(res.data){
						this.courseObj=res.data||{};
						this.coverSrc=this.courseObj.img? this.$filePath+'?fileName='+this.courseObj.img : '../../static/image/defaultpic/course_cover.png';
						this.courseObj.synopsis=this.courseObj.synopsis.replace(/img/gi, function (match, capture) {
							return match+' style="max-width:100%;height:auto;"'
						})
						this.commentList=res.data.recommendCourseList||[];
						this.catalogParmes.resourceType=this.courseObj.resourceType;
						this.getCatalog();
						this.getCommentList();
					}	
				})
			},
			getCatalog(){
				this.$u.get('/resource/fg/course-library/get/directory',{
					...this.catalogParmes
				}).then(res => {	
					if(res.data){
						this.catalogList=res.data||[];
						// console.log(this.catalogList,'this.catalogList')
						this.tabList[1]['name']="目录("+this.catalogList.length+")"
					}	
				})
			},
			getCommentList(){
				this.$u.get('/sysuser/fg/comment/page',{
					pageNum:1,
					pageSize:5,
					resourceId:this.courseObj.id,
					resourceType:this.courseObj.resourceType
				}).then(res => {	
					if(res.data){
						this.commentList=res.data.list||[];
						this.commentTotal=res.data.total||0
					}	
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
			agreeClick(res){
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
			collectClick(){
				if(this.$store.state.hasLogin){
					if(this.courseObj.isCollection==0){
						this.courseObj.isCollection=1;
						this.saveCollection()
					}else{
						this.courseObj.isCollection=0;
						this.delCollection()
					}
				}else{
					uni.navigateTo({
					     url: "/pages/login/index"
					});
				}
				
			},
			radioChange(e) {
				// var checked = e.detail.value
				this.payType=e.detail.value
			},
			shareClick(){
				this.shareShow=true;	
				// uni.shareWithSystem({
				//   summary: '',
				//   href: 'https://uniapp.dcloud.io',
				//   success(){
				//     // 分享完成，请注意此时不一定是成功分享
				//   },
				//   fail(){
				//     // 分享失败
				//   }
				// })
			},
			shareLink(type){
				let _this=this;
				// console.log(this.$websiteUrl+"/pages/course/index?oid="+this.oid,'0000000000000')
				console.log(type,'type')
				if(type=="xinlang"){
					uni.share({
					    provider: "sinaweibo",
					    scene: "WXSceneSession",
					    type: 0,
						"title":_this.courseObj.name,
						"href":this.$websiteUrl,
						"imageUrl":_this.$filePath+"?fileName="+this.courseObj.img,
					    summary: _this.courseObj.name,
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
						"title":this.courseObj.name,
						"href":this.$websiteUrl,
						"imageUrl":this.$filePath+"?fileName="+this.courseObj.img,
					    summary: this.courseObj.name,
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
						"title":this.courseObj.name,
						"href":this.$websiteUrl,
						"imageUrl":this.$filePath+"?fileName="+this.courseObj.img,
					    summary: this.courseObj.name,
					    success: function (res) {
					        console.log("success:" + JSON.stringify(res));
					    },
					    fail: function (err) {
					        console.log("fail:" + JSON.stringify(err));
					    }
					});
				}
				
			},
			saveCollection(){
				this.$u.post('/resource/fg/member-collection/batch/save',{
					"goodsList": [
					    {
					      "id": this.courseObj.id,
					      "type": this.courseObj.resourceType
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
					      "id": this.courseObj.id,
					      "type": this.courseObj.resourceType
					    }
					  ]
				}).then(res => {
					this.$u.toast('已取消收藏');
				}).catch(res=>{
					this.$u.toast('取消失败，请重试');
				})
				
			},
			closeReply(){
				this.rateCount=5;
				this.replyValue="";
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
						"resourceName": this.courseObj.name,
						"content": this.replyValue,
						"resourceId": this.courseObj.id,
						"resourceType": this.courseObj.resourceType,
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
			tryListen(){
				//试听免费的第一个
				let freeList=this.catalogList.filter((list)=>list.messageCode==null)||[];
				console.log(freeList,'freeList')
				if(freeList.length==0){
					uni.showToast({
					    title: '暂无试听的视频',
						icon:"none",
					    duration: 1000
					});
				}else{
					uni.navigateTo({
						 url: "/pages/course/video?vId="+freeList[0].id
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
					      "goodsId":this.courseObj.id ,
					      "goodsType":this.courseObj.resourceType ,
					      "num": 1,
					      "salePrice":this.courseObj.realPrice
					    }
					  ],
					  "payType": this.payType,
					  "source": "2",
					  "wechatPayType": "2"
				}).then(res => {
					if(res.data.url){
						console.log(res,'66666666666666666666')
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
									console.log(err,'888')
									this.$u.toast("支付失败，请稍后重试");
							    }
							})
						} 
					}
						// this.$u.toast(res.data.url+'微信支付1')	
				}).catch(res=>{
					uni.hideLoading();
					this.$u.toast('支付唤起失败，请稍后重试')	
				})
				
			},
			// tab栏切换
			change(index) {
				if(index==2&&this.courseObj.messageCode!=null){//习题需要权限才可以
					this.$u.toast('暂无权限观看');
					return;
				}
				this.current = index;
				
			},
			rateChange(value){
				this.rateCount=value;
			},
			sortClick(){
				if(this.sortText=="倒序"){
					this.sortText="正序";
					this.catalogParmes.orderBy="sort asc"
				}else{
					this.sortText="倒序";
					this.catalogParmes.orderBy="sort desc"
				}
				this.getCatalog()
			},
			goBack(){
				uni.navigateBack() 
			},
			freelinkToVideo(){
				if(!this.$store.state.hasLogin){
					uni.navigateTo({
					     url: "/pages/login/index"
					});	
					return;
				}
				if(this.courseObj.newVideoId){//现在正在学习的视频
					uni.navigateTo({
						 url: "/pages/course/video?vId="+this.courseObj.newVideoId
					});	
				}else{
					if(this.catalogList[0]){
						uni.navigateTo({
							 url: "/pages/course/video?vId="+this.catalogList[0]['id']
						});
					}else{
						this.$u.toast('暂无视频可以学习');
					}	
				}
			},
			
			linkToVideo(list){
				if(!this.$store.state.hasLogin){
					uni.navigateTo({
					     url: "/pages/login/index"
					});	
					return;
				};
				if(list.messageCode==null||list.messageCode=="null"){
					uni.navigateTo({
						 url: "/pages/course/video?vId="+list.id
					});
				}else{
					this.$u.toast('暂无权限观看');
				}
				
			},
			linktoCommentDetails(res){
				uni.navigateTo({
				     url: "/pages/comment/details?commentId="+res.id
				});
			},
			linktoComment(){
				uni.navigateTo({
				     url: "/pages/comment/index?resourceId="+this.courseObj.id+"&resourceType="+this.courseObj.resourceType
				});
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
	background-color: #eee;
	height: 480rpx;
}
.course_cover{
	width: 100%;
	height: 480rpx;
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
				word-wrap: break-word;
				word-break: break-all;
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
.catalog_wrap{
	.catalog_block{
		padding: 40rpx 0;
		border-bottom: 2rpx solid #E6EAF2;
	}
		
	.catalog_block:last-child{
		border-bottom: 0rpx solid #E6EAF2;
	}
	.catelog_left{
		.top{
			// color: #25B4B5;
			color:#222222;
			font-size: 30rpx;
			font-weight: bold;
			margin-bottom: 30rpx;
			&.lock{
				color: #878C97;
			}
		}
		.study_num{
			margin-left: 34rpx;
			margin-right: 34rpx;
		}
		.complete_text{
			color:#F5861A
		}	
		.number_txt{
			margin-right: 50rpx;
		}
		.bottom{
			color: #9C9D9C;
			font-size: 24rpx;
			
		}
	}
	.audition{
		color: #25B4B5;
	}
	.kf_course_playbtn,.kf_course_ztbtn{
		margin-bottom: 20rpx;
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
	.audition_btn_jg{
		height: 102rpx;
		flex: 1;
		flex-shrink: 0;
		color: #333333;
		background-color: #fff;
		.kf_audition_icon{
			margin-right: 10rpx;
		}
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
}

</style>
