<template>
<view class="outer_wrap">
	<!-- 头部导航 -->
	<kfNav title="评论详情"/>
	<view class="comment_wrap">
		<view class="comment_content"  :class="{ active: this.$store.state.user.level!=2 }">
			<view class="comment_list_wrap">
				<view class="comment">
					<view class="left">
						<image v-if="commentObj.userImg" :src="`${$filePath}?fileName=${commentObj.userImg}`" mode="aspectFill"></image>
						<image v-else src="../../static/image/me/header_pic.png" mode="aspectFill"></image>
					</view>
					<view class="right">
						<view class="top">
							<view class="name">{{ commentObj.userName }}</view>
							<view><u-rate active-color="#FABA40" inactive-color="#DEDEDE" :count="5" :current="commentObj.score" disabled></u-rate></view>
						</view>
						<view class="content">{{ commentObj.content }}</view>
						<view class="bottom">
							<view>{{commentObj.releaseTime}}</view>
							<view class="bot_right flex-center">
								<view class="com_btn flex-center">
									<image class="kf_commreplay_icon" src="../../static/image/icon/icon_xinxi@2x.png"></image>
									<text v-if="commentObj.replyNum">{{commentObj.replyNum||formatterReplyNum}}</text>
								</view>
								<view class="zan_btn flex-center">
									<image class="kf_comzan_icon" src="../../static/image/icon/icon_zan_nor@2x.png" v-if="commentObj.isAgree==0" @click.stop="agreeClick(commentObj)"></image>
									<image class="kf_comzan_icon" src="../../static/image/icon/icon_zan_sel@2x.png" v-if="commentObj.isAgree==1" @click.stop="agreeClick(commentObj)"></image>
									<text>{{commentObj.fabulousNum}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="sub_comment">
					<view class="comment" v-for="(res, index) in commentObj.replyVoList" :key="res.id">
						<view class="left">
							<image v-if="res.userImg" :src="`${$filePath}?fileName=${res.userImg}`" mode="aspectFill"></image>
							<image v-else src="../../static/image/me/header_pic.png" mode="aspectFill"></image>
						</view>
						<view class="right">
							<view class="top">
								<view class="name">{{ res.userName }}</view>
								<view class="name"><text class="reply_txt">回复</text>{{ res.fatherName }}</view>
							</view>
							<view class="content">{{ res.content }}</view>
							<view class="bottom">
								<view>{{res.releaseTime}}</view>
								<view class="bot_right" @click="commentShow(res)" v-if="$store.state.user.level!=2">
									<image class="kf_commreplay_icon" src="../../static/image/icon/icon_xinxi@2x.png" mode=""></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="comment_fixed_bottom" v-if="this.$store.state.user.level!=2">
			<view class="comment_input" type="text" @click="commentShow()"></view>
		</view>
		<u-popup v-model="replyShow" mode="bottom" @close="closeReply">
			<view class="reply_wrap">
				 <view class="textarea_wrap">
					 <textarea class="reply_textarea" v-model="replyValue" :placeholder="replyPlace" maxlength='300'/>
					 <text class="all_num">{{replyValue.length}}/300</text>
				 </view>
				 <view class="sure_wrap flex-between">
					 <view class="rate_wrap"></view>
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
				replayLevel:1,
				replyPlace:'留下你的想法...',
				replyName:"",
				commentId:'',
				commentObj:{},
				agreeObj:{
					"commentId": '',
					"type": ''
				},
				replayLevelObj:{},
				commentList : [
					{
						id: 1,
						name: '叶轻眉1',
						date: '01-25 13:58',
						contentText: '我不信伊朗会没有后续反应，我不信伊朗会没有后续反应我不信伊朗会没有后续反应美国肯定会为今天的事情付出代价的',
						allReply: 0,
						likeNum: 11,
						isLike: false,
						url: 'https://cdn.uviewui.com/uview/template/niannian.jpg',
					},
				]
				
			}
		},
		onLoad(option) {
			this.commentId=option.commentId;
		},
		onShow: function() {
			this.getDetails();
		},
		onHide: function() {
			
		},
		methods: {
			getDetails(){
				this.$u.get("/sysuser/fg/comment/get/"+this.commentId,{
				}).then(res => {	
					if(res.data){
						this.commentObj=res.data;
						this.replyName=this.commentObj.userName;
					}	
				})
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
			closeReply(){
				this.rateCount=0;
				this.replyValue=""
			},
			sendComment(){
				if(this.disabledFleg){
					return;
				}
				let dataP={
					"fatherId": this.commentObj.id,
					"mainId": this.commentObj.id,
					"fatherName":this.commentObj.userName,
					"resourceName": this.commentObj.resourceName,
					"content": this.replyValue,
					"resourceId": this.commentObj.resourceId,
					"resourceType": this.commentObj.resourceType,
					"score":0
				}
				if(this.replayLevel==2){
					dataP.fatherId=this.replayLevelObj.id;
					dataP.fatherName=this.replayLevelObj.userName;
				}
				if(this.replyValue.trim().length>0){
					this.disabledFleg=true;
					this.$u.post('/sysuser/fg/comment/save',{
						...dataP
					}).then(res => {
						this.replyValue='';
						if(res.code==0){
							this.$u.toast('评论成功');
							this.getDetails();
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
			commentShow(res){
				if(this.$store.state.hasLogin){
					// this.replyName=this.commentObj.userName;
					this.replyPlace="留下你的想法..."
					this.replayLevel=1;
					if(res&&res.userName){
						this.replyName=res.userName;
						this.replayLevel=2;
						this.replayLevelObj=res;
						this.replyPlace="回复"+this.replyName;
					}
					// this.replyPlace="回复"+this.replyName;
					this.replyShow=true
				}else{
					uni.navigateTo({
					     url: "/pages/login/index"
					});
				}
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
	overflow-y: scroll;
}
.sub_comment{
	padding-left: 60rpx;
}
.comment_content{
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	// padding-top: 30rpx;
	padding-bottom: 1rpx;
	&.active{
		padding-bottom: 102rpx;
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
	flex: 1;
	position: relative;
	.comment_list_wrap{
		height: 100%;
		width: 100%;
		padding-left: 30rpx;
		padding-right: 30rpx;
		overflow-y: scroll;	
	}
	.comment {
		display: flex;
		padding: 30rpx;
		border-bottom: 2rpx solid #EEEEEE;
		.reply_txt{
			color: #F48D0D;
			font-size: 30rpx;
			font-weight: bold;
			padding-left: 6rpx;
			padding-right: 6rpx;
		}
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
	.comment_input{
		width: 100%;
		height: 58rpx;
		border-radius: 58rpx;
		background-color: #F1F1F3;
	}
}
</style>
