<template>
	<view class="title_wrap">
		<text class="name">{{title}}</text>
		<view class="right_block" @click="linkTo"><text>更多</text><u-icon name="arrow-right" color="#606773" size="24"></u-icon></view>
	</view>
</template>

<script>
	export default {
		props:{
				
			title:{
				type: String,
				default: ''
			},
				
			url:{
				type: String,
				default: ''
			}
		},
		data() {
			return {
				currentUrl:this.url
			};
		},
			
		methods:{
				
			linkTo(){
				if(this.currentUrl){
					uni.navigateTo({
					    url: this.currentUrl
					});
				}	
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.title_wrap{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 31upx;
	.name{
		font-size: 40upx;
		color: #222222;
		font-weight: bold;
	}	
	.right_block{
		font-size:26upx;
		color:#606773;
		cursor: pointer;
	}
}
</style>
