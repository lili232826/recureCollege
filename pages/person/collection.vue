<template>
	<view class="collection_wrap">
		<u-navbar :is-back="false" :border-bottom="false" :background="{ background: '#f8f8f8' }">
			<view class="kf-nav-wrap">
				<view class="inner_wrap">
					<view class="index_nav">
						<!-- <u-icon name="arrow-left" color="#666" @click="goBack" class="arrow-left"  size="34"></u-icon> -->
						<image class="nav_back_icon arrow-left" src="../../static/image/icon/icon_fanhui.png" alt=""  @click="goBack">
						<view class="nav_bar_wrap">
							<text class="title" v-for="(item,index) in tabList" :key="index" :class="activeIndex==index?'active':''" @click="tabClick(item,index)">{{item.name}}</text>
							<!-- <text class="title">文献</text> -->
						</view>

					</view>
				</view>
			</view>
		</u-navbar>
		<view class="bookshelf_content">
			<view class="scroll_bookshelf_page">
				<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
					<view class="scroll_page" >
						<view v-if="collectionParmes.goodsType==6">
							<!-- 课程的 -->
							<uni-swipe-action>
								<view class="book_block" v-for="(item,index) in list " :key="index">
									<uni-swipe-action-item :options="options" @click="click(index)">
										<view class="book_block_inner" @click="linkToPage(item)">
											<image class="course_cover" v-if="item.img" :src="`${$filePath}?fileName=${item.img}`" mode=""></image>
											<image class="course_cover" v-if="!item.img" src="../../static/image/defaultpic/course_pic.png" mode=""></image>
											<view class="right">
												<view class="course_title title u-line-2">{{item.name}}</view>
												<view class="time">{{item.createTime}}</view>
											</view>
										</view>
									</uni-swipe-action-item>
								</view>
							</uni-swipe-action>
						</view>
						<view v-if="collectionParmes.goodsType==9">
							<!-- 图书的 -->
							<uni-swipe-action>
								<view class="book_block" v-for="(item,index) in list " :key="index">
									<uni-swipe-action-item :options="options" @click="click(index)">
										<view class="book_block_inner"  @click="linkToPage(item)">
											<image class="book_cover" v-if="item.img" :src="`${$filePath}?fileName=${item.img}`" mode=""></image>
											<view class="right">
												<view class="title u-line-1">{{item.name}}</view>
												<view class="author">{{item.author}} 著</view>
												<view class="brief i-line-3" v-if="item.synopsis">{{item.synopsis|formatterFiltertags}}</view>
												<view class="time">{{item.createTime}}</view>
											</view>
										</view>
									</uni-swipe-action-item>
								</view>
							</uni-swipe-action>
						</view>
						<view v-if="collectionParmes.goodsType==2">
							<!-- 文献 -->
							<uni-swipe-action>
								<view class="book_block" v-for="(item,index) in list " :key="index">
									<uni-swipe-action-item :options="options" @click="click(index)">
										<view class="book_block_inner">
											<view class="right">
												<view class="title u-line-1">{{item.name}}</view>
												<view class="brief i-line-3" v-if="item.synopsis">{{item.synopsis|formatterFiltertags}}</view>
												<view class="time">{{item.createTime}}</view>
											</view>
										</view>
									</uni-swipe-action-item>
								</view>
							</uni-swipe-action>
						</view>
						<u-loadmore v-if="!noDataFleg" :status="status" :load-text="loadText" color="#D5D7E0" margin-top="40" margin-bottom='40'/>
						<view v-else class="data_no_wrap flex-vertical">
							<image class="kf_nodata_pic" src="../../static/image/defaultpic/no_chart.png" mode=""></image>
							<text class="no_text">暂无数据~</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	export default {
		components: { uniSwipeAction,uniSwipeActionItem},
		data() {
			return {
				activeIndex:0,
				tabList:[
					{name:'课程',resourceType:6},
					{name:'图书',resourceType:9},
					{name:'文献',resourceType:2}
				],
				collectionParmes:{
					pageNum:1,
					pageSize:50,
					goodsType:6
				},
				options: [
					{
						text: '删除',
						style: {
							backgroundColor: '#FE2023'
						}
					}
				],
				pageCount:0,
				noDataFleg:false,
				list: [],
				status: 'loading',
				loadText: {
					loading: '正在加载中...',
					nomore: '这是我的底线'
				}
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			getList(){
				this.noDataFleg=false;
				this.$u.get('/resource/fg/member-collection/page',{
					...this.collectionParmes
				}).then(res => {	
					if(res.data){
						this.list=res.data.list||[];
						this.list= this.list.map(v=>{
							 return {...v,show:false}
						})
						this.pageCount=res.data.pages;
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
				// uni.showLoading({
				//     title: '加载中'
				// });
				this.$u.get('/resource/fg/member-collection/page',{
					...this.collectionParmes
				}).then(res => {	
					if(res.data){
						this.list=this.list.concat(res.data.list);
						this.list= this.list.map(v=>{
							 return {...v,show:false}
						});
						this.pageCount=res.data.pages;
						// uni.hideLoading();
						// console.log(res.data,'888888')
					}	
				})
			},
			delCollection(item,index){
				this.$u.post('/resource/fg/member-collection/batch/delete',{
					"goodsList": [
					    {
					      "id": item.objectId,
					      "type": item.objectType
					    }
					  ]
				}).then(res => {
					if(res.code==0){
						this.list[index].show=false;
						this.$u.toast(`取消成功`);
						setTimeout(()=>{
							this.list.splice(index,1)
						},500)
					}
				})
				
			},
			tabClick(item,index){
				this.activeIndex=index;
				this.collectionParmes.goodsType=item.resourceType;
				this.collectionParmes.pageNum=1;
				this.status="loading"
				this.getList()
			},
			reachBottom(){
				if(this.collectionParmes.pageNum<this.pageCount){
					this.collectionParmes.pageNum++;
					this.getMoreList();
					this.status="loading"
				}else{
					this.status="nomore"
				}
			},
			click(index) {
				// console.log(index,index1,'6666')
				this.delCollection(this.list[index],index);
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if(index != idx) this.list[idx].show = false;
				})
			},
			linkToPage(item){
				let resourceType=item.objectType;
				let oid=item.objectId;
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
	.collection_wrap{
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
		.data_no_wrap{
			padding-top: 60rpx;
		}
		.bookshelf_content{
			width: 100%;
			flex: 1;
			position: relative;
		}
		.scroll_bookshelf_page{
			position: absolute;
			width: 100%;
			height: 100%;
		}
		.scroll_page{
			width: 100%;
			padding-bottom: 1rpx;
		}
		.kf-nav-wrap{
			width: 100%;		
			.inner_wrap{
				width: 100%;
				background-color: #F8F8F8;
				z-index: 991;
				position: relative;
			}
			.index_nav{
				display: flex;
				height: 88rpx;
				line-height: 88rpx;
				align-items: center;
				padding: 0 24rpx;
				.arrow-left{
					position: absolute;
					left: 24rpx;
				}
				.nav_bar_wrap{
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				
				.title{
					font-size: 36rpx;
					text-align: center;
					// font-weight: bold;
					color: #666666;
					margin:0 40rpx;
					&.active{
						color: #333;
						font-weight: bold;
					}
				}
				
			}
		}
		.book_block{
			width: 100%;
			padding-left:20rpx;
			padding-right:20rpx;
			.book_block_inner{
				width: 100%;
				display: flex;
				border-bottom:1rpx solid #EEEEEE;
				padding:30rpx 0rpx;
			}
			.book_cover{
				width: 164rpx;
				height: 232rpx;
				flex-shrink: 0;
				margin-right: 30rpx;
			}
			.course_cover{
				width: 300rpx;
				height: 200rpx;
				flex-shrink: 0;
				margin-right: 24rpx;
				background-color: #F8F8F8;
			}
			.right{
				min-width: 0;
				flex: 1;
			}
			.title{
				font-size:32rpx;
				font-weight:bold;
				color:rgba(34,34,34,1);
			}
			.course_title{
				max-height: 84rpx;
				// overflow: hidden;
				margin-bottom: 80rpx;
			}
			.time{
				font-size:24rpx;
				font-weight:400;
				color:rgba(189,193,203,1)
			}
			.brief{
				font-size:26rpx;
				font-weight:500;
				min-height: 80rpx;
				max-height: 80rpx;
				overflow: hidden;
				color:rgba(135,139,148,1);
				line-height:40rpx;
				margin-bottom: 10rpx;
			}
			.author{
				font-size:22rpx;
				font-weight:500;
				color:rgba(189,193,203,1);
				margin-bottom:10rpx;
			}
			.read_precent{
				font-size:22rpx;
				font-weight:500;
				color:rgba(245,134,26,1);
			}
			.read_btn{
				width:146rpx;
				height:58rpx;
				color: #25B4B5;
				font-size: 26rpx;
				text-align: center;
				line-height: 58rpx;
				border:2rpx solid rgba(211,240,240,1);
				border-radius:29rpx;
			}
		}
	}
</style>
