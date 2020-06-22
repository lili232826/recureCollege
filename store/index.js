import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		forcedLogin: false,
		hasLogin:uni.getStorageSync("Y-Token")? true :false,
		user:uni.getStorageSync("user")? JSON.parse(uni.getStorageSync("user")) : {}
	},
	mutations: {
		login(state, user) {
			state.user=user;
			state.user.account = user.account || '游客';
			state.hasLogin = true;
			// console.log(state.user,'3333333state.userstate.user')
		},
		changeAvatar(state, img) {
			state.user.img = img;
			uni.setStorageSync('user', JSON.stringify(state.user));
		},
		logout(state) {
			state.userName = "";
			state.user={};
			state.hasLogin = false;
		}
	}
})

export default store
