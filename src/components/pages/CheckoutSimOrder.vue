<template>
  <div>
    <!-- 加入loading標籤，表示在此元件插入vue-loading-overlay的元件，可看到是用變數isLoading控制，因此至data增加此變數 -->
    <loading :active.sync="isLoading"></loading>
    <!-- 放入訂單資訊 -->
    <div class="my-5 row justify-content-center">
      <!-- 為form直接綁定submit觸發payOrder事件 -->
      <form class="col-md-6" @submit.prevent="payOrder">
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
</template>
<script>
export default {
  data() {
    return {
      //建立orderId在轉入此頁面時透過create執行this.$route.params.orderId取得
      orderId: "",
      //將訂單資料取得後存在oreder中(資料包含另一層user，預先定義以避免渲染時錯誤)
      order: {
        user: {}
      },
      isLoading: false
    };
  },
  methods: {
    //建立取得訂單資料function
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
        //結帳成功，重新取得訂單資訊，使其再次渲染
        if(response.data.success){
            vm.getOrder();
        }else{
            //結帳失敗，console.log跳錯誤訊息
            console.log(response.data.message);
        }
        vm.isLoading = false; //關閉vue-loading-overlay的效果
      });
    }
  },
  created() {
    //此處的this.$route.params.orderId，對應路由設定此頁的動態:orderId名稱，名稱需相同才能正確取得
    this.orderId = this.$route.params.orderId;
    this.getOrder();
  }
};
</script>