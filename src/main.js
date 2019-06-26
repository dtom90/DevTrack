import Vue from 'vue'
import App from './App.vue'

// Vuex store
import store from './store'

// Boostrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Font Awesome Icons
import { FontAwesomeIcon } from './font-awesome-icons'
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
