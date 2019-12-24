import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
// import { isTSConstructSignatureDeclaration } from '@babel/types'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/500',
    component: () => import('@/views/error-page/500'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/HomeManage/Home'),
        name: 'Home',
        meta: { title: '主页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 规则管理
  {
    path: '/rulemanage',
    component: Layout,
    redirect: '/rulemanage/varmanage',
    alwaysShow: true, // will always show the root menu
    name: 'RuleManage',
    meta: {
      title: '规则管理',
      icon: 'star'
      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'varmanage',
        component: () => import('@/views/VariableManage/index'),
        name: 'VariableManage',
        meta: {
          title: '变量管理'
          // roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'rulepackagemanage',
        component: () => import('@/views/VariablePackageManage/index'),
        name: 'RulePackageManage',
        meta: {
          title: '规则包管理'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'ruleprocessmanage',
        component: () => import('@/views/VariableProcessManage/index'),
        name: 'RuleProcessManage',
        meta: {
          title: '规则流程管理'
          // roles: ['admin']
        }
      },
      {
        path: 'processconfig',
        component: () => import('@/views/ProcessConfig/index'),
        name: 'RuleProcessConfig',
        meta: {
          title: '规则流程配置'
        },
        hidden: true
      }
    ]
  },
  // 决策管理
  {
    path: '/decisionmanage',
    component: Layout,
    redirect: '/descisionmanage/decisionsimulation',
    alwaysShow: true, // will always show the root menu
    name: 'DecisionManage',
    meta: {
      title: '决策管理',
      icon: 'lock'
      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'decisionsimulation',
        component: () => import('@/views/DecisionManage/Simulation'),
        name: 'DecisionSimulation',
        meta: {
          title: '决策模拟'
          // roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'decistatistics',
        component: () => import('@/views/DecisionManage/Statistic'),
        name: 'DecisionStatistics',
        meta: {
          title: '决策统计'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'simulationdetail',
        component: () => import('@/views/DecisionManage/SimulationDetail'),
        name: 'SimulationDetail',
        meta: {
          title: '规则模拟'
        },
        hidden: true
      },
      {
        path: 'simulationresult',
        component: () => import('@/views/DecisionManage/SimulationResult'),
        name: 'SimulationResult',
        meta: {
          title: '规则模拟结果'
        },
        hidden: true
      }
    ]
  },
  // 控制面板
  {
    path: '/controlpanel',
    component: Layout,
    redirect: '/controlpanel/varmanage',
    alwaysShow: true, // will always show the root menu
    name: 'ControlPanel',
    meta: {
      title: '控制面板',
      icon: 'user'
      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'usermanage',
        component: () => import('@/views/SystemManage/User'),
        name: 'UserManage',
        meta: {
          title: '用户管理'
          // roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'rolemanage',
        component: () => import('@/views/SystemManage/Role'),
        name: 'RoleManage',
        meta: {
          title: '角色管理'
          // roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'passmodify',
        component: () => import('@/views/SystemManage/PasswordModify'),
        name: 'PasswordModify',
        meta: {
          title: '修改密码'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },
  /** when your routing map is too long, you can split it into small modules **/
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
