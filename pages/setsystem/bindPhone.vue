<template>
	<view class="bindPhone_wrap">
		<kfNav title="手机验证" />
		<view>
			<view class="bind_top_wrap">
				<image class="bind_phone_pic" src="../../static/image/me/pic_yzsf@2x.png" mode=""></image>
				<text class="bind_tip">更换手机后，下次登录可使用新手机号</text>
			</view>
			<u-cell-group>
				<u-field
					v-model="newPhone"
					label="新手机号"
					placeholder="请输入手机号"
					placeholder-style="fontSize:30rpx"
					:field-style="{height:'64rpx'}"
				>
				</u-field>
				<u-field
					v-model="code"
					label="验证码"
					placeholder="请输入验证码"
					placeholder-style="fontSize:30rpx"
					:field-style="{height:'64rpx'}"
				>
					<view slot="right" @tap="getCode" class="code_btn">
						{{tips}}
					</view>
				<!-- 	<u-button size="mini"  type="success" >
						
					</u-button> -->
				</u-field>
			</u-cell-group>
		</view>
		<view>
			<view class="sign_out_btn" @click="submit">提交</view>
		</view>
		<!-- 倒计时 -->
		<u-verification-code
			change-text="重新获取(Xs)" 
			@end="end" 
			@start="start" 
			ref="uCode"
			@change="codeChange"></u-verification-code>
	</view>
</template>

<script>
	import kfNav from '@/components/kf-nav/kf-nav.vue';
	export default {
		components: { kfNav },
		data() {
			return {
				newPhone:'',
				code:'',
				resCode:'',
				tips:''
			}
		},
		onLoad() {

		},
		methods: {
			getCode() {
				if(this.newPhone.trim().length>0){
					if(this.$u.test.mobile(this.newPhone)){
						if(this.$refs.uCode.canGetCode) {
							// 模拟向后端请求验证码
							uni.showLoading({
								title: '正在获取验证码'
							})
							this.$u.get('/member/fg/personal-center/code-phone',{
								phone:this.newPhone
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
							// this.$u.toast('倒计时结束后再发送');
						}
					}else{
						this.$u.toast('请输入正确的手机号');
					}
				}else{
					this.$u.toast('请输入手机号');
				}
				
			},
			submit(){
				if(this.newPhone.trim().length<=0){
					this.$u.toast('请输入手机号');
					return;
				}
				if(!this.$u.test.mobile(this.newPhone)){
					this.$u.toast('请输入正确的手机号');
					return;
				}
				if(this.code.trim().length<=0){
					this.$u.toast('请输入验证码');
					return;
				}
				if(this.resCode==this.code&&this.resCode.length>0){
					this.$u.post('/member/fg/personal-center/update/phone',{
						phone:this.newPhone,
						code:this.code
					}).then(res => {
						if(res.code==0){
							this.$u.toast('修改成功');
							setTimeout(()=>{
								uni.navigateBack();
							})
						}	
					}).catch(res=>{
						this.$u.toast(res.msg);
					})
				}else{
					this.$u.toast('验证码不正确');
				}
			},
			codeChange(text) {
					this.tips = text;
			},
			
			end() {
				// this.$u.toast('倒计时结束');
			},
			start() {
				// this.$u.toast('倒计时开始');
			}
		}
	}
</script>

<style scoped lang="scss">
.bindPhone_wrap{
	width: 100%;
	height: calc(100vh - var(--window-top));
	background-color:#f8f8f8 ;
	.sign_out_btn{
		width: 600rpx;
		height:80rpx;
		margin: 141rpx auto 0;
		line-height: 80rpx;
		text-align: center;
		border-radius:40rpx;
		font-size:30rpx;
		font-weight:bold;
		color:#FFFFFF;
		background: linear-gradient(to right, #3EB78D, #3FB9CD);
	}
	.bind_top_wrap{
		width: 100%;
		height: 370rpx;
		background-color: #fff;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		margin-bottom: 20rpx;
	}
	.bind_phone_pic{
		width: 227rpx;
		height: 226rpx;
		margin-top: 42rpx;
		margin-bottom: 30rpx;
	}
	.bind_tip{
		font-size:28rpx;
		font-weight:500;
		color:#878B94;
	}
	.code_btn{
		color: #25B4B5;
		padding-left: 24rpx;
		border-left: 1rpx solid #E4E4E4;
	}
}	
</style>
