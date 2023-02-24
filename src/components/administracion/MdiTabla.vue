<template>
  <v-data-table
    sort-by="id"
    class="elevation-1"
    :headers="headers"
    :items="items"
    :options="options"
    :items-per-page="limit"
    :footer-props="footerProps"
    @update:options="actualizarOpcionesTabla"
    :server-items-length="total"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title class="text-capitalize">
          {{ toolbarTitle }}
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn
          icon
          class="mr-2"
          @click="withTrashedActive = !withTrashedActive"
        >
          <v-icon :color="withTrashedActive ? 'primary' : 'grey'">
            mdi-archive-lock-open-outline
          </v-icon>
        </v-btn>
        <v-btn color="primary" dark class="mb-2" @click="$emit('create')">
          Nuevo registro
        </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.icono="{ item }">
      <v-icon> {{ 'mdi-' + item.icono }}</v-icon>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        v-if="item.fecha_eliminado"
        class="mr-2"
        @click="$emit('restore', item)"
        color="grey"
      >
        mdi-delete-restore
      </v-icon>
      <v-icon class="mr-2" @click="$emit('edit', item)"> mdi-pencil </v-icon>
      <v-icon @click="$emit('remove', item)" color="red lighten-2">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="$emit('refresh')"> Recargar </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'MdiTabla',

  props: {
    toolbarTitle: {
      type: String,
      default: 'Listado',
    },
    headers: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
  },

  created() {
    this.resource = this.$route.query.resource;
    this.withTrashedActive = this.withTrashed;
    this.options = { page: this.page };
  },

  data() {
    return {
      withTrashedActive: false,
      options: {},
      footerProps: {
        'items-per-page-options': [5, 10, 20, 40],
      },
    };
  },

  computed: {
    ...mapState('withPaginationAndTrashed', ['total', 'withTrashed', 'limit', 'page']),
  },

  methods: {
    ...mapMutations('withPaginationAndTrashed', ['actualizarQuery']),

    actualizarOpcionesTabla({ itemsPerPage, page }) {
      this.actualizarQuery({ limit: itemsPerPage, page });
    },
  },

  watch: {
    withTrashedActive(newValue) {
      this.actualizarQuery({ withTrashed: newValue });
    },

    withTrashed(newValue) {
      this.withTrashedActive = newValue;
    },
  },
};
</script>
