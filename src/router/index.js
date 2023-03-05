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
    path: '/ingresar',
    name: 'ingresar',
    meta: { requiresAuth: false },
    component: () => import(/* webpackChunkName: "login" */ '@/components/users/LoginForm.vue'),
  },
  {
    path: '/registrarse',
    name: 'registrarse',
    meta: { requiresAuth: false },
    component: () => import(/* webpackChunkName: "login" */ '@/components/users/RegistroUsuario.vue'),
  },
  {
    path: '/administracion',
    name: 'administracion',
    component: () => import(/* webpackChunkName: "administracion" */ '@/views/administracion/Base.vue'),
    children: [
      {
        path: 'usuario',
        name: 'web:administracion:usuarios',
        component: () => import(/* webpackChunkName: "administracion:usuario" */ '@/components/users/CreateUserFom.vue'),
      },

      {
        path: 'roles',
        name: 'web:administracion:roles',
        component: () => import(/* webpackChunkName: "administracion:roles" */ '@/views/administracion/Roles.vue'),
      },
      {
        path: 'permisos',
        name: 'web:administracion:permisos',
        component: () => import(/* webpackChunkName: "administracion:permisos" */ '@/views/administracion/Permisos.vue'),
      },
      {
        path: 'medios-desplazamiento',
        name: 'web:administracion:medios-desplazamiento',
        component: () => import(
          /* webpackChunkName: "administracion:medios-desplazamiento" */ '@/components/administracion/GestionIconos.vue'
        ),
      },
      {
        path: 'incidentes',
        name: 'web:administracion:incidentes',
        component: () => import(
          /* webpackChunkName: "administracion:incidentes" */ '@/components/administracion/GestionIconos.vue'
        ),
      },
      {
        path: 'marcadores',
        name: 'web:administracion:marcadores',
        component: () => import(
          /* webpackChunkName: "administracion:marcadores" */ '@/components/administracion/GestionIconos.vue'
        ),
      },
      {
        path: 'clasificacion-vehicular',
        name: 'web:administracion:clasificacion-vehicular',
        component: () => import(
          /* webpackChunkName: "administracion:marcadores" */ '@/components/administracion/ClasificacionVehicular.vue'
        ),
      },
      {
        path: 'clases-vehiculares',
        name: 'web:administracion:clases-vehiculares',
        component: () => import(
          /* webpackChunkName: "administracion:marcadores" */ '@/views/administracion/ClasesVehiculares.vue'
        ),
      },
      {
        path: 'vehiculos',
        name: 'web:administracion:vehiculos',
        component: () => import(
          /* webpackChunkName: "administracion:marcadores" */ '@/views/administracion/Vehiculos.vue'
        ),
      },
      {
        path: 'estados-solicitud',
        name: 'web:administracion:estado_solicitud',
        component: () => import(
          /* webpackChunkName: "administracion:marcadores" */ '@/components/administracion/GestionEstadosCuenta.vue'
        ),
      },
      {
        path: 'table',
        name: 'administracion-marcadores',
        component: () => import(
          /* webpackChunkName: "marcadores" */ '@/components/administracion/EstadoCuentaTablaPaginada.vue'
        ),
      },
    ],
  },

  {
    path: '/desplazamiento',
    name: 'desplazamiento',
    component: () => import(/* webpackChunkName: "administracion" */ '@/views/desplazamiento/Base.vue'),
    children: [
      {
        path: 'movil',
        name: 'web:desplazamiento:movil',
        component: () => import(/* webpackChunkName: "web:desplazamiento:movil" */ '@/components/desplazamiento/DesplazamientoListado.vue'),
      },
      {
        path: 'registrados/:uuid',
        name: 'web:desplazamiento:detalle',
        component: () => import(/* webpackChunkName: "web:desplazamiento:movil" */ '@/components/desplazamiento/GeoJson.vue'),
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
