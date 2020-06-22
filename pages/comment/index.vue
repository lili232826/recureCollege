<template>
<view class="outer_wrap">
	<!-- 头部导航 -->
	<kfNav title="全部评论"/>
	<view class="comment_wrap">
		<view class="comment_content">
			<scroll-view scroll-y="true" style="width: 100%;height: 100%;"  @scrolltolower="tolowerBottom">
				<view class="page-box"  :class="{ active: this.$store.state.user.level!=2 }">
					<view class="comment" v-for="(res, index) in commentList" :key="res.id" @click="linktoDetails(res)">
						<view class="left">
							<image v-if="res.userImg" :src="`${$filePath}?fileName=${res.userImg}`" mode="aspectFill"></image>
							<image v-else src="../../static/image/me/header_pic.png" mode="aspectFill"></image>
						</view>
						<view class="right">
							<view class="top">
								<view class="name">{{ res.userName }}</view>
								<view><u-rate disabled active-color="#FABA40" inactive-color="#DEDEDE" :count="5" :current="res.score" ></u-rate></view>
							</view>
							<view class="content">{{ res.content }}</view>
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
					<u-loadmore v-if="commentList&&commentList.length>0" :status="status" :load-text="loadText" color="#D5D7E0" margin-top="40" margin-bottom='40'/>
				</view>
			</scroll-view>
		</view>
		<view class="comment_fixed_bottom" v-if="this.$store.state.user.level!=2">
			<view class="comment_input" type="text" @click="commentShow"></view>
		</view>
		<u-popup v-model="replyShow" mode="bottom" @close="closeReply">
			<view class="reply_wrap">
				 <view class="textarea_wrap">
					 <textarea class="reply_textarea" v-model="replyValue" :placeholder="replyPlace" maxlength='300'/>
					 <text class="all_num">{{replyValue.length}}/300</text>
				 </view>
				 <view class="sure_wrap flex-between">
					 <view class="rate_wrap">评星:<u-rate active-color="#FABA40" inactive-color="#DEDEDE" gutter="20" :count="5" :current="rateCount"></u-rate></view>
					 <button  class="kf_sure_btn" @click="sendComment" :disabled="disabledFleg">发送</button >
				 </view>
			</view>
		</u-popup>
	</view>
</view>
</template>

<script>
	import kfNav from '@/components/kf-nav/kf-nav.vue';
	export default {	
		components: {kfNav },
		data() {
			return {
				replyShow:false,
				disabledFleg:false,
				replyValue:'',
				replyPlace:'留下你的想法...',
				rateCount:5,
				courseObj:{
					resourceId: "",
					resourceType: "",
					pageNum:1,
					pageSize:50
				},
				agreeObj:{
					"commentId": '',
					"type": ''
				},
				commentList : [],
				pageCount:1,
				status: 'nomore',
				loadText: {
					loading: '正在加载中...',
					nomore: ' 这是我的底线 '
				}
				
			}
		},
		onLoad(option) {
			this.courseObj.resourceId=option.resourceId;
			this.courseObj.resourceType=option.resourceType;
			this.getCommentList();
			
		},
		onShow: function() {
			console.log(this.$store.state.user.level,'this.oid')
		},
		onHide: function() {
			
		},
		methods: {
			getCommentList(){
				this.$u.get('/sysuser/fg/comment/page',{
					...this.courseObj
				}).then(res => {	
					if(res.data){
						this.commentList=res.data.list||[];
						this.pageCount=res.data.pages||1;
						this.courseObj.name=this.commentList[0]? this.commentList[0]['resourceName'] : "";
						
					}	
				})
			},
			getMoreList(){
				this.$u.get('/sysuser/fg/comment/page',{
					...this.courseObj
				}).then(res => {	
					if(res.data){
						this.commentList=this.commentList.concat(res.data.list);
						this.pageCount=res.data.pages;
						// console.log(res.data,8888)
					}	
				})
			},
			tolowerBottom(){
				if(this.courseObj.pageNum<this.pageCount){
					this.courseObj.pageNum++;
					this.getMoreList();
					this.status="loading"
				}else{
					this.status="nomore"
				}
			},
			commentShow(){
				if(this.$store.state.hasLogin){
					this.replyShow=true
				}else{
					uni.navigateTo({
					     url: "/pages/login/index"
					});
				}
				
			},
			closeReply(){
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
						"resourceName": this.courseObj.name,
						"content": this.replyValue,
						"resourceId": this.courseObj.resourceId,
						"resourceType": this.courseObj.resourceType,
						"score": this.rateCount
					}).then(res => {
						this.replyValue='';
						if(res.code==0){
							this.$u.toast('评论成功');
							this.courseObj.pageNum=1;
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
				
			},
			giveAgree(){
				this.$u.post('/sysuser/fg/comment/agree',{
					...this.agreeObj
				}).then(res => {
					
				})
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
			rateChange(value){
				this.rateCount=value;
			},
			linktoDetails(res){
				uni.navigateTo({
				     url: "/pages/comment/details?commentId="+res.id,
				});
			},
			goBack(){
				uni.navigateBack() 
			},
		}
	}
</script>

<style scoped lang="scss">
	
.outer_wrap{
	display: flex;
	flex-direction: column;
	height: calc(100vh - var(--window-top));
	width: 100%;
	// position: relative;
}
// .comment-nav-wrap{	
// 	height: 44px;
// 	// flex-shrink: 0;
// }
.comment_content{
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	.page-box{
		padding-left: 30rpx;
		// padding-top: 30rpx;
		padding-right: 30rpx;
		padding-bottom: 1rpx;
		&.active{
			padding-bottom: 102rpx;;
		}
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
.comment_wrap{
	flex:1;//0 1 auto
	position: relative;
	// height: calc(100% - 44px);
	
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
				margin-bottom: 28rpx;
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
				// margin-bottom: 20rpx;
			}
				
			.com_btn{
				margin-right: 40rpx;
			}
		}
	}
}

.comment_fixed_bottom{
	height: 102rpx;
	position: absolute;
	bottom: 0;
	width: 100%;
	padding: 22rpx 30rpx;
	display: flex;
	box-shadow: 0 0 10rpx 5rpx #E9E9E9;
	font-size: 30rpx;
	background-color: #fff;
	z-index: 2;
	.comment_input{
		width: 100%;
		height: 58rpx;
		border-radius: 58rpx;
		background-color: #F1F1F3;
	}
}
</style>
