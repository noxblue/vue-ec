<template>
  <div>
    <div class="container mt-5">
      <div class="row justify-content-center"><img class="icon-img img-fluid" src="@/assets/icon.svg" alt=""/></div>
      <div class="row justify-content-center py-2"><h1>萌寵電商管理後台</h1></div>
    </div>
    <!-- 將觸發登入事件綁定在form上，以submit事件觸發signin這個function -->
    <form class="form-signin text-center mt-3" @submit.prevent="signin">
      <h2 class="h3 mb-3 font-weight-normal">請先登入</h2>
      <label for="inputEmail" class="sr-only">Email address</label>
      <!-- 為input用v-model綁定資料，綁定前先在data上設定資料格式，取用data中user的username資料 -->
      <input
        type="email"
        id="inputEmail"
        class="form-control"
        placeholder="請輸入E-mail帳號"
        v-model="user.username"
        required
        autofocus
      />
      <label for="inputPassword" class="sr-only">Password</label>
      <!-- 為input用v-model綁定資料，綁定前先在data上設定資料格式，取用data中user的password資料 -->
      <input
        type="password"
        id="inputPassword"
        class="form-control"
        placeholder="請輸入密碼"
        v-model="user.password"
        required
      />
      <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me" /> 記住我
        </label>
      </div>
      <button class="btn btn-lg btn-primary btn-block" type="submit">登入</button>
      <p class="mt-5 mb-3 text-muted">&copy; Copyright 2020</p>
    </form>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      //設定使用者登入資料綁定，資料名稱為user，參數為登入用的資料username、password
      user: {
        username: "",
        password: ""
      }
    };
  },
  //在methods中設定login這個function
  methods: {
    signin() {
      //觸發function時執行axios向伺服器傳遞資料
      //signin這個API的路徑為伺服器加上/signin
      //API文件有改為使用路徑/admin/signin，後端會需要將cookie存入瀏覽器，同時會進行驗證，故要到注入點main.js中加上axios的跨域處理（axios.defaults.withCredentials=true)
      const api = `${process.env.APIPATH}/admin/signin`;
      const vm = this;
      //使用post方法，後方加上傳遞的資料
      this.$http.post(api,vm.user).then(response => {
        console.log(response.data);
        //使用router的方法，使登入成功時轉頁面至首頁
        if(response.data.success){
            vm.$router.push('/admin/products')
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body {
  height: 100%;
  background-color: #f5f5f5;
}

body {
  height: 100%;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  justify-content: center;
  padding-top: 40px;
  padding-bottom: 40px;
  
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.icon-img{
  max-width: 120px;
  max-height: 120px;
}
</style>
