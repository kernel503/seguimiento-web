<template>
  <v-app>
    <v-navigation-drawer permanent app>

    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  // components: { BarNavigation, MainContainer, NavigationDrawer },

  data: () => ({

  }),
};
</script>
