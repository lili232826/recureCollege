<template>
	<view class="reset_pass_wrap">
		<kfNav title="重置密码" />
		<view class='inner_wrap'>
			<!-- 输入手机号 -->
			<view class="add_phone_wrap" v-if="type==0">
				<view class="login_block">
					<input class="code-input"  placeholder="请输入手机号" placeholder-style="color:#C8CAD2;fontSize:30rpx" v-model="phone"/>
				</view>
				<view class="login_btn send_btn" @click="sendCode" :class="phone.trim().length>0?'active':''">发送验证码</view>
			</view>
			<!-- 输入验证码 -->
			<view class="get_code_wrap" v-else>
				<view class="code_tip">验证码已发送至{{phone}}，请查收</view>
				<view class="form_wrap">
					<view class="login_block">
						<view class="input_label">验证码</view>
						<input v-model="code" class="code-input"  placeholder="请输入验证码" placeholder-style="color:#C8CAD2;fontSize:30rpx" />
						<view class="code_btn" @click="getCode">{{tips}}</view>
					</view>
					<view class="login_block">
						<view class="input_label">新密码</view>
						<input v-model="password1" class="phone-input"  placeholder="请输入新密码" placeholder-style="color:#C8CAD2;fontSize:30rpx"/>
					</view>
					<view class="login_block">
						<view  class="input_label">确认密码</view>
						<input v-model="password2" class="phone-input"  placeholder="请再次输入新密码" placeholder-style="color:#C8CAD2;fontSize:30rpx"/>
					</view>
				</view>
				<view class="login_btn active send_btn" @click="submit">提交</view>
			</view>
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
	import md5Libs from "uview-ui/libs/function/md5";
	import kfNav from '@/components/kf-nav/kf-nav.vue';
	export default {
		components: { kfNav},
		data() {
			return {
				tips:'',
				phone:'',
				resCode:'',
				code:'',
				password1:'',
				password2:'',
				type:0,//
			}
		},
		onLoad() {
			
		},
		methods: {
			sendCode(){
				if(this.phone.trim().length>0){
					if(this.$u.test.mobile(this.phone)){
						this.getCode()
					}else{
						this.$u.toast('请输入正确的手机号');
					}
				}
			},
			codeChange(text) {
					this.tips = text;
			},
			getCode() {
				if(this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					this.$u.get('/member/fg/permissions/reset/password/send/code',{
						phone:this.phone
					}).then(res => {
						if(res.code==0){
							this.resCode=res.data.substring(res.data.length-6);
							uni.hideLoading();
							// 这里此提示会被this.start()方法中的提示覆盖
							this.$u.toast('验证码已发送');
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
							this.type=2;
						}	
					}).catch(res=>{
						// console.log(res,'666666')
						this.$u.toast(res.msg);
					})
				} else {
					// this.$u.toast('倒计时结束后再发送');
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
				if(this.code.trim().length<=0){
					this.$u.toast('请输入验证码');
					return;
				}
				if(this.password1.trim().length<=0){
					this.$u.toast('请输入新密码');
					return;
				}
				if(this.password2.trim().length<=0){
					this.$u.toast('请再次输入密码');
					return;
				}
				if(this.password1!=this.password2){
					this.$u.toast('密码输入不一致');
					return;
				}
				if(this.resCode==this.code&&this.resCode.length>0){
					this.$u.post('/member/fg/permissions/reset/password',{
					  "code": this.code,
					  "newPassword1": md5Libs.md5(this.password1),
					  "newPassword2": md5Libs.md5(this.password2),
					  "phone": this.phone
					}).then(res => {
						if(res.code==0){
							this.$u.toast('修改成功');
							setTimeout(()=>{
								uni.navigateTo({
									url: "/pages/login/accountLogin"
								});
							})
						}	
					}).catch(res=>{
						console.log(res,'hhhh')
						this.$u.toast(res.msg);
					})
				}
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
			
		}
		.add_phone_wrap{
			padding:150rpx 50rpx 0rpx;
		}
		.form_wrap{
			background-color: #fff;
		}
		.login_block{
			padding-left:24rpx;
			height: 126rpx;
			border-bottom:1rpx solid #E3E3E3;
			display: flex;
			align-items: center;
			// margin: 160rpx 0 110rpx;
		}
		.code-input{
			flex:1;
		}
		.input_label{
			width:140rpx;
			font-size:30rpx;
			font-weight:500;
			color:#333333;
			margin-right: 20rpx;
		}
		.code_tip{
			height: 83rpx;
			font-size:26rpx;
			font-weight:500;
			color:#F5861A;
			line-height: 83rpx;
			padding-left: 30rpx;
			// text-align: center;
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
		.send_btn{
			margin-top: 160rpx;
		}
		.code_btn{
			font-size:28rpx;
			font-weight:500;
			color:#25B4B5;
			padding: 0 29rpx;
			border-left:1rpx solid #E4E4E4
		}
	}
</style>
