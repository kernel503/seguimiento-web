import Vue from 'vue';
import VueRouter from 'vue-router';
// import store from '@/store/user';

Vue.use(VueRouter);

const routes = [
  {
    path: '/dashboard',
    name: 'web:dashboard',
    meta: { requiresAuth: false },
    component: () => import(
      /* webpackChunkName: "dashboard" */ '@/components/desplazamiento/DesplazamientoListado.vue'
    ),
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
        path: 'tipos-vehiculos-rutas',
        name: 'web:administracion:tipos-vehiculos-rutas',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "administracion:tipos-vehiculos-rutas" */ '@/components/administracion/RutasTransporte/GestionTiposVehiculoRutas.vue'
        ),
      },
      {
        path: 'tipos-servicios-rutas',
        name: 'web:administracion:tipos-servicios-rutas',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "administracion:tipos-servicios-rutas" */ '@/components/administracion/RutasTransporte/GestionTiposServiciosRutas.vue'
        ),
      },
      {
        path: 'clases-servicios-rutas',
        name: 'web:administracion:clases-servicios-rutas',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "administracion:clases-servicios-rutas" */ '@/components/administracion/RutasTransporte/GestionClasesServiciosRutas.vue'
        ),
      },
      {
        path: 'rutas-transporte',
        name: 'web:administracion:rutas-transporte',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "administracion:rutas-transportes" */ '@/components/administracion/RutasTransporte/GestionRutasTransporte.vue'
        ),
      },
      {
        path: 'levantamientos',
        name: 'web:administracion:levantamiento',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "administracion:rutas-transportes" */ '@/components/administracion/GestionLevantamiento.vue'
        ),
      },
      {
        path: 'conteo-vehicular',
        name: 'web:administracion:conteo-vehicular',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "administracion:rutas-transportes" */ '@/components/administracion/GestionLevantamientoContador.vue'
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
    path: '/levantamiento',
    name: 'levantamiento',
    meta: { requiresAuth: true },
    component: () => import(
      /* webpackChunkName: "administracion" */ '@/views/levantamiento/Base.vue'
    ),
    children: [
      {
        path: 'marcador',
        name: 'web:levantamiento:marcador',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "web:desplazamiento:movil" */ '@/components/levantamiento/Listado.vue'
        ),
      },
      {
        path: 'marcador/:codigo',
        name: 'web:levantamiento:detalle-marcador',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "web:desplazamiento:movil" */ '@/components/levantamiento/Marker.vue'
        ),
      },
      {
        path: 'conteo-vehicular',
        name: 'web:conteo-vehicular:lista',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "web:desplazamiento:movil" */ '@/components/conteo_vehicular/Listado.vue'
        ),
      },
      {
        path: 'conteo-vehicular/:codigo',
        name: 'web:conteo-vehicular:detalle',
        meta: { requiresAuth: true },
        component: () => import(
          /* webpackChunkName: "web:desplazamiento:movil" */ '@/components/conteo_vehicular/Tabla.vue'
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
  // base: process.env.BASE_URL,
  routes,
});

export default router;
