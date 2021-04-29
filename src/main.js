import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

import VueRx from 'vue-rx'
import VuejsClipper from 'vuejs-clipper'

Vue.config.productionTip = false

Vue.prototype.$API_URL = "/api"

Vue.use(VueRx)
Vue.use(VuejsClipper)

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
