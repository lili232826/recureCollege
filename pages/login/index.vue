<template>
	<view class="login_wrap">
		<view class='inner_wrap'>
			<view class="close_wrap">
				<u-icon name="close" color="#333" size="44" class="" @click="closeLogin"></u-icon>
			</view>
			<view class="phone_title">
				手机号登录
			</view>
			<view class="phone_login_wrap">
				<view class="login_block">
					<image class="phone_icon" src="../../static/image/me/icon_shouji@2x.png" mode=""></image>
					<input class="phone-input" v-model="phone"  placeholder="请输入手机号" placeholder-style="color:#C8CAD2;fontSize:30rpx"/>
				</view>
				<view class="login_block">
					<image class="code_icon" src="../../static/image/me/icon_yanzm@2x.png" mode=""></image>
					<input class="code-input" v-model="code" placeholder="请输入验证码" placeholder-style="color:#C8CAD2;fontSize:30rpx" />
					<view class="code_btn" @tap="getCode">{{tips}}</view>
				</view>
				<view class="login_tip">未注册的手机号验证后自动创建个人账号</view>
			</view>
			
			<view class="login_btn" @click="submit">提交</view>
			<view class="account_btn_wrap" ><text class="account_btn" @click="linktoAccount">账号密码登录</text></view>
		</view>
		<view class="agreement_wrap">
			<view class="agreement_tip">登录/注册即同意遵守华夏康复学院</view>
			<view class="agreement"><text @click="linktoAgree">《用户服务协议》</text>和<text @click="linktoAgreePrivacy">《用户隐私政策》</text></view>
		</view>
		<!-- 倒计时 -->
		<u-verification-code
			change-text="重新获取(Xs)"
			seconds="60" 
			@end="end" 
			@start="start" 
			ref="uCode"
			@change="codeChange"></u-verification-code>
	</view>
		
</template>

<script>	
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				tips:'',
				phone:'',
				code:'',
				resCode:"",
				loginType:'手机号'
			}
		},
		onLoad() {
			// console.log(this.$mp.page.route,getCurrentPages(),'kkkkk'); // 直接获取当前页面路由
		},
		onShow(){
			this.phone='';
			this.code='';
		},
		methods: {
			...mapMutations(['login']),
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if(this.phone.trim().length<=0){
					this.$u.toast('请输入手机号');
					return;
				}
				if(this.$u.test.mobile(this.phone)){
					if(this.$refs.uCode.canGetCode) {
						// 模拟向后端请求验证码
						uni.showLoading({
							title: '正在获取验证码'
						})
						this.$u.get('/member/fg/permissions/app/login/code',{
							phone:this.phone
						}).then(res => {
							if(res.code==0){
								this.resCode=res.data.substring(res.data.length-6);
								uni.hideLoading();
								// 这里此提示会被this.start()方法中的提示覆盖
								this.$u.toast('验证码已发送');
								// 通知验证码组件内部开始倒计时
								this.$refs.uCode.start();
							}	
						}).catch(res=>{
							this.$u.toast(res.msg);
						})
					} else {
						// this.$u.toast('倒计时结束后再重新获取');
					}
				}else{
					this.$u.toast('请输入正确的手机号');
				}
			},
			end() {
				// this.$u.toast('倒计时结束');
			},
			start() {
				// this.$u.toast('倒计时开始');
			},
			goBack(){
				uni.navigateBack() 
			},
			submit(){
				if(this.phone.trim().length<=0){
					this.$u.toast('请输入手机号');
					return;
				}
				if(!this.$u.test.mobile(this.phone)){
					this.$u.toast('请输入正确的手机号');
					return;
				}
				if(this.code.trim().length<=0){
					this.$u.toast('请输入验证码');
					return;
				}
				if(this.resCode==this.code&&this.resCode.length>0){//获取code
					this.$u.get('/member/fg/permissions/verification/phone',{
						account:this.phone,
						code:this.code,
						channel:1
					}).then(res => {
						if(res.data==0){//新手机号
							this.linkTosetPass();
						}else{
							this.$u.post('/member/fg/permissions/app/phone/login',{	//直接登录
								account:this.phone,
								channel:1
							}).then(res => {
								if(res.code==0){
									uni.setStorageSync('Y-Token', res.data.token);
									uni.setStorageSync('user', JSON.stringify(res.data));
									this.$u.toast('登录成功');
									this.login(res.data);
									this.$store.state.hasLogin=true;
									// let routes =getCurrentPages();
									setTimeout(()=>{
										uni.navigateBack() 
									})
								}
							})
						}
					})
				}else{
					this.$u.toast('验证码不正确');
				}
				
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
			linktoAccount(){
				uni.navigateTo({
					url: "/pages/login/accountLogin"
				});
			},
			linkTosetPass(){
				uni.setStorageSync('phone', this.phone);
				uni.navigateTo({
					url: "/pages/login/setPass"
				});
			},
			closeLogin(){
				uni.navigateBack() 
			}
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
