<template>
  <div id="app">
    <!-- 將原本的預設圖片移除
    <img src="./assets/logo.png">-->
    <router-view class="content" />
    <footer class="container-fluid py-3 footer">
      <span>&copy; 2020 萌寵電商－最懂你寶貝寵物的專家</span>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
  //設定好axios、VueAxios在注入點後，先透過created這個hook執行api資料抓取
  created() {
    // //將api路徑設定為常數變數（伺服器位置為：https://vue-course-api.herokuapp.com，路徑為：api/:API_PATH/products）
    // const api = 'https://vue-course-api.herokuapp.com/api/charlesliu/products'

    //改將api路徑設定到config/dev.env.js的module.exports中，並使用process.env.參數名稱 取得設定資料
    // console.log(process.env.APIPATH, process.env.CUSTOMPATH);
    //使用ES6反引號設定變數字串內容，以${}的方式引用變數（即上述參數名稱）
    // const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`;

    //使用VueAxios的AJAX方法取得資料
    // this.$http.get(api).then(response => {
    //   console.log(response.data);
    // });
  }
};
</script>

<style lang="scss">
// // 安裝完bootstrap、node-sass、sass-loader後，在App.vue這個主要app設定處修改style為：lang="scss"，使其撰寫完全以scss進行編譯(將內容當做scss檔案)
// // 並在內容處引入bootstrap的scss檔
// @import "~bootstrap/scss/bootstrap";

// 或是將bootstrap改在assets/all.scss中import，此處只要import該檔案即可
@import "./assets/all";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  // margin-top: 60px;
  .content {
    min-height: calc(100vh - 50px);
  }
  .footer {
    height: 50px;
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
