<template>
  <div>
    <!-- 加入loading標籤，表示在此元件插入vue-loading-overlay的元件，可看到是用變數isLoading控制，因此至data增加此變數 -->
    <loading :active.sync="isLoading"></loading>
    <ClientNavbar ref="clientnavbar"></ClientNavbar>
    <Alert></Alert>
    <div class="container mt-4">
      <div class="row">
        <div class="col">
          <button class="btn btn-light" @click="goBack">
            <i class="fas fa-2x fa-reply"></i>
          </button>
        </div>
      </div>
      <div class="row justify-content-center align-items-center my-5">
        <div class="col-md-8">
          <!-- 頁面標題 -->
          <div class="row justify-content-center">
            <h1 class="text-secondary">萌寵電商 購物結帳</h1>
          </div>
          <!-- 結帳進度 -->
          <div class="row justify-content-around mb-3">
            <div
              class="order-status col-3 d-flex justify-content-center align-items-center py-1"
              :class="{'active':status.check=='cart'}"
            >
              <span>確認訂單資訊</span>
            </div>
            <div
              class="order-status col-3 d-flex justify-content-center align-items-center py-1"
              :class="{'active':status.check=='userdata'}"
            >
              <span>訂購人資訊</span>
            </div>
            <div
              class="order-status col-3 d-flex justify-content-center align-items-center py-1"
              :class="{'active':status.check=='checkout'}"
            >
              <span>進行付款</span>
            </div>
          </div>
          <!-- 購物車內容 -->
          <div class="row" v-if="status.check!=='checkout'">
            <div class="card w-100">
              <div
                class="card-header"
                data-toggle="collapse"
                data-target="#collapseCart"
                aria-expanded="true"
                aria-controls="collapseCart"
                id="headingOne"
              >
                <div class="row px-3 justify-content-between align-items-center">
                  <h4 class="mb-0">購物清單</h4>
                  <h5 class="mb-0">結帳總金額：{{cart.final_total}}元</h5>
                </div>
              </div>

              <div
                id="collapseCart"
                class="collapse"
                :class="{'show':status.check=='cart'}"
                aria-labelledby="headingOne"
              >
                <div class="card-body">
                  <table class="table mb-0">
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
                          {{item.product.title}}
                          <div class="badge badge-success" v-if="item.coupon">已套用折價券</div>
                        </td>
                        <td class="align-middle">{{item.qty}}/{{item.product.unit}}</td>
                        <td class="align-middle text-right">{{item.final_total}}元</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="3" class="text-right">總計</td>
                        <!-- 取用存在data中的cart資料，其total為未折扣前總價 -->
                        <td class="text-right">{{cart.total}}元</td>
                      </tr>
                      <tr v-if="cart.final_total!==cart.total">
                        <td colspan="3" class="text-right text-success">優惠折扣價</td>
                        <td class="text-right">{{cart.final_total}}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <!-- 確認購物車階段顯示內容 -->
          <div v-if="status.check=='cart'">
            <div class="row">
              <div class="input-group mb-3 input-group-sm mt-3">
                <!-- input雙向綁定data中的coupon_code -->
                <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code" />
                <div class="input-group-append">
                  <!-- 按鈕觸發addCouponCode功能 -->
                  <button
                    class="btn btn-outline-primary"
                    type="button"
                    @click="addCouponCode()"
                  >套用優惠碼</button>
                </div>
              </div>
            </div>
            <div class="row justify-content-end">
              <button class="btn btn-primary" @click="goCheckStatus('userdata')">下一步</button>
            </div>
          </div>
          <!-- 輸入訂購人資料階段顯示內容 -->
          <div v-if="status.check=='userdata'">
            <div class="row justify-content-center my-3">
              <h4>請輸入訂購人資料</h4>
            </div>
            <ValidationObserver v-slot="{handleSubmit}">
              <!-- 在form上面直接綁定submit事件觸發createOrder功能，取消預設submit事件 -->
              <form @submit.prevent="handleSubmit(createOrder)">
                <div class="form-group">
                  <label for="useremail">Email</label>
                  <ValidationProvider name="Email欄位" rules="required|email" v-slot="{errors}">
                    <input
                      type="text"
                      class="form-control"
                      name="email"
                      id="useremail"
                      v-model="form.user.email"
                      placeholder="請輸入 Email"
                    />
                    <span class="text-danger">{{errors[0]}}</span>
                  </ValidationProvider>
                </div>
                <div class="form-group">
                  <label for="username">收件人姓名</label>
                  <ValidationProvider name="收件人姓名" rules="required" v-slot="{errors}">
                    <input
                      type="text"
                      class="form-control"
                      name="name"
                      id="username"
                      v-model="form.user.name"
                      placeholder="請輸入姓名"
                    />
                    <span class="text-danger">{{errors[0]}}</span>
                  </ValidationProvider>
                </div>

                <div class="form-group">
                  <label for="usertel">收件人電話</label>
                  <input
                    type="tel"
                    class="form-control"
                    id="usertel"
                    v-model="form.user.tel"
                    placeholder="請輸入電話"
                  />
                </div>

                <div class="form-group">
                  <label for="useraddress">收件人地址</label>
                  <ValidationProvider name="地址欄位" rules="required" v-slot="{errors}">
                    <input
                      type="text"
                      class="form-control"
                      name="address"
                      id="useraddress"
                      v-model="form.user.address"
                      placeholder="請輸入地址"
                    />
                    <span class="text-danger">{{errors[0]}}</span>
                  </ValidationProvider>
                </div>

                <div class="form-group">
                  <label for="comment">留言</label>
                  <textarea
                    name
                    id="comment"
                    class="form-control"
                    cols="30"
                    rows="5"
                    v-model="form.message"
                  ></textarea>
                </div>
                <div class="row justify-content-between px-3">
                  <button class="btn btn-light" @click="goCheckStatus('cart')">回前一步</button>
                  <button type="submit" class="btn btn-danger">送出訂單</button>
                </div>
              </form>
            </ValidationObserver>
          </div>
          <!-- 付款階段顯示內容 -->
          <div v-if="status.check=='checkout'">
            <div class="row justify-content-center my-3">
              <h4>訂單完成待付款</h4>
            </div>
            <div class="row justify-content-center">
              <!-- 為form直接綁定submit觸發payOrder事件 -->
              <form class="col" @submit.prevent="payOrder">
                <table class="table">
                  <thead>
                    <th>品名</th>
                    <th>數量</th>
                    <th>單價</th>
                  </thead>
                  <tbody>
                    <!-- 使用data中的order裡，products資料渲染訂單每個項目（名稱、數量、單位、最後金額） -->
                    <tr v-for="item in order.products" :key="item.id">
                      <td class="align-middle">{{ item.product.title }}</td>
                      <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
                      <td class="align-middle text-right">{{ item.final_total }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="2" class="text-right">總計</td>
                      <!-- 直接取用訂單資料的total為結帳金額顯示 -->
                      <td class="text-right">{{ order.total }}</td>
                    </tr>
                  </tfoot>
                </table>

                <table class="table">
                  <tbody>
                    <tr>
                      <th width="100">Email</th>
                      <!-- 取用訂單資訊的user資料進行呈現 -->
                      <td>{{ order.user.email }}</td>
                    </tr>
                    <tr>
                      <th>姓名</th>
                      <td>{{ order.user.name }}</td>
                    </tr>
                    <tr>
                      <th>收件人電話</th>
                      <td>{{ order.user.tel }}</td>
                    </tr>
                    <tr>
                      <th>收件人地址</th>
                      <td>{{ order.user.address }}</td>
                    </tr>
                    <tr>
                      <th>付款狀態</th>
                      <td>
                        <span v-if="!order.is_paid">尚未付款</span>
                        <span v-else class="text-success">付款完成</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="text-right" v-if="order.is_paid === false">
                  <button class="btn btn-danger">確認付款去</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import ClientNavbar from "../ClientNavbar";
import Alert from "../AlertMessage";
export default {
  components: {
    ClientNavbar,
    Alert
  },
  data() {
    return {
      isLoading: false,
      status: {
        check: "cart" //記錄結帳進度，分別為cart、userdata、checkout
      },
      cart: {}, //存購物車資料
      coupon_code: "", //存折價券名稱
      //設定供訂單送出時儲存的訂單相關資訊欄位，用來送出
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: ""
        },
        message: ""
      },
      orderId: "", //完成訂單時取得訂單id
      order: {
        user: {}
      }
    };
  },
  methods: {
    //取得購物車列表
    getCart() {
      const vm = this;
      //設定api路徑
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      this.$http.get(api).then(response => {
        //用console.log檢查取回的資料格式
        console.log(response.data);
        vm.cart = response.data.data; //存入data中的cart
        console.log(vm.cart.carts.length);
      });
    },
    //刪除購物車項目(傳入要刪除項目的id)
    removeCartItem(id) {
      //設定api路徑將id帶入
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      //要用data接資料前先設定vm=this，避免this的指向錯誤
      const vm = this;
      this.$http.delete(api).then(response => {
        //用console.log檢查取回的資料格式
        console.log(response.data);
        //刪除後重新取得購物車列表資料，重新渲染
        vm.getCart();
        //成功時用evenbus呼叫AlertMessage，傳入訊息內容與Alert樣式
        vm.$bus.$emit("message:push", response.data.message, "success");
        //重新渲染Navbar
        vm.updateClientNav();
      });
    },
    //使用者送出使用優惠碼時執行傳送code給API
    addCouponCode() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      const vm = this;
      //將資料存為API所需要的格式
      const coupon = {
        code: vm.coupon_code
      };
      vm.isLoading = true; //開啟vue-loading-overlay的效果
      this.$http.post(api, { data: coupon }).then(response => {
        //用console.log檢查取回的資料格式
        console.log(response.data);
        if (response.data.success) {
          //成功時用evenbus呼叫AlertMessage，傳入訊息內容與Alert樣式
          vm.$bus.$emit("message:push", response.data.message, "success");
        } else {
          //失敗時用evenbus呼叫AlertMessage，傳入訊息內容與Alert樣式
          vm.$bus.$emit("message:push", response.data.message, "danger");
        }
        vm.isLoading = false; //關閉vue-loading-overlay的效果
        //重新取得購物車列表資料，重新渲染(成功時API資料庫cart的資料會改，重新取得以重新渲染)
        vm.getCart();
        //重新渲染Navbar
        vm.updateClientNav();
      });
    },
    //執行送出訂單結帳資料（會將購物車清空）
    createOrder() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
      //將要傳送的資料存成order變數
      const order = vm.form;
      //vee-validate的3.x版以改成用ValidationObserver管理，當整張表單通過驗證時才執行submit觸發的function
      this.$http.post(api, { data: order }).then(response => {
        //用console.log檢查取回的資料格式
        console.log("訂單建立結果", response.data.message);
        if (response.data.success) {
          //呼叫子元件clientnavbar重新取得購物車列表資料
          vm.updateClientNav();
          //更改進度到checkout
          vm.goCheckStatus("checkout");
          //成功時用evenbus呼叫AlertMessage，傳入訊息內容與Alert樣式
          vm.$bus.$emit("message:push", response.data.message, "success");
          //取得訂單id
          vm.orderId = response.data.orderId;
          //呼叫取得訂單資料
          vm.getOrder();
        } else {
          //失敗時用evenbus呼叫AlertMessage，傳入訊息內容與Alert樣式
          vm.$bus.$emit("message:push", response.data.message, "danger");
        }
      });
    },
    //取得訂單資料
    getOrder() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order/${vm.orderId}`;
      vm.isLoading = true; //開啟vue-loading-overlay的效果
      this.$http.get(api).then(response => {
        //用console.log檢查取回的資料格式
        console.log(response.data);
        vm.order = response.data.order; //存入data中的order
        vm.isLoading = false; //關閉vue-loading-overlay的效果
      });
    },
    //建立執行付款功能，點選按鈕後post到付款api，並且重新取得訂單資訊
    payOrder() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/pay/${vm.orderId}`;
      vm.isLoading = true; //開啟vue-loading-overlay的效果
      this.$http.post(api).then(response => {
        //用console.log檢查取回的資料格式
        console.log(response.data);
        vm.isLoading = false; //關閉vue-loading-overlay的效果
        if (response.data.success) {
          //前往完成頁面
          vm.$router.push(`/success`);
        } else {
          //失敗時用evenbus呼叫AlertMessage，傳入訊息內容與Alert樣式
          vm.$bus.$emit("message:push", response.data.message, "danger");
        }
      });
    },
    //以$refs方式呼叫設定ref="clientnavbar"的子元件，觸發該元件的getCart()
    updateClientNav() {
      this.$refs.clientnavbar.getCart();
    },
    //前往結帳階段
    goCheckStatus(status) {
      const vm = this;
      vm.status.check = status;
      if (status == "cart") {
        $("#collapseCart").collapse("show");
      } else {
        $("#collapseCart").collapse("hide");
      }
    },
    //回到前一頁
    goBack() {
      this.$router.back();
    }
  },
  created() {
    this.getCart();
  }
};
</script>

<style lang="scss" scoped>
.order-status {
  background-color: #fff;
  border: 1px solid var(--primary);
  border-radius: 5px;
  &.active {
    background-color: var(--primary);
    border: none;
    color: #fff;
    font-weight: bold;
  }
}
</style>