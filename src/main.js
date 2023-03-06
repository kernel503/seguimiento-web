import Vue from 'vue';
import VueAxios from 'vue-axios';
import Toast from 'vue-toastification';
import VueProgressBar from 'vue-progressbar';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import instance from './plugins/axiosInstance';
import 'vue-toastification/dist/index.css';
import 'leaflet/dist/leaflet.css';

const toastOptions = {};

Vue.config.productionTip = false;

Vue.use(VueAxios, { axios: instance });
Vue.use(Toast, toastOptions);
Vue.use(VueProgressBar, {
  color: 'black',
  failedColor: 'rgb(244, 67, 54)',
  height: '2px',
  thickness: '4px',
  position: 'relative',
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
