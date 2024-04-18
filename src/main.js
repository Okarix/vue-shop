import './assets/main.css'

import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router/routes'

const app = createApp(App)

app.use(autoAnimatePlugin)
app.use(router)
app.mount('#app')
