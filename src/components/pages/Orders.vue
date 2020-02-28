<template>
  <div>
    <Loading :active.sync="isLoading"></Loading>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="100">購買時間</th>
          <th width="180">Email</th>
          <th>購買品項</th>
          <th width="100">應付金額</th>
          <th width="80">是否付款</th>
          <th width="80">編輯</th>
        </tr>
      </thead>
      <!-- 當order有值才顯示tbody內容 -->
      <tbody v-if="orders && orders.length">
        <!-- 使用computed排序後的值進行渲染，當is_paid為false時，動態加上text-sacondary的class -->
        <tr v-for="(item, key) in sortOrder" :key="key" :class="{'text-info': !item.is_paid}">
          <!-- 購買時間套入date的filter格式 -->
          <td>{{ item.create_at | date }}</td>
          <td>
            <!-- 如果user中有值，將email的文字帶入此處 -->
            <span v-text="item.user.email" v-if="item.user"></span>
          </td>
          <td>
            <ul class="list-unstyled">
              <!-- 訂單中產品不只一個，因此透過v-for進行內容渲染內部的product -->
              <li v-for="(product, i) in item.products" :key="i">
                {{ product.product.title }} 數量：{{ product.qty }}
                {{ product.product.unit }}
              </li>
            </ul>
          </td>
          <td class="text-right">{{ item.total | currency }}</td>
          <td>
            <strong v-if="item.is_paid" class="text-success">已付款</strong>
            <span v-else class="text-muted">尚未付款</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm" @click="openModal(item)">編輯</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 插入pagination元件作為分頁，將pagination作為props的值，以pages名稱傳入元件，
    並從元件的function傳出觸發emitPages（換頁）事件，以觸發getOrders功能，進行頁面內容重新渲染-->
    <Pagination :pages="pagination" @emitPages="getOrders"></Pagination>

    <!-- Modal -->
    <div
      class="modal fade"
      id="orderModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>編輯訂單</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div>訂單建立日期：{{tempOrder.create_at|date}}</div>
            <div>
              是否付款：
              <span v-if="tempOrder.is_paid" class="text-success">已付款</span>
              <span v-else class="text-danger">尚未付款</span>
            </div>
            <div class="row mt-3">
              <div class="col-6">
                <div>寄送資訊</div>
                <hr />
                <div class="form-group">
                  <label for>訂購人姓名</label>
                  <input type="text" v-model="tempOrder.user.name" class="form-control" />
                </div>
                <div class="form-group">
                  <label for>訂購人email</label>
                  <input type="email" v-model="tempOrder.user.email" class="form-control" />
                </div>
                <div class="form-group">
                  <label for>聯絡電話</label>
                  <input type="tel" v-model="tempOrder.user.tel" class="form-control" />
                </div>
                <div class="form-group">
                  <label for>寄送地址</label>
                  <input type="text" v-model="tempOrder.user.address" class="form-control" />
                </div>
                <div>用戶留言：</div>
                <div>{{tempOrder.message}}</div>
              </div>
              <div class="col-6">
                <div>訂購產品資訊</div>
                <hr />
                <div
                  v-for="item in tempOrder.products"
                  :key="item.id"
                  class="card border-success mb-2"
                >
                  <div class="card-body form-group">
                    <div
                      class="card-title"
                      style="font-weight:bold;font-size:20px;"
                    >品項：{{item.product.title}}</div>
                    <label for>購買數量</label>
                    <select name class="form-control" v-model="item.qty">
                      <!-- 並且透過v-for渲染1-10的數字，並個別動態填入值與顯示數量文字、單位 -->
                      <option
                        :value="num"
                        v-for="num in 10"
                        :key="num"
                      >{{num}} {{item.product.unit}}</option>
                    </select>
                  </div>
                  <div class="card-footer text-right bg-transparent">
                    <button
                      class="btn btn-outline-danger btn-sm"
                      @click="delOrderItem(item.id)"
                    >刪除此品項</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <!-- 在確認按鈕加上v-on，使用methods送出資料 -->
            <button type="button" class="btn btn-primary" @click="editOrder">確認修改</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import jQuery from "jquery";
//將分頁元件導入
import Pagination from "../Pagination";

export default {
  //啟用元件Pagination
  components: {
    Pagination
  },
  data() {
    return {
      //建立操控vue-loading-overlay的變數isLoading使其預設值為false，並在下方method中要加入的時刻更改其值即可
      isLoading: false,
      //建立用來接收訂單資訊的變數orders
      orders: [],
      //接收訂單的分頁資訊
      pagination: {},
      //存取編輯中的單筆訂單
      tempOrder: {
        products: [],
        user: {}
      }
    };
  },
  methods: {
    getOrders(page = 1) {
      //用axios取得訂單資訊，傳入開啟第幾頁page，預設值為1（會由pagination傳入）
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
      vm.isLoading = true; //取資料時進入loading效果
      this.$http.get(api).then(response => {
        console.log(response.data);
        vm.orders = response.data.orders; //訂單資料存入orders進行渲染
        vm.pagination = response.data.pagination; //分頁資料存入pagination以傳給pagination元件渲染
        vm.isLoading = false; //取完資料關閉loading效果
      });
    },
    //將單筆訂單資料傳入開啟編輯訂單Modal
    openModal(item) {
      const vm = this;
      //使用Object.assign，只有第一層傳值、以下階層還是傳參考（屬於淺層複製），使得下列delet時刪除到本來的orders資料
      //vm.tempOrder = Object.assign({}, item);
      //因此改用jQuery.extend的深層複製方法，上方需import jQuery進來，下列前方如設定為true則為深層複製，未設定為淺層複製
      vm.tempOrder = jQuery.extend(true, {}, item);
      $("#orderModal").modal("show");
    },
    //刪除訂單內品項
    delOrderItem(itemId) {
      const vm = this;
      vm.$delete(vm.tempOrder.products, itemId);
    },
    //更新編輯訂單
    editOrder() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/order/${vm.tempOrder.id}`;
      vm.isLoading = true;
      //使用put方式修改訂單
      this.$http.put(api, { data: vm.tempOrder }).then(response => {
        console.log(response.data.message);
        if (response.data.success) {
          //重新取得訂單資料(要放在axios中，否則在api跑完前就會先執行，會拿到舊的資料)
          vm.getOrders();
          vm.isLoading = false;
          //關閉Modal
          $("#orderModal").modal("hide");
          //成功時用evenbus呼叫AlertMessage，傳入訊息內容與Alert樣式
          vm.$bus.$emit("message:push", response.data.message, "success");
        }else{
          //失敗時用evenbus呼叫AlertMessage，傳入訊息內容與Alert樣式
          vm.$bus.$emit("message:push", response.data.message, "danger");
        }
      });
    },
  },
  computed: {
    //產生排序內容，依照已付款與未付款進行排序，使其排序為已付款->未付款
    sortOrder() {
      const vm = this;
      let newOrder = []; //使用陣列存取排序後的資料，最後return用來渲染
      if (vm.orders.length) {
        //當訂單資料長度>0時（有訂單資料時）
        newOrder = vm.orders.sort((a, b) => {
          //newOrder為對於orders資料使用sort排序後的資料
          const aIsPaid = a.is_paid ? 1 : 0; //將true、false改為1、0的數值
          const bIsPaid = b.is_paid ? 1 : 0;
          return bIsPaid - a.is_paid; //由大到小排序(先放已付款再放未付款)
        });
      }
      return newOrder;
    }
  },
  created() {
    this.getOrders();
  }
};
</script>