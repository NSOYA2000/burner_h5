import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/burnerlist'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/burnerlist',
    name: 'burnerlist',
    component: () => import('@/views/burner_list'),
    hidden: true
  },
  {
    path: '/potlist',
    name: 'potlist',
    component: () => import('@/views/pot_list'),
    hidden: true
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard'),
    hidden: true
  },
  {
    path: '/potdetail',
    name: 'potdetail',
    component: () => import('@/views/pot_detail'),
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

export const asyncRoutes = [{ path: '*', redirect: '/404', hidden: true }]

const createRouter = () =>
  new Router({
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
