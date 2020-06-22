<template>
	<view class="change_password_wrap">
		<kfNav title="修改密码" />
		<view>
			<u-cell-group>
				<u-field
					v-model="oldPass"
					:password="true"
					label="旧密码"
					placeholder="请输入旧密码"
					:error-message="errorOldp"
					:field-style="{height:'64rpx'}"
					@input="inputOld"
				>
				</u-field>
				<u-field
					v-model="newPass"
					:password="true"
					label="新密码"
					placeholder="请输入新密码"
					:error-message="errorNewp"
					:field-style="{height:'64rpx'}"
					@input="inputNew"
				>
				</u-field>
				<u-field
					v-model="newPassTwo"
					:password="true"
					label="新密码"
					placeholder="请再次输入"
					:error-message="errorNewp2"
					:field-style="{height:'64rpx'}"
					@input="inputNew2"
				>
				</u-field>
			</u-cell-group>
		</view>
		<view>
			<view class="sign_out_btn" @click="submitPass">提交</view>
		</view>
		<u-toast ref="uToastPass" />
	</view>
</template>

<script>
	import md5Libs from "uview-ui/libs/function/md5";
	import kfNav from '@/components/kf-nav/kf-nav.vue';
	export default {
		components: { kfNav },
		data() {
			return {
				errorOldp:'',
				errorNewp:'',
				errorNewp2:'',
				oldPass:'',
				newPass:'',
				newPassTwo:''
				
			}
		},
		onLoad() {

		},
		methods: {
			submitPass(){
				if(this.oldPass.length<=0){
					this.errorOldp='请输入旧密码';
					return;
				}
				if(this.newPass.length<6){
					this.errorNewp='请输入不少于六位的新密码';
					return;
				}
				if(this.newPassTwo.length<=0){
					this.errorNewp2='请再次输入新密码';
					return;
				}
				if(this.newPass==this.oldPass){
					this.$u.toast('新密码不能与旧密码一样');
					return;
				}
				if(this.newPass!=this.newPassTwo){
					this.$u.toast('两次新密码不一致');
					return;
				}
				this.$u.post('/member/fg/personal-center/update/password',{
				  "newPassword1":md5Libs.md5(this.newPass) ,
				  "newPassword2":md5Libs.md5(this.newPassTwo),
				  "oldPassword": md5Libs.md5(this.oldPass)
				}).then(res => {
					if(res.code==0){
						this.$u.toast('修改成功');
						setTimeout(()=>{
							uni.navigateBack() 
						})
					}	
				}).catch(res=>{
					this.$u.toast(res.msg);
				})
			},
			linktoNews(){
				uni.navigateTo({
					url: "/pages/news/index"
				});
			},
			inputOld(value){
				if(value.trim().length>0){
					this.errorOldp=''
				}
			},
			inputNew(value){
				if(value.trim().length>0){
					this.errorNewp=''
				}
			},
			inputNew2(value){
				if(value.trim().length>0){
					this.errorNewp2=''
				}
			}
		}
	}
</script>

<style scoped lang="scss">
.change_password_wrap{
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
}	
</style>
