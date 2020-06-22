<template>
	<view class="agreement_wrap">
		<kfNav :title="title" bgColor="#fff"/>
		<view class="agreement_content">
			<view class="inner_content">
				<scroll-view scroll-y style="height: 100%;width: 100%;">
					<view class="title">
						{{agreementObj.cnkey}}
					</view>
					<view class="content" v-html="agreementObj.value">								
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
		
</template>

<script>	
	import kfNav from '@/components/kf-nav/kf-nav.vue';
	export default {
		components: { kfNav},
		data() {
			return {
				cnkey:'',
				title:"注册协议",
				agreementObj:{
					value:'',
					cnkey:''
				}
			}
		},
		onLoad(options) {
			let key=options.cnkey;
			if(key=='privacy'){
				this.cnkey="用户隐私政策";
				this.title="隐私政策"
			}else{
				this.cnkey="用户服务协议";
				this.title="注册协议"
			}
			this.getAgreement()
		},
		methods: {
			getAgreement(){
				this.$u.get('/sysuser/fg/dictionary/dictionary',{
					cnkey:this.cnkey
				}).then(res => {	
					if(res.data){
						this.agreementObj=res.data;
						// console.log(res.data,'888888')
					}	
				})
			},
			goBack(){
				uni.navigateBack() 
			}
			
			
		}
	}
</script>

<style scoped lang="scss">
	.agreement_wrap{
		width: 100%;
		height: calc(100vh - var(--window-top));
		background-color:#fff ;
		display: flex;
		flex-direction: column;
		.agreement_content{
			width: 100%;
			flex: 1;
			position: relative;
		}
		.inner_content{
			height: 100%;
			position: absolute;
			width: 100%;
			height: 100%;
			
		}
		.title{
			font-size:34rpx;
			font-weight:bold;
			color:#333;
			margin-bottom: 20rpx;
			padding-top: 50rpx;
			padding-left:30rpx ;
		}
		.content{
			font-size:28rpx;
			font-weight:500;
			color:#333333;
			line-height:48px;
			padding: 0 30rpx 35rpx 30rpx;
		}
	}
</style>
