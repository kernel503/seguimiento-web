import Vue from 'vue';
import VueRouter from 'vue-router';
// import store from '@/store/user';

Vue.use(VueRouter);

const routes = [
  {
    path: '/dashboard',
    name: 'web:dashboard',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
  },
  {
    path: '/ingresar',
    name: 'web:ingresar',
    meta: { requiresAuth: false },
    component: () => import(
      /* webpackChunkName: "login" */ '@/views/administracion/Login.vue'
    ),
  },
  {
    path: '/administracion',
    name: 'administracion',
    meta: { requiresAuth: true },
    component: () => import(
      /* webpackChunkName: "administracion" */ '@/views/administracion/Base.vue'
    ),
    children: [
      {
        path: 'usuario',
        name: 'web:administracion:usuarios',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "administracion:usuario" */ '@/components/users/CreateUserFom.vue'
        ),
      },

      {
        path: 'roles',
        name: 'web:administracion:roles',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "administracion:roles" */ '@/views/administracion/Roles.vue'
        ),
      },
      {
        path: 'permisos',
        name: 'web:administracion:permisos',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "administracion:permisos" */ '@/views/administracion/Permisos.vue'
        ),
      },
      {
        path: 'medios-desplazamiento',
        name: 'web:administracion:medios-desplazamiento',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "administracion:medios-desplazamiento" */ '@/components/administracion/GestionIconos.vue'
        ),
      },
      {
        path: 'incidentes',
        name: 'web:administracion:incidentes',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "administracion:incidentes" */ '@/components/administracion/GestionIconos.vue'
        ),
      },
      {
        path: 'marcadores',
        name: 'web:administracion:marcadores',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "administracion:marcadores" */ '@/components/administracion/GestionIconos.vue'
        ),
      },
      {
        path: 'clasificacion-vehicular',
        name: 'web:administracion:clasificacion-vehicular',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "administracion:marcadores" */ '@/components/administracion/ClasificacionVehicular.vue'
        ),
      },
      {
        path: 'clases-vehiculares',
        name: 'web:administracion:clases-vehiculares',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "administracion:marcadores" */ '@/views/administracion/ClasesVehiculares.vue'
        ),
      },
      {
        path: 'vehiculos',
        name: 'web:administracion:vehiculos',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "administracion:marcadores" */ '@/views/administracion/Vehiculos.vue'
        ),
      },
      {
        path: 'estados-solicitud',
        name: 'web:administracion:estados-solicitud',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "administracion:marcadores" */ '@/components/administracion/GestionEstadosCuenta.vue'
        ),
      },
      {
        path: 'table',
        name: 'administracion-marcadores',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "marcadores" */ '@/components/administracion/EstadoCuentaTablaPaginada.vue'
        ),
      },
      {
        path: 'login2',
        name: 'administracion-login2',
        component: () => import(
          /* webpackChunkName: "login2" */ '@/views/administracion/Login.vue'
        ),
      },
    ],
  },

  {
    path: '/desplazamiento',
    name: 'desplazamiento',
    meta: { requiresAuth: true },
    component: () => import(
      /* webpackChunkName: "administracion" */ '@/views/desplazamiento/Base.vue'
    ),
    children: [
      {
        path: 'movil',
        name: 'web:desplazamiento:movil',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "web:desplazamiento:movil" */ '@/components/desplazamiento/DesplazamientoListado.vue'
        ),
      },
      {
        path: 'registrados/:uuid',
        name: 'web:desplazamiento:detalle',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "web:desplazamiento:movil" */ '@/components/desplazamiento/GeoJson.vue'
        ),
      },
    ],
  },

  {
    path: '*',
    component: () => import(
      /* webpackChunkName: "web:not_found:movil" */ '@/components/paginas/NotFound.vue'
    ),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
