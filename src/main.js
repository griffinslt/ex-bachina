

import "/src/assets/main.scss"



import { createApp } from 'vue'
import VNetworkGraph from "v-network-graph"
import "v-network-graph/lib/style.css"
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(VNetworkGraph)
app.use(router)

app.mount('#app')
