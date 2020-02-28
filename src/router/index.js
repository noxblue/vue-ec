import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
//載入商店首頁
import Shop from '@/components/Shop';
import Login from '@/components/pages/Login'
//載入Dashboard元件
import Dashboard from '@/components/Dashboard'
//載入要放在Dashboard內的子元件Products
import Products from '@/components/pages/Products'
//將另一個路由的Dashboard的子元件SimulationOrders.vue載入
import SimulationOrders from '@/components/pages/SimulationOrders'
//載入SimOrder結帳確認頁面
import CheckoutSimOrder from '@/components/pages/CheckoutSimOrder';
//載入要放在Dashboard的子元件Orders、Coupons
import Orders from '@/components/pages/Orders';
import Coupons from '@/components/pages/Coupons';

//載入產品頁面
import Product from '@/components/pages/Product';
//載入購物車頁面
import Cart from '@/components/pages/Cart';
//載入完成結帳頁面
import Success from '@/components/pages/Success';

Vue.use(Router)

export default new Router({
  //設定如果所在路由=router-link，則該元件加上active的class
  linkActiveClass: 'active',
  //設定路由
  routes: [
    //設定前往非指定路由時重新導向
    {
      //非指定路由即為使用者打的網址非下方所指定的path，此處應使用*作為path代表為非指定以外的所有路徑
      path: '*',
      //使用redirect指定重新導向至哪個路由
      redirect: '/login',
    },
    {
      path: '/',
      name: 'Shop',
      component: Shop,
    },
    {
      //建立商品頁面，讀取id為商品id進行顯示(因為是跳轉整張頁面而非父元件內部切換router-view的內容顯示，路徑不可設在Shop的子路徑上)
      path: '/product/:productId',
      name: 'Product',
      component: Product
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart,
    },
    {
      path: '/success',
      name: 'Success',
      component: Success,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      //設定Dashboard元件的路由
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      //使用children設定子元件路徑
      children: [
        {
          path: 'products',
          name: 'Products',
          component: Products,
          //使用meta設定路由訊息，當meta中的參數requiresAuth=true時，並且因main.js有設定router.beforeEach，此頁面在符合router.beforeEach的轉頁條件時才可進入
          meta: {
            requiresAuth: true,
          },
        },
        {
          //設定Orders、Coupons元件的路由在admin/下，並使用meta限制登入才可讀取
          path: 'orders',
          name: 'Orders',
          component: Orders,
          //使用meta設定路由訊息，當meta中的參數requiresAuth=true時，並且因main.js有設定router.beforeEach，此頁面在符合router.beforeEach的轉頁條件時才可進入
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'coupons',
          name: 'Coupons',
          component: Coupons,
          //使用meta設定路由訊息，當meta中的參數requiresAuth=true時，並且因main.js有設定router.beforeEach，此頁面在符合router.beforeEach的轉頁條件時才可進入
          meta: {
            requiresAuth: true,
          },
        },
      ]
    },
    {
      //使用相同的Dashboard模版製作不同的路由，主要是在products位置改放置simulation_orders的頁面
      path: '/simulation',
      name: 'Simulation',
      component: Dashboard,
      //使用children設定子元件路徑，設定為simulation_orders，因此從主網域/#/simulation_orders即可直接存取此頁面
      children: [
        {
          path: 'simulation_orders',
          name: 'SimulationOrders',
          component: SimulationOrders,
        },
        {
          //此處路由需增加自定義的orderId，使點下結帳按鈕時取訂單id前往此頁面，並供CheckoutSimOrder元件使用this.$route.params.orderId取得此id
          path: 'checkout_sim_order/:orderId',
          name: 'CheckoutSimOrderCh',
          component: CheckoutSimOrder,
        },
      ]
    },
  ]
})
