<template>
	<view>
		<view class="article_block" v-for="(item,index) in list" :key="index" @click="linktoDetails(item)">
			<view class="left_cont">
				<view class="title u-line-1">{{item.name}}</view>
				<view class="synopsis u-line-2">
					{{item.synopsis}}
				</view>
				<view class="bar_bottom flex-between">
					<text class="price" v-if="item.realPrice!=0">￥{{item.realPrice}}</text>
					<text class="free_price" v-if="item.realPrice==0">免费</text>
					<view><text class="look_num" v-if="item.price!=0">￥{{item.disprice}}</text></view>
				</view>
			</view>
			<image v-if="item.image" class="cover" :src="item.image" mode=""></image>
		</view>
		<view class="no_data flex-vertical" v-if="!list||list.length==0">
			<image src="../../static/image/defaultpic/no_chart.png" mode="" class="no_data_pic"></image>
			<text class="no_data_txt" >暂无相关内容</text>
		</view>
	</view>
</template>

<script>
	//图书的列表
	export default {
		props:{	
			list:{
				type: Array,
				default() {
					return [];
				}
			}		
		},
		data() {
			return {
				
			};
		},
		mounted(){
			
		}	,
		methods:{
			linktoDetails(item){
				this.$emit("linkTo", item);
			}		
			
		}
	}
</script>

<style lang="scss" scoped>
.article_block{
	display: flex;
	align-items: center;
	width: 690rpx;
	padding: 30rpx 0;
	border-bottom: 2rpx solid #EEEEEE;
	.left_cont{
		flex:1;
		min-width: 0;
	}
	.cover{
		width: 240rpx;
		height: 150rpx;
		flex-shrink: 0;
		margin-left: 40rpx;
		
	}
	.title{
		color: #202021;
		font-size: 30rpx;
		line-height: 44rpx;
		font-weight: bold;
		margin-bottom: 16rpx;
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
	.author{
		font-size: 22rpx;
		color: #BDC1CB;
		height: 22rpx;
		margin-bottom: 20rpx;
	}
	.synopsis{
		font-size: 26rpx;
		color: #878B94;
		line-height: 40rpx;
		margin-bottom: 18rpx;
	}
		
	.look_num{
		color:#BDC1CB;
		font-size: 24rpx;
	}
}
.no_data{
	text-align: center;
	padding-top: 55rpx;
	.no_data_pic{
		width: 310rpx;
		height: 221rpx;
		margin-bottom: 55rpx;
	}
	.no_data_txt{
		font-size:28rpx;
		font-weight:500;
		color:#CBCBCB;
	}
}
</style>
