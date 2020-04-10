import Vue from 'vue';
import Vuex from 'vuex';
// import axios from 'axios';

import cartModule from './cart'


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        alertMessages: [],
        isLoading:false,
    },
    actions: {
        //AlertMessage
        updateAlertMessage(context, alert) {
            const timestamp = Math.floor(new Date() / 1000);
            let message = alert.message
            let status = alert.status
            let alertContent = { message, status, timestamp }
            context.commit('SHOW_ALERT', alertContent)
            context.dispatch('removeMessageWithTiming', timestamp)
        },
        removeMessageWithTiming(context, timestamp) {
            setTimeout(() => {
                context.state.alertMessages.forEach((item, index) => {
                    if (item.timestamp === timestamp) {
                        context.commit('REMOVE_ALERT', index)
                    }
                });
            }, 5000);
        },
        removeMessage(context, index) {
            context.commit('REMOVE_ALERT', index)
        },
        //Loading Effect
        updateLoading(context,status){
            context.commit('LOADING',status)
        }
    },
    mutations: {
        SHOW_ALERT(state, alertContent) {
            state.alertMessages.push(alertContent)
        },
        REMOVE_ALERT(state, index) {
            state.alertMessages.splice(index, 1)
        },
        LOADING(state,status){
            state.isLoading = status;
        }
    },
    getters: {
        alertMessages(state){
            return state.alertMessages
        },
        isLoading(state){
            return state.isLoading
        }
    },
    modules:{
        cartModule,
    }
});