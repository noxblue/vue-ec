//使用bus.js建立一個使用$bus方法的prototype，使用eventbus使子元件可向外部傳遞訊息

//先導入vue以取用vue的方法
import Vue from 'vue';

//宣告一個Vue原型prototype，方法名稱為$bus
Vue.prototype.$bus = new Vue();

//此原型用於傳遞Message訊息
//取用方法為：vm.$bus.$emit('message:push',message,status);
//message:push：呼叫名稱
//message(String)：訊息內容
//status(String)：Alert的樣式(Bootstrap的alert-class名稱)
//透過AlertMessage.vue設定呼叫方式與呈現樣式