<template>
  <v-data-table :headers="headers" :items="items" sort-by="id" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Incidentes</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark class="mb-2" @click="openDialog">
          Nuevo registro
        </v-btn>
        <v-dialog v-model="dialog" max-width="500px">
          <administracion-form
            :path="path"
            :payload="selectedItem"
            title="Incidentes"
            @show-form="showForm"
            @reload="initialize"
          />
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">
              ¿Está seguro de que desea eliminar este elemento?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">ACeptar</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.icono="{ item }">
      <v-icon> mdi-{{ item.icono }} </v-icon>
      {{ item.icono }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Recargar </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import AdministracionForm from './AdministracionForm.vue';

export default {
  name: 'GestionTable',
  components: { AdministracionForm },
  props: {
    path: {
      type: String,
      default: 'incidentes',
    },
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: 'Nombre',
        sortable: false,
        value: 'nombre',
      },
      { text: 'Icono', value: 'icono' },
      {
        text: 'Acciones',
        value: 'actions',
        sortable: false,
        align: 'center',
      },
    ],
    items: [],
    selectedItem: null,
    editedIndex: -1,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Registro' : 'Editar Registro';
    },
  },

  watch: {
    dialog(val) {
      // eslint-disable-next-line no-unused-expressions
      val || this.close();
    },
    dialogDelete(val) {
      // eslint-disable-next-line no-unused-expressions
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    showForm(payload) {
      this.dialog = payload;
      this.$nextTick(() => {
        this.editedIndex = -1;
        this.selectedItem = null;
      });
    },

    async initialize() {
      try {
        const {
          data: { data },
        } = await this.axios.get(this.path);
        this.items = data;
      } catch (error) {
        this.$toast.error('No se pudo obtener el catálogo.');
      }
    },

    openDialog() {
      this.dialog = true;
      this.selectedItem = null;
    },
    editItem(item) {
      console.log('Editar');
      console.log(item);
      this.selectedItem = { icono: item.icono, nombre: item.nombre, id: item.id };
      this.dialog = true;
    },

    async deleteItemConfirm() {
      try {
        await this.axios.delete(`${this.path}/${this.selectedItem.id}`);
        this.initialize();
      } catch (error) {
        this.$toast.error('Error al eliminar el registro.');
      }
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedIndex = -1;
        this.selectedItem = null;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
    },

    deleteItem(item) {
      this.selectedItem = item;
      this.dialogDelete = true;
    },

  },
};
</script>
