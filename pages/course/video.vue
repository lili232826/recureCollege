<template>
	<view class="video_wrap">
		<!-- 头部 -->
		<u-navbar :is-back="false" :border-bottom="false" :background="{ background: '#F8F8F8' }">
			<view class="video-nav-wrap">
				<view class="index_nav">
					<view class="nav-left">
						<image class="nav_back_icon arrow-left" src="../../static/image/icon/icon_fanhui.png" alt=""  @click="goBack">
						<!-- <u-icon name="arrow-left" color="#666666" @click="goBack" size="34"></u-icon> -->
					</view>
					<view class="title"><view class="name_txt  u-line-1">{{videoObj.name}}</view></view>
					<view class="nav_right">
						<!-- <image class="kf_collect_icon" src="../../static/image/icon/icon_schang@2x.png" mode="" v-if="videoObj.isCollection==0" @click="collectClick"></image>
						<image class="kf_collect_icon" src="../../static/image/icon/icon_shoucang_nor@2x.png" mode="" v-if="videoObj.isCollection==1" @click="collectClick"></image>
						<image class="kf_share_icon" src="../../static/image/icon/icon_share@2x.png" mode="" @click="shareClick"></image> -->
					</view>
				</view>
			</view>
		</u-navbar>
		<view class="video_content">
			<view class="play_wrap">
				<video class="kf_video"
					id="kfVideo"
				 :src="`${$websiteUrl}/file/${videoSrc}`"
				 :poster="posterSrc"
				 controls
				 autoplay
				 @play="playHandle"
				 @pause="pauseHandle"
				 @ended="endedHandle"
				 @timeupdate="updateHandle"
				></video>
			
			</view>
			<view class="content_wrap">
				<view class="title u-line-2">{{videoObj.name}}</view>
				<view class="cont_bottom">
					<!-- <view class="price_left">
						<view v-if="videoObj.realPrice==0" class="free_price">免费</view>
						<view class="price" v-if="videoObj.realPrice>0">￥<text class="big_price" >{{videoObj.realPrice.substring(0,videoObj.realPrice.indexOf("."))}}</text>.{{videoObj.realPrice.substring(videoObj.realPrice.length-2)}}</view>
						<view class="discount_price" v-if="videoObj.price">￥{{videoObj.price}}</view>
					</view> -->
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
					<view class="title">文本内容</view>
					<view class="text">
						<text v-if="videoObj.text" v-html="videoObj.text"></text>
						<view v-else class="data_no_wrap flex-vertical" >
							<image class="kf_nodata_pic" src="../../static/image/defaultpic/no_chart.png" mode=""></image>
							<text class="no_text">暂无文本内容~</text>
						</view>
					</view>
				</view>
				<view class="page_content" v-if="current==1">
					<view style="height: 80rpx;" v-if="catalogList&&catalogList.length>0">
						<view class="course_sort_btn flex-centerH" @click="sortClick">
							{{sortText}}
							<image class="course_sort_icon" src="../../static/image/icon/paixu@2x.png" mode=""></image>
						</view>
					</view>
					<view class="catalog_wrap" v-if="catalogList&&catalogList.length>0">
						<view class="catalog_block flex-between" v-for="(list,index) in catalogList" :key="index" @click="changeVideo(list)">
							<view class="catelog_left">
								<view class="top" :class="activeFormatter(list)">
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
									<text class="complete_text" v-if="list.id==vId">已播{{list.schedule}}%</text>
								</view>
							</view>
							<view>
								<!-- 有权限的 -->
								<view class="catelog_right flex-vertical" v-if="list.messageCode==null||list.messageCode=='null' ">
									<image v-if="list.id==vId" class="kf_course_playbtn" src="../../static/image/icon/zant_course_icon.png" mode=""></image>
									<image v-if="list.id!=vId" class="kf_course_playbtn" src="../../static/image/icon/play_course_icon.png" mode=""></image>
								</view>
								<!-- 没有权限的 -->
								<view class="catelog_right flex-vertical" v-if="list.messageCode!=null&&videoObj.courseMessageCode!=null">
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
				<view class="page_content" v-if="current==2">
					<view class="title">内容简介</view>
					<view class="text">
						<text>主要内容：在中风患者或某些一侧大脑损伤患者
						的康复中有一个很普遍的倾向，就是将注意力集中在那些能实际看得到的问题上。治疗师观察患者时会立即注意到其痉挛的上肢体位，手指不能活动或不能用手。
						她一眼就能看到患者步行时是否伴有膝过伸，足不
						能背屈抬离地面。而现在许多治疗观念把重点放在降低痉
						挛的一半瘫痪，就强调了运动问题。</text>
					</view>
				</view>
				
			</view>
		</view>
		<!-- <view class="fixed_bottom">
			<view class="audition_btn flex-centerH"><image class="kf_audition_icon" src="../../static/image/icon/shiting-ico@2x.png" mode=""></image>试听</view>
			<view class="pay_btn flex-centerH"><image class="kf_pay_icon" src="../../static/image/icon/zhifu-ico@2x.png" mode=""></image>立即支付</view>
			<view class="vip_btn flex-centerH">VIP会员畅听</view>
		</view> -->
	</view>
</template>

<script>
	export default {	
		data() {
			return {
				//http://img.cdn.qiniu.dcloud.net.cn/wap2appvsnative.mp4
				//http://49.4.26.127:8012/2020/04/13/9232ae7493554d78b621a3fb495373e8/index.m3u8
				//:class="{'lock':list.messageCode!=null&&videoObj.messageCode!=null}"\
				
				current: 1,
				tabList: [
					{
						name: '文本'
					},
					{
						name: '目录(0)'
					}
				],
				sortText:"正序",
				catalogList:[],
				kfVideo:null,
				vId:'',
				playList:[],
				videoSrc:'',
				posterSrc:'',//../../static/image/defaultpic/course_video.png
				currentTime:0,
				videoObj:{},
				catalogParmes:{
					id:"",
					resourceType:'',
					orderBy:'sort asc'
				}
			}
		},
		onLoad(options){
			this.vId=options.vId;
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
		onUnload(){//页面卸载时
			uni.setStorage({
				key: 'playObj',
				data: JSON.stringify({'currentTime':this.currentTime,'videoId':this.videoObj.id})
			});
			this.sendTime();//离开时发送观看记录
			this.sendTimeRate()//观看进度
		},
		computed: {
			activeFormatter(){
			  return function (list) {
				  //list.messageCode!=null&&videoObj.messageCode!=null
				 let activeName="";	 
				 if(list.messageCode!=null&&this.videoObj.courseMessageCode!=null){
					 activeName="lock"
				 }				 
				 if(list.id==this.vId){
					activeName="active"
				 }
				 return activeName;
			  }
			}
		},
		methods: {
			getDetail(){
				this.$u.get('/resource/fg/video-library/get/'+this.vId,{
				}).then(res => {	
					if(res.data){
						this.videoObj=res.data;
						this.posterSrc=this.videoObj.img? this.$filePath+'?fileName='+this.videoObj.img : '../../static/image/defaultpic/course_video.png';
						this.catalogParmes.id=this.videoObj.id;
						this.catalogParmes.resourceType=this.videoObj.resourceType
						this.getFilePath();
						this.getCatalog();
						this.videoObj.text=this.videoObj.text.replace("img",'img style="width:100%;height:auto" ')||'';
						setTimeout(()=>{
							// this.kfVideo.seek(100);
							this.kfVideo.play();
						},300)
					}	
				})
			},
			getFilePath(){
				///file/file/getFilePath
				///file/file/get/video/m3u8
				//https://jx.7639616.com/?url=https://cn7.kankia.com/hls/20200101/5c361debcd70cbd3cd118bc9d24186a4/1577874894/index.m3u8
				this.$u.get('/file/file/get/video/m3u8?fileName='+this.videoObj.video,{
				}).then(res => {	
					if(res.data){
						this.videoSrc=res.data;
					}	
				})
			},
			getCatalog(){
				this.$u.get('/resource/fg/course-library/get/directory',{
					...this.catalogParmes
				}).then(res => {	
					if(res.data){
						this.catalogList=res.data||[];
						this.playList = this.catalogList.filter((item)=>{//过滤有权限的视频
							return item.messageCode==null||item.messageCode=='null'
						})
						this.tabList[1]['name']="目录("+this.catalogList.length+")"
					}	
				})
			},
			//视频的事件start
			playHandle(e){
				// console.log('playHandle')
			},
			pauseHandle(e){
				// console.log('pauseHandle')
			},
			endedHandle(){//播放结束时
			// console.log('endedHandle')
				this.sendTime();//离开时发送观看记录
				this.sendTimeRate()//观看进度
				let  currentVideoInd = this.playList.findIndex((item, index, arr) => {
				  return item.id == this.vId;
				})
				if(this.playList[currentVideoInd+1]){//续播下一个
					this.vId=this.playList[currentVideoInd+1]['id'];
					this.getDetail()
				}
			},
			updateHandle(e){
				this.currentTime = Number(e.detail.currentTime)*1000;
				// console.log(e.detail.currentTime,this.currentTime)
				
			},
			//视频事件end
			changeVideo(list){
				this.sendTime();//先把上一个视频储存
				this.sendTimeRate()//观看进度
				this.currentTime=0;
				if(this.vId==list.id){
					return;
				};
				if(list.messageCode==null||list.messageCode=='null'){
					this.vId=list.id;
					this.getDetail();
				}else{
					this.$u.toast('暂无权限观看');
				}
			},
			sendTime(){
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
			sendTimeRate(){
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
			// tab栏切换
			change(index) {
				this.current = index;
			},
			collectClick(){
				if(this.videoObj.isCollection==0){
					this.videoObj.isCollection=1;
					this.saveCollection()
				}else{
					this.videoObj.isCollection=0;
					this.delCollection()
				}
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
				this.kfVideo.pause();
				// this.sendTime();//离开时发送观看记录
				// this.sendTimeRate()//观看进度
				uni.navigateBack();
				
				// uni.navigateTo({
				// 	 url: "/pages/course/index?vId=e89a2db0910f11ea99ba0050569033dc"
				// });
			}
		}
	}
</script>

<style scoped lang="scss">
	.video_wrap{
		// padding-bottom: 102rpx;
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
			margin-right: 16rpx;
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
			padding-bottom: 30rpx;
			// margin-bottom: 95rpx;		
			// image{
			// 	max-width: 100%;
			// }
			// img{
			// 	width: 100px;
			// }
			
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
				&.active{
					color: #25B4B5;
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
}
</style>
