<template>
  <v-data-table :headers="headers" :items="items" sort-by="id" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Incidentes</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevo registro
            </v-btn>
          </template>
          <administracion-form :path="path" @show-form="showForm" @reload="initialize" />
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">
              ¿Está seguro de que desea eliminar este elemento?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
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
    editedIndex: -1,
    editedItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
    defaultItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
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
      console.log(payload);
      this.dialog = payload;
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

    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = { ...item };
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.items.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem);
      } else {
        this.items.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>
