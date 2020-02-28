<template>
  <div>
    <!-- 以自身結束的標籤，插入Navbar元件 -->
    <Navbar />
    <!-- 設定Alert元件顯示位置 -->
    <Alert></Alert>
    <div class="container-fluid">
      <div class="row">
        <!-- 以有開頭與結束的標籤，插入Sidebar元件 -->
        <Sidebar></Sidebar>
        <main role="main" class="col-md-10 ml-sm-auto col-lg-10 px-4">
            <!-- 以router-view標籤，插入子元件 -->
            <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
//將bs4原生的dashboard拆解成上方架構，Navbar、Sidebar等元件，再透過此頁面載入相關元件
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
//導入AlertMessage，以供子元件進行呼叫
import Alert from "./AlertMessage";

export default {
  //將載入元件以components啟用，以在上方透過元件標籤的方式插入
  components: {
    Navbar,
    Sidebar,
    //將Alert元件啟用
    Alert,
  }
};
</script>