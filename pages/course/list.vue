<template>
	<view class="course_wrap">
		<kfNav :title="title"/>
		<view class="sort_wrap flex-center">
			<view class="totol">共{{totalCount||0}}条</view>
			<view class="sort_bar " @click="clickSort">
				<image class="sort_icon" src="../../static/image/icon/icon_shaixuan@2x.png" mode=""></image>
				<text class="sort_txt">筛选</text>
			</view>
		</view>
		<view class="list_wrap">
			<view class="scroll_wrap">
				<scroll-view scroll-y style="height: 100%;width: 100%;"
				@scroll="scroll"
				@scrolltolower="reachBottom" :scroll-top="scrollTopNum">
					<view class="page-box">
						<kfCourse :list="list" @linkTo="linktoDetails" />
						<u-loadmore v-if="!noDataFleg" :status="status" :load-text="loadText" color="#D5D7E0" margin-top="40" margin-bottom='40'/>
						<view class="data_no_wrap flex-vertical" v-if="noDataFleg">
							<image class="kf_nodata_pic" src="../../static/image/defaultpic/no_chart.png" mode=""></image>
							<text class="no_text">暂无相关内容~</text>
						</view>
					</view>
					<!-- <image src="../../static/image/defaultpic/no_chart.png" mode=""></image> -->
				</scroll-view>
			</view>
			
			<!-- <view class="course_block" v-for="(item,index) in list" :key="index" @click="linktoDetails(item)">
				<image class="cover" :src="item.image" mode=""></image>
				<view class="right_cont">
					<view class="title u-line-2">{{item.title}}</view>
					<view class="bar_bottom">
						<text class="price" v-if="item.price!=0">￥{{item.price}}</text>
						<text class="discount_price" v-if="item.price!=0">￥{{item.disprice}}</text>
						<text class="free_price" v-if="item.price==0">免费</text>
					</view>
					<view><image class="user_icon" src="../../static/image/icon/icon_renshu@2x.png" mode=""></image><text class="num">630人学过</text></view>
				</view>
			</view> -->
			
		</view>
		
		<u-popup v-model="popupShow" mode="top"  @close="closePopup">
			<view class="popup_sortwrap">
				<view class="tag_title">分类</view>
				<scroll-view scroll-x="true" >
					<view class="tag_wrap">
						<view class="tag active">全部</view>
						<view class="tag" 
						:class="{'active': tagSelectList.indexOf(list.code)!=-1}" 
						v-for="(list,index) in tagList" :key="index" @click="chooseTag(list)">{{list.showName}}</view>
					</view>
				</scroll-view>
				<view class="tag_title">价格</view>
				<scroll-view scroll-x="true" >
					<view class="tag_wrap">
						<view class="tag" :class="{'active': priceIndex==index}" v-for="(list,index) in priceList" :key="index" @click="choosePriceTag(list,index)">{{list.name}}</view>
					</view>
				</scroll-view>
				<view class="btn_bottom">
					<view class="reset_btn" @click="reset">重置</view>
					<view class="sure_btn" @click="searchSure">确定</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import kfNav from '@/components/kf-nav/kf-nav.vue';
	import kfCourse from '@/components/kf-courselist/kf-course.vue';
	export default {
		components: { kfNav,kfCourse},
		data() {
			return {
				triggered: false,
				freshing:false,
				popupShow:false,
				// loadling:true,
				tagSelectList:[''],
				priceIndex:0,
				title:'课程',
				type:6,
				courseParmes:{
					resourceType:6,//课程
					pageNum:1,
					pageSize:50,
					orderBy:"uploadTime desc",
					priceOption:'',
					diyTypeCode:[]
				},
				pageCount:0,
				totalCount:0,
				scrollTopNum:0,
				old: {
					scrollTopNum: 0
				},
				list: [],
				priceList:[
					{name:"全部",priceOption:''},
					{name:"免费",priceOption:0},
					{name:"付费",priceOption:1}
				],
				tagList:[],
				noDataFleg:false,
				status: 'loading',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '正在加载中...',
					nomore: '这是我的底线'
				}
				
			}
		},
		onLoad(options) {
			let code=options.code;
			let type=options.type;
			if(code){
				this.courseParmes.diyTypeCode=[code];
				this.tagSelectList=[code];//高亮显示
			}
			if(type){
				this.courseParmes.resourceType=type;
				type==6? this.title='课程' : this.title="直播课"
			}
		},
		onShow: function() {
			this.getList();
			this.getCouserBar();
		},
		onHide: function() {
			
		},
		methods: {
			getCouserBar(){
				this.$u.get('/resource/fg/diytype/name/list?',{
					name:'课程分类'
				}).then(res => {	
					if(res.data){
						this.tagList=res.data||[];
					}	
				})
			},
			getList(){
				this.noDataFleg=false;
				// uni.showLoading({
				//     title: '努力加载中'
				// });
				this.$u.get('/resource/fg/resource/app/search',{
					...this.courseParmes
				}).then(res => {	
					if(res.data){
						this.list=res.data.resList||[];
						this.pageCount=res.data.pageCount;
						this.totalCount=res.data.totalCount;
						if(this.pageCount==1){
							this.status="nomore"
						}
						if(this.list.length==0){
							this.noDataFleg=true;
						}
					}	
				})
			},
			getMoreList(){
				this.$u.get('/resource/fg/resource/app/search',{
					...this.courseParmes
				}).then(res => {	
					if(res.data){
						this.list=this.list.concat(res.data.resList);
						this.pageCount=res.data.pageCount;
						// console.log(res.data,8888)
					}	
				})
			},
			scroll: function(e) {
				this.old.scrollTopNum = e.detail.scrollTop
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
			linktoDetails(item){
				let resourceType=item.resourceType;
				let oid=item.id;
				switch(resourceType) {
				    case 5:
				        uni.navigateTo({
				        	url: "/pages/video/index?oid="+oid
				        });
				        break;
				    case 6:
				        uni.navigateTo({
				        	url: "/pages/course/index?oid="+oid
				        });
				        break;
					case 7:
					   uni.navigateTo({
					   	url: "/pages/liveCourse/index?oid="+oid
					   });
					   break;
				     default:
				        console.log(默认代码块)
				} 
				// if(resourceType==5){
				// 	uni.navigateTo({
				// 		url: "/pages/video/index?oid="+oid
				// 	});
				// }
				// if(resourceType==6){
				// 	uni.navigateTo({
				// 		url: "/pages/course/index?oid="+oid
				// 	});
				// }	
				// if(resourceType==6){
				// 	uni.navigateTo({
				// 		url: "/pages/course/index?oid="+oid
				// 	});
				// }	
			},	
			clickSort(){
				this.popupShow=true
			},
			chooseTag(item){
				// if (this.tagSelectList.indexOf(item.code) == -1) {
				// 	this.tagSelectList.push(item.code);//选中添加到数组里	
				// } 
				this.tagSelectList=[item.code]//多选改单选
				this.courseParmes.diyTypeCode=this.tagSelectList;
				// else {
				// 	this.tagSelectList.splice(this.tagSelectList.indexOf(item.code), 1); //取消
				// }
			},
			choosePriceTag(item,index){
					this.priceIndex=index;
					this.courseParmes.priceOption=item.priceOption
				
			},
			searchSure(){
				this.courseParmes.pageNum=1;
				this.popupShow=false;
				this.getList()
			},
			reset(){
				this.priceIndex=0;
				this.tagSelectList=[];
				this.courseParmes.priceOption='';
				this.courseParmes.diyTypeCode=[];
				this.courseParmes.pageNum=1;
				this.getList();
				this.popupShow=false
			},	
			closePopup(){
				// this.tagSelectList=[]
				
			}
		}
	}
</script>

<style scoped lang="scss">
.course_wrap{
	height: calc(100vh - var(--window-top));
	width: 100%;
	display: flex;
	flex-direction: column;
	.sort_wrap{
		height: 83rpx;
		flex-shrink: 0;
		justify-content: space-between;
		padding-left: 30rpx;
		padding-right: 20rpx;
		border-bottom: 2rpx solid #EEEEEE;
		.sort_bar{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 120rpx;
			height: 46rpx;
			background-color: #EEF8F8;
			border-radius: 46rpx;
			cursor: pointer;
		}
		.totol{
			color:#BDC1CB;
			font-size: 24rpx;
		}
		.sort_icon{
			width: 22rpx;
			height: 22rpx;
			margin-right: 11rpx;
		}
		.sort_txt{
			color: #25B4B5;
			font-size: 24rpx;
		}
	}
		
	.list_wrap{
		flex: 1;
		width: 100%;
		position: relative;
		
		.scroll_wrap{
			position: absolute;
			width: 100%;
			height: 100%;
			
		}
		.page-box{
			padding: 0 30rpx 1rpx;
			
		}
	}
	.course_block{
		display: flex;
		// width: 690rpx;
		width: 100%;
		padding: 30rpx 0;
		border-bottom: 2rpx solid #EEEEEE;
		.right_cont{
			flex:1;
		}
		.cover{
			width: 300rpx;
			height: 200rpx;
			flex-shrink: 0;
			margin-right: 24rpx;
		}
		.title{
			color: #202021;
			font-size: 30rpx;
			line-height: 44rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
		}
		.bar_bottom{
			margin-bottom: 20rpx;
		}
		.price{
			color: #FE2023;
			font-size: 28rpx;
			font-weight: bold;
			margin-right: 24rpx;
		}
		.discount_price{
			color: #BDBEBD;
			font-size: 24rpx;
			text-decoration: line-through;
		}
		.free_price{
			color:#0AB562;
			font-size: 24rpx;
		}
		.user_icon{
			width: 19rpx;
			height: 22rpx;
			margin-right: 11rpx;
		}
		.num{
			color:#9C9D9C;
			font-size: 22rpx;
		}
	}
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
		min-width: 142rpx;
		padding: 0 15rpx;
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
		color: #25B4B5;
	}
	.btn_bottom{
		display: flex;
		justify-content: center;
		margin-top: 38rpx;
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
	
</style>



