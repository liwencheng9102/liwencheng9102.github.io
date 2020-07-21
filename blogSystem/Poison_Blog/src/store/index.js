import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    draftId: '',
    bloggerInfo: {},
    unreadArticals: [],
    unreadMessages:[],
    showUnreadArticals:[],
    showUnreadMessages:[],
    searchResult:[]
  },
  mutations: {
    changeLoginStatus(state, yesOrNo) {
      state.isLogin = yesOrNo
    },
    receive_draftId(state, id) {
      state.draftId = id
    },
    receive_userInfo(state, data) {
      state.bloggerInfo = data
    },
    receive_unreadArticals(state, data) {
      state.unreadArticals = data
    },
    addUnreadArtical(state,data){
      if (data.length!=0) {
        state.showUnreadArticals = [...state.showUnreadArticals,...data]
      }
    },
    receive_unreadMessages(state,data){
      state.unreadMessages = data
    },
    addUnreadMessages(state,data){
      state.showUnreadMessages = [...state.showUnreadMessages,...data]
    },
    rmUnreadArticals(state){
      let arr = []
      let arrLength = state.showUnreadArticals.length
      if (arrLength>=6) {
        for (let i = arrLength - 1; i > arrLength - 7; i--) {
          const element = state.showUnreadArticals[i];
          arr.unshift(element)
        }
        state.showUnreadArticals = arr
      }
    },
    receive_searchResult(state,data){
      state.searchResult = data
    }
  },
  actions: {},
  modules: {}
})