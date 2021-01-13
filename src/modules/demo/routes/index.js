// docs:
// https://klook.slab.com/public/tiff2ezs

/**
 * Note: sub-menu only appear when route children.length >= 1
 *
 * hidden: true                   if set true, item will not show in the sidebar (default is false)
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * global: true                   if set true, item would ignore module namespaced (defsault is undefined, recommend not set)
 * highlight:                     if set Func, SubSidebar menu item would highlight according to this Func return value
 *   undefined (default) | Func($route)     if the Func you set return undefined, SubSidebar menu highlight logic would be origin
 * meta: {
 *   auth: ['admin','editor']    control the page roles (you can set multiple roles)
 *   title: 'title'               the name show in sidebar and breadcrumb (recommend set)
 *   icon: 'svg-name'             the icon show in the sidebar
 *   breadcrumb: false            if set false, the item will hidden in breadcrumb (default is true)
 *                                 if breadcrumb is a function, component Breadcrumb would show its return value
 *                                 if breadcrumb is a string, component would show it directly
 *                                 else, component would show meta.title
 * }
 */

import '../assets/icons'

const router = {
  /**
   * Define your routes namespaced
   * Every module path would begin with it
   * e.g. "/${base}/${your_path}"
   */
  base: '/default',
  routes: [
    {
      path: '',
      name: 'home',
      meta: {
        title: 'Home',
        icon: 'people'
      },
      children: [
        // Write your module routes

        /**
         * Define your global 404 page (optional)
         * If not define, router would define a default 404 page
         * component: () => import("@/pages/404")
         */

        // Default route:
        {
          path: '',
          name: 'default',
          component: () => import('../pages/index'),
          meta: {
            title: 'Admin',
            icon: ''
          }
        }
        // {
        //   path: '*',
        //   hidden: true,
        //   redirect: { name: 'demo' }
        // }

        // TODO1: Your module 404 page match must be placed at the end !!!
        // { path: "/*", redirect: "/404", hidden: true }
      ]
    }
  ]
}

export default router
