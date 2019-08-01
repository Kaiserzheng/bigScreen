import Vue from 'vue'
import Router from 'vue-router'
import riverLake from '@/components/view/riverLake/riverLake'
import dynamicMonitor from '@/components/view/dynamicMonitor/dynamicMonitor'
import threeDimensional from '@/components/view/threeDimensional/threeDimensional'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'riverLake',
      component: riverLake
    },
    {
      path: '/dynamicMonitor',
      name: 'dynamicMonitor',
      component: dynamicMonitor
    },
    {
      path: '/threeDimensional',
      name: 'threeDimensional',
      component: threeDimensional
    }
  ]
})
