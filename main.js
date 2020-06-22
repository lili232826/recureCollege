import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

// Vue.prototype.$websiteUrl = 'http://test16.zhongdianyun.com:2020'; 
// Vue.prototype.$filePath = 'http://test16.zhongdianyun.com:2020/file/file/';
// Vue.prototype.$fileUpload = 'http://test16.zhongdianyun.com:2020/file/file/upload'; 

Vue.prototype.$websiteUrl = 'http://www.kfclass.com'; 
Vue.prototype.$filePath = 'http://www.kfclass.com/file/file/';
Vue.prototype.$fileUpload = 'http://www.kfclass.com/file/file/upload'; 

import store from './store'
Vue.prototype.$store = store
App.mpType = 'app'

// 引入全局uView
// import uView from "@/uview";
// Vue.use(uView);
import uView from "uview-ui";
Vue.use(uView);

const app = new Vue({
	store,
    ...App
})

import jiuaiDebounce from '@/common/js/jiuai-debounce.js'
Vue.prototype.$jiuaiDebounce=jiuaiDebounce;

import * as filters from '@/common/js/filters.js';
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// http拦截器，此为需要加入的内容，如果不是写在common目录，请自行修改引入路径
import httpInterceptor from '@/common/http.interceptor.js'
// 这里需要写在最后，是为了等Vue创建对象完成，引入"app"对象(也即页面的"this"实例)
Vue.use(httpInterceptor, app)

// http接口API集中管理引入部分
import httpApi from '@/common/http.api.js'
Vue.use(httpApi, app)
app.$mount()
