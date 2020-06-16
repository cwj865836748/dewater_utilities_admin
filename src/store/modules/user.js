import {Admin} from '@/api'
import {getToken, setToken, removeToken} from '@/utils/auth'
import router, {resetRouter} from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  showBidPrice: false,
  roles: [],
  permissions: [],
  staffId: '',
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_STAFFID: (state, staffId) => {
    state.staffId = staffId
  },
  SET_SHOW_BID_PRICE: (state, showBidPrice) => {
    state.showBidPrice = showBidPrice
  },
}

const actions = {
  // user login
  login({commit}, userInfo) {
    const {username, password} = userInfo
    return new Promise((resolve, reject) => {
      Admin.logIn({username: username.trim(), password: password}).then(response => {
        const {data} = response

        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({commit}) {
    return new Promise((resolve, reject) => {
      Admin.getInfo().then(response => {
        const {user} = response
        // 默认头像 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        user.avatar = require('@/assets/images/logo.png')

        if (!user) {
          reject('Verification failed, please Login again.')
        }

        const {username, avatar, remark, staffId, showBidPrice} = user

        commit('SET_NAME', username) // 用户名
        commit('SET_AVATAR', avatar)  //头像
        commit('SET_INTRODUCTION', remark) // 备注
        commit('SET_STAFFID', staffId) // 部门人员ID
        commit('SET_SHOW_BID_PRICE', showBidPrice) // 是否展示承包价
        // commit('SET_SHOW_BID_PRICE', true) // 是否展示承包价

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get Roles
  getMenu({commit}) {
    return new Promise((resolve, reject) => {
      Admin.getMenu().then(response => {
        const {data} = response

        commit('SET_ROLES', data.menuList)
        commit('SET_PERMISSIONS', data.permissions)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit, state, dispatch}) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_PERMISSIONS', [])
      removeToken()
      resetRouter()
      dispatch('tagsView/delAllViews', null, {root: true})
      resolve()
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({commit, dispatch}, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const {roles} = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {root: true})

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, {root: true})

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
