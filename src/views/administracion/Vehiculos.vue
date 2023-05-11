<template>
    <div>
      <v-data-table
      :headers="headers"
      :items="items"
      :server-items-length="total"
      sort-by="id"
      class="elevation-1"
      :footer-props="{
        pageText: '{0}-{1} de {2}',
        'items-per-page-text':'Elementos por página'
    }"
      >
      <template v-slot:no-data>
        Sin registros
      </template>
      <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title class="text-capitalize">
              Vehiculos
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="600px" persistent>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="red darken-2" dark class="mb-2" v-bind="attrs" v-on="on">
                  <v-icon class="mr-1"> mdi-plus-box </v-icon>
                  Nuevo registro
                </v-btn>
              </template>

              <v-card>
                <v-card-title class="">
                  {{formTitle}}
                </v-card-title>
                <v-card-text>
                  <v-form ref="form_vehiculo">
                    <v-container>
                      <v-row>
                        <v-col class="mt-2 pb-0" cols="12" sm="12">
                          <v-text-field
                            :rules="[fieldRule]"
                            v-model="editedItem.nombre"
                            label="Ingrese el nombre*"
                            outlined
                          >
                          </v-text-field>
                        </v-col>
                        <v-col class="mt-2 pb-0" cols="12" sm="12">
                          <v-text-field
                            :rules="[fieldRule]"
                            v-model="editedItem.nomenclatura"
                            label="Ingrese la nomenclatura*"
                            outlined
                          >
                          </v-text-field>
                        </v-col>
                        <v-col class="pb-0" cols="12" sm="12">
                          <v-text-field
                            :rules="[fieldRule]"
                            v-model="editedItem.descripcion"
                            label="Ingrese descripcion*"
                            outlined
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </v-card-text>

                <v-card-actions class="py-5">
                  <v-spacer></v-spacer>
                      <v-btn
                        text
                        @click="close()"
                      >
                        Cancelar
                      </v-btn>
                      <v-btn class="red darken-1" text @click="save()" v-if="editedIndex==-1" dark>
                        Guardar
                      </v-btn>
                      <v-btn class="red darken-1" text @click="update(editedItem)"  v-else dark>
                        Actualizar
                      </v-btn>
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
        <v-btn class="red darken-2" @click="deleteItem()" >Eliminar</v-btn>
        <v-spacer></v-spacer>
        </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
<script>
import { integer, string, number } from '../../http/Validation';

export default {
  data() {
    return {
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          value: 'nombre',
        },
        { text: 'Nomenclatura', align: 'center', value: 'nomenclatura' },
        { text: 'Descripción', align: 'center', value: 'descripcion' },
        {
          text: 'Acciones',
          align: 'right',
          value: 'actions',
          sortable: false,
        },
      ],
      items: [],
      clases: [],
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      total: 0,
      limit: 10,
      page: 1,
      editedItem: {
      },
      defaultItem: {
        nombre: '',
        id_clase: null,
        nomenclatura: '',
        cantidad_ejes: null,
        peso_maximo: null,
        longitud_maxima: null,
        descripcion: '',
      },

    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Registrar Vehiculo' : 'Editar Vehiculo';
    },
  },
  methods: {
    integerRule: integer('Debe completar el campo.'),
    fieldRule: string('Debe ingresar un valor numerico'),
    numberRule: number('Debe ingresar un valor numerico'),
    async initialize() {
      const {
        data: {
          data,
          meta: { total },
        },
      } = await this.axios.get('/vehiculos', {
        params: {
          with_trashed: this.withTrashed,
          limit: 1000,
          page: this.page,
        },
      });
      this.items = data;
      this.total = total;
    },
    async save() {
      try {
        const validate = this.$refs.form_vehiculo.validate();
        if (validate) {
          await this.axios.post('/vehiculos', this.editedItem);
          this.initialize();
          this.$toast.success('Registro creado.');
          this.close();
        }
      } catch (error) {
        this.$toast.error('Error al crear el vehiculo vehicular.');
      }
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },
    async update(item) {
      try {
        const validate = this.$refs.form_vehiculo.validate();
        if (validate) {
          await this.axios.put(`/vehiculos/${item.id}`, this.editedItem);
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
        await this.axios.delete(`/vehiculos/${this.editedItem.id}`);
        this.$toast.success('Registro eliminado');
        this.initialize();
        this.dialogDelete = false;
      } catch (error) {
        this.$toast.error('Error al eliminar vehiculo.');
      }
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
      this.$refs.form_vehiculo.reset();
    },
  },
  async created() {
    this.initialize();
  },

};
</script>
