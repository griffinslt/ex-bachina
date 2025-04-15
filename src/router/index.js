import { createRouter, createWebHistory } from 'vue-router'
import WalkthroughView from '../views/WalkthroughView.vue'
import Steps from '../views/StepsView.vue'
import InteractiveStaveView from '@/views/InteractiveStaveView.vue'
import GenerateView from '@/views/GenerateView.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/walkthrough',
      name: 'walkthrough',
      component: WalkthroughView
    },
    {
      path: '/steps',
      name: 'steps',
      component: Steps
    },
    {
      path: '/interactive-stave',
      name: 'interactive-stave',
      component: InteractiveStaveView
    },
    {
      path: '/generate',
      name: 'generate',
      component: GenerateView
    },
  ]
})

export default router
