<template>
  <div>
    <!-- 加入loading標籤，表示在此元件插入vue-loading-overlay的元件，可看到是用變數isLoading控制，因此至data增加此變數 -->
    <loading :active.sync="isLoading"></loading>

    <ClientNavbar></ClientNavbar>
    <Alert></Alert>
    <div class="container mt-4">
        <div class="row"><div class="col"><button class="btn btn-light" @click="goBack"><i class="fas fa-2x fa-reply"></i></button></div></div>
      <div class="row">
        <div class="col-md-6 product p-3">
          <div class="row">
            <div class="col">
              <h1 class="title">{{product.title}}</h1>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <span class="badge badge-info category">{{product.category}}</span>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <span>產品說明</span>
            </div>
          </div>
          <div class="row mb-5">
            <div class="col">
              <span class="description">{{product.description}}</span>
            </div>
          </div>
          <div class="row justify-content-around">
            <div class="col-5 price_title">
              <span>定價</span>
            </div>
            <div class="col-5 price_title">
              <span>優惠價</span>
            </div>
          </div>
          <div class="row mb-3 justify-content-around">
            <div class="col-5 d-flex align-items-center">
              <del class="origin_price">{{product.origin_price|currency}}</del>
            </div>
            <div class="col-5 d-flex align-items-center">
              <span class="price">{{product.price|currency}}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-3 d-flex align-items-center">
              <span>選購數量：</span>
            </div>
            <div class="col-9">
              <!-- 選取的數量需被記錄，故使用v-model將資料product.num與select資料進行雙向綁定 -->
              <select name class="form-control form-control-sm" v-model="product.num">
                <!-- 並且透過v-for渲染1-10的數字，並個別動態填入值與顯示數量文字、單位 -->
                <option :value="num" v-for="num in 10" :key="num">{{num}} {{product.unit}}</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <button
                class="btn btn-primary btn-block mt-3"
                @click="addtoCart(product.id,product.num)"
              >
                <i class="fas fa-spinner fa-spin" v-if="isLoading"></i>加入購物車
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-6 product p-3">
          <img class="img-fluid product_img" :src="product.imageUrl" />
          <div class="product_content p-3">
            <span>產品介紹：</span>
            <span>{{product.content}}</span>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import ClientNavbar from "../ClientNavbar";
import Alert from "../AlertMessage";


export default {
  //啟用元件
  components: {
    ClientNavbar,
    Alert,

  },
  data() {
    return {
      productId: "", //存從網址取得的產品id
      isLoading: false, //判斷資料loading中
      product: {} //存取回的產品資料
    };
  },
  methods: {
    //取得單一產品資訊，API需要產品id，在點選時傳入從網址存的id值，預設數量num為1
    getProduct(id, num = 1) {
      const vm = this;
      //設定api路徑將id帶入
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        //用console.log檢查取回的資料格式
        console.log(response.data);
        //將取回資料中的product存入data中的product
        vm.product = response.data.product;
        vm.$set(vm.product, "num", num); //設定產品數量，為傳入則預設值為1
        vm.isLoading = false;
        console.log(vm.product);
      });
    },
    //將產品加入購物車，API需要產品id、數量qty，先將qty傳入值設預設值為1，未傳入時則為1
    addtoCart(id, qty = 1) {
      const vm = this;
      vm.isLoading = true;
      //設定api路徑將id帶入
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      //將取得值存為傳出時的物件格式（傳出格式為{data:{'product_id':id,'qty':數量}}
      const cart = {
        product_id: id,
        qty
      };
      //將資料組合成API在post時的格式後，傳出
      this.$http.post(api, { data: cart }).then(response => {
        //用console.log檢查取回的資料格式
        console.log(response.data);
        vm.isLoading = false;
        //上方加入購物車按鈕處再加上觸發與傳送值即可執行本function
        //回到前一頁
        vm.goBack();
        //成功時用evenbus呼叫AlertMessage，傳入訊息內容與Alert樣式
        vm.$bus.$emit("message:push", response.data.message, "success");
      });
    },
    goBack(){
        this.$router.back()
    }
  },
  created() {
    //在created階段使用this.$route.params.productId取路由上設定的:productId，即此頁product/後方的網址
    const vm = this;
    vm.productId = vm.$route.params.productId;
    vm.getProduct(vm.productId);
  }
};
</script>

<style lang="scss" scoped>
.product {
  .title {
    color: var(--primary);
  }
  .category {
    font-size: 16px;
  }
  .description {
    font-size: 20px;
  }
  .origin_price {
    color: var(--danger);
  }
  .price {
    font-size: 32px;
    font-weight: bold;
  }
  .price_title {
    border-bottom: 2px solid var(--danger);
  }
  .product_img {
    border-radius: 5px 5px 0 0;
  }
  .product_content {
    background-color: var(--light);
    border-radius: 0 0 5px 5px;
  }
}
</style>