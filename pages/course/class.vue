<template>
	<view class="class_wrap">	
		<kfNav title="全部课程"/>
		<view class="classlist_wrap">
			<view class="class_block" v-for="(item,index)  in list" :key="index" @click="linktoList(item)">
				<image class="class_icon" :src="`${$filePath}?fileName=${item.img}`" mode="" v-if="item.img"></image>
				<image class="class_icon" :src="defaultIcon" mode="" v-else></image>
				<view class="cont">
					<view class="name u-line-1">{{item.showName}}</view>
					<view class="brief u-line-1">共{{item.num}}门课程</view>
				</view>
			</view>
			<!-- <view class="class_block">
				<image class="class_icon" src="../../static/icon_naotan@2x.png" mode=""></image>
				<view class="cont">
					<view class="name u-line-1">脑瘫</view>
					<view class="brief u-line-1">共20门课程</view>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import kfNav from '@/components/kf-nav/kf-nav.vue';
	export default {
		components: { kfNav},
		data() {
			return {
				defaultIcon:"../../static/image/defaultpic/class_icon.png",
				list: []
			}	
		},
		onLoad() {
		
		},
		onShow: function() {
			this.getList()
		},
		onHide: function() {
			
		},
		methods: {
			getList(){
				this.$u.get('/resource/fg/diytype/name/list?',{
					name:'课程分类'
				}).then(res => {	
					if(res.data){
						this.list=res.data||[]
						// this.=res.data||[];
						console.log(res.data,'9999')
					}	
				})
			},
			linktoList(item){
				// console.log(item,'77777777777')
				uni.navigateTo({
				    url: "/pages/course/list?code="+item.code,
				});
			},	
		}
	}
</script>

<style scoped lang="scss">
	.class_wrap{
		min-height: 100vh;
		background-color: #F8F8F8;
	}
	.classlist_wrap{
		padding: 30rpx 24rpx;
		background-color: #F8F8F8;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.class_block{
		background-color: #fff;
		display: flex;
		align-items: center;
		width: 336rpx;
		height: 166rpx;
		margin-bottom: 30rpx;
		.class_icon{
			width: 80rpx;
			height: 80rpx;
			margin-left: 28rpx;
			margin-right: 16rpx;
		}
			
		.name{
			color: #202021;
			font-size: 28rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
		}
		.brief{
			color: #C8CAD2;
			font-size: 24rpx;
		}
	}
		
</style>
