<template>
	<view class="bookshelf_wrap">
		<u-navbar :is-back="false" :border-bottom="false" :background="{ background: '#f8f8f8' }">
			<view class="kf-nav-wrap">
				<view class="inner_wrap">
					<view class="index_nav">
						<u-icon name="arrow-left" color="#666" @click="goBack" class="arrow-left" size="34"></u-icon>
						<view class="nav_bar_wrap">
							<text class="title" v-for="(item,index) in tabList" :key="index" 
							:class="activeIndex==index?'active':''" 
							@click="activeIndex=index">{{item.name}}</text>
							<!-- <text class="title">文献</text> -->
						</view>

					</view>
				</view>
			</view>
		</u-navbar>
		<view class="bookshelf_content">
			<view class="scroll_bookshelf_page">
				<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
					<view class="scroll_page">
						<view class="book_block" v-for="(item,index) in list " :key="index">
							<view class="book_block_inner">
								<image class="book_cover" :src="item.image" mode=""></image>
								<view class="right">
									<view class="title u-line-1">{{item.title}}</view>
									<view class="author">{{item.author}} 著</view>
									<view class="flex-end">
										<view class="read_btn">阅读</view>
										<text class="read_precent">已读{{item.precent}}</text>
									</view>
								</view>
							</view>
						</view>
						<!-- <view class="book_block" v-for="(item,index) in list " :key="index">
							<view class="book_block_inner">
								<view class="right">
									<view class="title u-line-1">{{item.title}}</view>
									<view class="brief i-line-3">{{item.brief}} 著</view>
									<view class="time">{{item.time}}</view>
								</view>
							</view>
						</view> -->
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex:0,
				tabList:[
					{name:'图书'},
					{name:'文献'}
				],
				list: [
					{
						image: '../../static/pic_banner@2x.png',
						title: '成人偏瘫康复治疗的选择性躯干活动设计',
						brief:'系统介绍康复评定学概念',
						price:'14.80',
						disprice:'14.80',
						author:'戴维斯',
						precent:'55%',
						time:'2020-04-18 12:00'
					},
					{
						image: '../../static/pic_banner@2x.png',
						title: '成人偏瘫康复治疗的选择性躯干活动设计',
						brief:'系统介绍康复评定学概念',
						price:'14.80',
						disprice:'14.80',
						author:'戴维斯',
						precent:'55%',
						time:'2020-04-18 12:00'
					},
					{
						image: '../../static/pic_banner@2x.png',
						title: '成人偏瘫康复治疗的选择性躯干活动设计',
						brief:'系统介绍康复评定学概念',
						price:'14.80',
						disprice:'14.80',
						author:'戴维斯',
						precent:'55%',
						time:'2020-04-18 12:00'
					},
					{
						image: '../../static/pic_banner@2x.png',
						title: '成人偏瘫康复治疗的选择性躯干活动设计',
						brief:'系统介绍康复评定学概念',
						price:'14.80',
						disprice:'14.80',
						author:'戴维斯',
						precent:'55%',
						time:'2020-04-18 12:00'
					},
					{
						image: '../../static/pic_banner@2x.png',
						title: '成人偏瘫康复治疗的选择性躯干活动设计',
						brief:'系统介绍康复评定学概念',
						price:'14.80',
						disprice:'14.80',
						author:'戴维斯',
						precent:'55%',
						time:'2020-04-18 12:00'
					},
					{
						image: '../../static/pic_1@2x.png',
						title: '成人偏瘫康复治疗的选择性躯干活动设计',
						brief:'系统介绍康复评定学概念',
						price:'14.80',
						disprice:'14.80',
						author:'戴维斯',
						precent:'59%',
						time:'2020-04-18 12:00'
					},
				],
			}
		},
		onLoad() {

		},
		methods: {
			reachBottom(){
				console.log('888888')
			},
			goBack(){
				uni.navigateBack() 
			}
		}
	}
</script>

<style scoped lang="scss">
	.bookshelf_wrap{
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
		.bookshelf_content{
			flex: 1;
		}
		.scroll_bookshelf_page{
			position: relative;
			width: 100%;
			height: 100%;
		}
		.scroll_page{
			position: absolute;
			width: 100%;
			height: 100%;
		}
		.kf-nav-wrap{
			width: 100%;		
			.inner_wrap{
				width: 100%;		
				position: relative;
			}
			.index_nav{
				display: flex;
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
			padding:0 30rpx;
			.book_block_inner{
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
			.right{
				min-width: 0;
			}
			.title{
				font-size:32rpx;
				font-weight:bold;
				color:rgba(34,34,34,1);
				margin-bottom: 28rpx;
			}
			.time{
				font-size:24rpx;
				font-weight:400;
				color:rgba(189,193,203,1)
			}
			.brief{
				font-size:26rpx;
				font-weight:500;
				color:rgba(135,139,148,1);
				line-height:40rpx;
				margin-bottom: 30rpx;
			}
			.author{
				font-size:22rpx;
				font-weight:500;
				color:rgba(189,193,203,1);
				margin-bottom:80rpx;
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
