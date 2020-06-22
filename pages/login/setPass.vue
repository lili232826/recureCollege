<template>
	<view class="reset_pass_wrap">
		<kfNav title="设置密码" />
		<view class='inner_wrap'>
			<view class="login_block">
				<input class="code-input"  placeholder="密码" placeholder-style="color:#C8CAD2;fontSize:30rpx" :password="passHide" v-model="password"/>
				<image class="pass_hide_icon" src="../../static/image/me/login_icon_bishang@2x.png" mode="" v-if="passHide" @click="passHide=false"></image>
				<image class="pass_show_icon" src="../../static/image/me/login_icon_zhenkai@2x.png" mode="" v-if="!passHide" @click="passHide=true"></image>
			</view>
			<view class="login_btn" :class="password.trim().length>0?'active':''" @click="submit">登录</view>
			
		</view>
		<view class="agreement_wrap">
			<view class="agreement_tip">登录/注册即同意遵守华夏康复学院</view>
			<view class="agreement"><text @click="linktoAgree">《用户服务协议》</text>和<text @click="linktoAgreePrivacy">《用户隐私政策》</text></view>
		</view>
		
	</view>
		
</template>

<script>	
	import md5Libs from "uview-ui/libs/function/md5";
	import kfNav from '@/components/kf-nav/kf-nav.vue';
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		components: { kfNav},
		data() {
			return {
				tips:'',
				password:'',
				passHide:true
			}
		},
		onLoad() {
			this.phone=uni.getStorageSync('phone')	
		},
		methods: {
			...mapMutations(['login']),
			submit(){
				let _this=this;
				if(this.password.trim().length>0){
					if(this.password.trim().length>=6){
						this.$u.post('/member/fg/permissions/app/phone/login',{
							account:this.phone,
							password:md5Libs.md5(this.password),
							channel:1
						}).then(res => {
							if(res.code==0){
								uni.setStorageSync('Y-Token', res.data.token);
								uni.setStorageSync('user', JSON.stringify(res.data));
								this.$u.toast('登录成功');
								_this.login(res.data);
								_this.$store.state.hasLogin=true;
								let routes =getCurrentPages();
								setTimeout(()=>{
									uni.navigateBack({
									   delta: 2
									})
								})
							}
						})
					}else{
						this.$u.toast('密码不得少于六位');
					}
				}
			},
			goBack(){
				uni.navigateBack() 
			},
			linktoAgree(){
				uni.navigateTo({
					url: "/pages/login/agreement"
				});
			},
			linktoAgreePrivacy(){
				uni.navigateTo({
					url: "/pages/login/agreement?cnkey=privacy"
				});
			},
			linkToIndex(){
				uni.switchTab({
					url: "/pages/index/index"
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.reset_pass_wrap{
		width: 100%;
		height: calc(100vh - var(--window-top));
		background-color:#fff ;
		.inner_wrap{
			padding: 0 42rpx;
		}
		.login_block{
			padding-left:24rpx;
			height: 126rpx;
			border-bottom:1rpx solid #E3E3E3;
			display: flex;
			align-items: center;
			margin: 160rpx 0 110rpx;
		}
		.code-input{
			flex:1;
		}
		.login_btn{
			width: 600rpx;
			height:80rpx;
			margin: 0 auto;
			line-height: 80rpx;
			text-align: center;
			border-radius:40rpx;
			font-size:30rpx;
			font-weight:bold;
			margin-bottom: 50rpx;
			background-color: #E6E6E6;
			color:#999999;
			&.active{
				color:#FFFFFF;
				box-shadow:  0px 10rpx 10rpx rgb(210,241,240);
				background: linear-gradient(to right, #3EB78D, #3FB9CD);
			}
		}
		.account_btn_wrap{
			font-size: 28rpx;
			text-align: center;
			color: #25B4B5;
		}
		.pass_hide_icon{
			width: 44rpx;
			height: 44rpx;
			flex-shrink: 0;
		}
		.pass_show_icon{
			width: 44rpx;
			height: 44rpx;
			flex-shrink: 0;
		}
		.agreement_wrap{
			width: 100%;
			position: fixed;
			bottom: 50rpx;
			left: 0;
			text-align: center;
			.agreement_tip{
				color: #878B94;
				font-size: 28rpx;
				margin-bottom: 6rpx;
			}
			.agreement{
				font-size: 22rpx;
				color: #25B4B5;
			}
		}
	}
</style>
