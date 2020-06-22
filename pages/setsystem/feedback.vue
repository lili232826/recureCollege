<template>
	<view class="feedback_wrap">
		<kfNav title="意见反馈" />
		<view class="textarea_wrap">
			<textarea class="textarea" placeholder-style="#D2D6E0" placeholder="您的使用感受或建议" v-model="value" maxlength='300'/>
			<text class="all_num">{{computedLen}}/300</text>
		</view>
		<view  class="upload_wrap">
			<view class="title">
				上传图片
			</view>
			<view>
				<u-upload ref="kfUpload" 
				:action="action" 
				:file-list="fileList" 
				:auto-upload="false" 
				max-count="6" 
				:max-size="1 * 1024 * 1024" 
				@on-remove="remove"
				@on-uploaded="uploaded">	
				</u-upload>
				<!-- <u-upload ref="uUpload"  :action="action" :auto-upload="true" :file-list="fileList"
				  max-count="6" :max-size="1 * 1024 * 1024" >
					
				</u-upload> -->
			</view>
			
		</view>
		<view class="submit_btn" :class="value.trim().length>0?'active':''" @click='submit'>
			提交
		</view>
	</view>
	
</template>

<script>
	import kfNav from '@/components/kf-nav/kf-nav.vue';
	export default {
		components: { kfNav },
		data() {
			return {
				value:"",
				// 演示地址，请勿直接使用
				action: this.$fileUpload,
				submitObj:{
				  
				},
				fileList: [],
				fileUploadedList:[]
			}
		},
		computed: {
			computedLen() {
				return this.value.length>300 ? 300 : this.value.length
			}
			
		},
		onLoad() {
			
		},
		methods: {
			uploaded(lists){
				this.fileUploadedList=[];
				lists.map( item => {
				    this.fileUploadedList.push(item.response);
				});
				// console.log(this.fileList,'6666666666666666666666')
			},
			remove(index, lists){
				console.log(index, lists,'index, lists')
			},
			submit(){
				if(this.value.trim().length>0){
					// this.$refs.kfUpload.upload();
					this.$u.post('/sysuser/fg/message/save',{
						"content": this.value,
						"imgList": this.fileUploadedList,
						"source": 2
					}).then(res => {	
						// console.log(res,'9999999999999')
						if(res.code==0){
							// uni.hideLoading();
							// this.$u.toast('反馈成功');
							setTimeout(()=>{
								uni.navigateBack() 
							},1000)
						}	
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
.feedback_wrap{
	width: 100%;
	height: calc(100vh - var(--window-top));
	background-color:#f8f8f8 ;
	.submit_btn{
		width: 600rpx;
		height:80rpx;
		margin: 100rpx auto 0;
		line-height: 80rpx;
		text-align: center;
		border-radius:40rpx;
		font-size:30rpx;
		font-weight:bold;
		color:#FFFFFF;
		background-color: #D6D6D6;
		&.active{
			color:#FFFFFF;
			box-shadow:  0px 10rpx 10rpx rgb(210,241,240);
			background: linear-gradient(to right, #3EB78D, #3FB9CD);
		}
	}
	.textarea_wrap{
		padding: 38rpx 40rpx;
		height: 370rpx;
		background-color: #fff;
		position: relative;
		margin-bottom: 20rpx;
		.all_num{
			font-size:24rpx;
			font-weight:400;
			color:#D2D6E0;
			position: absolute;
			bottom: 20rpx;
			right: 26rpx;
		}
		.textarea{
			width: 100%;
		}
	}
	.upload_wrap{
		padding: 36rpx 39rpx;
		background-color: #fff;
		.title{
			font-size:30rpx;
			font-weight:500;
			color:#333333;
			margin-bottom: 20rpx;
		}
	}
}	
.slot-btn {
	width: 329rpx;
	height: 140rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background: rgb(244, 245, 246);
	border-radius: 10rpx;
}

.slot-btn__hover {
	background-color: rgb(235, 236, 238);
}
</style>
