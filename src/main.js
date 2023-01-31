import Vue from 'vue';
import VueAxios from 'vue-axios';
import Toast from 'vue-toastification';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import instance from './plugins/axiosInstance';
import 'vue-toastification/dist/index.css';

const toastOptions = {};

Vue.config.productionTip = false;
Vue.use(VueAxios, { axios: instance });
Vue.use(Toast, toastOptions);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
