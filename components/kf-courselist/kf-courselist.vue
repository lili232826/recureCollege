<template>
	<view class="book_block" @click="linktoDetails(list)">
		<view class="cover_bg">
			<image v-if="list.img" class="cover" :src="`${$filePath}?fileName=${list.img}`"></image>
			<image v-else="list.img" class="cover" :src="loadingImg"></image>
		</view>
		<!-- <u-lazy-load class="cover" 
		height="220"
		img-mode="scaleToFill"
		:image="`${$filePath}?fileName=${list.img}`" 
		:loading-img="loadingImg" 
		:error-img="errorImg"></u-lazy-load> -->
		<view class="content">
			<view class="title u-line-2" >{{list.name}}</view>
			<view class="bar_bottom">
				<text class="price" v-if="list.realPrice!=0">￥{{list.realPrice}}</text>
				<text class="discount_price" v-if="list.realPrice!=0&&list.price!=0">￥{{list.price}}</text>
				<text class="free_price" v-if="list.realPrice==0">免费</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	//精选课程首页的
	export default {
		props:{	
			list:{
				type: Object,
				default() {
					return{};
				}
			}		
		},
		data() {
			return {
				
				loadingImg:"../../static/image/defaultpic/course_pic.png",
				errorImg:"../../static/image/defaultpic/course_pic.png"
			};
		},
		mounted(){	
		},
		methods:{	
			linktoDetails(item){
				this.$emit("linkTo", item);
			}
		}
	}
</script>

<style lang="scss" scoped>
.book_block{
    width: 332rpx;
	.cover_bg{
		width: 332rpx;
		height: 220rpx;
		background-color: #F8F8F8;
		margin-bottom: 20rpx;
	}
	.cover{
		width: 332rpx;
		height: 220rpx;
		
	}
	.title{
		color: #202021;
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 22rpx;
		display: -webkit-box;
		height: 80rpx;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
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
	
}
</style>
