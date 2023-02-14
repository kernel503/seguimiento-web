<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" v-if="isAuthenticated">
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
          <v-list-group v-if="item.children" :key="item.index">
            <template v-slot:activator>
              <v-list-item-title class="text-capitalize">{{
                item.title
              }}</v-list-item-title>
            </template>

            <template #prependIcon>
              <v-icon>{{ item.icon }}</v-icon>
            </template>

            <v-list-item
              v-for="(child, j) in item.children"
              :key="j"
              :to="child.path"
              class="ml-4"
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

    <v-app-bar app>
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        v-if="isAuthenticated"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <template v-if="isAuthenticated">
        <v-btn icon class="mx-2" plain @click="logout">
          <v-icon> mdi-logout </v-icon>
        </v-btn>
      </template>

      <template v-else>
        <v-btn
          :color="loginColor"
          small
          class="mx-2"
          plain
          :to="{ name: 'login' }"
        >
          Ingresar
        </v-btn>
        <v-btn :color="signupColor" small plain :to="{ name: 'signup' }">
          Registrarse
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app> </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'App',
  // components: { BarNavigation, MainContainer, NavigationDrawer },
  async created() {
    const hasToken = !!localStorage.getItem('token') || false;
    if (hasToken) {
      try {
        const response = await this.axios.get('/user');
        const { data } = response;
        this.userData(data);
        this.userIsAuthenticated(true);
        this.showBtn = true;
      } catch (error) {
        this.userData(null);
        this.userIsAuthenticated(false);
        this.showBtn = true;
      }
    }
  },

  mounted() {},

  data: () => ({
    items: [
      {
        title: 'Dashboard',
        icon: 'mdi-view-dashboard',
        path: { name: 'dashboard' },
      },
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
        ],
      },
    ],
    showBtn: false,
    right: null,
    drawer: null,
  }),

  methods: {
    logout() {
      localStorage.removeItem('token');
      this.userIsAuthenticated(false);
      this.$router.push({ name: 'login' });
    },
    ...mapActions('user', ['userIsAuthenticated', 'userData']),
  },

  computed: {
    loginColor() {
      return this.$route.name === 'login' ? 'primary' : '';
    },
    signupColor() {
      return this.$route.name === 'signup' ? 'primary' : '';
    },
    ...mapState('user', ['data', 'isAuthenticated']),
  },
};
</script>
