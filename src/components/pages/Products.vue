<template>
  <div>
    <!-- 加入loading標籤，表示在此元件插入vue-loading-overlay的元件，可看到是用變數isLoading控制，因此至data增加此變數
    <loading :active.sync="isLoading"></loading> -->
    <div class="text-right mt-4">
      <!-- 使用bootstrap的modal開啟，可用原生的方法data-toggle="modal" data-target="#指定的ModalID"
      也可從文件中找尋Usage中的Methods，此處使用vue的按鍵觸發，並改以Vue的Methods控制開啟-->
      <!-- 此處傳入true值，使function判斷isNew為true，即當做新增產品進行處理 -->
      <button class="btn btn-primary" @click="openModal(true)">建立新產品</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="80">原價</th>
          <th width="80">售價</th>
          <th width="100">是否啟用</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <!-- 使用v-for以data中的products資料進行tr渲染，每個tr就是一個產品，eslint會針對key未設定跳錯，可先設定為id -->
        <tr v-for="(item) in products" :key="item.id">
          <td>{{item.category}}</td>
          <td>{{item.title}}</td>
          <!-- 金額的部份要加上千分號與錢字號的filter，已建立在src/filters/currencyFilter，並在main.js導入並啟用，啟用名稱為currency，因此此處加上currency即可 -->
          <td class="text-right">{{item.origin_price|currency}}</td>
          <td class="text-right">{{item.price|currency}}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else class="text-secondary">未啟用</span>
          </td>
          <td>
            <!-- 此處設定開啟Modal，傳入false，和item，使function判斷isNew=false（要進行產品編輯），並帶入item值 -->
            <button class="btn btn-outline-primary btn-sm" @click="openModal(false,item)">編輯</button>
            <button class="btn btn-outline-danger btn-sm" @click="delProductModal(item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 插入Pagination元件製作分頁功能，將props名稱設為pages，傳入從getProducts取得的pagination的值
    並從元件內部觸發以emitPages接收，觸發getProducts的function，並傳入page的值-->
    <Pagination :pages="pagination" @emitPages="getProducts" class="mt-5"></Pagination>

    <!-- Modal -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span v-if="isNew">新增產品</span>
              <span v-else>修改產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input
                    type="text"
                    class="form-control"
                    id="image"
                    placeholder="請輸入圖片連結"
                    v-model="tempProduct.imageUrl"
                  />
                </div>
                <div class="form-group">
                  <label for="customFile">
                    或 上傳圖片
                    <!-- 此處為fontawesome的loading圖片，設定自定義變數為true時顯示 -->
                    <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                  </label>
                  <!-- 上傳檔案，input的type是使用file，事件使用change進行監聽 -->
                  <input
                    type="file"
                    id="customFile"
                    class="form-control"
                    ref="files"
                    @change="uploadFile"
                  />
                </div>
                <img
                  img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                  class="img-fluid"
                  :src="tempProduct.imageUrl"
                  alt
                />
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">產品名稱</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    placeholder="請輸入產品名稱"
                    v-model="tempProduct.title"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input
                      type="text"
                      class="form-control"
                      id="category"
                      placeholder="請輸入分類"
                      v-model="tempProduct.category"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input
                      type="unit"
                      class="form-control"
                      id="unit"
                      placeholder="請輸入單位"
                      v-model="tempProduct.unit"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="origin_price"
                      placeholder="請輸入原價"
                      v-model="tempProduct.origin_price"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="price"
                      placeholder="請輸入售價"
                      v-model="tempProduct.price"
                    />
                  </div>
                </div>
                <hr />

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="description"
                    placeholder="請輸入產品描述"
                    v-model="tempProduct.description"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="content"
                    placeholder="請輸入產品說明內容"
                    v-model="tempProduct.content"
                  ></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <!-- 設定是否啟用的checkbox，原本checkbox的值是true、false，使其勾選時（true-value）值為1，未勾選時（false-value）值為0 -->
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="is_enabled"
                      v-model="tempProduct.is_enabled"
                      :true-value="1"
                      :false-value="0"
                    />
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <!-- 在確認按鈕加上v-on，使用methods送出資料 -->
            <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal for 刪除產品 -->
    <div
      class="modal fade"
      id="delProductModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="delProduct">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//下方的methods有使用到jquery取用的方法$，因此在此元件中要將$先import進來才能取用
import $ from "jquery";
//導入Pagination用以渲染
import Pagination from "../Pagination";

export default {
  data() {
    return {
      //建立資料products用來儲存axios取回的產品資料
      products: [],
      //建立送出資料內容的參數，用來存在Modal中輸入的資料
      tempProduct: {},
      //設定isNew資料提供新增修改產品時判斷，true為新增、false為修改，此處預設為false
      isNew: false,
      //建立一個status管理狀態顯示
      status: {
        //自定義一個參數，預設值為false，並且在html中設定v-if，使其為true時顯示
        //另在上傳檔案的method中，啟動時改為true、ajax結束時改為false
        fileUploading: false
      },
      //增加一個pagination資料為空物件，用來儲存getProducts透過axios取得的pagination(資料包含total_pages、current_page、has_pre、has_next)
      pagination: {}
    };
  },
  methods: {
    //因為增加了頁碼功能，因此取得時改使用admin/products?page=:page，而:page即是以動態傳入值進行獲取，為避免渲染時未傳值進來，因此將page預設值設為1
    getProducts(page = 1) {
      //設定api路徑，使用動態的方式給於page值，於呼叫時傳入，如未傳入則此function預設page=1
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/products?page=${page}`;
      //要用data接資料前先設定vm=this，避免this的指向錯誤
      const vm = this;

      //設定在還沒取的資料時，開啟vue-loading-overlay的效果（isLoading=true）
      // vm.isLoading = true;
      vm.$store.dispatch('updateLoading',true)

      this.$http.get(api).then(response => {
        //用console.log檢查取回的資料格式
        console.log(response.data);

        //取得資料後就停止vue-loading-overlay的效果
        // vm.isLoading = false;
        vm.$store.dispatch('updateLoading',false)

        //將取回資料中的products存入data中的products
        vm.products = response.data.products;

        //設計分頁功能，將API取得的資料中的pagination存到data中設定好的pagination中
        vm.pagination = response.data.pagination;
      });
    },
    //設定執行openModal時傳入資料進入function進行判斷（判斷是新增產品還是修改產品）
    openModal(isNew, item) {
      //開啟前先判斷isNew為true或false
      if (isNew) {
        //新增產品時，tempProduct為空，以傳入值判斷後將isNew的值修改，以供updateProduct進行判斷
        this.tempProduct = {};
        this.isNew = true;
      } else {
        //修改產品時，使tempProduct為傳入的item，但此處如果直接設定tempProduct=item是傳參考，
        //應使用ES6的Object.assign()的方法，使item值存入物件中，再使該物件存入tempProduct
        this.tempProduct = Object.assign({}, item);
        this.isNew = false;
      }
      //設定完資料後，才開啟Modal

      //此處取用bs4的method方法控制modal開啟，但使用的是jquery，因此要先安裝好jquery和popper.js後，
      //在此元件的script內先import：$ from'jquery'，才不會出現$未定義的錯誤（$是jquery使用的方法）
      $("#productModal").modal("show");
    },
    updateProduct() {
      //因為新增和修改產品使用同一個function進行更新，故此處需要另外做判斷設定
      //api在新增與修改不同，改為let宣告，使其可被修改
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`;
      const vm = this;
      //因為新增、修改產品的API方法不同（新增為post、修改為put），設定方法為一個變數，後續判斷時變更，預設為新增（即post)
      let httpMethod = "post";
      //使用isNew進行判斷，因為所有預設皆為新增，只要判斷是否是修改（isNew==false），並調整api位置與httpMethod即可，isNew仍要從vm取用
      if (!vm.isNew) {
        //api加上路徑指定id，因該產品資料以傳入tempProduct，此處以vm取用其id即可
        api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
        //修改產品的httpMethod應為put
        httpMethod = "put";
      }

      //API文件有說明，建立、修改商品時，傳送資料格式為物件，並將資料包在data參數中的物件格式，因此此處傳送資料改為{data:vm.資料}(tempProduct資料本來就是物件)
      //新增：透過axios的post方法傳送tempProduct資料進去
      //修改：透過put方法傳送tempProduct進去
      //因此方法已設為變數httpMethod，此處以[]進行取用
      this.$http[httpMethod](api, { data: vm.tempProduct }).then(response => {
        //用console.log檢查取回的資料格式
        console.log(response.data);
        //設定條件，成功時
        if (response.data.success) {
          //關閉Modal
          $("#productModal").modal("hide");
          // //成功時用evenbus呼叫AlertMessage，傳入訊息內容與Alert樣式
          // vm.$bus.$emit("message:push", response.data.message, "success");
          vm.$store.dispatch("updateAlertMessage", {
            message: response.data.message,
            status: "success"
          });
          //並執行產品列表更新
          vm.getProducts();
        } else {
          //失敗時
          //關閉Modal
          $("#productModal").modal("hide");
          //並執行產品列表更新
          vm.getProducts();
          //增加跳console.log錯誤
          console.log(response.data.message);
          // //失敗時用eventbus呼叫AlertMessage，傳入訊息內容與Alert樣式
          // this.$bus.$emit("message:push", response.data.message, "danger");
          vm.$store.dispatch("updateAlertMessage", {
            message: response.data.message,
            status: "danger"
          });
        }
      });
    },
    delProductModal(item) {
      //將傳入的item存入tempProduct中（與上方相同一樣使用ES6的Object.assign()方法
      this.tempProduct = Object.assign({}, item);
      //開啟刪除Modal
      $("#delProductModal").modal("show");
    },
    delProduct() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
      this.$http.delete(api).then(response => {
        //用console.log檢查取回的資料格式
        console.log(response.data);
        //回傳成功時關閉Modal更新產品列表，失敗時亦同，另跳console.log
        if (response.data.success) {
          //關閉Modal
          $("#delProductModal").modal("hide");
          // //成功時用evenbus呼叫AlertMessage，傳入訊息內容與Alert樣式
          // vm.$bus.$emit("message:push", response.data.message, "success");
          vm.$store.dispatch("updateAlertMessage", {
            message: response.data.message,
            status: "success"
          });
          //並執行產品列表更新
          vm.getProducts();
        } else {
          //關閉Modal
          $("#delProductModal").modal("hide");
          //並執行產品列表更新
          vm.getProducts();
          //增加跳console.log錯誤
          console.log(response.data.message);
          // //失敗時用eventbus呼叫AlertMessage，傳入訊息內容與Alert樣式
          // this.$bus.$emit("message:push", response.data.message, "danger");
          vm.$store.dispatch("updateAlertMessage", {
            message: response.data.message,
            status: "danger"
          });
        }
      });
    },

    //執行上傳圖片
    uploadFile() {
      //圖片丟進瀏覽器時，可從console.log中檢查this，在VueComponent裡可找到
      console.log(this);
      //圖片被儲存在this的$refs.files.files，格式為陣列，存在第0個位置，因此宣告變數存取這張圖片檔
      const uploadedFile = this.$refs.files.files[0];
      const vm = this;

      //圖片一丟進瀏覽器，加上動畫效果（更改vm.status.fileUploading值為true)
      vm.status.fileUploading = true;

      //要使用WebAPI的FormData()方法進行上傳，先宣告一個新的formData
      const formData = new FormData();
      //使用formData的append('API指定欄位',圖檔)方法，將圖檔資訊加入formData中
      formData.append("file-to-upload", uploadedFile);
      //宣告url為api網址
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;
      //使用post的方法傳送（api網址,檔案,{設定headers的content-type格式為form-data})
      this.$http
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          //圖片上傳成功，去除動畫效果（更改vm.status.fileUploading值為false)
          vm.status.fileUploading = false;

          //傳送成功此處會取得success==true、傳到Firebase上的圖片網址imageUrl
          console.log(response.data);
          //成功時執行
          if (response.data.success) {
            //要將網址存入tempProduct，但直接存會導致缺乏get、set等功能，無法雙向綁定，導致無法立即顯示，因此要改用vm.$set方式指定(目的地,位置(物件為參數),值)
            vm.$set(vm.tempProduct, "imageUrl", response.data.imageUrl);
            // //成功時用evenbus呼叫AlertMessage，傳入訊息內容與Alert樣式
            // vm.$bus.$emit("message:push", response.data.message, "success");
            vm.$store.dispatch("updateAlertMessage", {
              message: response.data.message,
              status: "success"
            });
          } else {
            // //失敗時用eventbus呼叫AlertMessage，傳入訊息內容與Alert樣式
            // vm.$bus.$emit("message:push", response.data.message, "danger");
            vm.$store.dispatch("updateAlertMessage", {
              message: response.data.message,
              status: "danger"
            });
          }
        });
    }
  },
  created() {
    this.getProducts();
  },
  components: {
    Pagination
  }
};
</script>