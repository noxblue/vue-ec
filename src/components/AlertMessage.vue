<template>
  <div class="message-alert">
      <!-- 使用動態class的方式，將傳入status值整合為bs4的樣式class，並以messages作為傳入的資料進行渲染 -->
    <div
      class="alert alert-dismissible"
      :class="'alert-' + item.status"
      v-for="(item, i) in messages"
      :key="i"
    >
    <!-- 內容帶入資料的訊息文字message -->
      {{ item.message }}
      <!-- 設定關閉按鈕觸發removeMessage，刪除messages中的第i筆資料，此處的i為v-for渲染時資料的index -->
      <button
        type="button"
        class="close"
        @click="removeMessage(i)"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //先設定資料messages為陣列，用於渲染
      messages: []
    };
  },
  methods: {
    //建立傳入訊息資料function（資料傳入後元件即會渲染畫面），傳入資料為message、status
    updateMessage(message, status) {
      //用new Date()設定觸發當下時間為timestamp
      const timestamp = Math.floor(new Date() / 1000);
      //將timestamp與傳入資料用物件格式push到data中的messages陣列中
      this.messages.push({
        message,
        status,
        timestamp
      });
      //最後觸發function，執行時間到就刪除資料（消失於畫面），傳入timestamp判斷刪除哪一筆資料
      this.removeMessageWithTiming(timestamp);
    },
    //建立按下關閉按鈕就刪除資料的function，按鈕元件會傳入該筆資料的i值(即為index)
    removeMessage(num) {
      //執行將data中messages的陣列裡，刪除該位置的資料1筆
      this.messages.splice(num, 1);
    },
    //建立設定時間一到就刪除資料的funciton
    removeMessageWithTiming(timestamp) {
      const vm = this;
      //觸發後5000毫秒（5秒）執行下列function
      setTimeout(() => {
        //使用forEach在messages中尋找
        vm.messages.forEach((item, i) => {
          //當資料中的timestamp與傳入的值相同，則刪除該位置index的資料1筆
          if (item.timestamp === timestamp) {
            vm.messages.splice(i, 1);
          }
        });
      }, 5000);
    }
  },
  //此元件created時，設定$bus的呼叫方法
  created() {
    const vm = this;
    //透過$on()方法設定呼叫方式，呼叫名稱為message:push，帶傳入值分別為message與status，status的預設值為warning
    vm.$bus.$on("message:push", (message, status = "warning") => {
      //呼叫成功時執行下列function（即觸發將訊息傳入messages的function，產生渲染）
      console.log("呼叫成功");
      vm.updateMessage(message, status);
    });
  }
  //最後到要取用此呼叫方式的父元件導入本元件、並啟用，且設定插入位置（顯示位置），再到子元件觸發時以$bus.$emit進行呼叫
};
</script>

<style scope>
.message-alert {
  position: fixed;
  max-width: 50%;
  /* top: 56px;
  right: 20px; */
  top: calc(100vh - 60vh);
  left:calc(50vw - 5%);
  z-index: 1100;
}
</style>