<template>
	<view class="book_block" @click="linktoDetails">
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
			<view class="title">{{list.name}}</view>
			<view class="brief">{{list.synopsis}}</view>
		</view>
	</view>
</template>

<script>
	//新课上架首页
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
			
		}	,
		methods:{
			linktoDetails(){
				this.$emit("linkTo");
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
		margin-bottom: 24rpx;
		
	}
	.title{
		color: #202021;
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 22rpx;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
		
	.brief{
		color: #878B94;
		font-size: 26rpx;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	
}
</style>
