<script>
	export default {
		onLaunch: function() {
			// console.log(plus.runtime.appid,'App Launch')
		},
		onShow: function() {
			uni.getStorage({
				key: 'playObj',
				success: (res) => {
					var playObj = JSON.parse(res.data);
					var currentTime=playObj.currentTime;
					var videoId=playObj.videoId;		
					if(this.$store.state.hasLogin&&currentTime>0){
						this.sendTime(currentTime,videoId);
						this.sendTimeRate(currentTime,videoId)
					}
				},
				fail:()=> {
					console.log('fail')
				}
			});
			uni.getSystemInfo({
			    success: function (res) {
			  //       console.log();
			  //       console.log(res.system,'操作系统版本');
			  //       console.log(res.version,'引擎版本号');
					// console.log(res.platform,'客户端平台');
					// console.log(res.swanNativeVersion,'swanNativeVersion');
			    }
			});
			console.log('App show')
		},
		onHide: function() {
			console.log('App hide')
		},
		methods:{
			sendTime(currentTime,videoId){//观看时长
				this.$u.post('/resource/fg/video-library/timeLength/save',{
					  "time": currentTime,
					  "videoId": videoId
				}).then(res => {
					if(res.code==0){
						uni.removeStorage({
							key: 'playObj'
						});
					}
				}).catch(res=>{
					
				})
			},
			sendTimeRate(currentTime,videoId){//观看进度
				this.$u.post('/resource/fg/video-library/schedule/save',{
					  "time": currentTime,
					  "videoId": videoId
				}).then(res => {
					if(res.code==0){
						uni.removeStorage({
							key: 'playObj'
						});
					}
				}).catch(res=>{
					
				})
			},
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	// @import "@/uview/index.scss";
	@import "uview-ui/index.scss";
</style>
