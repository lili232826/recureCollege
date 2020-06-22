<template>
	<view class="login_wrap">
		<view class='inner_wrap'>
			<view class="close_wrap">
				<u-icon name="close" color="#333" size="44" class=""  @click="goBack"></u-icon>
			</view>
			<view class="phone_title">
				账号密码登录
			</view>
			<view class="account_login_wrap">
				<view class="login_block">
					<image class="user_icon" src="../../static/image/me/login_icon_user@2x.png" mode=""></image>
					<input class="phone-input"  placeholder="请输入用户名或手机号" placeholder-style="color:#C8CAD2;fontSize:30rpx" v-model="user"/>
				</view>
				<view class="login_block">
					<image class="pass_icon" src="../../static/image/me/icon_mima@2x.png" mode=""></image>
					<input class="code-input"  v-model="password" placeholder="请输入密码" placeholder-style="color:#C8CAD2;fontSize:30rpx" :password="passHide"/>
					<image class="pass_hide_icon" src="../../static/image/me/login_icon_bishang@2x.png" mode="" v-if="passHide" @click="passHide=false"></image>
					<image class="pass_show_icon" src="../../static/image/me/login_icon_zhenkai@2x.png" mode="" v-if="!passHide" @click="passHide=true"></image>
				</view>
				<view class="login_tip flex-end"><text  @click="linkToResetPass">忘记密码？</text></view>
			</view>
			<view class="login_btn" @click="submitAccount">提交</view>
		</view>
		<view class="agreement_wrap">
			<view class="agreement_tip">登录/注册即同意遵守华夏康复学院</view>
			<view class="agreement"><text @click="linktoAgree">《用户服务协议》</text>和<text @click="linktoAgreePrivacy">《用户隐私政策》</text></view>
		</view>
	</view>
		
</template>

<script>
	import md5Libs from "uview-ui/libs/function/md5";
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				passHide:true,
				password:'',
				user:""
			}
		},
		onLoad() {
			
		},
		onShow(){
			this.passHide=true;
			this.password='';
			this.user="";
		},
		methods: {
			...mapMutations(['login']),
			goBack(){
				uni.navigateBack() 
			},
			submitAccount(){
				if(this.user.trim().length<=0){
					this.$u.toast('请输入账号');
					return;
				}
				if(this.password.trim().length<=0){
					this.$u.toast('请输入密码');
					return;
				}
				this.$u.post('/member/fg/permissions/login',{	//账户登录
					account:this.user,
					password:md5Libs.md5(this.password),
					channel:1
				}).then(res => {
					if(res.code==0){
						uni.setStorageSync('Y-Token', res.data.token);
						uni.setStorageSync('user', JSON.stringify(res.data));
						this.login(res.data);
						this.$store.state.hasLogin=true;
						this.$u.toast('登录成功');
						this.login(res.data);
						// let routes =getCurrentPages();
						setTimeout(()=>{
							uni.navigateBack({  
							   delta: 2
							})
						},1000)
					}
				}).catch(res=>{
					this.$u.toast(res.msg);
				})
			},
			linkToResetPass(){
				uni.navigateTo({
					url: "/pages/login/resetPass"
				});
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
		}
	}
</script>

<style scoped lang="scss">
	.login_wrap{
		width: 100%;
		height: calc(100vh - var(--window-top));
		background-color:#fff ;
		.inner_wrap{
			padding: 0 42rpx;
		}
		.close_wrap{
			padding: 80rpx 0 30rpx;
			margin-bottom: 80rpx;
		}
		.phone_title{
			font-size:44rpx;
			font-weight:bold;
			color:#333;
			margin-bottom: 20rpx;
		}
		.phone_icon{
			width: 24rpx;
			height: 33rpx;
			flex-shrink: 0;
			margin-right: 31rpx;
		}
		.code_icon{
			width: 35rpx;
			height: 33rpx;
			flex-shrink: 0;
			margin-right: 20rpx;
		}
		.user_icon{
			width: 26rpx;
			height: 33rpx;
			flex-shrink: 0;
			margin-right: 30rpx;
		}
		.pass_icon{
			width: 33rpx;
			height: 41rpx;
			flex-shrink: 0;
			margin-right: 25rpx;
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
		.login_block{
			padding-left:24rpx;
			height: 126rpx;
			border-bottom:1rpx solid #E3E3E3;
			display: flex;
			align-items: center;
		}
		.code-input{
			flex:1;
		}
		.phone-input{
			width: 100%;
			}
		.code_btn{
			font-size:28rpx;
			font-weight:500;
			color:#25B4B5;
			padding: 0 29rpx;
			border-left:1rpx solid #E4E4E4
		}
		.login_tip{
			font-size:26rpx;
			font-weight:500;
			color:#C8CAD2;
			padding: 29rpx 23rpx;
			margin-bottom: 13rpx;
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
			color:#FFFFFF;
			background: linear-gradient(to right, #3EB78D, #3FB9CD);
			box-shadow:  0px 10rpx 10rpx rgb(210,241,240);
			margin-bottom: 50rpx;
		}
		.account_btn_wrap{
			font-size: 28rpx;
			text-align: center;
			color: #25B4B5;
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
