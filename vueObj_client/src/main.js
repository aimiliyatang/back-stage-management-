import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App.vue'
import Routers from "./router.config.js"
import axios from "axios";
import VueAxios from "vue-axios";
import iView from 'iview';
import 'iview/dist/styles/iview.css';    // 使用 CSS
import store from "../store.config.js";

Vue.use(VueRouter);
Vue.use(iView);
Vue.use(VueAxios,axios);

// 路由配置
const RouterConfig = {
    routes: Routers,
    mode:"history"
};
const router = new VueRouter(RouterConfig);
new Vue({
  el: '#app',
  router:router,
  store:store,
  render: h => h(App)
})
