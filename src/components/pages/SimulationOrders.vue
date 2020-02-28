<template>
  <div>
    <!-- 加入loading標籤，表示在此元件插入vue-loading-overlay的元件，可看到是用變數isLoading控制，因此至data增加此變數 -->
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <!-- 在產品列表部分使用bs4格線進行排版(外層要先加上row)，另使用data中取得的products資料進行渲染 -->
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <!-- 此處為產品圖片，使用動態方式加上style，但style參數要以駝峰方式撰寫，而非原生的background-image，為方便帶入變數，字串部分改以ES6方式撰寫 -->
          <div
            style="height: 150px; background-size: cover; background-position: center"
            :style="{backgroundImage:`url(${item.imageUrl})`}"
          ></div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{item.title}}</a>
            </h5>
            <p class="card-text">{{item.content}}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <!-- 此處針對價格顯示進行設定item.price是優惠價金額，商品如果沒有優惠價時則只顯示原價，有優惠價時先顯示原價在顯示優惠價： -->
              <div class="h5" v-if="!item.price">售價 {{item.origin_price}} 元</div>
              <del class="h6" v-if="item.price">原價 {{item.origin_price}} 元</del>
              <div class="h5" v-if="item.price">優惠價 {{item.price}} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <!-- 查看更多按鈕觸發getProduct功能，並傳入該產品的id -->
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click="getProduct(item.id)"
            >
              <!-- 使用v-if進行loading圖片的顯示控制，當status.loadingItem與此元件id相同時，才顯示 -->
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem===item.id"></i>
              查看更多
            </button>
            <!-- 觸發addCart功能，傳入產品id（數量不傳則function預設為1） -->
            <button
              type="button"
              class="btn btn-outline-danger btn-sm ml-auto"
              @click="addtoCart(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem===item.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 插入購物車列表 -->
    <div class="row justify-content-center my5" v-if="cart.carts && cart.carts.length">
      <table class="table col-8">
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
              <button class="btn btn-outline-danger btn-sm" @click="removeCartItem(item.id)">
                <i class="far fa-trash-alt"></i>
              </button>
            </td>
            <td class="align-middle">
              {{item.product.title}}
              <div class="text-success" v-if="item.coupon">已套用折價券</div>
            </td>
            <td class="align-middle">{{item.qty}}/{{item.product.unit}}</td>
            <td class="align-middle text-right">{{item.final_total}}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="text-right">總計</td>
            <!-- 取用存在data中的cart資料，其total為未折扣前總價 -->
            <td class="text-right">{{cart.total}}</td>
          </tr>
          <tr v-if="cart.final_total!==cart.total">
            <td colspan="3" class="text-right text-success">優惠折扣價</td>
            <td class="text-right">{{cart.final_total}}</td>
          </tr>
        </tfoot>
      </table>
      <div class="input-group mb-3 input-group-sm col-8">
        <!-- input雙向綁定data中的coupon_code -->
        <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code" />
        <div class="input-group-append">
          <!-- 按鈕觸發addCouponCode功能 -->
          <button class="btn btn-outline-secondary" type="button" @click="addCouponCode()">套用優惠碼</button>
        </div>
      </div>
    </div>
    <!-- 加入訂單資訊表單，同時在data中加上API建立訂單所需的user、message等資料以form作為data名稱，並透過v-model與表單進行綁定 -->
    <div class="my-5 row justify-content-center">
      <!-- VeeValidate的3.x版改用handleSubmit管理整張表單驗證，需在表單最外層加上ValidationObserver v-slot="{handleSubmit}"
      並在form上將@submit.prevent="createOrder"改成="handleSubmit(createOrder)"，通過驗證才執行createOrder的function-->
      <ValidationObserver v-slot="{handleSubmit}" class="col-md-6">
        <!-- 在form上面直接綁定submit事件觸發createOrder功能，取消預設submit事件 -->
        <form @submit.prevent="handleSubmit(createOrder)">
          <div class="form-group">
            <label for="useremail">Email</label>
            <!-- 使用v-validate啟用input的驗證，required為必填，email則必須為email格式，不通過時errors.has('name')會變成true -->
            <!-- <input
            type="email"
            class="form-control"
            name="email"
            id="useremail"
            v-model="form.user.email"
            placeholder="請輸入 Email"
            v-validate="'required|email'"
            :class="{'is-invalid':errors.has('email')}"
            />-->
            <!-- 使用v-validate啟用input的驗證後，會透過name進行對應，驗證不通過時errors.has('name')會變成true，可透過此方式顯示錯誤訊息
            email驗證則會透過errors.first('name')顯示英文版錯誤訊息，要改成中文語系需透過i18n進行轉換-->
            <!-- <span class="text-danger" v-if="errors.has('email')">{{errors.first('email')}}</span> -->
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
            <!-- <input
            type="text"
            class="form-control"
            name="name"
            id="username"
            v-model="form.user.name"
            placeholder="輸入姓名"
            v-validate="'required'"
            :class="{'is-invalid':errors.has('name')}"
          />
            <span class="text-danger" v-if="errors.has('name')">收件人姓名為必填哦！</span>-->
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
            <!-- <input
            type="text"
            class="form-control"
            name="address"
            id="useraddress"
            v-model="form.user.address"
            placeholder="請輸入地址"
            v-validate="'required'"
            :class="{'is-invalid':errors.has('address')}"
          />
            <span class="text-danger" v-if="errors.has('address')">地址欄位不得留空</span>-->
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
              rows="10"
              v-model="form.message"
            ></textarea>
          </div>
          <div class="text-right">
            <button class="btn btn-danger">送出訂單</button>
          </div>
        </form>
      </ValidationObserver>
    </div>
    <!-- 此處插入產品Modal -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <!-- 直接使用單一產品的資料product進行資料填入渲染 -->
            <h5 class="modal-title" id="modalLabel">{{ product.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageUrl" class="img-fluid" alt />
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right">{{ product.description }}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">售價 {{ product.origin_price }} 元</div>
              <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
              <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
            </div>
            <!-- 選取的數量需被記錄，故使用v-model將資料product.num與select資料進行雙向綁定 -->
            <select name class="form-control mt-3" v-model="product.num">
              <!-- 並且透過v-for渲染1-10的數字，並個別動態填入值與顯示數量文字、單位 -->
              <option :value="num" v-for="num in 10" :key="num">選購 {{num}} {{product.unit}}</option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計
              <strong>{{ product.num * product.price }}</strong> 元
            </div>
            <!-- 觸發addCart功能，傳入產品id（此處直接取用放在data中的id）數量（使用上方設定的product.num，選取的value與num已雙向綁定） -->
            <button
              type="button"
              class="btn btn-primary"
              @click="addtoCart(product.id, product.num)"
            >
              <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 產品Modal結束 -->
  </div>
</template>

<script>
//使用modal功能前要記得先載入jquery的$
import $ from "jquery";

export default {
  data() {
    return {
      //設定用來存產品資料的data
      products: [],
      //設定用來存當下操作的產品資料data
      product: {},
      //設定用來存，取回的購物車資訊
      cart: {},
      //設定存使用者輸入的coupon_code
      coupon_code: "",
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
      //個別產品讀取效果以比對操作的id是否相同進行判斷
      status: {
        loadingItem: "" //此參數用來存操作的item.id，存入時上方元件會使用v-if進行比對，如果id與此相符時顯示
      },
      //先前有使用vue-loading-overlay，需先設定isLoading預設值為false，在需要出現時在將此值改為true即可
      isLoding: false
    };
  },
  methods: {
    //先使用getProducts，以客戶端API設定取得產品資料
    getProducts() {
      //設定api路徑
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`;
      //要用data接資料前先設定vm=this，避免this的指向錯誤
      const vm = this;
      //設定在還沒取的資料時，開啟vue-loading-overlay的效果（isLoading=true）
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        //用console.log檢查取回的資料格式
        console.log(response.data);
        //取得資料後就停止vue-loading-overlay的效果
        vm.isLoading = false;
        //將取回資料中的products存入data中的products
        vm.products = response.data.products;
        // //設計分頁功能，將API取得的資料中的pagination存到data中設定好的pagination中
        // vm.pagination = response.data.pagination;
      });
    },
    //只取得該筆產品資料，API需要產品id，在點選時傳入id值
    getProduct(id, num = 1) {
      //設定api路徑將id帶入
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
      //要用data接資料前先設定vm=this，避免this的指向錯誤
      const vm = this;
      //設定在還沒取的資料時，將取得的id存入status.loadingItem中，使元件可v-if比對後顯示loading圖片
      vm.status.loadingItem = id;
      this.$http.get(api).then(response => {
        //用console.log檢查取回的資料格式
        console.log(response.data);
        //將取回資料中的product存入data中的product
        vm.product = response.data.product;
        vm.$set(vm.product, "num", num);
        //使用BS4的method，以jQuery方法開啟Modal
        $("#productModal").modal("show");

        //取得資料開啟Modal後就將status.loadingItem清空，關閉loading圖片顯示
        vm.status.loadingItem = "";

        // //設計分頁功能，將API取得的資料中的pagination存到data中設定好的pagination中
        // vm.pagination = response.data.pagination;
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
        //最後重新取得購物車資料並重新渲染
        vm.getCart();
      });
    },
    //取得購物車列表
    getCart() {
      //設定api路徑將id帶入
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      //要用data接資料前先設定vm=this，避免this的指向錯誤
      const vm = this;
      vm.isLoading = true; //開啟vue-loading-overlay的效果
      this.$http.get(api).then(response => {
        //用console.log檢查取回的資料格式
        console.log(response.data);
        vm.cart = response.data.data; //存入data中的cart
        vm.isLoading = false; //關閉vue-loading-overlay的效果
      });
    },
    //刪除購物車項目(傳入要刪除項目的id)
    removeCartItem(id) {
      //設定api路徑將id帶入
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      //要用data接資料前先設定vm=this，避免this的指向錯誤
      const vm = this;
      vm.isLoading = true; //開啟vue-loading-overlay的效果
      this.$http.delete(api).then(response => {
        //用console.log檢查取回的資料格式
        console.log(response.data);
        //刪除後重新取得購物車列表資料，重新渲染
        vm.getCart();
        //成功時用evenbus呼叫AlertMessage，傳入訊息內容與Alert樣式
        vm.$bus.$emit("message:push", response.data.message, "success");
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
        //重新取得購物車列表資料，重新渲染(成功時API資料庫cart的資料會改，重新取得以重新渲染)
        vm.getCart();
      });
    },
    //執行送出訂單結帳資料（會將購物車清空）
    createOrder() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
      //將要傳送的資料存成order變數
      const order = vm.form;
      // //使用VeeValidate的官方文件方法進行整張表單驗證，通過時result為true，未通過為false
      // this.$validator.validate().then(result => {
      //   //整張表單通過時執行成立訂單API post
      //   if (result) {
      //     this.$http.post(api, { data: order }).then(response => {
      //       //用console.log檢查取回的資料格式
      //       console.log("訂單建立結果", response.data.message);
      //       //重新取得購物車列表資料，重新渲染(成功時API資料庫cart的資料會改，重新取得以重新渲染)
      //       vm.getCart();
      //     });
      //   } else {
      //     //未通過驗證則顯示錯誤訊息
      //     console.log('表單資料不完整')
      //   }
      // });
      //vee-validate的3.x版以改成用ValidationObserver管理，當整張表單通過驗證時才執行submit觸發的function
      this.$http.post(api, { data: order }).then(response => {
        //用console.log檢查取回的資料格式
        console.log("訂單建立結果", response.data.message);
        //重新取得購物車列表資料，重新渲染(成功時API資料庫cart的資料會改，重新取得以重新渲染)
        vm.getCart();
        //送出訂單後跳轉至CheckoutSimOrder頁面，且帶入axios取得的orderId
        this.$router.push(`/checkout_sim_order/${response.data.orderId}`);
        //成功時用evenbus呼叫AlertMessage，傳入訊息內容與Alert樣式
        vm.$bus.$emit("message:push", response.data.message, "success");
      });
    }
  },
  created() {
    //執行取得產品列表資料
    this.getProducts();
    //執行取得購物車列表資料
    this.getCart();
  }
};
</script>