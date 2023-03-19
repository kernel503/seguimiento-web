<template>
  <v-app>
    <vue-progress-bar></vue-progress-bar>
    <v-navigation-drawer
      app
      v-model="drawer"
      v-if="isAuthenticated"
      color="blue-grey lighten-5"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6 text-center">
            Seguimiento
          </v-list-item-title>
          <v-list-item-subtitle class="text-h4 text-center">
            🛴
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <template v-for="item in items">
          <v-list-group color="red" v-if="item.children" :key="item.index">
            <template v-slot:activator>
              <v-list-item-title class="text-capitalize">
                {{ item.title }}
              </v-list-item-title>
            </template>

            <template #prependIcon>
              <v-icon>{{ item.icon }}</v-icon>
            </template>

            <v-list-item
              v-for="(child, j) in item.children"
              :key="j"
              :to="child.path"
              class="ml-4"
              color="red"
            >
              <v-list-item-icon>
                <v-icon>{{ child.icon }} </v-icon>
              </v-list-item-icon>
              <v-list-item-title class="text-capitalize">
                <span>{{ child.title }}</span>
              </v-list-item-title>
            </v-list-item>
          </v-list-group>

          <v-list-item v-else :key="item.title" :to="item.path">
            <v-list-item-icon>
              <v-icon>{{ item.icon }} </v-icon>
            </v-list-item-icon>
            <v-list-item-title class="text-capitalize">
              <span>{{ item.title }}</span>
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="blue-grey lighten-5" v-if="isAuthenticated">
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        v-if="isAuthenticated"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <template v-if="isAuthenticated">
        <v-btn icon class="mx-2" plain @click="dialogLogout = true">
          <v-icon> mdi-logout </v-icon>
        </v-btn>
      </template>

      <!-- <template v-else>
        <v-btn
          :color="loginColor"
          small
          class="mx-2"
          plain
          :to="{ name: 'web:ingresar' }"
        >
          Ingresar2
        </v-btn>
      </template>-->
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app v-if="false"> </v-footer>
    <v-dialog v-model="dialogLogout" max-width="530px">
      <v-card>
        <v-card-title class="text-h5 justify-center">
          ¿Está seguro que desea cerrar sesion?
        </v-card-title>
        <v-card-actions class="py-3">
          <v-spacer></v-spacer>
          <v-btn class="red darken-2" @click="logout" dark>Si</v-btn>
          <v-btn class="default" color="" @click="dialogLogout = false"
            >No</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <Footer></Footer>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Footer from '@/components/Footer.vue';

const items = [
  // {
  //   title: 'Dashboard',
  //   icon: 'mdi-view-dashboard',
  //   path: { name: 'web:dashboard' },
  // },
  {
    title: 'Administración',
    icon: 'mdi-database',
    children: [
      {
        title: 'Usuarios',
        icon: 'mdi-account-multiple',
        path: { name: 'web:administracion:usuarios' },
      },
      {
        title: 'Permisos',
        icon: 'mdi-security',
        path: { name: 'web:administracion:permisos' },
      },
      {
        title: 'Roles',
        icon: 'mdi-account-check',
        path: { name: 'web:administracion:roles' },
      },
      {
        title: 'Estados solicitud',
        icon: 'mdi-account-details',
        path: { name: 'web:administracion:estados-solicitud' },
      },
      {
        title: 'Medios desplazamiento',
        icon: 'mdi-train-car',
        path: { name: 'web:administracion:medios-desplazamiento' },
      },
      {
        title: 'Incidentes',
        icon: 'mdi-alert',
        path: { name: 'web:administracion:incidentes' },
      },
      {
        title: 'Marcadores',
        icon: 'mdi-map-marker-star',
        path: { name: 'web:administracion:marcadores' },
      },
      {
        title: 'Clasificación Vehicular',
        icon: 'mdi-car-info',
        path: { name: 'web:administracion:clasificacion-vehicular' },
      },
      {
        title: 'Clases Vehiculares',
        icon: 'mdi-car-info',
        path: { name: 'web:administracion:clases-vehiculares' },
      },
      {
        title: 'Vehiculos',
        icon: 'mdi-car-info',
        path: { name: 'web:administracion:vehiculos' },
      },
    ],
  },
  {
    title: 'Desplazamientos',
    icon: 'mdi-crosshairs-gps',
    children: [
      {
        title: 'Registros',
        icon: 'mdi-cellphone-marker',
        path: {
          name: 'web:desplazamiento:movil',
        },
      },
      // {
      //   title: 'Dispositivo móvil',
      //   icon: 'mdi-cellphone-marker',
      //   path: {
      //     name: 'web:desplazamiento:detalle',
      //     params: { uuid: '22a3e45f-343e-4308-b42b-0cc2fe05873f' },
      //   },
      // },
    ],
  },
];

export default {
  name: 'App',
  // components: { BarNavigation, MainContainer, NavigationDrawer },
  components: { Footer },
  async created() {
    this.$Progress.start();

    const hasToken = !!localStorage.getItem('token') || false;

    if (hasToken) {
      console.log('Tiene token');
      try {
        const { data } = await this.axios.get('/user');
        const { permisos } = data;

        if (permisos.length) {
          this.userData(data);
          this.userIsAuthenticated(true);
          this.showBtn = true;
          this.items = items
            .map((item) => {
              const childPath = item.children.filter((child) => permisos.includes(child.path.name));
              if (childPath.length === 0) return null;
              return {
                ...item,
                children: childPath,
              };
            })
            .filter(Boolean);
        } else {
          this.$toast.error(
            'No tiene permisos para acceder al componente web.',
          );
          this.logout();
        }
      } catch (error) {
        this.logout();
      }
    } else {
      console.log('No tiene token');
      this.logout();
    }

    // this.userIsAuthenticated
    if (!this.accesoPermitido(this.$route.name) && this.isAuthenticated) {
      console.log(this.$route.name);
      console.log(this.data?.permisos);
      this.$router.push({ name: 'web:dashboard' }, () => {});
    }

    this.$router.beforeEach((to, from, next) => {
      console.log(to);
      console.log(from);
      console.log(this.data);

      if (!this.isAuthenticated && !to.meta.requiresAuth) {
        console.log('Entra');
        return next();
      }

      if (!this.isAuthenticated) {
        console.log('Entra 2');
        return next(false);
      }

      if (to.name === 'web:ingresar' || !this.accesoPermitido(to.name)) {
        console.log('Entra 3');
        return next(false);
      }

      // if (to.meta.requiresAuth) {
      //   console.log('Entra 2');
      //   return next();
      // }

      console.log('Entra 4');
      return next();
    });

    this.axios.interceptors.request.use(
      (config) => {
        this.$Progress.start();
        return config;
      },
      (error) => {
        this.$Progress.finish();
        return Promise.reject(error);
      },
    );

    this.axios.interceptors.response.use(
      (response) => {
        this.$Progress.finish();
        return response;
      },
      (error) => {
        this.$Progress.finish();
        return Promise.reject(error);
      },
    );
  },

  mounted() {
    this.$Progress.finish();
  },

  data: () => ({
    items: [],
    showBtn: false,
    right: null,
    drawer: null,
    dialogLogout: false,
  }),

  methods: {
    ...mapActions('user', ['userIsAuthenticated', 'userData']),

    logout() {
      this.dialogLogout = false;
      localStorage.removeItem('token');
      this.userIsAuthenticated(false);
      this.$router.push({ name: 'web:ingresar' }, () => {});
    },

    rutaIngresar() {
      console.log(
        '🚀 ~ file: App.vue:297 ~ rutaIngresar',
        this.$route.name,
      );
      return this.$route.name === 'web:ingresar';
    },

    accesoPermitido(nombreRuta) {
      if (!Array.isArray(this.data?.permisos)) {
        return false;
      }
      return this.data.permisos.includes(nombreRuta);
    },
  },

  computed: {
    ...mapState('user', ['data', 'isAuthenticated']),

    loginColor() {
      return this.$route.name === 'web:ingresar' ? 'red darken-2' : '';
    },
  },
};
</script>
