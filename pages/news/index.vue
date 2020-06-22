<template>
	<view class="news_wrap">
		<kfNav title="消息" bgColor="#fff"/>
		<view class="new_content">
			<scroll-view scroll-y style="height: 100%;width: 100%;" 
			refresher-enabled="true" 
			:refresher-triggered="triggered"
			@refresherrefresh="onRefresh" 
			@refresherrestore="onRestore" 
			refresher-background="#f8f8f8"
			@scrolltolower="reachBottom" 
			@scroll="scroll" 
			:scroll-top="scrollTopNum"
			refresher-default-style="white"
			>
				<view class="inner_content">
					<view class="news_block_wrap">
						<uni-swipe-action>
							<view class="news_block" v-for="(item,ind) in list" :key="ind">
								<view class="time">
									{{item.sendTime}}
								</view>
								<!-- 按组使用 -->
								<uni-swipe-action-item :options="options" @click="click(ind)">
									<view class="cont" @click="linktoDetails(item)" >
										<image v-if="item.status==1" src="../../static/image/icon/icon_xiaox@2x.png" mode="" class="news_icon"></image>
										<image v-if="item.status==0" src="../../static/image/icon/icon_rw_dian@2x.png" mode="" class="news_icon"></image>
										<view class="right_cont">
											<view class="news_tit u-line-1">{{item.title}}</view>
											<view class="news_txt u-line-2">{{item.content}}</view>
										</view>
									</view>
								</uni-swipe-action-item>
							</view>
						</uni-swipe-action>
						<u-loadmore  v-if="!noDataFleg" :status="status" :load-text="loadText" color="#D5D7E0" bg-color="#f8f8f8" margin-top="40" margin-bottom='40'/>
						<view class="data_no_wrap flex-vertical" v-if="noDataFleg">
							<image class="kf_nodata_pic" src="../../static/image/defaultpic/no_chart.png" mode=""></image>
							<text class="no_text">暂无消息~</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
		
</template>

<script>	
	import kfNav from '@/components/kf-nav/kf-nav.vue';
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	export default {
		components: { kfNav,uniSwipeAction,uniSwipeActionItem},
		data() {
			return {
				triggered: false,
				freshing:false,
				newsParmes:{
					pageNum:1,
					pageSize:20
				},
				pageCount:0,
				options: [
					{
						text: '删除',
						style: {
							backgroundColor: '#FE2023'
						}
					}
				],
				scrollTopNum:0,
				old: {
					scrollTopNum: 0
				},
				list: [],
				status: 'loading',
				noDataFleg:false,
				loadText: {
					loadmore:'上拉加载更多',
					loading: '正在加载中...',
					nomore: '这是我的底线'
				}
			}
		},
		onLoad() {
			this.getList();
		},
		methods: {
			
			getList(){
				this.noDataFleg=false;
				this.$u.get('/member/fg/pm/page',{
					...this.newsParmes
				}).then(res => {	
					if(res.data){
						this.list=res.data.list;
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
						// console.log(res,'999999999')
					}	
				})
			},
			getMoreList(){
				this.$u.get('/member/fg/pm/page',{
					...this.newsParmes
				}).then(res => {	
					if(res.data){
						this.list=this.list.concat(res.data.list);	
						this.list= this.list.map(v=>{
							 return {...v,show:false}
						})
						this.pageCount=res.data.pages;
					}	
				})
			},
			delNew(oid,index){
				this.$u.post('member/fg/pm/delete/'+oid,{
				}).then(res => {
					if(res.code==0){
						this.list[index].show=false;
						this.$u.toast(`删除成功`);
						setTimeout(()=>{
							this.list.splice(index,1)
						},500)
					}
				})
			},
			click(index) {	
				this.delNew(this.list[index]['id'],index);
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
			onRefresh() {
				// console.log(this.freshing,'this.freshingthis.freshing')
				if (this.freshing) return;  
				this.freshing = true;  
				if (!this.triggered)//界面下拉触发，triggered可能不是true，要设为true  
					this.triggered = true;  
				setTimeout(() => {  
					this.triggered = false;//触发onRestore，并关闭刷新图标  
					this.freshing = false;  
				}, 3000)  
			},
			onRestore() {
				this.newsParmes.pageNum=1;
				this.getList();//重新获取
			},
			scroll: function(e) {
				this.old.scrollTopNum = e.detail.scrollTop
			},
			reachBottom(){
				if(this.newsParmes.pageNum<this.pageCount){
					this.newsParmes.pageNum++;
					this.getMoreList();
					this.status="loading"
				}else{
					this.status="nomore"
				}
			},
			goBack(){
				uni.navigateBack() 
			},
			linktoDetails(item){
				item.status=1;
				uni.navigateTo({
				    url: "/pages/news/details?newsId="+item.id,
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.news_wrap{
		height: calc(100vh);
		background-color: #f8f8f8;
		display: flex;
		flex-direction: column;
	}
	
	.new_content{
		position: relative;
		flex: 1;
		.inner_content{
			width: 100%;
			height: 100%;
			padding: 30rpx;
			position: absolute;
		}
		.news_block_wrap{
			padding-bottom: 1rpx;
		}
	}
	.news_block{
		width: 100%;
		margin-bottom: 22rpx;
		.news_icon{
			width: 68rpx;
			height: 68rpx;
			margin-right: 23rpx;
			flex-shrink: 0;
		}
		.right_cont{
			flex: 1;
			min-width: 0;
		}
		.cont{
			width: 100%;
			display: flex;
			align-items: center;
			background-color: #fff;
			border-radius: 8rpx;
			padding: 34rpx 24rpx;
		}
		.time{
			color: #878B94;
			font-size: 24rpx;
			text-align: center;
			margin-bottom: 23rpx;
		}
		.news_tit{
			color:#333333;
			font-size:30rpx;
			margin-bottom: 18rpx;
		}
		.news_txt{
			color:#878B94;
			font-size:28rpx;
			line-height: 46rpx;
			max-height: 92rpx;
		}
	}
</style>
