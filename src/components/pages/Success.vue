<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <ClientNavbar></ClientNavbar>
    <Alert></Alert>
    <div
      class="container-fluid flex-column hero-image bg-cover d-flex justify-content-center align-items-center"
    >
      <div>
        <span class="hero-text text-white">您已經付款完成囉！</span>
      </div>
      <div>
        <router-link to="/" class="btn btn-info">回到首頁繼續購物</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ClientNavbar from "../ClientNavbar";
import Alert from "../AlertMessage";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    ClientNavbar,
    Alert
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["isLoading"])
  }
};
</script>

<style lang="scss" scoped>
.bg-cover {
  background-size: cover;
  background-position: center center;
}
.hero-image {
  height: 400px;
  background-image: url("https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2650&q=80");
}
.hero-text {
  font-size: 36px;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>