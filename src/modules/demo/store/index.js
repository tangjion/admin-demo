// Write your vuex

import getters from './getters'
import { SET_COMMENTS_LIST } from './mutation_consts'
import api from '../api/index'
import { checkArray } from '../utils/index'

const demo = api.demo

let store = {
  // Recommend open namespaced
  namespaced: true,

  state: {
    commentsList: []
  },

  mutations: {
    [SET_COMMENTS_LIST](state, arr) {
      state.commentsList = arr
    }
  },

  actions: {
    getCommentsList({ commit }) {
      return demo.getList().then((res) => {
        let list = []
        if (checkArray(list)) {
          list = res.data
        }
        commit(SET_COMMENTS_LIST, list)
        return res
      })
    }
  },

  getters,

  modules: {
    // ...
  }
}

export default store
