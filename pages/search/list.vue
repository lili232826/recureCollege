<template>
	<view class="search_res_wrap">
		<view class="search_top_wrap">
			<u-navbar :is-back="false" :border-bottom="false" :height="55" :background="{ background: 'transparent' }">
				<view class="search_top">
					<!-- <u-icon name="arrow-left" color="#fff" class="arrow-left" size="34"></u-icon> -->
					<image class="nav_back_icon arrow-left" src="../../static/image/icon/icon_fanhui_white.png" alt=""  @click="goBack">
					<u-search 
					v-model="keyword" 
					action-text="取消" 
					:action-style="{color:'#fff'}"  
					:maxlength="10"
					@custom='emptySearch'
					@search="searchClick"
					></u-search>
				</view>
			</u-navbar>
			<view class="u-tabs-box">
				<u-tabs-swiper 
				activeColor="#fff" 
				inactive-color="#D9F9FF"
				bg-color="transparent"
				ref="tabs" 
				:list="tabList" 
				:current="current" 
				@change="change" 
				:is-scroll="false" 
				swiperWidth="750"></u-tabs-swiper>
			</view>
		</view>
		<view class="sort_bar_wrap flex-centerH">
			<view class="bar_list" v-for="(list,index) in sortList" :key="index" :class="{'active': activeIndex==index}" @click="changeSort(list,index)">
				<view v-if="index<3"><text>{{list.name}}</text></view>
			</view>
			<view class="flex-centerH sort_bar_list" :class="{'active': sortFleg}" @click="clickSort">
				<text>筛选</text>
				<image  v-if="!sortFleg" class="sort_bar" src="../../static/image/icon/icon_shaixuan2.png" mode=""></image>
				<image v-else class="sort_bar" src="../../static/image/icon/icon_shaixuan@2x.png" mode=""></image>
			</view>
		</view>
		<swiper class="swiper-box" :current="swiperCurrent">
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height: 100%;width: 100%;"
				    @scroll="scroll"
					@scrolltolower="reachBottom" :scroll-top="scrollTopNum">
					<view class="page-box">
						<kfCourse :list="list" @linkTo="linktoDetails"/>
						<u-loadmore v-if="!noDataFleg" :status="status" :load-text="loadText" color="#D5D7E0" margin-top="40" margin-bottom='40'/>
						<view class="data_no_wrap flex-vertical" v-if="noDataFleg">
							<image class="kf_nodata_pic" src="../../static/image/defaultpic/no_chart.png" mode=""></image>
							<text class="no_text">暂无相关内容~</text>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<u-popup v-model="popupShow" mode="top"  @close="closePopup">
			<view class="popup_sortwrap">
				<view class="tag_title">分类</view>
				<scroll-view scroll-x="true" >
					<view class="tag_wrap">
						<view class="tag active">全部</view>
						<view class="tag" 
						:class="{'active': tagSelectList.indexOf(list.code)!=-1}" 
						v-for="(list,index) in tagList" :key="index" @click="chooseTag(list,index)">{{list.showName}}</view>
					</view>
				</scroll-view>
				<view class="tag_title">价格</view>
				<scroll-view scroll-x="true" >
					<view class="tag_wrap">
						<view class="tag" 
						:class="{'active': priceIndex==index}"
						v-for="(list,index) in priceList" 
						:key="index" @click="choosePriceTag(list,index)">{{list.name}}</view>
					</view>
				</scroll-view>
				<view class="btn_bottom">
					<view class="reset_btn" @click="reset">重置</view>
					<view class="sure_btn"  @click="searchSure">确定</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import kfCourse from '@/components/kf-courselist/kf-course.vue';
	import kfBook from '@/components/kf-booklist/kf-book.vue';
	import kfArticle from '@/components/kf-article/kf-article.vue';
	//1图书、2文献、3文章、4专家、5视频、6系列课、7直播、8文件、9图片、10音频 
	export default {
		components: {kfCourse,kfBook,kfArticle },
		data() {
			return {
				keyword:"",
				current: 0,
				swiperCurrent: 0,
				popupShow:false,
				tagSelectList:[],
				courseParmes:{
					resourceType:6,//课程
					pageNum:1,
					pageSize:50,
					priceOption:'',
					orderBy:'',
					content:"",
					diyTypeCode:[]
				},
				priceIndex:0,
				typeTab:"课程分类",
				tagList:[
					{showName:"全部",code:""}
				],
				priceList:[
					{name:"全部",priceOption:''},
					{name:"免费",priceOption:0},
					{name:"付费",priceOption:1}
				],
				tabList: [
					{
						name: '课程',
						resourceType:6,
						typeTab:'课程分类'
					},
					{
						name: '直播',
						resourceType:7,
						typeTab:'课程分类'
					},
					{
						name: '图书',
						resourceType:9,
						typeTab:'图书分类'
						
					},
					{
						name: '文献',
						resourceType:2,
						typeTab:'文献分类'
					}
				], 
				activeIndex:0,	
				sortFleg:false,
				sortList:[
					{
						name: '默认',
						value:""
					},
					{
						name: '时间',
						value:"uploadTime desc"
					},
					{
						name: '销量',
						value:"salesNum desc"
					}
				],
				pageCount:0,
				scrollTopNum:0,
				old: {
					scrollTopNum: 0
				},
				noDataFleg:false,
				list:[],
				status: 'loading',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '正在加载中...',
					nomore: '这是我的底线'
				}
				// courseList:[],
				// bookList:[],
				// liveList:[],
				// literatureList:[]
			}
		},
		onLoad(option) {
			this.keyword=option.keyword;
			this.courseParmes.content=option.keyword;
			this.getList();
			this.getCouserBar();//弹框里面的课程分类
			console.log(option,'op'); //打印出上个页面传递的参数。
		},	
		methods: {
			getList(){
				this.status="loading";
				this.noDataFleg=false;
				this.$u.get('/resource/fg/resource/app/search',{
					...this.courseParmes
				}).then(res => {	
					if(res.data){
						this.list=res.data.resList||[];
						this.pageCount=res.data.pageCount;
						if(this.pageCount==1){
							this.status="nomore";
							
						}
						if(this.list.length==0){
							this.noDataFleg=true;
						}
						this.scrollTopNum = this.old.scrollTopNum
						this.$nextTick(function() {
							this.scrollTopNum = 0
						});
					}	
				})
			},
			getCouserBar(){//获取的是弹框的分类
				this.$u.get('/resource/fg/diytype/name/list?',{
					name:this.typeTab,
				}).then(res => {	
					if(res.data){
						this.tagList=res.data||[];
					}	
				})
			},
			scroll: function(e) {
				this.old.scrollTopNum = e.detail.scrollTop
			},
			// tab栏切换
			change(index) {
				this.current=index;
				this.courseParmes.resourceType=this.tabList[index]['resourceType'];
				this.courseParmes.pageNum=1;
				this.typeTab=this.tabList[index]['typeTab'];
				this.courseParmes.diyTypeCode=[];//重置搜索分类
				this.getCouserBar();//重置分类
				this.getList();
				// this.$nextTick(function() {
				// 	this.scrollTopNum = 0
				// });
			},
			changeSort(item,index){
				this.activeIndex=index;
				this.courseParmes.orderBy=item.value;
				this.courseParmes.pageNum=1;
				this.getList();
			},
			chooseTag(item){
				if (this.tagSelectList.indexOf(item.code) == -1) {
					this.tagSelectList.push(item.code);//选中添加到数组里	
				} 
				this.courseParmes.diyTypeCode=this.tagSelectList;
			},
			choosePriceTag(item,index){
				this.priceIndex=index;
				this.courseParmes.priceOption=item.priceOption
			},
			searchSure(){
				this.popupShow=false;
				this.getList()
			},
			reset(){
				this.tagSelectList=[];
				this.courseParmes.priceOption='';
				this.courseParmes.diyTypeCode=[];
				this.getList();
				this.popupShow=false;
				this.sortFleg=false
			},	
			reachBottom(){
				console.log(this.courseParmes.pageNum,this.pageCount)
				if(this.courseParmes.pageNum<this.pageCount){
					this.courseParmes.pageNum++;
					this.getMoreList();
					this.status="loading"
				}else{
					this.status="nomore"
				}
			},
			getMoreList(){
				this.$u.get('/resource/fg/resource/app/search',{
					...this.courseParmes
				}).then(res => {	
					if(res.data){
						this.list=this.list.concat(res.data.resList);
						this.pageCount=res.data.pageCount;
						this.pageCount=res.data.pageCount;
						// console.log(res.data,8888)
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
			clickSort(){
				this.popupShow=true;
				this.sortFleg=true;
				// this.tagSelectList=this.courseParmes.diyTypeCode;
			},
			closePopup(){
				this.tagSelectList=[]
			},
			emptySearch(){
				this.keyword='';
				this.courseParmes.content=''
				this.getList()
			},
			searchClick(){
				this.courseParmes.content=this.keyword;
				this.getList()
			},
			goBack(){
				uni.navigateBack() 
			}
		}
	}
</script>

<style scoped lang="scss">
.search_res_wrap{
	display: flex;
	flex-direction: column;
	height: calc(100vh - var(--window-top));
	width: 100%;
	.swiper-box {
		flex: 1;
	}
	.swiper-item {
		height: 100%;
	}
	.search_top_wrap{
		width: 100%;
		// height: 232rpx;
		padding-bottom: 10rpx;
		background: linear-gradient(to bottom, #3EB78D, #3EB7CD);
		.arrow-left{
			margin-right: 18rpx;
			margin-top: 12rpx;
		}
	}
	.search_top{
		width: 100%;
		padding: 0 24rpx;
		// padding: 20rpx 24rpx 38rpx;
		display: flex;
	}
	.sort_bar_wrap{
		height: 92rpx;
		border-bottom: 1rpx solid #E3E3E3;
		.sort_bar_wrap{
			color: #666666;
			font-size: 28rpx;
		}
		.bar_list{
			flex: 1;
			height: 92rpx;
			line-height: 92rpx;
			text-align: center;
		}
		.sort_bar_list{
			flex: 1;
		}
		.active{
			color: #25B4B5;
			font-weight: bold;
		}
		.sort_bar{
			width: 26rpx;
			height: 24rpx;
		}
	}
	.page-box{
		padding: 0 30rpx 1rpx;
		
	}
	.popup_sortwrap{
		height:560rpx;
		padding: 48rpx 30rpx;
		.tag_wrap{
			display: flex;
			flex-wrap: nowrap;
			padding-bottom: 28rpx;
		}
		.tag_title{
			color: #333333;
			font-weight: bold;
			font-size: 30rpx;
			margin-bottom: 28rpx;
		}
		.tag{
			width: 142rpx;
			height: 66rpx;
			color: #333333;
			font-size: 28rpx;
			flex-shrink: 0;
			line-height: 66rpx;
			text-align: center;
			border:2rpx solid #E8E8E8;
			border-radius: 66rpx;
			margin-right:30rpx;
			margin-bottom: 20rpx;
		}	
		.tag.active{
			border-color: #EEF8F8;
			background-color: #EEF8F8;
		}
		.btn_bottom{
			display: flex;
			justify-content: center;
		}
		.reset_btn{
			width: 280rpx;
			height: 84rpx;
			border-radius: 4rpx;
			text-align: center;
			line-height: 84rpx;
			font-size: 28rpx;
			background-color:#F3F3F3;
			color: #333333;
			margin-right: 64rpx;
		}
		.sure_btn{
			width: 280rpx;
			height: 84rpx;
			text-align: center;
			border-radius: 4rpx;
			line-height: 84rpx;
			font-size: 28rpx;
			color: #fff;
			background-color:#5AC5C6
		}
	}
	
}
</style>
