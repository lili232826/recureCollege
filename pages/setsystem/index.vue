<template>
	<view class="set_wrap">
		<kfNav title="设置" />
		<view class="set_content">
			<view class="set_block" v-for="(item,index) in listArr" :key="index">
				<view class="set_line" v-for="(list,ind) in item" :key="ind" @click="linktoPage(list)" v-if="list.showFleg">			
					<view class="title">{{list.name}}
						<view class="version" v-if="list.name=='关于我们'&&!updateData.versionNumber">{{version}}</view>
						<view class="version_new" v-if="list.name=='关于我们'&&updateData.versionNumber">有新版本{{updateData.versionNumber}}</view>
					</view>
					<u-icon class="arrow-right" name="arrow-right" color="#AEB0B8" ></u-icon>	
				</view>
			</view>
		</view>
		<view>
			<view class="sign_out_btn" @click="loginOut" v-if="this.$store.state.hasLogin">退出登录</view>
		</view>
		<u-modal v-model="showModal" class="vip_modal" 
			title="权益迁移" 
			:content-slot="true"
			:title-style="{fontWeight:'bold'}"
			:show-cancel-button="true"
			confirm-text="转移到新账号"
			cancel-text="转移到已有账号"
			confirm-color="#25B4B5"
			>
			<view class="slot-vip_modal">
				<text class="warn_txt">您目前的会员权益仅能在本设备下使用，会员权益迁入康复学院账号后可跨设备使用</text>
				<u-icon class="close_modal" name="close" color="#AEB0B8" size="28" @click="closeModal"></u-icon>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import kfNav from '@/components/kf-nav/kf-nav.vue';
	export default {
		components: { kfNav },
		data() {
			return {
				showModal:false,
				listArr: [
					[{
						name: "修改密码",
						path: "/pages/setsystem/changePassword",
						showFleg:true,//判断机构和普通用户的显示
					   
					  }, {
						name: "绑定手机号",
						path: "/pages/setsystem/bindPhone",
						showFleg:true
					  }
					], [{
						name: "关于我们",
						//name:"换绑手机",
						path: "/pages/setsystem/aboutus",
						showFleg:true
					  },
					  {
						name: "意见反馈",
						path: "/pages/setsystem/feedback",
						showFleg:true
					   
					  }]
				],
				version:'',
				updateData:{
					versionNumber:''
				}
			}
		},
		onLoad() {
			this.getSystemInfo()
		},
		onReady(){
			// this.$store.state.hasLogin
		},
		onShow(){
			console.log('show')
			if(this.$store.state.user.level==2){//机构用户,不显示绑定手机号
				this.listArr[0][1]['showFleg']=false
			}else{
				this.listArr[0][1]['showFleg']=true
			}		 
		},
		methods: {
			getSystemInfo(){
				let _this=this;
				// #ifdef APP-PLUS
				this.version="V "+plus.runtime.version;
				uni.getSystemInfo({
				    success: (res) =>{
						this.platform=res.platform;
						if(this.platform=="android"){
							this.$u.get('/file/app/get/new/version?type=2',{
							}).then(res => {
								if(res.code==0){
									this.updateData=res.data;
									// console.log(this.updateData,"_this.updateData",)
								}
							})
						}else if(this.platform=="ios"){
							console.log(this.platform,'ios');
							this.$u.get('/file/app/get/new/version?type=1',{
							}).then(res => {
								if(res.code==0){
									this.updateData=res.data
								}
							})
						}
				    }
				});
				// #endif
			},
			clickModal(){
				this.showModal=true;
			},
			linktoPage(list){
				let path=list.path;
				let name=list.name;
				if(name=='修改密码'&&!this.$store.state.hasLogin){
					uni.navigateTo({
						url: "/pages/login/index"
					});
				}else if (name=="绑定手机号"&&!this.$store.state.hasLogin){
					uni.navigateTo({
						url: "/pages/login/index"
					});
				}else{
					uni.navigateTo({
						url: path
					});
				}
				
			},
			linktoNews(){
				uni.navigateTo({
					url: "/pages/news/index"
				});
			},
			closeModal(){
				this.showModal=false;
			},
			loginOut(){
				let _this=this;
				uni.showModal({
				    title: '提示',
				    content: '确定退出登录吗？',
				    success: function (res) {
				        if (res.confirm) {
				            uni.setStorageSync('Y-Token', '');
				            uni.setStorageSync('user', JSON.stringify({}));
				            _this.$store.state.user={};
							_this.$store.state.hasLogin=false;
							uni.switchTab({
							    url: '/pages/person/index'
							});
						   setTimeout(()=>{
							   uni.navigateTo({
								url: "/pages/login/index"
							   });
						   },500)
				        } else if (res.cancel) {
				            // console.log('用户点击取消');
				        }
				    }
				});
				
			}
		}
	}
</script>

<style scoped lang="scss">
.set_wrap{
	width: 100%;
	height: calc(100vh - var(--window-top));
	background-color:#f8f8f8 ;
	.sign_out_btn{
		width: 670rpx;
		height:84rpx;
		margin: 558rpx auto 0;
		line-height: 84rpx;
		text-align: center;
		border:3rpx solid #DFF1F1;
		border-radius:42rpx;
		font-size:30rpx;
		font-weight:500;
		color:#25B4B5;
	}
}	
.set_content{
	.set_block{
		background-color:#fff;
		// border-radius: 20rpx;
		margin-bottom: 20rpx;
	}
	.set_line{
		display: flex;
		align-items: center;
		height: 108rpx;
		padding:0 28rpx;
		justify-content: space-between;
		border-bottom:1rpx solid #EBEBEB;
		&:last-child{
			border-bottom: 0;
		}
		.title{
			color:#333333;
			font-size: 30rpx;
			padding-left: 26rpx;
			flex:1;
			// font-weight:500;
		}
		.version{
			font-size:24rpx;
			float: right;
			font-weight:500;
			padding-right: 10rpx;
			color: #BDC1CB;
		}
		.version_new{
			font-size:24rpx;
			float: right;
			font-weight:500;
			padding-right: 10rpx;
			color:#FE1F22;
		}
	}
}
.vip_modal{
	.slot-vip_modal{
		padding: 40rpx;
		position: relative;
	}
	.close_modal{
		position: absolute;
		top: -54rpx;
		right: 28rpx;
	}
	.warn_title{
		color: #333333;
		font-size: 34rpx;
		margin-bottom: 36rpx;
	}
	.warn_txt{
		color: #666666;
		font-size: 26rpx;
		line-height: 40rpx;
	}
}
</style>
