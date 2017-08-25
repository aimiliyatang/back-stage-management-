import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state:{
     login:false
  },
  actions:{
     changeState({commit,state},bl){
        commit("changeState",bl);
     },
     logout({commit}){
        commit("logout");
     }
  },
  mutations:{
     changeState(state,bl){
        state.login=bl;
     },
     logout(state){
        state.login=false;
     }
  },
  getters:{
     getState:(state)=>{
        return state.login;
     }
  }
});