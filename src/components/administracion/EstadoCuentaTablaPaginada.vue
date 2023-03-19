<template>
  <v-data-table
    sort-by="id"
    class="elevation-1"
    :headers="headers"
    :items="items"
    :options="options"
    :footer-props="footerProps"
    :server-items-length="total"
    @update:options="actualizarOpcionesTabla"
  >
    <template v-slot:no-data> Sin registros </template>
    <template #top>
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
          <v-icon :color="withTrashedActive ? 'red darken-2' : 'grey'">
            mdi-archive-lock-open-outline
          </v-icon>
        </v-btn>
        <v-btn color="red darken-2" dark class="mb-2" @click="$emit('create')">
          Nuevo registro
        </v-btn>
      </v-toolbar>
    </template>

    <template #item.permitir_acceso="{ item }">
      <v-icon color="green darken-2" v-if="item.permitir_acceso"
        >mdi-check-circle-outline</v-icon
      >
    </template>

    <template #item.actions="{ item }">
      <v-icon
        v-if="item.fecha_eliminado"
        class="mr-2"
        @click="$emit('restore', item)"
        color="grey"
      >
        mdi-delete-restore
      </v-icon>
      <v-icon v-if="!item.fecha_eliminado" class="ml-2" @click="$emit('edit', item)">
        mdi-pencil
      </v-icon>
      <v-icon v-if="!item.fecha_eliminado" @click="$emit('remove', item)" color="red lighten-2">
        mdi-delete
      </v-icon>
    </template>

    <template #no-data>
      Sin registros
    </template>
  </v-data-table>
</template>
<script>
// import { mapMutations, mapState } from 'vuex';

export default {
  name: 'EstadoCuentaTablaPaginada',

  props: {
    total: {
      type: Number,
    },
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
    // this.withTrashedActive = this.withTrashed;S
    this.options = {};
    this.footerProps = {
      'items-per-page-options': this.itemsPerPage,
      pageText: '{0}-{1} de {2}',
      'items-per-page-text': 'Elementos por página',
    };
  },

  data() {
    return {
      withTrashedActive: false,

      options: {},
      footerProps: {},
    };
  },

  computed: {
    // ...mapState('withPaginationAndTrashed', [
    //   'total',
    //   'withTrashed',
    //   'limit',
    //   'page',
    //   'itemsPerPage',
    // ]),
  },

  methods: {
    actualizarOpcionesTabla(config) {
      this.$emit('update', config);
    },
  },

  watch: {
    withTrashedActive(newValue) {
      this.$emit('trash', newValue);
    },
  },
};
</script>
