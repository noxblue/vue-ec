import axios from 'axios'
export default {
  namespaced: true, //設定全部皆為區域變數
  state: {
    cart: {},
    status: 'cart', //記錄結帳進度，分別為cart、userdata、checkout
    orderId: '',
    order: {
      user: {}
    },
  },
  actions: {
    //ChangeStatus
    changeStatus(context, status) {
      context.commit('STATUS', status)
    },
    //ChangeCart
    getCart(context) {
      context.commit('LOADING', true, { root: true }) //因改皆為區域變數，呼叫root的mutations需設定root:true
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      axios.get(api).then(response => {
        let cartData = response.data.data;
        context.commit('GET_CART', cartData)
        context.commit('LOADING', false, { root: true })
      });
    },
    addtoCart(context,cartItem) {
      context.dispatch("updateLoading", false,{root:true}) //呼叫vuex的actions
      //設定api路徑將id帶入
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      //將資料組合成API在post時的格式後，傳出
      axios.post(api, { data: cartItem }).then(response => {
        context.dispatch("updateLoading", false,{root:true}); //呼叫vuex的actions
        context.dispatch("updateAlertMessage", {
          message: response.data.message,
          status: "success"
        },{root:true});
        context.dispatch("getCart")
      });
    },
    removeCartItem(context, id) {
      //設定api路徑將id帶入
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      axios.delete(api).then(response => {
        if (response) {
          context.dispatch('getCart')
          context.dispatch("updateAlertMessage", {
            message: response.data.message,
            status: "success"
          }, { root: true });
        } else {
          context.dispatch("updateAlertMessage", {
            message: response.data.message,
            status: "danger"
          }, { root: true });
        }
      });
    },
    //UseCoupon
    addCouponCode(context, coupon) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      context.dispatch("updateLoading", true, { root: true }); //呼叫vuex的actions
      axios.post(api, { data: coupon }).then(response => {
        if (response.data.success) {
          context.dispatch("updateAlertMessage", {
            message: response.data.message,
            status: "success"
          }, { root: true });
        } else {
          context.dispatch("updateAlertMessage", {
            message: response.data.message,
            status: "danger"
          }, { root: true });
        }
        context.dispatch("updateLoading", false, { root: true }); //呼叫vuex的actions
        context.dispatch('getCart')
      });
    },
    //order
    createOrder(context, orderData) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
      const order = orderData;
      axios.post(api, { data: order }).then(response => {
        if (response.data.success) {
          context.dispatch('changeStatus', 'checkout')
          context.dispatch("updateAlertMessage", {
            message: response.data.message,
            status: "success"
          }, { root: true });
          context.commit('GET_ORDER_ID', response.data.orderId)
          context.dispatch('getOrder')
        } else {
          context.dispatch("updateAlertMessage", {
            message: response.data.message,
            status: "danger"
          }, { root: true });
        }
      });
    },
    getOrder(context) {
      const orderId = context.state.orderId //下方api字串格式無法直接取用，存入變數後使用
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order/${orderId}`;
      context.dispatch("updateLoading", true, { root: true }); //呼叫vuex的actions
      axios.get(api).then(response => {
        context.commit('GET_ORDER_DATA', response.data.order)
        context.dispatch("updateLoading", false, { root: true }); //呼叫vuex的actions
      });
    },
    clearOrderData(context) {
      const default_order = { user: {} }
      context.commit('CLEAR_ORDER_DATA', default_order)
    }
  },
  mutations: {
    GET_CART(state, cartData) {
      state.cart = cartData;
    },
    STATUS(state, status) {
      state.status = status;
    },
    GET_ORDER_ID(state, id) {
      state.orderId = id
    },
    GET_ORDER_DATA(state, orderData) {
      state.order = orderData
    },
    CLEAR_ORDER_DATA(state, default_order) {
      state.order = default_order
      state.status = 'cart'
      state.orderId = ''
    }
  },
  getters: {
    cart(state) {
      return state.cart
    },
    status(state) {
      return state.status
    },
    orderId(state) {
      return state.orderId
    },
    order(state) {
      return state.order
    }
  }
}