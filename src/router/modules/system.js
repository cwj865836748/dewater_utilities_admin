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
    {
      path: 'app-version',
      component: () => import('@/views/system/app-version'),
      name: 'AppVersion',
      meta: { title: 'appVersion' }
    }
  ]
}

export default systemRouter
