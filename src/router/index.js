import { createRouter, createWebHistory } from 'vue-router'
import WalkthroughView from '../views/WalkthroughView.vue'
import Steps from '../views/StepsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'walkthrough',
      component: WalkthroughView
    },
    {
      path: '/steps',
      name: 'steps',
      component: Steps
    },
  ]
})

export default router
