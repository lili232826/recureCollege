<template>
	<view>
		<view class="course_block" v-for="(item,index) in list" :key="index" @click="linktoDetails(item)">
			<!-- <image class="cover" :src="`${$filePath}?fileName=${item.img}`" mode=""></image> -->
			<view class="cover_wrap">
				<u-lazy-load class="cover"
				:image="`${$filePath}?fileName=${item.img}`" 
				height="200"
				img-mode="scaleToFill"
				:loading-img="loadingImg" 
				:error-img="errorImg"></u-lazy-load>
				<view class="course_status liveing" v-if="item.resourceType==7&&item.liveStatus==1">直播中</view>
				<view class="course_status livewill" v-if="item.resourceType==7&&item.liveStatus==2">预告</view>
			</view>
			<view class="right_cont" v-if="item.resourceType==5||item.resourceType==6">
				<view class="title u-line-2" v-html="item.name">{{item.name}}</view>
				<view class="bar_bottom">
					<text class="price" v-if="item.realPrice!=0">￥{{item.realPrice.toFixed(2)}}</text>
					<text class="discount_price" v-if="item.realPrice!=0&&item.price">￥{{item.price.toFixed(2)}}</text>
					<text class="free_price" v-if="item.realPrice==0">免费</text>
				</view>
				<view><image class="user_icon" src="../../static/image/icon/icon_renshu@2x.png" mode=""></image><text class="num" v-if="item.browseNum!=null||item.browseNum!='null'">{{item.browseNum|formatterLookNum}}人学过</text></view>
			</view>
			<view class="right_cont" v-if="item.resourceType==7">
				<view class="title u-line-2" v-html="item.name">{{item.name}}</view>
				<view class="bar_bottom">
					
				</view>
				<view><text class="num">{{item.liveTime}}</text></view>
			</view>
		</view>
	</view>
</template>

<script>
	//课程列表
	export default {
		props:{	
			list: {
				type: Array,
				default () {
					return []
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
.course_block{
	display: flex;
	width: 690rpx;
	padding: 30rpx 0;
	border-bottom: 2rpx solid #EEEEEE;
	.cover_wrap{
		position: relative;
	}
	.course_status{
		position: absolute;
		top: 10rpx;
		left: 10rpx;
		width: 82rpx;
		height: 36rpx;
		text-align: center;
		line-height: 36rpx;
		font-size: 20rpx;
		color: #fff;
		border-radius:4px;
		&.liveing{
			background-color: #06B5A2;
		}
		&.livewill{
			background-color: #F46542;
		}
	}
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
		min-height: 88rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	.bar_bottom{
		min-height: 38rpx;
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
