<template>
	<view class="news_details_wrap">
		<kfNav title="消息详情"/>
		<view class="news_details_content">
			<view class="title">消息详情</view>
			<view class="tip flex-between">
				<!-- <view>发信人：admin</view> -->
				<view>{{newsObj.sendTime }}</view>
			</view>
			<view class="details_txt" v-if="newsObj.content">
				{{newsObj.content |formatterFiltertags}}
			</view>
		</view>
	</view>
		
</template>

<script>	
	import kfNav from '@/components/kf-nav/kf-nav.vue';
	export default {
		components: { kfNav },
		data() {
			return {
				newsObj:{},
				oid:''
			}
		},
		onLoad(options) {
			this.oid=options.newsId;
			this.getDetail();
			// this.readNew();
		},
		methods: {
			getDetail(){
				this.$u.get('/member/fg/pm/get/'+this.oid,{
				}).then(res => {	
					if(res.data){
						this.newsObj=res.data;	
					}	
				})
			},
			readNew(){
				// this.$u.get('/member/fg/pm/get/'+this.oid,{
				// }).then(res => {	
				// 	if(res.data){
				// 		this.newsObj=res.data;	
				// 	}	
				// })
			},
			goBack(){
				uni.navigateBack() 
			}
		}
	}
</script>

<style scoped lang="scss">
	page{
		width: 100%;
		height: 100%;
	}
	.news_details_wrap{
		height: 100%;
		background-color: #fff;
	}
	
	.news_details_content{
		padding:46rpx 30rpx 0;
		.title{
			color: #333333;
			font-size: 36rpx;
			font-weight: bold;
			margin-bottom: 36rpx;
		}
		.tip{
			color: #BDC1CB;
			font-size: 24rpx;
			border-bottom: 1rpx solid #EBEBEB;
			padding-bottom: 36rpx;
		}
		.details_txt{
			color: #333333;
			font-size: 28rpx;
			line-height: 48rpx;
			padding: 36rpx 0;
			word-wrap :break-word
		}
	}

</style>
