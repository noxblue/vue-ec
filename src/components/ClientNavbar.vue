<template>
  <div>
    <nav class="navbar navbar-expand-md navbar-light bg-primary">
      <router-link class="nav-link text-light h4 mb-0" to="/">
        <img class="icon-img" src="../assets/icon.svg" alt /> 萌寵電商
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav ml-md-auto">
          <li class="nav-item dropdown">
            <a
              class="nav-link text-light"
              href="#"
              id="navbarDropdownMenuLink"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i class="fa fa-shopping-cart fa-2x d-md-block d-none"></i>
              <span class="text-center btn btn-light d-md-none d-block" style="font-size:16px;">購物清單</span>
              <span
                class="badge badge-pill badge-danger cart-badge d-md-block d-none"
                v-if="cart.carts && cart.carts.length"
              >{{cart.carts.length}}</span>
            </a>
            <div
              class="dropdown-menu dropdown-menu-right px-3 py-0"
              style="width:auto; min-width: 350px;"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <!-- 如果購物車是空的不顯示表格 -->
              <table class="table mb-0" v-if="cart.carts && cart.carts.length">
                <thead>
                  <tr>
                    <th></th>
                    <th>品名</th>
                    <th>數量</th>
                    <th>小計</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- 使用data中的cart內的carts資料（以陣列內含多個產品物件）渲染整行資料 -->
                  <tr v-for="item in cart.carts" :v-if="cart.carts" :key="item.id">
                    <td class="align-middle">
                      <!-- 刪除按鈕觸發removeCartItem，傳入此項目的id -->
                      <button
                        class="btn btn-outline-danger btn-sm"
                        @click="removeCartItem(item.id)"
                      >
                        <i class="far fa-trash-alt"></i>
                      </button>
                    </td>
                    <td class="align-middle">
                      <div>{{item.product.title}}</div>
                      <div class="badge badge-success" v-if="item.coupon">已套用折價券</div>
                    </td>
                    <td class="align-middle">{{item.qty}}/{{item.product.unit}}</td>
                    <td class="align-middle text-right">{{item.final_total|currency}}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" class="text-right">總計</td>
                    <!-- 取用存在data中的cart資料，其total為未折扣前總價 -->
                    <td class="text-right">{{cart.total|currency}}</td>
                  </tr>
                  <tr v-if="cart.final_total!==cart.total">
                    <td colspan="3" class="text-right text-success">優惠折扣價</td>
                    <td class="text-right">{{cart.final_total|currency}}</td>
                  </tr>
                  <tr>
                    <td colspan="4" class="text-right">
                      <router-link to="/cart" class="btn btn-primary">結帳去</router-link>
                    </td>
                  </tr>
                </tfoot>
              </table>
              <!-- 購物車為空顯示提示 -->
              <div v-else class="text-center py-2">
                <span>購物車是空的唷！</span>
              </div>
            </div>
          </li>
          <li class="nav-item ml-md-2 ml-0">
            <router-link to="/login" class="nav-link btn btn-light">管理員登入</router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
    };
  },
  computed:{
    ...mapGetters('cartModule',['cart'])
  },
  methods: {
    //刪除購物車項目(傳入要刪除項目的id)
    removeCartItem(id) {
      const vm = this
      vm.$store.dispatch('cartModule/removeCartItem',id)
    }
  },
  created() {
    this.$store.dispatch('cartModule/getCart')
  }
};
</script>

<style lang="scss" scoped>
.cart-badge {
  position: absolute;
  bottom: 0;
  right: 0;
}
.icon-img {
  max-width: 30px;
  max-height: 30px;
}
</style>