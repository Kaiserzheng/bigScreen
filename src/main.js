// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../static/font/iconfont.css'
import config from '../static/index.js'
import axios from 'axios'
import "openlayers/css/ol.css";
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import SuperMapCesium from 'vue-cesium-supermap'
import '@babel/polyfill'
Vue.use(SuperMapCesium, {
  cesiumPath: './static/Cesium'
})
Vue.use(ElementUI)
Vue.use(iView)
Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.prototype.$config = config
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

