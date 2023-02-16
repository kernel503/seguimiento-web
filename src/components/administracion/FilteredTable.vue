<template>
  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="id"
    class="elevation-1"
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
          :color="with_trashed ? 'primary' : 'grey'"
          class="mr-2"
          @click="showTrash"
        >
          <v-icon>mdi-archive-lock-open-outline</v-icon>
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
export default {
  name: 'FilteredTable',

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
    if (this.$route.query.with_trashed === 'true') {
      this.with_trashed = true;
      return;
    }

    if (this.$route.query.with_trashed === 'false') {
      this.with_trashed = false;
      return;
    }

    this.$router.push({ query: { with_trashed: this.with_trashed } });
    this.resource = this.$route.query.resource;
  },
  data() {
    return {
      with_trashed: false,
    };
  },

  methods: {
    showTrash() {
      this.with_trashed = !this.with_trashed;
      this.$router.push({ query: { with_trashed: this.with_trashed } });
      this.$emit('trashed');
    },
  },

  watch: {
    with_trashed() {
      // this.$router.push({ query: { with_trashed: this.with_trashed } });
    },
  },
};
</script>
