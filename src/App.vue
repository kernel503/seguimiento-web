<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Application </v-list-item-title>
          <v-list-item-subtitle> subtext </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <template v-for="item in items">
          <v-list-group v-if="item.children" :key="item.index">
            <template v-slot:activator>
              <v-list-item-title class="text-capitalize">{{ item.title }}</v-list-item-title>
            </template>

            <template #prependIcon>
              <v-icon>{{ item.icon }}</v-icon>
            </template>

            <v-list-item
              v-for="(child, j) in item.children"
              :key="j"
              :to="item.uri + child.uri"
              active-class="white--text blue"
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

          <v-list-item v-else :key="item.title" :to="item.uri" active-class="white--text blue">
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
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
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
export default {
  name: 'App',
  // components: { BarNavigation, MainContainer, NavigationDrawer },

  data: () => ({
    items: [
      { title: 'Dashboard', icon: 'mdi-view-dashboard' },

      {
        title: 'Administración',
        icon: 'mdi-image',
        children: [{ title: 'Usuarios', icon: 'mdi-account-multiple' }],
      },
    ],
    right: null,
    drawer: null,
  }),
};
</script>
