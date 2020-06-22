<template>
	<view class="study_wrap">
		<scroll-view scroll-y="true" style="width: 100%;height: 100%;" @scrolltolower="tolowerBottom">
			<view class="page-box" style="width: 100%;height: 100%;">
				<view class="study_top_wrap">
					<view class="bg">
						<u-navbar :is-back="false" :border-bottom="false" :background="{ background: 'linear-gradient(to right, #3EB78D, #3FB9CD)' }">
							<view class="nav-slot-wrap">
								<view class="study_nav">
									<!-- <u-icon name="arrow-left" color="#fff" @click="goBack" class="arrow-left" size="34"></u-icon> -->
									<text class="title">学习中心</text>
								</view>
							</view>
						</u-navbar>
						<view class="study_top_content">
							<view class="study_time">近一周学习时间：<text class="time_num">{{chartData.totalTimeLength||0}}</text>分钟</view>
							<view class="chart_wrap">
								<canvas canvas-id="canvasLine" id="canvasLine" class="charts" v-if="showChart"></canvas>
								<view class="no_chart_wrap" v-else>
									<image class="no_chart" src="../../static/image/defaultpic/no_chart.png" mode=""></image>
									<text class="tip">快去找找感兴趣的内容吧~</text>
								</view>
							</view>
							
						</view>
					</view>
				</view>
				<view class="study_couser">
					<view class="kf_title"><text class="name">我的课程</text></view>
					<view class="courser_container">
						<view class="course_block" v-for="(item,index) in list" :key="index" @click="linktoDetails(item)">
							<view class="cover_wrap">
								<image v-if="item.img"  class="cover" :src="`${$filePath}?fileName=${item.img}`" mode=""></image>
								<image v-else class="cover" src="../../static/image/defaultpic/course_pic.png" mode=""></image>
								<view class="course_status liveing" v-if="item.resourceType==7&&item.liveStatus==1">直播中</view>
								<view class="course_status livewill" v-if="item.resourceType==7&&item.liveStatus==2">预告</view>
							</view>
							
							<view class="right_cont" v-if="item.resourceType==5||item.resourceType==6">
								<view class="title u-line-2">{{item.name}}</view>
								<view class="bar_bottom">
									<view class="percent_txt">已学习{{item.schedule}}%</view>
									<kfLineProgress height="6" active-color="#3EB78D" :percent="item.schedule"/>
								</view>
							</view>
							<view class="right_cont" v-if="item.resourceType==7">
								<view class="title u-line-2" v-html="item.name">{{item.name}}</view>
								<view class="bar_bottom">
								</view>
								<view><text class="num">{{item.liveTime}}</text></view>
							</view>
						</view>
					</view>
					<u-loadmore v-if="!noDataFleg" :status="status" :load-text="loadText" color="#D5D7E0" margin-top="40" margin-bottom='40'/>
				<!-- 	<view class="index_bottom" @click="linkTo">
						—— 这是我的底线 ——
					</view> -->
					<view class="data_no_wrap flex-vertical" v-if="noDataFleg">
						<image class="kf_nodata_pic" src="../../static/image/defaultpic/no_chart.png" mode=""></image>
						<text class="no_text">暂无课程，快去购买吧~</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>	
	import kfTitle from '@/components/kf-title/kf-title.vue';
	import kfLineProgress from '@/components/kf-line-progress/kf-line-progress.vue';
	import uCharts from '@/components/u-charts/u-charts.js';
	let _self;
	let canvaLineA=null;
	export default {
		components: { kfTitle ,kfLineProgress},
		data() {
			return {
				showChart:true,
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				chartData: {
					categories: ['2012', '2013', '2014', '2015', '2016', '2017','2018',"今年"],
					series: [{
						name: '成交量A',
						data: [35, 20, 25, 37, 4, 20,50,20],
						textColor:"#676E78",
						style:"curve",
						format:(val)=>{return val+'分钟'}
					}]
				},
				pageCount:0,
				courseMyPrames:{
					pageNum:1,
					pageSize:50,
					resourceType:6
				},
				list: [],
				noDataFleg:false,
				status: 'loading',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '正在加载中...',
					nomore: '这是我的底线'
				}
			}
		},
		onLoad() {
			_self = this;
			this.cWidth=uni.upx2px(660);
			this.cHeight=uni.upx2px(360);
		},
		onShow() {
			this.getChart();
			this.getMyCourse();
		},
		methods: {
			showLineA(canvasId,chartData){
				canvaLineA=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'line',
					fontSize:11,
					legend:{show:false},
					// dataLabel:false,
					padding:[20,20,20,20],
					colors:['#fe960d',"#fac911"],
					dataPointShape:true,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					categories: chartData.date,
					series: [{
						name:'',
						data:chartData.timeLength,
						textColor:"#676E78",
						style:"curve",
						format:(val)=>{return val+'分钟'}
					}],
					animation: true,
					xAxis: {
						type:'grid',
						gridColor:'#f4f3f3',
						dashLength:8,
						disableGrid:false,
						axisLine:false,
						// boundaryGap: true,
						//disabled:true
					},
					yAxis: {
						disabled:true,
						disableGrid:true,
						format:(val)=>{return val.toFixed(0)+'元'}
					},
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					extra: {
						line:{
							type: 'straight'
						}
					}
				});
				
			},
			goBack(){
				uni.navigateBack() 
			},
			getChart(){		
				this.showChart=true;
				this.$u.get('/resource/fg/course-library/get/learning/statistics?',{
				}).then(res => {	
					if(res.data){
						this.chartData=res.data;
						this.chartData.date[this.chartData.date.length-1]="今天"
						this.showLineA("canvasLine",this.chartData);
						
					}
				}).catch(res=>{
					this.showChart=false;
				})
			},
			getMyCourse(){
				if(this.$store.state.hasLogin){//我的课程需登录查看
					this.noDataFleg=false;
					this.status="loading";
					this.$u.get('/resource/fg/resource/get/learning/statistics',{
						...this.courseMyPrames
					}).then(res => {
						if(res.data){
							this.list=res.data.list||[];
							this.pageCount=res.data.pages;
							if(this.list.length==0){
								this.noDataFleg=true;
							}
							if(this.pageCount==1){
								this.status="nomore";
							}
						}	
					}).catch(res=>{
						this.list=[];
						this.noDataFleg=true;
					})
				}else{
					this.list=[];
					this.noDataFleg=true;
				}	
			},
			getMoreMyCourse(){
				this.$u.get('/resource/fg/resource/get/learning/statistics',{
					...this.courseMyPrames
				}).then(res => {	
					if(res.data){
						this.list=this.list.concat(res.data.list);
						this.pageCount=res.data.pages;
						// console.log(res.data.list,'999999')
					}	
				})
			},
			tolowerBottom(){
				if(this.courseMyPrames.pageNum<this.pageCount){
					this.courseMyPrames.pageNum++;
					this.getMoreMyCourse();
					this.status="loading"
				}else{
					this.status="nomore"
				}
			},
			linktoDetails(item){
				let resourceType=item.resourceType;
				let oid=item.id;
				if(resourceType==5){
					uni.navigateTo({
						url: "/pages/video/index?oid="+oid
					});
				}
				if(resourceType==7){
					uni.navigateTo({
						url: "/pages/liveCourse/index?oid="+oid
					});
				}
				if(resourceType==6){
					uni.navigateTo({
						url: "/pages/course/index?oid="+oid
					});
				}	
			},	
			getDateWeek () {
			  let lastDate = [];
			  for (let i = 0; i < 7; i++) {
				let date = new Date(new Date().setDate(new Date().getDate() - i)).toLocaleDateString();
				let dateArr = date.split('/');
				if (dateArr[1] < 10) {
				  dateArr[1] = "0" + dateArr[1]
				}
				if (dateArr[2] < 10) {
				  dateArr[2] = "0" + dateArr[2]
				}
				let resStr = dateArr[1] + "." + dateArr[2]
				lastDate.unshift(resStr)
			  }
			  lastDate[lastDate.length - 1] = "今天"
			  return lastDate
			}
		}
	}
</script>

<style scoped lang="scss">
.study_wrap{
	height: calc(100vh - var(--window-top));
	width: 100%;
}
.study_top_wrap{
	height:740rpx ;
	.bg{
		height: 518rpx;
		background: linear-gradient(to right, #3EB78D, #3FB9CD);
	}
}
.study_nav{
	color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 24rpx 0 24rpx;
	.title{
		flex: 1;
		text-align:center;
		font-size: 34rpx;
		font-weight: bold;
	}
}
.study_time{
	color: #fff;
	font-size: 28rpx;
	padding-top:80rpx;
	margin-bottom: 40rpx;	
	.time_num{
		font-size: 54rpx;
		font-weight: bold;
	}
}
.study_top_content{
	padding: 0 30rpx;
	.chart_wrap{
		width: 690rpx;
		height: 410rpx;
		border-radius: 20rpx;
		background-color: #fff;
		box-shadow: 0 0 20rpx 8rpx #E8EBEF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
		
	.charts{
		width: 660rpx;
		height: 360rpx;
	}
}
.study_couser{
	padding: 20rpx 30rpx 1rpx;
	.kf_title{
		margin-bottom: 10rpx;
	}
	.name{
		font-size: 40upx;
		color: #222222;
		font-weight: bold;
	}	
	.courser_container{
		// height: 520rpx;
	}
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
			background-color: #F8F8F8;
		}
		.title{
			color: #202021;
			font-size: 30rpx;
			line-height: 44rpx;
			font-weight: bold;
			margin-bottom: 36rpx;
		}
		.percent_txt{
			color: #9C9D9C;
			font-size: 22rpx;
		}
		.num{
			color:#9C9D9C;
			font-size: 22rpx;
		}
	}
}
.index_bottom{
	height: 108rpx;
	line-height: 108rpx;
	text-align: center;
	color: #D5D7E0;
	font-size: 24rpx;
}
.no_chart_wrap{
	display: flex;
	justify-content: center;
	flex-direction: column;
	.no_chart{
		width: 310rpx;
		height: 221rpx;
		margin-bottom: 50rpx;
	}
	.tip{
		color: #CBCBCB;
		font-size: 28rpx;
	}
}

</style>
