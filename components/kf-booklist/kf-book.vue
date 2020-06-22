<template>
	<view>
		<view class="book_block" v-for="(item,index) in list" :key="index" @click="linktoDetails(item)">
			<image class="cover" :src="`${$filePath}?fileName=${item.img}`" mode=""></image>
			<view class="right_cont">
				<view class="title u-line-1" v-html="item.name">{{item.name}}</view>
				<view class="author" v-if="item.author">{{item.author}} 著</view>
				<view class="synopsis u-line-2">
					{{item.synopsis}}
				</view>
				<view class="bar_bottom">
					<text class="price" v-if="item.realPrice!=0">￥{{item.realPrice}}</text>
					<text class="discount_price" v-if="item.realPrice!=0&&item.price!=0">￥{{item.price}}</text>
					<text class="free_price" v-if="item.realPrice==0">免费</text>
				</view>
			</view>
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
.book_block{
	display: flex;
	width: 690rpx;
	padding: 30rpx 0;
	border-bottom: 2rpx solid #EEEEEE;
	.right_cont{
		flex:1;
	}
	.cover{
		width: 164rpx;
		height: 232rpx;
		flex-shrink: 0;
		margin-right: 24rpx;
	}
	.title{
		max-width: 472rpx;
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
