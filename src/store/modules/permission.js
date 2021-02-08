1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
import {asyncRoutes, constantRoutes} from '@/router'
import Layout from '@/layout'
// 获取组件的方法
const _import = require('@/router/_import_' + process.env.NODE_ENV)

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {...route}
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function addDynamicRoutes(routes) {
  const res = []

  routes.forEach(route => {
    const tmp = {...route}
    const tempJson = {
      hidden: tmp.hidden,
      alwaysShow: tmp.alwaysShow,
      redirect: tmp.redirect,
      name: tmp.name,
      path: tmp.path,
      meta: {
        title: tmp.title,
        icon: tmp.icon,
        noCache: tmp.noCache,
        affix: tmp.affix,
        breadcrumb: tmp.breadcrumb,
        activeMenu: tmp.activeMenu
      }
    }
    if (tmp.title == 'unit' || tmp.title == 'agentCommission') tempJson.hidden = true

    if (tmp.component) {
      if (tmp.component == 'Layout') {
        tempJson.component = Layout
      } else {
        tempJson.component = _import(tmp.component)
      }
    }

    if (tmp.children && tmp.children.length > 0) {
      tempJson.children = addDynamicRoutes(tmp.children)
    }
    res.push(tempJson)
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({commit}, roles) {
    return new Promise(resolve => {
      let accessedRoutes = addDynamicRoutes(roles)
      //添加上错误域名
      accessedRoutes.push({path: '*', redirect: '/404', hidden: true})
      // const accessedRoutes = asyncRoutes
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

