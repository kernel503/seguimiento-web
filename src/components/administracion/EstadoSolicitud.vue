<template>
  <div>
    <v-data-table
    :headers="headers"
    :items="item2.data"
    sort-by="id"
    class="elevation-1"
    >

    <template v-slot:item.actions="{ item }">
      <v-icon
      v-if="item.solicitud.estado.id==1"
      class="mr-2"
      @click="editItem(item)" > mdi-close-circle
     </v-icon>

     <v-icon
      v-else
      class="mr-2"
      @click="editItem(item)" > mdi-checkbox-marked-circle
    </v-icon>
    </template>
    <template v-slot:item.solicitud.estado.nombre="{ item }">
      <v-chip
      v-if="item.solicitud.estado.id==1"
      color="green"
      text-color="white">{{ item.solicitud.estado.nombre }}
    </v-chip>
    <v-chip
      v-else
      color="red"
      text-color="white">{{ item.solicitud.estado.nombre }}
    </v-chip>
    </template>
    </v-data-table>
    <v-dialog v-model="dialogDelete"  max-width="530px" >
      <v-card>
          <v-card-title class="text-h5">¿Está seguro que desea eliminar el registro?</v-card-title>
          <v-card-actions class="py-3">
          <v-spacer></v-spacer>
          <v-btn class="default"  outlined color=""  @click="dialogDelete = false" >Cancelar</v-btn>
          <v-btn class="primary" @click="deleteItem()" >Eliminar</v-btn>
          <v-spacer></v-spacer>
          </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEstado" max-width="600">
      <v-card>
        <v-card-title class="text-center">
          Activar cuenta de usuario
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="restoreItem">Aceptar</v-btn>
          <v-btn color="gray darken-1" text @click="dialogRestore = false">
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      headers: [
        {
          text: 'Usuario',
          align: 'start',
          value: 'name',
        },
        { text: 'Estado', align: 'center', value: 'solicitud.estado.nombre' },
        {
          text: 'Acciones',
          align: 'right',
          value: 'actions',
          sortable: false,
        },
      ],
      items: [],
      item2: {
        data: [
          {
            id: 1,
            name: 'developer',
            email: 'developer@gmail.com',
            email_verified_at: null,
            created_at: '2023-02-25T01:07:50.000000Z',
            updated_at: '2023-02-25T01:07:50.000000Z',
            solicitud: {
              id: 1,
              id_usuario: 1,
              id_estado_solicitud: 1,
              fecha_creado: '2023-02-25T01:07:50.000000Z',
              fecha_actualizado: '2023-02-25T01:07:50.000000Z',
              fecha_eliminado: null,
              estado: {
                id: 1,
                nombre: 'Activa',
                permitir_acceso: true,
                fecha_creado: '2023-02-25T01:07:50.000000Z',
                fecha_actualizado: '2023-02-25T01:07:50.000000Z',
                fecha_eliminado: null,
              },
            },
          },
          {
            id: 2,
            name: 'test',
            email: 'test@gmail.com',
            email_verified_at: null,
            created_at: '2023-02-25T02:04:00.000000Z',
            updated_at: '2023-02-25T02:04:00.000000Z',
            solicitud: {
              id: 2,
              id_usuario: 2,
              id_estado_solicitud: 1,
              fecha_creado: '2023-02-25T02:04:00.000000Z',
              fecha_actualizado: '2023-02-25T02:04:00.000000Z',
              fecha_eliminado: null,
              estado: {
                id: 3,
                nombre: 'Suspendida',
                permitir_acceso: true,
                fecha_creado: '2023-02-25T01:07:50.000000Z',
                fecha_actualizado: '2023-02-25T01:07:50.000000Z',
                fecha_eliminado: null,
              },
            },
          },
        ],
      },
      dialog: false,
      dialogDelete: false,
      dialogEstado: false,
      editedIndex: -1,
      editedItem: {
        id: '',
        nombre: '',
        version: '',
      },
      defaultItem: {
        nombre: '',
        version: '',
      },

    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Crear Clasificación Vehicular' : 'Editar Clasificación Vehicular';
    },
  },
  methods: {
    async initialize() {
      const response = await this.axios.get('/usuarios?include=solicitud.estado');
      this.items = response.data.data;
    },
    async save() {
      try {
        const validate = this.$refs.form_clasificacion.validate();
        if (validate) {
          await this.axios.post('/clasificaciones-vehicular', this.editedItem);
          this.initialize();
          this.$toast.success('Registro creado.');
          this.close();
        }
      } catch (error) {
        this.$toast.error('Error al crear la clasificación vehicular.');
      }
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = { ...item };
      this.dialogEstado = true;
    },
    async update(item) {
      try {
        const validate = this.$refs.form_clasificacion.validate();
        if (validate) {
          await this.axios.put(`/clasificaciones-vehicular/${item.id}`, this.editedItem);
          this.initialize();
          this.$toast.success('Registro actualizado correctamente.');
          this.close();
        }
      } catch (error) {
        this.$toast.error('Error al crear la clasificación vehicular.');
      }
    },
    deleteItemConfirm(item) {
      this.editedItem.id = item.id;
      this.dialogDelete = true;
    },
    async deleteItem() {
      try {
        await this.axios.delete(`/clasificaciones-vehicular/${this.editedItem.id}`);
        this.$toast.success('Registro eliminado');
        this.initialize();
        this.dialogDelete = false;
      } catch (error) {
        this.$toast.error('Error al eliminar la clasificación vehicular.');
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },
  },
  async created() {
    this.initialize();
  },

};
</script>
