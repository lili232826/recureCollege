<template>
	<view class="index_wrap">
		<view class="nav_wrap">
			<u-navbar :is-back="false">
				<view class="nav-slot-wrap">
					<view class="index_nav">
						<image class="search_icon"  src="../../static/image/icon/icon_search@2x.png" @click="linkToSearch"></image>
						<text class="title">康复学院</text>
						<image class="menu_icon"  src="../../static/image/icon/icon_quanbu@2x.png" @click="linkToclass"></image>
					</view>
				</view>
			</u-navbar>
		</view>
		<view class="play_wrap">
			<u-swiper :list="list" :effect3d="true" height="350" name="picture" @click="linkPlay"></u-swiper>
		</view>
		<view class="mode_wrap">
			<view v-for="(list,index) in modeList" class="mode_block" :key="index" @click="modeLink(list)">
				<image  class="icon"  :src="list.image"></image>
				<text class="name">{{list.title}}</text>
			</view>
		</view>
		<kfTitle class="kf_title" title="直播课程" url='/pages/course/list?type=7'/>
		<view class="broad_wrap">
			<view class="broad_block" @click="linkToLive">
				<view class="img_outer">
					<image class="img" :src="`${$filePath}?fileName=${couserObj.img}`"></image>
					<view class="course_status liveing" v-if="couserObj.liveStatus==1">直播中</view>
					<view class="course_status livewill" v-if="couserObj.liveStatus==2">预告</view>
				</view>
				<view class="content">
					<view class="cont u-line-2">{{couserObj.name}}</view>
					<view class="bar_bottom" >
						<view class="left_bar">
							<image v-if="couserObj.authorImg" class="user_pic" :src="`${$filePath}?fileName=${couserObj.authorImg}`"></image>
							<image v-if="!couserObj.authorImg" class="user_pic" src="../../static/image/me/header_pic.png"></image>
							<text class="user_name">{{couserObj.author}}</text>
						</view>
						<view class="time">{{couserObj.formatLiveTime}} {{couserObj.formatTime}}</view>
					</view>
				</view>
			</view>
		</view>
		<kfTitle class="kf_title" title="新课上架" url='/pages/course/list'/>
		<view class="newc_wrap">
			<kfNewcourselist class="list" v-for="(item,index) in bookList" :key="index" :list="item" @linkTo="linktoDetails(item)" />
		</view>
		<view class="line"></view>
		<view class="course_tab">
			<view class="title_name">精选课程</view>
			<view>
				<text class="tab_name" :class="activeIndex==index ? 'active' : ''" 
				v-for="(list,index) in courseBar" :key="index" 
				@click="courseChange(list,index)">{{list.showName}}</text>
			</view>
			<!-- <view class="left_wrap">
				<u-tabs :list="courseBar" 
				:is-scroll="true" font-size="32"
				font-size-ctive='40'
				inactive-color="#555555"
				active-color="#222"
				bar-height='0'
				:active-item-style="{fontSize:'40rpx'}"
				:current="activeIndex"
				 @change="courseChange"></u-tabs>
			</view> -->
			<view class="right_block" @click="linkToChange"><text>更多</text><u-icon name="arrow-right" color="#606773" size="24"></u-icon></view>
		</view>
		<view class="course_wrap">
			<kfCourselist class="list" v-for="(item,index) in selectCourseList" :key="index" :list="item" @linkTo="linktoDetails(item)"/>
		</view>
		<view class="line"></view>
		<view class="recbook_wrap">
			<kfTitle class="kf_title" title="推荐图书" url='/pages/list/index'/>
			<view class="recbook_list">
				<scroll-view scroll-x="true" class="scroll_recbook">
					<view class="recbook_block">
						<image class="cover" src="../../static/pic_banner@2x.png"></image>
						<view class="content">
							<view class="title">孤独症谱系...</view>
							<view class="price">9.50</view>
						</view>
					</view>
					<view class="recbook_block">
						<image class="cover" src="../../static/pic_banner@2x.png"></image>
						<view class="content">
							<view class="title">孤独症谱系...</view>
							<view class="price">9.50</view>
						</view>
					</view>
					<view class="recbook_block">
						<image class="cover" src="../../static/pic_banner@2x.png"></image>
						<view class="content">
							<view class="title">孤独症谱系...</view>
							<view class="price">9.50</view>
						</view>
					</view>
					<view class="recbook_block">
						<image class="cover" src="../../static/pic_banner@2x.png"></image>
						<view class="content">
							<view class="title">孤独症谱系...</view>
							<view class="price">9.50</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="line"></view>
		<view class="expert_wrap">
			<kfTitle class="kf_title" title="专家团队" url='/pages/list/index'/>
			<view class="scroll_expert">
				<scroll-view scroll-x="true" class="scroll_wrap">
					<view class="flex scroll_inner">
						<view class="expert_block">
							<image class="expert_pic" src="../../static/pic_10@2x.png"></image>
							<view class="content">
								<view class="name ellipsis-1">孤独症谱系...</view>
								<view class="tag_wrap">
									<image class="user_icon" src="../../static/image/icon/icon_renwu@2x.png" ></image>
									<text class="user_tag">康复治疗师</text>
									<image class="house_icon" src="../../static/image/icon/icon_jigou@2x.png" ></image>
									<text class="house_name">机构名称</text>
								</view>
								<view class="good ellipsis-1">擅长领域：擅长幼儿残疾预防与治疗</view>
								<view class="look_num">1246<view class="dot"></view>关注</view>
							</view>
						</view>
						<view class="expert_block">
							<image class="expert_pic" src="../../static/pic_10@2x.png"></image>
							<view class="content">
								<view class="name ellipsis-1">孤独症谱系...</view>
								<view class="tag_wrap">
									<image class="user_icon" src="../../static/image/icon/icon_renwu@2x.png" ></image>
									<text class="user_tag">康复治疗师</text>
									<image class="house_icon" src="../../static/image/icon/icon_jigou@2x.png" ></image>
									<text class="house_name">机构名称</text>
								</view>
								<view class="good ellipsis-1">擅长领域：擅长幼儿残疾预防与治疗</view>
								<view class="look_num">1246<view class="dot"></view>关注</view>
							</view>
						</view>
						<view class="expert_block">
							<image class="expert_pic" src="../../static/pic_10@2x.png"></image>
							<view class="content">
								<view class="name ellipsis-1">孤独症谱系...</view>
								<view class="tag_wrap">
									<image class="user_icon" src="../../static/image/icon/icon_renwu@2x.png" ></image>
									<text class="user_tag">康复治疗师</text>
									<image class="house_icon" src="../../static/image/icon/icon_jigou@2x.png" ></image>
									<text class="house_name">机构名称</text>
								</view>
								<view class="good ellipsis-1">擅长领域：擅长幼儿残疾预防与治疗</view>
								<view class="look_num">1246<view class="dot"></view>关注</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="index_bottom" @click="linkTo">
			—— 这是我的底线 ——
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import kfTitle from '@/components/kf-title/kf-title.vue';
	import kfNewcourselist from '@/components/kf-courselist/kf-newcourselist.vue';
	import kfCourselist from '@/components/kf-courselist/kf-courselist.vue';
	export default {
		components: { kfTitle,kfNewcourselist,kfCourselist },
		computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
		data() {
			return {
				background:{
					backgroundColor: '#001f3f',
				},
				playPrames:{
					signValue:"sylbt",
					num:8
				},
				coursePrames:{
					code:"PC_home01",
					pageNum:1,
					pageSize:1
				},
				liveCoursePrames:{
					code:"PC_home01",
					pageNum:1,
					pageSize:1
				},
				bookPrames:{
					code:"PC_home02",
					pageNum:1,
					pageSize:4
				},
				selectCoursePrames:{
					diyTypeCode:"",
					pageNum:1,
					pageSize:4
				},
				list: [],
				couserObj:{},
				liveCouserObj:{},
				modeList:[{
						image: '../../static/image/icon/icon_kecheng@2x.png',
						title: '课程',
						resourceType:6
					},
					{
						image: '../../static/image/icon/icon_zhibo@2x.png',
						title: '直播',
						resourceType:7
					},
					{
						image: '../../static/image/icon/icon_tushu@2x.png',
						title: '图书',
						resourceType:9
					},
					{
						image: '../../static/image/icon/icon_wenxian@2x.png',
						title: '文献',
						resourceType:2
					}
				],
				bookList:[
					{
						image: '../../static/pic_banner@2x.png',
						title: '直播',
						brief:'系统介绍康复评定学概念'
					},
					{
						image: '../../static/pic_banner@2x.png',
						title: '图书',
						brief:'系统介绍康复评定学概念'
					},
					{
						image: '../../static/pic_banner@2x.png',
						title: '文献',
						brief:'系统介绍康复评定学概念'
					}
				],
				courseList:[],
				selectCourseList:[],
				activeIndex:0,
				courseBar:[]
			}
		},
		onLoad() {
		},
		onShow: function() {
			this.getPlay();
			this.getCouser();
			this.getBook();
			this.getCouserBar();
		},
		onHide: function() {
			// console.log(' Hide')
		},
		onPullDownRefresh() {
		   setTimeout(() =>{
			   this.getPlay();
			   this.getCouser();
			   this.getBook();
			   this.getCouserBar();
			   uni.stopPullDownRefresh();
		   }, 1000);
	   },
		methods: {
			getPlay(){	
				this.$u.get('/sysuser/fg/adspace/signvalue',{		
					...this.playPrames
				}).then(res => {
					if(res.data&&res.data.length>0){
						let data=res.data;
						data.forEach((item,index)=>{
							data[index].picture=this.$filePath+"?fileName="+item.picture
						})
						this.list=data;
					}
				})
			},
			getCouser(){
				this.$u.get('/resource/fg/recommend/content/list?',{
					...this.coursePrames
				}).then(res => {
					// console.log(res.data,res.data.recommendResourcePage,'res.data.recommendResourcePage.list')
					if(res.data.recommendResourcePage.list){
						this.couserObj=res.data.recommendResourcePage.list[0]||{};
						
					}	
				})
			},
			getBook(){
				this.$u.get('/resource/fg/recommend/content/list?',{
					...this.bookPrames
				}).then(res => {	
					if(res.data.recommendResourcePage.list){
						this.bookList=res.data.recommendResourcePage.list||[];
					}	
				})
			},
			getCouserBar(){
				this.$u.get('/resource/fg/diytype/name/list?',{
					name:'课程分类',
					num:'3'
				}).then(res => {	
					if(res.data&&res.data.length>0){
						 // res.data.map(item => {
							// item['name'] = item['showName'];
						 // })
						this.courseBar=res.data;
						this.selectCoursePrames.diyTypeCode=this.courseBar[this.activeIndex].code;
						this.getSelectedCouser();
					}	
				})
			},
			 
			courseChange(item,index){
				this.activeIndex=index;
				this.selectCoursePrames.diyTypeCode=item.code
				// this.selectCoursePrames.diyTypeCode=this.courseBar[index].code;
				this.getSelectedCouser();
			},
			getSelectedCouser(){
				this.$u.get('resource/fg/recommend/featured/list?',{
					...this.selectCoursePrames
				}).then(res => {	
					if(res.data){
						this.selectCourseList=res.data.list||[]
						// console.log('44')
					}	
				})
			},
			linktoDetails(item){
				if(item.resourceType==6){//课程
					uni.navigateTo({
						url: "/pages/course/index?oid="+item.id
					});
				}else if(item.resourceType==5){//单个视频
					uni.navigateTo({
						url: "/pages/video/index?oid="+item.id
					});
				}
			},
			linkPlay(index){
				let url=this.list[index].url;
				 // 跳转到内部窗口并且传递链接
				uni.navigateTo({
					url: `/pages/webview/webview?url=${url}`
				})
			},
			linkToChange(){
				uni.navigateTo({
					url: `/pages/course/list`
				})
			},
			modeLink(item){
				let name=item.title;
				let resourceType=item.resourceType;
				if(name=='课程'||name=="直播"){
					uni.navigateTo({
						url: "/pages/course/list?type="+resourceType
					});
				}
			},
			linkToLive(){
				uni.navigateTo({
				    url: "/pages/liveCourse/index?oid="+this.couserObj.id
				});
			},
			linkToclass(){
				uni.navigateTo({
				    url: "/pages/course/class"
				});
			},
			linkToSearch(){
				uni.navigateTo({
				     url: "/pages/search/index",
					
				});
			},
			linkTo(){
				uni.navigateTo({
				     url: "/pages/list/index",	
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.nav_wrap{
		margin-bottom: 20rpx;
		.title{
			font-size:36rpx;
			font-weight:bold;
			color:#333;
		}
	}	
	.title_name{
		font-size: 40upx;
		color: #222222;
		font-weight: bold;
	}
	.play_wrap{
		margin-bottom: 58rpx;		
	}
	.kf_title{
		margin-bottom: 38rpx;
	}
	.mode_wrap{
		display: flex;
		justify-content: center;
		margin-bottom: 66rpx;
	}
	.mode_block{
		text-align: center;
		color: #222222;
		font-size: 24rpx;
		.icon{
			width: 108rpx;
			height: 108rpx;
			margin: 0 36rpx;
			margin-bottom: 8rpx;
		}
	}
	.broad_wrap{
		padding: 0 30rpx;
		margin-bottom:56rpx;
	}
	.broad_block{
		border-radius: 6rpx;
		overflow: hidden;
		box-shadow: 0 0 10rpx 5rpx #E9E9E9;
		.img_outer{
			background-color: #F8F8F8;
			width: 100%;
			height: 300rpx;
			position: relative;
		}
		.course_status{
			position: absolute;
			top: 20rpx;
			left: 20rpx;
			width: 82rpx;
			height: 36rpx;
			text-align: center;
			line-height: 36rpx;
			font-size: 20rpx;
			color: #fff;
			border-radius:4px;
			&.liveing{
				background-color: #06B5A2;
			}
			&.livewill{
				background-color: #F46542;
			}
		}
		.content{
			padding:31rpx 24rpx;
		}
		.img{
			width: 100%;
			height: 300rpx;
		}	
		.cont{
			color:#222222;
			font-size:32rpx;
			line-height: 44rpx;
			font-weight: bold;
			margin-bottom: 26rpx;
		}
		.user_pic{
			width: 61rpx;
			height: 61rpx;
			border-radius: 61rpx;
			margin-right:18rpx
		}	
		.user_name{
			color:#25B4B5;
			font-size: 28rpx;
			
		}	
		.time{
			color:#878B94;
			font-size: 28rpx;
		}
		.left_bar{
			display: flex;
			align-items: center;
		}
		.bar_bottom{
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
	.newc_wrap,.course_wrap{
		padding: 0 30rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		.list{
			margin-bottom: 48rpx;
		}
	}
	.course_tab{
		padding: 60rpx 30upx 60rpx 31rpx ;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.left_wrap{
			width: 612rpx;
		}
		.right_block{
			width: 76rpx;
			flex-shrink: 0;
		}
		.tab_name{
			color: #555555;
			font-size: 32rpx;
			margin-right: 20rpx;
			cursor: pointer;
		}
			
		.tab_name.active{
			color: #222222;
			font-weight:bold
		}
		.right_block{
			font-size:26upx;
			color:#606773;
			cursor: pointer;
		}
	}
		
	.recbook_wrap{
		padding-top:56rpx;
		padding-bottom:56rpx
	}
		
	.scroll_recbook{
		white-space: nowrap; // 滚动必须加的属性
	}
	.recbook_block{
		width: 164rpx;
		height: 232rpx;
		display: inline-block;
		margin-left: 60rpx;
		.title{
			color:#000000;
			font-size:30rpx;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
		}	
		.price{
			color: #FE2023;
			font-size: 28rpx;
			font-weight: bold;
		}
		.cover{
			width: 164rpx;
			height: 232rpx;
		}
	}
	.expert_wrap{
		padding-top:56rpx;
	}	
	.scroll_expert{
		padding-left: 30rpx;
	}
	.scroll_inner{
		width: 1360rpx;
		display: flex;
		flex-wrap: wrap;
	}
	.expert_block{
		display: flex;
		width: 632rpx;
		border-bottom: 2rpx solid #EEEEEE;
		padding: 30rpx 0rpx;
		margin-right: 48rpx;
		.content{
			flex:1
		}
		.user_icon{
			width: 20rpx;
			height: 23rpx;
			margin-right: 10rpx;
		}	
		.house_icon{
			width: 20rpx;
			height: 24rpx;
			margin-right: 10rpx;
		}
		.expert_pic{
			width: 164rpx;
			height: 232rpx;
			flex-shrink: 0;
			margin-right: 29rpx;
		}
			
		.name{
			font-size:32rpx;
			color:#222222;
			font-weight: bold;
			padding-top: 12rpx;
			margin-bottom: 24rpx;
		}
		.user_tag{
			margin-right: 30rpx;
			margin-bottom: 24rpx;
		}	
		.good{
			color: #878B94;
			font-size: 26rpx;
			margin-bottom: 24rpx;
		}
		.look_num{
			color: #25B4B5;
			font-size: 24rpx;
			display: flex;
			align-items: center;
		}	
		.dot{
			display: inline-block;
			width: 6rpx;
			height: 6rpx;
			background-color: #5AC5C6;
			border-radius: 50%;
			margin-left:9rpx;
			margin-right: 7rpx;
		}
		.tag_wrap{
			color:#BDC1CB;
			font-size:24rpx;
			margin-bottom: 20rpx;
		}
		
	}
	.index_bottom{
		height: 108rpx;
		line-height: 108rpx;
		text-align: center;
		color: #D5D7E0;
		font-size: 24rpx;
	}
</style>
