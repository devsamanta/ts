// Copyright © 2018-2019 Stanislav Valasek <valasek@gmail.com>

import api from '../../api/axiosSettings'
import { Notify } from 'quasar'

// initial state
const state = {
  all: [], // id, name, allocation
  selected: '',
  selectedAllocation: 1
}

const getters = {}

const actions = {

  getConsultants ({ commit, dispatch }) {
    api.apiClient.get('/api/consultants', { crossDomain: true })
      .then(response => {
        commit('SET_CONSULTANTS', response.data)
      })
      .catch(e => {
        Notify.create({
          message: 'Couldn\'t read consultants from server. \n' + e.toString(),
          color: 'negative',
          icon: 'report_problem'
        })
        console.log(e) /* eslint-disable-line no-console */
      })
  },

  setSelected ({ commit }, selectedConsultant) {
    commit('SET_SELECTED', selectedConsultant)
  }

}

const mutations = {

  SET_CONSULTANTS (state, consultants) {
    state.all = consultants.sort(function (a, b) {
      var nameA = a.name.toUpperCase()
      var nameB = b.name.toUpperCase()
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      return 0
    })
    let c = localStorage.getItem('selectedConsultant')
    if (c && c.length > 0) {
      state.selected = c
      state.selectedAllocation = state.all.find(cc => cc.name === c).allocation
    } else {
      state.selected = consultants[0].name
      state.selectedAllocation = consultants[0].allocation
    }
  },

  SET_SELECTED (state, selectedConsultant) {
    state.selected = selectedConsultant
    state.selectedAllocation = state.all.find(cc => cc.name === selectedConsultant).allocation
    localStorage.setItem('selectedConsultant', selectedConsultant)
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
