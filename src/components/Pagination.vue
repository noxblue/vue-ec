<template>
  <div>
    <!-- 插入bs4的元件pagination，已經以pages取得pagination的值，因此渲染時使用pages作為變數取得，製作分頁功能 -->
    <nav aria-label="Page navigation">
      <!-- 使用d-flex、justify-content-center將分頁元件置中 -->
      <ul class="pagination d-flex justify-content-center">
        <!-- 前一頁按鈕以pagination的has_pre進行判斷，如果為false即無上一頁，此處加上disabled的動態class
        按鈕行為則用current_page判斷，傳入當前頁面-1的頁碼給getProducts進行渲染-->
        <li class="page-item" :class="{'disabled':!pages.has_pre}">
          <a
            class="page-link"
            href="#"
            aria-label="Previous"
            @click.prevent="updatePage(pages.current_page-1)"
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <!-- 透過v-for來渲染頁碼，使其產生所需要數量的頁碼元件
        取用data中pagination的total_pages判斷，渲染數量2即為渲染2個，此處的page即為渲染的頁碼
        另外加上動態class，當判斷current_page與page相同時，加上active的class使其呈現啟用樣式-->
        <li
          class="page-item"
          v-for="page in pages.total_pages"
          :key="page"
          :class="{'active':pages.current_page==page}"
        >
          <!-- 連結內容改為頁碼{{page}}，並加上點擊事件，傳入該頁碼到updatePage中，使該functiont向外觸發emitPages事件，以執行getProducts功能，使其執行取得該頁的產品列表 -->
          <a class="page-link" href="#" @click.prevent="updatePage(page)">{{page}}</a>
        </li>
        <li class="page-item" :class="{'disabled':!pages.has_next}">
          <a
            class="page-link"
            href="#"
            aria-label="Next"
            @click.prevent="updatePage(pages.current_page+1)"
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
    //使用props的pages從Products頁面取得pagination的值
    props:['pages'],
    data(){
        return{
            
        }
    },
    methods:{
        //建立點擊分頁按鈕，往外傳送頁面資訊(page指第幾頁)，觸發重新渲染事件
        updatePage(page){
            this.$emit('emitPages',page)
        },
    },
};
</script>