import Vue from 'vue';
import VueRouter from 'vue-router';
// import store from '@/store/user';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'dashboard',
    meta: { requiresAuth: false },
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: { requiresAuth: false },
    component: () => import(/* webpackChunkName: "login" */ '@/components/users/LoginForm.vue'),
  },
  {
    path: '/administracion',
    name: 'administracion',
    component: () => import(/* webpackChunkName: "administracion" */ '@/views/Administracion.vue'),
    children: [
      {
        path: '/usuario',
        name: 'usuario-formulario',
        component: () => import(/* webpackChunkName: "usuario-formulario" */ '@/components/users/CreateUserFom.vue'),
      },
      {
        path: 'medios-desplazamiento',
        name: 'administracion-medios-desplazamiento',
        component: () => import(
          /* webpackChunkName: "medios-desplazamiento" */ '@/components/administracion/MediosDesplazamientoForm.vue'
        ),
      },
      {
        path: 'incidentes',
        name: 'administracion-incidentes',
        component: () => import(
          /* webpackChunkName: "incidentes" */ '@/components/administracion/GestionTable.vue'
        ),
      },
      {
        path: 'marcadores',
        name: 'administracion-marcadores',
        component: () => import(
          /* webpackChunkName: "marcadores" */ '@/components/administracion/MarcadoresForm.vue'
        ),
      },
      {
        path: 'table',
        name: 'administracion-marcadores',
        component: () => import(
          /* webpackChunkName: "marcadores" */ '@/components/administracion/FilteredTable.vue'
        ),
      },
    ],
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
