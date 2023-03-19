<template>
  <div>
    <v-data-table
    :headers="headers"
    :items="items"
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
              Clasificación vehicular
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
                <v-form ref="form_clasificacion">
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
                      <v-col class="pb-0" cols="12" sm="12">
                        <v-text-field
                          :rules="[fieldRule]"
                          v-model="editedItem.version"
                          label="Ingrese versión*"
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
          <v-card-title class="justify-center">
            ¿Está seguro que desea eliminar el registro?
          </v-card-title>
          <v-card-actions class="">
          <v-spacer></v-spacer>
          <v-btn text color="red darken-1" @click="deleteItem()" >Aceptar</v-btn>
          <v-btn text color="gray darken-1" @click="dialogDelete = false" >Cancelar</v-btn>
          <v-spacer></v-spacer>
          </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { string } from '../../http/Validation';

export default {
  data() {
    return {
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          value: 'nombre',
        },
        { text: 'Versión', align: 'center', value: 'version' },
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
    fieldRule: string('Debe completar el campo.'),
    async initialize() {
      const response = await this.axios.get('/clasificaciones-vehicular');
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
      this.dialog = true;
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
      this.$refs.form_clasificacion.resetValidation();
      this.$refs.form_clasificacion.reset();
    },
  },
  async created() {
    this.initialize();
  },

};
</script>
