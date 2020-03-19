<template>
  <div>
    <!-- 為ClientNavbar設定ref名稱，使此父元件function可用此名稱透過$refs方法呼叫此子元件的function -->
    <ClientNavbar ref="clientnavbar"></ClientNavbar>
    <!-- 設定Alert元件顯示位置 -->
    <Alert></Alert>
    <div
      class="container-fluid hero-image bg-cover d-flex justify-content-center align-items-center"
    >
      <div>
        <span class="text-white hero-text">寵你所愛－牠們的需求我們都懂</span>
      </div>
    </div>
    <!-- 設定ActiveProducts的觸發事件updateCart，當此子元件以$emit觸發updateCart事件時，觸發此父元件的updateClientNav() -->
    <ActiveProducts @updateCart="updateClientNav"></ActiveProducts>
    
  </div>
</template>

<script>
import ClientNavbar from "./ClientNavbar";
//導入AlertMessage，以供子元件進行呼叫
import Alert from "./AlertMessage";
import ActiveProducts from "./pages/ActiveProducts";


export default {
  components: {
    ClientNavbar,
    Alert,
    ActiveProducts,

  },
  data() {
    return {};
  },
  methods: {
    //以$refs方式呼叫設定ref="clientnavbar"的子元件，觸發該元件的getCart()
    updateClientNav() {
      this.$refs.clientnavbar.getCart();
    }
  }
};
</script>

<style lang="scss" scoped>
.bg-cover {
  background-size: cover;
  background-position: center calc(-90vh / 3);
  background-attachment: fixed;
  background-repeat: no-repeat;
}
.hero-image {
  //   background-image: url("https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2650&q=80");
  background-image: url("https://images.unsplash.com/photo-1570824104453-508955ab713e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2713&q=80");
  width: 100%;
  // height: 320px;
  height: calc(100vh / 3);
}
.hero-text {
  font-size: 36px;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>