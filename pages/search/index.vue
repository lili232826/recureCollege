<template>
	<view class="search_wrap">
		<view class="content">
			<kfNav title="搜索"/>
			<view class="search_box">
				<u-search action-text="取消" 
				@search="doSearch" 
				v-model="keyword" 
				:maxlength="10"
				@change="changeHandle"
				@custom='goBack'></u-search>
			</view>
			<view class="search_content" v-if="!searchFleg">
				<view class="search_title flex-between" v-if="tagList&&tagList.length>0">
					<text class="history_txt">历史记录</text>
					<image class="kf_delete_btn" src="../../static/image/icon/icon_delect@2x.png" mode="" @tap="oldDelete"></image>
				</view>
				<view class="search_res" v-if="tagList&&tagList.length>0">
					<view class="tag" 
					v-for="(list,index) in tagList" :key="index"
					@click="tagClick(list)"
					>{{list}}</view>
				</view>
				<view class="search_title flex-between">
					<text class="history_txt">热门搜索</text>
				</view>
				<view class="hot_wrap">
					<view class="hot_list flex-center" v-for="(list,index) in hotList" :key="index" @click="hotClick(list)">
						<text class="number" :class="'number_'+index">{{index+1}}</text>
						<text class="u-line-1">{{list.hotSearchWord.slice(0,8)}}</text>
					</view>
				</view>
			</view>
			<view class="search_list_wrap" v-if="searchFleg">
				<view class="search_list u-line-1" v-for="(list,index) in searchList" :key="index" @click="tagClick(list)">{{list}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import kfNav from '@/components/kf-nav/kf-nav.vue';
	export default {
		components: {kfNav },
		data() {
			return {
				keyword:'',
				tagList:[
					// {name:"病毒"},
					// {name:"型冠状病毒"},
					// {name:"冠状病毒"},
					// {name:"新型病毒"},
					// {name:"病毒"},
					// {name:"冠状病毒"},
				],
				searchFleg:false,//不显示全局匹配
				hotList:[],
				searchList:[]
			}
		},
		onLoad() {
			this.getList();
			this.loadOldKeyword();
		},
		onShow() {
			this.searchFleg=false;
			this.keyword='';
		},
		methods: {	
			getList(){
				this.$u.get('/sysuser/fg/hotsw/list',{
					num:10
				}).then(res => {	
					if(res.data){
						// console.log(res.data,'9999999999999')
						this.hotList=res.data||[];
					}	
				})
			},
			getSearchList(){
				this.$u.get('/resource/fg/resource/search/list',{
					content:this.keyword,
				}).then(res => {	
					if(res.data){
						// console.log(res.data,'88')
						this.searchList=res.data||[];
					}	
				})
			},
			changeHandle(){
				if(this.keyword.trim().length>0){
					this.getSearchList();
					this.searchFleg=true;
				}else{
					this.searchFleg=false;
				}
			},
			tagClick(item){
				let text=item;
				this.saveKeyword(text.slice(0,10)); //保存为历史
				uni.navigateTo({
				    url: "/pages/search/list?keyword="+text
				});
			},
			hotClick(list){
				let text=list.hotSearchWord;
				this.saveKeyword(text.slice(0,10)); //保存为历史
				uni.navigateTo({
				    url: "/pages/search/list?keyword="+text
				});
			},
			//加载历史搜索,自动读取本地Storage
			loadOldKeyword() {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						this.tagList = OldKeys;
					}
				});
			},
			//清除历史搜索
			oldDelete() {
				uni.showModal({
					content: '确定清除历史搜索记录？',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.tagList = [];
							uni.removeStorage({
								key: 'OldKeys'
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//执行搜索
			doSearch() {				
				this.keyword=this.$u.trim(this.keyword);	
				uni.navigateTo({
				    url: "/pages/search/list?keyword="+this.keyword
				});
				if(this.keyword.length>0){
					this.saveKeyword(this.keyword.slice(0,10)); //保存为历史
				}else{
					uni.showToast({
						title: "搜索内容不能为空",
						icon: 'none',
						duration: 2000
					});
				}
			},
			
			//保存关键字到历史记录
			saveKeyword(keyword) {
				if(keyword)
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						var findIndex = OldKeys.indexOf(keyword);
						if (findIndex == -1) {
							OldKeys.unshift(keyword);
						} else {
							OldKeys.splice(findIndex, 1);
							OldKeys.unshift(keyword);
						}
						//最多10个纪录
						OldKeys.length > 10 && OldKeys.pop();
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.tagList = OldKeys; //更新历史搜索
					},
					fail: (e) => {
						var OldKeys = [keyword];
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.tagList = OldKeys; //更新历史搜索
					}
				});
			},
			goBack(){
				uni.navigateBack() 
			}
		}
	}
</script>

<style scoped lang="scss">
.search_wrap{
	position: absolute;
	top:0;
	right: 0;
	left: 0;
	bottom: 0;
	.content{
		height: 100%;
	}
	.search_box{
		padding: 32rpx 24rpx;
	}
	.search_content{
		padding: 30rpx 24rpx;
	}
	.history_txt{
		color: #333333;
		font-size: 30rpx;
		font-weight: bold;
	}
	.search_title{
		margin-bottom: 20rpx;
	}
	.search_res{
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 50rpx;
		.tag{
			color: #333333;
			text-align: center;
			font-size: 28rpx;
			padding: 20rpx 24rpx;
			margin-right: 18rpx;
			margin-bottom: 18rpx;
			border-radius: 6rpx;
			background-color: #F3F3F3;
		}
	}
		
	.hot_wrap{
		color: #333333;
		font-size: 28rpx;
		.hot_list{
			padding: 5rpx 0;
			margin-bottom: 20px;
		}
		.number{
			color: #AAAAAA;
			font-size: 32rpx;
			font-weight: bold;
			margin-right: 20rpx;
		}
		.number_0{
			color: #FF4713;
		}
		.number_1{
			color: #F86442;
		}
		.number_2{
			color: #EC8710;
		}
	}
	.search_list_wrap{
		.search_list{
			color: #333333;
			height: 88rpx;
			line-height: 88rpx;
			border-bottom: 1rpx solid #EDEDED;
			padding-left: 20rpx;
			padding-right: 20rpx;
		}
	}
}
</style>
