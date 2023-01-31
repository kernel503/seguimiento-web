import Vue from 'vue';
import VueRouter from 'vue-router';
// import store from '@/store/user';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: { requiresAuth: false },
    component: () => import(/* webpackChunkName: "login" */ '@/components/users/LoginForm.vue'),
  },
  {
    path: '/usuario/formulario',
    name: 'usuario-formulario',
    component: () => import(/* webpackChunkName: "usuario-formulario" */ '@/components/users/CreateUserFom.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach(() => {
//   // const value = store.state().isAuthenticated;
//   console.log(store);
//   return true;
// });

export default router;
