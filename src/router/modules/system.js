/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: 'noRedirect',
  name: 'System',
  meta: {
    title: 'system',
    icon: 'lock'
  },
  children: [
    {
      path: 'setting',
      component: () => import('@/views/system/setting'),
      name: 'Setting',
      meta: { title: 'systemSetting' }
    },
    {
      path: 'admin',
      component: () => import('@/views/system/admin'),
      name: 'Admin',
      meta: { title: 'admin' }
    },
    {
      path: 'role',
      component: () => import('@/views/system/role'),
      name: 'Role',
      meta: { title: 'role' }
    },
    {
      path: 'rule',
      component: () => import('@/views/system/rule'),
      name: 'Rule',
      meta: { title: 'rule' }
    },
    {
      path: 'log',
      component: () => import('@/views/system/log'),
      name: 'Log',
      meta: { title: 'operationLog' }
    },
    // {
    //   path: 'app-version',
    //   component: () => import('@/views/system/app-version'),
    //   name: 'AppVersion',
    //   meta: { title: 'appVersion' }
    // }

  ]
}
const reportRouter = {
  path: '/report',
  component: Layout,
  redirect: 'noRedirect',
  name: '报表管理',
  meta: {
    title: '报表管理',
    icon: 'lock'
  },
  children: [
    {
      path: 'report',
      component: () => import('@/views/report/index'),
      name: '报表管理',
      meta: { title: '报表管理' }
    }
  ]
}
const areaRouter = {
  path: '/area',
  component: Layout,
  redirect: 'noRedirect',
  name: '区域管理',
  meta: {
    title: '区域管理',
    icon: 'lock'
  },
  children: [
    {
      path: 'area',
      component: () => import('@/views/area'),
      name: '区域管理',
      meta: { title: '区域管理' }
    }
  ]
}
const businessRouter = {
  path: '/business',
  component: Layout,
  redirect: 'noRedirect',
  name: '业务管理',
  meta: {
    title: '业务管理',
    icon: 'lock'
  },
  children: [
    {
      path: 'business',
      component: () => import('@/views/business'),
      name: '业务类型',
      meta: { title: '业务类型' }
    },
    {
      path: 'water',
      component: () => import('@/views/business/water'),
      name: '设施类型',
      meta: { title: '设施类型' }
    }
  ]
}
const caseRouter = {
  path: '/case',
  component: Layout,
  redirect: 'noRedirect',
  name: '案件管理',
  meta: {
    title: '案件管理',
    icon: 'lock'
  },
  children: [
    {
      path: 'case',
      component: () => import('@/views/case'),
      name: '案件管理',
      meta: { title: '案件管理' }
    }
  ]
}
const inspectionRouter = {
  path: '/inspection',
  component: Layout,
  redirect: 'noRedirect',
  name: '巡检管理',
  meta: {
    title: '巡检管理',
    icon: 'lock'
  },
  children: [
    {
      path: 'inspectionList',
      component: () => import('@/views/inspection/inspectionList'),
      name: '巡检列表',
      meta: { title: '巡检列表' }
    },
    {
      path: 'inspectionLineList',
      component: () => import('@/views/inspection/inspectionLineList'),
      name: '巡检路线管理',
      meta: { title: '巡检路线管理' }
    }
  ]
}
const merchantRouter = {
  path: '/merchant',
  component: Layout,
  redirect: 'noRedirect',
  name: '商家管理',
  meta: {
    title: '商家管理',
    icon: 'lock'
  },
  children: [
    {
      path: 'merchant',
      component: () => import('@/views/merchant'),
      name: '商家管理',
      meta: { title: '商家管理' }
    },
    {
      path: 'merchantType',
      component: () => import('@/views/merchant/merchantType'),
      name: '商家类型管理',
      meta: { title: '商家类型管理' }
    }
  ]
}
const userRouter = {
  path: '/user',
  component: Layout,
  redirect: 'noRedirect',
  name: '用户管理',
  meta: {
    title: '用户管理',
    icon: 'lock'
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/user'),
      name: '用户管理',
      meta: { title: '用户管理' }
    }
  ]
}
export default {systemRouter,userRouter,merchantRouter,inspectionRouter,caseRouter,businessRouter,areaRouter,reportRouter}
