// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
//安裝完axios、vue-axios後依文件import至entry檔案中
import axios from 'axios';
import VueAxios from 'vue-axios';
import Vuex from 'vuex';  //vuex完成安裝後導入
import store from './store'  //設定完vuex的store，導入至main.js

//使用vue-loading-overlay製作全頁loading效果，先npm install vue-loading-overlay安裝
//再到注入點main.js進行元件import、css的import
import Loading from 'vue-loading-overlay';  //需在下方以component全域啟用
import 'vue-loading-overlay/dist/vue-loading.css';

//將bootstrap import進來，以供取用
import 'bootstrap';

//安裝完vee-validate後，導入
import {ValidationProvider,extend,ValidationObserver} from 'vee-validate';
//並且導入規則
import {required,email} from 'vee-validate/dist/rules'
//導入本地化語系
import {localize} from 'vee-validate';
import TW from 'vee-validate/dist/locale/zh_TW.json'

import App from './App';
import router from './router';

//將設定eventbus的原型檔bus.js在注入點中import，提供整個專案取用該呼叫方法
import './bus';
//導入存放在src/filters中的currencyFilter.js
import currencyFilter from './filters/currencyFilter';
import dateFilter from './filters/dateFilter';


Vue.config.productionTip = false
//import axios、vue-axios後依文件啟用（順序要先啟用VueAxios再啟用axios，不然會報錯）
Vue.use(VueAxios, axios);
//此處為因應登入api登入時進行跨域驗證，必須將axios的跨域驗證打開，方能正確驗證
axios.defaults.withCredentials = true;

//啟用Vuex
Vue.use(Vuex);

//以Component全域啟用vue-loading-overlay元件
Vue.component('Loading',Loading);   //最後再到要啟用的元件或路由template最上方區塊加入loading標籤

//import完ValidationProvider後以Component全域啟用
Vue.component('ValidationProvider',ValidationProvider)
//並且啟用規則
extend('email',email);
extend('required',{
  ...required,
message:'{_field_}為必填哦！'})
//啟用本地化語系驗證
localize('zh_TW',TW);
//啟用ValidationObserver
Vue.component('ValidationObserver',ValidationObserver);

//使用filter方法啟用currencyFilter，此處自定義啟用的filter方法名稱為currency，最後還要到要加入顯示此格式的地方加上filter
Vue.filter('currency',currencyFilter);
Vue.filter('date',dateFilter);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,    //上方導入Vuex的store，此處引入Vue實體內
  components: { App },
  template: '<App/>'
});

//登入驗證使用Vue中的導航守衛功能：router.beforeEach
//function包含了to表示要前往的頁面，from表示從哪個頁面前往，next表示實際導向哪個頁面
router.beforeEach(function (to, from, next) {
  // console.log('to', to, 'from', from, 'next', next)
  //可在此處透過if設定條件，此處設定to前往的頁面如果在路由(router/index.js)中有設定meta參數，且requiresAuth=true時，執行內容
  if (to.meta.requiresAuth) {
    // console.log('這裡需要登入')
    // 使用「檢查用戶是否持續登入」的API檢查，登入中才成功轉換頁面
    const api = `${process.env.APIPATH}/api/user/check`;
      //使用post方法，讀取回傳訊息進行判斷
      //因此處執行環境是在router下，非vue的元件內，故無法使用this.$http取用post方法，應改為直接用axios取用post方法
      axios.post(api).then(response => {
        // console.log(response.data);
        //當判斷為登入中（即response.data.success==true時），放行（即執行next()，前往原本就要去的頁面
        if(response.data.success){
            next();
        }else{
          //當判斷為非登入中，則將next導向指定path
          next({
            path:'/login',
          });
          alert(response.data.message)
        }
      });
  } else {
    //如果前往頁面的路由沒有設定meta.requiresAuth，就直接放行
    next();
  }
})
