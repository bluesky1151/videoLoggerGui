import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import Api from './modules/Api';
import Common from './modules/Common';
export default new createStore({
  modules: {
    Api,
    Common
  },
  plugins: [createPersistedState({
    storage: window.localStorage
  })]
})