<template>
    <div>
      <v-data-table
      :headers="headers"
      :items="items"
      sort-by="id"
      class="elevation-1"
      >
      <template v-slot:top>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="600px" persistent>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                  <v-icon class="mr-1"> mdi-plus-box </v-icon>
                  Agregar registro
                </v-btn>
              </template>

              <v-card>
                <v-card-title class="justify-center">
                  <h2 class="primary--text">{{formTitle}}</h2>
                </v-card-title>
                <v-divider class="blue accent-2 mx-5"></v-divider>

                <v-card-text>
                  <v-form ref="form_clasificacion">
                    <v-container>
                      <v-row>
                        <v-col class="mt-2 pb-0" cols="12" sm="12">
                          <v-text-field
                            v-model="editedItem.name"
                            label="Ingrese el nombre*"
                            outlined
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </v-card-text>

                <v-card-actions class="py-5">
                  <v-row class="justify-center">
                    <v-col cols="12" sm="3">
                      <v-btn
                        outlined
                        block
                        color="blue darken-1"
                        text
                        @click="close()"
                      >
                        Cancelar
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="3" v-if="editedIndex==-1">
                      <v-btn block cols-12 class="primary" text @click="save()" >
                        Guardar
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="5" v-else>
                      <v-btn block cols-12 class="primary" text @click="update(editedItem)" >
                        Actualizar
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

      <template v-slot:item.actions="{ item }">
        <v-icon class="mr-2" @click="editItem(item)" > mdi-pencil </v-icon>
        <v-icon color="red lighten-2" @click="deleteItemConfirm(item)">
          mdi-delete
        </v-icon>
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
    </div>
  </template>
<script>
export default {
  data() {
    return {
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          value: 'name',
        },
        {
          text: 'Acciones',
          align: 'right',
          value: 'actions',
          sortable: false,
        },
      ],
      items: [],
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        id: '',
        name: '',
      },
      defaultItem: {
        name: '',
      },

    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Crear Permiso' : 'Editar Permiso';
    },
  },
  methods: {
    async initialize() {
      const response = await this.axios.get('/permisos');
      this.items = response.data.data;
    },
    async save() {
      try {
        const validate = this.$refs.form_clasificacion.validate();
        if (validate) {
          await this.axios.post('/permisos', this.editedItem);
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
      this.dialog = true;
    },
    async update(item) {
      try {
        const validate = this.$refs.form_clasificacion.validate();
        if (validate) {
          await this.axios.put(`/permisos/${item.id}`, this.editedItem);
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
        await this.axios.delete(`/permisos/${this.editedItem.id}`);
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