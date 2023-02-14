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
    path: '/signup',
    name: 'signup',
    meta: { requiresAuth: false },
    component: () => import(/* webpackChunkName: "login" */ '@/components/users/CreateUserFom.vue'),
  },
  {
    path: '/administracion',
    name: 'administracion',
    component: () => import(/* webpackChunkName: "administracion" */ '@/views/Administracion.vue'),
    children: [
      {
        path: 'usuario',
        name: 'web:administracion:usuarios',
        component: () => import(/* webpackChunkName: "administracion:usuario" */ '@/components/users/CreateUserFom.vue'),
      },

      {
        path: 'roles',
        name: 'web:administracion:roles',
        component: () => import(/* webpackChunkName: "administracion:roles" */ '@/components/administracion/Roles.vue'),
      },
      {
        path: 'permisos',
        name: 'web:administracion:permisos',
        component: () => import(/* webpackChunkName: "administracion:permisos" */ '@/components/administracion/Roles.vue'),
      },
      {
        path: 'medios-desplazamiento',
        name: 'web:administracion:medios-desplazamiento',
        component: () => import(
          /* webpackChunkName: "administracion:medios-desplazamiento" */ '@/components/administracion/MediosDesplazamientoForm.vue'
        ),
      },
      {
        path: 'incidentes',
        name: 'web:administracion:incidentes',
        component: () => import(
          /* webpackChunkName: "administracion:incidentes" */ '@/components/administracion/GestionTable.vue'
        ),
      },
      {
        path: 'marcadores',
        name: 'web:administracion:marcadores',
        component: () => import(
          /* webpackChunkName: "administracion:marcadores" */ '@/components/administracion/MarcadoresForm.vue'
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
