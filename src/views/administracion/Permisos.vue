<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="id"
      class="elevation-1"
      :footer-props="{
        pageText: '{0}-{1} de {2}',
        'items-per-page-text': 'Elementos por página',
      }"
      :disable-sort="true"
    >
      <template v-slot:no-data> Sin registros </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="text-capitalize"> Permisos </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn icon class="mr-2" @click="updateSearch">
            <v-icon :color="showBaseRoles ? 'red darken-2' : 'grey'">
              mdi-shield-lock-open-outline
            </v-icon>
          </v-btn>
          <v-dialog v-model="dialog" max-width="600px" persistent>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="red darken-2"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon class="mr-1"> mdi-plus-box </v-icon>
                Nuevo registro
              </v-btn>
            </template>

            <v-card>
              <v-card-title>
                {{ formTitle }}
              </v-card-title>
              <v-divider class="blue accent-2 mx-5"></v-divider>
              <v-card-text>
                <v-form ref="form_permisos" @submit.prevent>
                  <v-container>
                    <v-row>
                      <v-col class="mt-2" cols="12" sm="12">
                        <v-text-field
                          :rules="[fieldRule]"
                          v-model="editedItem.name"
                          outlined
                        >
                          <template #label>
                            Ingrese el nombre
                            <span class="red--text"><strong>* </strong></span>
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>

              <v-card-actions class="pt-0 mt-0">
                <v-spacer></v-spacer>
                <v-btn text @click="close()"> Cancelar </v-btn>
                <v-btn
                  class="red darken-1"
                  text
                  @click="save()"
                  v-if="editedIndex == -1"
                  dark
                >
                  Guardar
                </v-btn>
                <v-btn
                  class="red darken-1"
                  text
                  @click="update(editedItem)"
                  v-else
                  dark
                >
                  Actualizar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon v-if="item.id > roleLimit" class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon
          v-if="item.id > roleLimit"
          color="red lighten-2"
          @click="deleteItemConfirm(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogDelete" max-width="530px">
      <v-card>
        <v-card-title class="justify-center">
          ¿Está seguro que desea eliminar el registro?
        </v-card-title>
        <v-card-actions class="py-3">
          <v-spacer></v-spacer>
          <v-btn text color="red darken-1" @click="deleteItem()">Aceptar</v-btn>
          <v-btn text color="gray darken-1" @click="dialogDelete = false"
            >Cancelar</v-btn
          >
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
      showBaseRoles: false,
      roleLimit: 88,
      requiredField: [(v) => !!v || 'Name is required'],
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          value: 'name',
          sortable: false,
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

  created() {
    this.initialize();
  },

  methods: {
    fieldRule: string('Debe completar el campo.'),

    async initialize() {
      const response = await this.axios.post('/permisos/search', {
        sort: [{ field: 'id', direction: 'desc' }],
        filters: [
          {
            field: 'id',
            operator: '>',
            value: this.showBaseRoles ? 0 : this.roleLimit,
          },
        ],
      });
      this.items = response.data.data;
    },

    updateSearch() {
      this.showBaseRoles = !this.showBaseRoles;
      this.initialize();
    },

    async save() {
      try {
        const validate = this.$refs.form_permisos.validate();
        if (validate) {
          await this.axios.post('/permisos', this.editedItem);
          this.initialize();
          this.$toast.success('Registro creado.');
          this.close();
        }
      } catch (error) {
        this.$toast.error('Error al crear el permiso.');
      }
    },

    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
      if (this.$refs.form_permisos) {
        this.$refs.form_permisos.resetValidation();
      }
    },

    async update(item) {
      try {
        const validate = this.$refs.form_permisos.validate();
        if (validate) {
          await this.axios.put(`/permisos/${item.id}`, this.editedItem);
          this.initialize();
          this.$toast.success('Registro actualizado correctamente.');
          this.close();
        }
      } catch (error) {
        this.$toast.error('Error al actualizar el permiso.');
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
        this.$toast.error('Error al eliminar el permiso.');
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
      // if (this.$refs.form_change_pass) {
      this.$refs.form_permisos.resetValidation();
      this.$refs.form_permisos.reset();
    },
  },
};
</script>
