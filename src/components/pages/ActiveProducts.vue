<template>
  <div>
    <!-- 加入loading標籤，表示在此元件插入vue-loading-overlay的元件，可看到是用變數isLoading控制，因此至data增加此變數 -->
    <loading :active.sync="isLoading"></loading>
    <div class="container my-5">
      <div class="row">
        <div class="d-none d-md-block col-md-3 mb-4">
          <div class="list-group sticky-top">
            <a
              href="#"
              class="list-group-item list-group-item-action list-group-item-secondary"
              :class="{'active':selectedCategory==''}"
              @click.prevent="selectedCategory=''"
            >全部商品</a>
            <a
              v-for="(item,i) in sortCategory"
              :key="i"
              href="#"
              class="list-group-item list-group-item-action list-group-item-secondary"
              :class="{'active':selectedCategory==item}"
              @click.prevent="selectedCategory=item"
            >{{item}}</a>
          </div>
        </div>
        <div class="col-md-9">
          <div class="row">
            <!-- 使用sortProducts進行渲染，不顯示未啟用產品 -->
            <div
              class="col-12 col-md-6 col-lg-4 mb-3"
              v-for="item in sortProducts"
              :key="item.id"
            >
              <!-- <img class="item-img img-fluid border-bottom-0" :src="item.imageUrl" /> -->
              <!-- 點擊產品，觸發goProductPage，傳入item.id(即產品id) -->
              <div class="product-item h-100" @click="goProductPage(item.id)">
                <div class="item-img bg-cover" :style="{backgroundImage:'url('+item.imageUrl+')'}"></div>
                <div class="item-content bg-white">
                  <span class="badge badge-info mb-3">{{item.category}}</span>
                  <h4>{{item.title}}</h4>
                  <div class="text-right">{{item.description}}</div>
                  <div class="d-flex justify-content-between">
                    <del class="text-danger font-weight-bold">{{item.origin_price|currency}}</del>
                    <h5>優惠：{{item.price|currency}}</h5>
                  </div>
                  <div class="text-right">
                    <button class="btn btn-sm btn-primary" @click.stop="addtoCart(item.id)">
                      <!-- 點選加入購物車時，顯示loading動態圖片 -->
                      <i class="fas fa-spinner fa-spin" v-if="status.loadingItem===item.id"></i>
                      加入購物車
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Pagination :pages="pagination" @emitPages="getProducts" class="mt-5"></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//使用$emit方法前先導入$方法
import $ from "jquery";
import Pagination from '../Pagination';
export default {
  components:{
    Pagination,
  },
  data() {
    return {
      isLoading: false,
      products: [], //儲存所有產品
      selectedCategory: "", //儲存被選擇的產品類別
      status: {
        loadingItem: "" //此參數用來存操作的item.id，存入時上方元件會使用v-if進行比對，如果id與此相符時顯示
      }
    };
  },
  methods: {
    //先使用getProducts，以客戶端API設定取得產品資料，未傳入值則預設取得第一頁資料
    getProducts(page=1) {
      //要用data接資料前先設定vm=this，避免this的指向錯誤
      const vm = this;
      //設定api路徑
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${page}`;
      //設定在還沒取的資料時，開啟vue-loading-overlay的效果（isLoading=true）
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        //用console.log檢查取回的資料格式
        console.log(response.data);
        // //只存啟用中的產品，使用rawProducts將取回產品資料存入
        // let rawProducts = response.data.products;
        // //再將已啟用的產品push進vm.products
        // for (let i = 0; i < rawProducts.length; i++) {
        //   if (rawProducts[i].is_enabled == 1) {
        //     vm.products.push(rawProducts[i]);
        //   }
        // }
        
        //存入data中
        vm.products=response.data.products;

        //取得資料後就停止vue-loading-overlay的效果
        vm.isLoading = false;

        //設計分頁功能，將API取得的資料中的pagination存到data中設定好的pagination中
        vm.pagination = response.data.pagination;
      });
    },
    //將產品加入購物車，API需要產品id、數量qty，先將qty傳入值設預設值為1，未傳入時則為1
    addtoCart(id, qty = 1) {
      const vm = this;
      vm.status.loadingItem = id;
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
        //傳送完畢將status.loadingItem清空，關閉loading圖片顯示
        vm.status.loadingItem = "";
        //關閉Modal（如果有開啟的話）
        $("#productModal").modal("hide");
        //上方加入購物車按鈕處再加上觸發與傳送值即可執行本function
        //成功時用evenbus呼叫AlertMessage，傳入訊息內容與Alert樣式
        vm.$bus.$emit("message:push", response.data.message, "success");
        //以updateCart事件呼叫父元件觸發updateClientNavbar()，使其透過$refs方法呼叫ClientNavbar的getCart()，進行重新取得購物車資料渲染
        this.$emit("updateCart");
      });
    },
    //前往產品頁(傳入產品id）
    goProductPage(id){
        //使用$router轉換頁面至產品頁，帶入傳入的產品id
        this.$router.push(`/product/${id}`);
    }
  },
  computed: {
    //篩選分類資料
    sortCategory() {
      const vm = this;
      let categoryAll = [];
      for (let i = 0; i < vm.products.length; i++) {
        categoryAll.push(vm.products[i].category);
      }
      let categoryList = [];
      categoryAll.forEach(value => {
        if (categoryList.indexOf(value) == -1) {
          categoryList.push(value);
        }
      });
      return categoryList;
    },
    sortProducts() {
      const vm = this;
      //先將啟用的產品找出來
      let enabledProducts = []
      vm.products.forEach((value)=>{
        if(value.is_enabled==1){
          enabledProducts.push(value)
        }
      });
      //再篩選出使用者選擇的類別
      let selectedProducts = [];
      if (vm.selectedCategory == "") {
        selectedProducts = enabledProducts;
      } else {
        enabledProducts.forEach(value => {
          if (value.category == vm.selectedCategory) {
            selectedProducts.push(value);
          }
        });
      }
      return selectedProducts;
    }
  },
  created() {
    this.getProducts();
  }
};
</script>

<style lang="scss" scoped>
.bg-cover {
  background-size: cover;
  background-position: center center;
}
.product-item {
  border: 1px solid var(--info);
  border-radius: 5px 5px 5px 5px;
  cursor: pointer;
  &:hover {
    box-shadow: 2px 2px 4px 2px var(--info);
  }
}
.item-img {
  border-radius: 5px 5px 0 0;
  height: 300px;
}
@media (min-width: 768px) {
  .item-img {
    height: 200px;
  }
}
.item-content {
  padding: 5%;
  border-radius: 0 0 5px 5px;
}
</style>