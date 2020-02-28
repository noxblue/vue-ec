<template>
  <div>
    <nav class="navbar navbar-dark fixed-top bg-primary flex-md-nowrap p-0 shadow">
      <router-link to="/" class="navbar-brand col-sm-3 col-md-2 mr-0">萌寵電商</router-link>
      
      <!-- <input
        class="form-control form-control-dark w-100"
        type="text"
        placeholder="Search"
        aria-label="Search"
      /> -->
      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a class="nav-link btn btn-primary px-3" href="#" @click.prevent="logout">登出</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    logout() {
      //觸發logout時執行axios登出事件
      const api = `${process.env.APIPATH}/logout`;
      const vm = this;
      //使用post方法，api文件表示不需傳遞資料
      this.$http.post(api).then(response => {
        console.log(response.data);
        //使用router的方法，使登入成功時轉頁面至login
        if (response.data.success) {
          vm.$router.push("/login");
        }
      });
    },
  },
};
</script>