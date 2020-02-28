<template>
  <div>
    <Loading :active.sync="isLoading"></Loading>
    <div class="text-right mt-3">
      <button class="btn btn-primary" @click="openCouponModal(true)">建立新的優惠券</button>
    </div>
    <div class="row d-flex justify-content-center">
      <table class="table col-10 mt-4">
        <thead>
          <tr>
            <th>優惠券名稱</th>
            <th>折扣碼</th>
            <th>折扣百分比</th>
            <th>到期日</th>
            <th>是否啟用</th>
            <th>編輯</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, key) in coupons" :key="key">
            <td>{{ item.title }}</td>
            <td>{{item.code}}</td>
            <td>{{ item.percent }}%</td>
            <td>{{ item.due_date | date }}</td>
            <td>
              <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
              <span v-else class="text-muted">未啟用</span>
            </td>
            <td>
              <button
                class="btn btn-outline-primary btn-sm"
                @click="openCouponModal(false, item)"
              >編輯</button>
              <button class="btn btn-outline-danger btn-sm" @click="delCouponModal(item)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 插入Coupon編輯Modal -->
    <div
      class="modal fade"
      id="couponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="exampleModalLabel" v-if="isNew">新增優惠券</h5>
            <h5 class="modal-title" id="exampleModalLabel" v-else>編輯優惠券</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="title">優惠券名稱</label>
              <input
                type="text"
                class="form-control"
                id="title"
                v-model="tempCoupon.title"
                placeholder="請輸入標題"
              />
            </div>
            <div class="form-group">
              <label for="coupon_code">優惠碼</label>
              <input
                type="text"
                class="form-control"
                id="coupon_code"
                v-model="tempCoupon.code"
                placeholder="請輸入優惠碼"
              />
            </div>
            <div class="form-group">
              <label for="due_date">到期日</label>
              <input type="date" class="form-control" id="due_date" v-model="due_date" />
            </div>
            <div class="form-group">
              <label for="price">折扣百分比%</label>
              <input
                type="number"
                class="form-control"
                id="price"
                v-model="tempCoupon.percent"
                placeholder="請輸入折扣百分比"
              />
            </div>
            <div class="form-group">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :true-value="1"
                  :false-value="0"
                  v-model="tempCoupon.is_enabled"
                  id="is_enabled"
                />
                <label class="form-check-label" for="is_enabled">是否啟用</label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateCoupon">
              <span v-if="isNew">新增優惠券</span>
              <span v-else>更新優惠券</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal for 刪除Coupon -->
    <div
      class="modal fade"
      id="delCouponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除Coupon優惠券</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempCoupon.title }}</strong> 優惠券(刪除後將無法恢復)。
            <div>
              <strong>【優惠內容】</strong>
            </div>
            <div>優惠名稱：{{tempCoupon.title}}</div>
            <div>折扣碼：{{tempCoupon.code}}</div>
            <div>折扣百分比：{{tempCoupon.percent}}%</div>
            <div>到期日：{{tempCoupon.due_date|date}}</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="delCoupon">確認刪除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 插入pagination元件作為分頁，將pagination作為props的值，以pages名稱傳入元件，
    並從元件的function傳出觸發emitPages（換頁）事件，以觸發getOrders功能，進行頁面內容重新渲染-->
    <Pagination :pages="pagination" @emitPages="getCoupons" v-if="pagination.total_pages>0"></Pagination>
  </div>
</template>

<script>
import $ from "jquery";
//將分頁元件導入
import Pagination from "../Pagination";

export default {
  components: {
    Pagination
  },
  data() {
    return {
      isLoading: false, //判斷是否開啟loading效果
      pagination: "", //存分頁碼
      coupons: {}, //存取回的coupons
      tempCoupon: {
        //存編輯中coupon
        title: "",
        is_enabled: 0,
        percent: 100,
        due_date: 0,
        code: ""
      },
      isNew: false, //判斷編輯中是否為新coupon
      due_date: new Date()
    };
  },
  watch: {
    due_date() {
      const vm = this;
      const timestamp = Math.floor(new Date(vm.due_date) / 1000);
      vm.tempCoupon.due_date = timestamp;
    }
  },
  methods: {
    //取得coupons列表資料
    getCoupons(page = 1) {
      //用axios取得訂單資訊，傳入開啟第幾頁page，預設值為1（會由pagination傳入）
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
      vm.isLoading = true; //取資料時進入loading效果
      this.$http.get(api).then(response => {
        console.log(response.data);
        vm.coupons = response.data.coupons; //coupon資料存入coupons進行渲染
        vm.pagination = response.data.pagination; //分頁資料存入pagination以傳給pagination元件渲染
        vm.isLoading = false; //取完資料關閉loading效果
      });
      console.log("getCoupons");
    },
    //開啟單一coupon資料isNew=true則為新增
    openCouponModal(isNew, item) {
      const vm = this;
      vm.isNew = isNew;
      vm.tempCoupon = Object.assign({}, item);
      $("#couponModal").modal("show");
    },
    //新增、更新一筆coupon（使用tempCoupon），預設為新增
    updateCoupon() {
      const vm = this;
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
      let httpMethod = "post";
      if (!vm.isNew) {
        api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
        httpMethod = "put";
      }
      vm.isLoading = true; //傳資料時進入loading效果
      this.$http[httpMethod](api, { data: vm.tempCoupon }).then(response => {
        console.log(response.data);
        if (response.data.success) {
          vm.getCoupons(); //更新完重新取得資料
          vm.isLoading = false; //取完資料關閉loading效果
          $("#couponModal").modal("hide"); //關閉Modal
          //成功時用evenbus呼叫AlertMessage，傳入訊息內容與Alert樣式
          vm.$bus.$emit("message:push", response.data.message, "success");
        } else {
          //失敗時用evenbus呼叫AlertMessage，傳入訊息內容與Alert樣式
          vm.$bus.$emit("message:push", response.data.message, "danger");
        }
      });
      console.log("updateCoupon");
    },
    //開啟刪除折扣碼Modal
    delCouponModal(item) {
      //將點選的項目內容塞入tempCoupon中
      this.tempCoupon = Object.assign({}, item);
      $("#delCouponModal").modal("show"); //開啟Modal
    },
    //執行刪除Coupon
    delCoupon() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
      vm.isLoading = true; //傳資料時進入loading效果
      this.$http.delete(api).then(response => {
        console.log(response.data);
        vm.getCoupons();  //刪除完重新取得coupons資料
        vm.isLoading = false; //傳完資料關閉loading效果
        $("#delCouponModal").modal("hide"); //關閉Modal
        if (response.data.success) {
          //成功時用evenbus呼叫AlertMessage，傳入訊息內容與Alert樣式
          vm.$bus.$emit("message:push", response.data.message, "success");
        } else {
          vm.$bus.$emit("message:push", response.data.message, "danger");
        }
      });
    }
  },
  created() {
    this.getCoupons();
  }
};
</script>