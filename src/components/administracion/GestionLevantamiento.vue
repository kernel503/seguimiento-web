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
        'items-per-page-text': 'Elementos por página',
      }"
      :disable-sort="true"
      @update:options="actualizarOpcionesTabla"
    >
      <template v-slot:no-data> Sin registros </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="text-capitalize">
            {{ routeName }}
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn
            icon
            class="mr-2"
            @click="withTrashed = !withTrashed"
            title="Mostrar registros eliminados"
          >
            <v-icon :color="withTrashed ? 'red darken-2' : 'grey'">
              mdi-archive-lock-open-outline
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
                Crear código
              </v-btn>
            </template>

            <v-card>
              <v-card-title>
                {{ formTitle }}
              </v-card-title>
              <v-card-text>
                <v-form ref="form" @submit.prevent>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" class="my-0 py-0">
                        <v-menu
                          v-model="menuDatePicker"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              :rules="[fieldRule]"
                              v-model="editedItem.fecha_vencimiento"
                              label="Fecha vencimiento del código"
                              prepend-icon="mdi-calendar"
                              readonly
                              clearable
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.fecha_vencimiento"
                            @input="menuDatePicker = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>

              <v-card-actions class="pt-0 mt-0">
                <v-spacer></v-spacer>
                <v-btn text @click="close"> Cancelar </v-btn>
                <v-btn
                  class="red darken-1"
                  text
                  @click="handleSave"
                  v-if="editedIndex == -1"
                  dark
                >
                  Crear código
                </v-btn>
                <v-btn
                  class="red darken-1"
                  text
                  @click="handleUpdate"
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

      <template #item.actions="{ item }">
        <v-icon v-if="!item.fecha_eliminado" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon
          v-if="item.fecha_eliminado"
          @click="restoreItem(item)"
          color="grey"
        >
          mdi-delete-restore
        </v-icon>
        <v-icon v-else color="red lighten-2" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="restoreDialog" max-width="600">
      <v-card>
        <v-card-title class="text-center">
          ¿Quiere restaurar el registro {{ editedItem.codigo }}?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="handleRestore">
            Aceptar
          </v-btn>
          <v-btn color="gray darken-1" text @click="close"> Cancelar </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="600">
      <v-card>
        <v-card-title class="justify-center">
          ¿Quiere eliminar el registro {{ editedItem.codigo }}?
        </v-card-title>
        <v-card-actions class="py-3">
          <v-spacer></v-spacer>
          <v-btn text color="red darken-1" @click="handleDelete">
            Aceptar
          </v-btn>
          <v-btn text color="gray darken-1" @click="close"> Cancelar </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { string } from '../../http/Validation';

export default {
  name: 'GestionLevantamiento',

  data() {
    return {
      url: '',
      routeName: '',
      withTrashed: false,
      limit: 10,
      page: 1,
      total: 0,
      headers: [
        {
          text: 'Código',
          align: 'start',
          value: 'codigo',
          sortable: false,
        },
        {
          text: 'Fecha vencimiento',
          align: 'start',
          value: 'fecha_vencimiento',
          sortable: false,
        },
        {
          text: 'Propietario',
          align: 'start',
          value: 'usuario.email',
          sortable: false,
        },
        {
          text: 'Acciones',
          align: 'end',
          value: 'actions',
          sortable: false,
        },
      ],
      items: [],
      dialog: false,
      deleteDialog: false,
      restoreDialog: false,
      menuDatePicker: false,
      editedIndex: -1,
      editedItem: {
        id: '',
        fecha_vencimiento: null,
      },
      defaultItem: {
        id: '',
        fecha_vencimiento: null,
      },
    };
  },

  created() {
    this.routeName = this.$route.name.split(':').at(-1).replaceAll('-', ' ');
    this.obtenerItems();
  },

  watch: {
    withTrashed() {
      this.obtenerItems();
    },
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Crear registro' : 'Editar registro';
    },
  },

  methods: {
    fieldRule: string('Debe completar el campo.'),

    async obtenerItems() {
      try {
        const response = await this.axios.get('levantamientos', {
          params: {
            with_trashed: this.withTrashed,
            limit: this.limit,
            page: this.page,
            include: ['usuario'].join(','),
          },
        });
        this.total = response.data.meta.total;
        this.items = response.data.data;
      } catch (error) {
        console.log(error);
        this.total = 0;
        this.items = [];
      }
    },

    actualizarOpcionesTabla(config) {
      if (config.page !== this.page) {
        this.page = config.page;
        this.obtenerItems();
      }

      if (config.itemsPerPage !== this.limit) {
        this.limit = config.itemsPerPage;
        this.obtenerItems();
      }
    },

    setItemValues(item) {
      this.editedIndex = this.items.indexOf(item);
      const { id, fecha_vencimiento: fechaVencimiento, codigo } = item;

      this.editedItem = {
        id,
        codigo,
        fecha_vencimiento: fechaVencimiento,
      };

      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },

    restoreItem(item) {
      this.setItemValues(item);
      this.restoreDialog = true;
    },

    editItem(item) {
      this.setItemValues(item);
      this.dialog = true;
    },

    async handleSave() {
      try {
        const validate = this.$refs.form.validate();
        if (!validate) {
          return;
        }

        const response = await this.axios.post('levantamientos', {
          ...this.editedItem,
          id: undefined,
        });
        console.log(response);
        this.$toast.success(`Código creado: ${response.codigo}`);
      } catch (error) {
        console.log(error);
        this.$toast.error('Error al crear el registro.');
      }
      this.obtenerItems();
      this.close();
    },

    async handleUpdate() {
      try {
        const validate = this.$refs.form.validate();
        if (!validate) {
          return;
        }
        await this.axios.put(`levantamientos/${this.editedItem.codigo}`, {
          ...this.editedItem,
        });
        this.$toast.success('Registro actualizado correctamente.');
      } catch (error) {
        console.log(error);
        this.$toast.error('Error al actualizar el registro.');
      }
      this.obtenerItems();
      this.close();
    },

    async handleRestore() {
      try {
        await this.axios.post(
          `levantamientos/${this.editedItem.codigo}/restore`,
        );
        this.$toast.info('Registro restaurado.');
      } catch (error) {
        console.log(error);
        this.$toast.error('Error al actualizar el medio de desplazamiento.');
      }
      this.obtenerItems();
      this.close();
    },

    async handleDelete() {
      try {
        await this.axios.delete(`levantamientos/${this.editedItem.codigo}`);
        this.$toast.success('Registro eliminado');
      } catch (error) {
        console.log(error);
        this.$toast.error('Error al eliminar el registro.');
      }
      this.obtenerItems();
      this.close();
    },

    deleteItem(item) {
      this.editedItem = { ...item };
      this.deleteDialog = true;
    },

    close() {
      this.dialog = false;
      this.deleteDialog = false;
      this.restoreDialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });

      if (this.$refs.form) {
        this.$refs.form.resetValidation();
        this.$refs.form.reset();
      }
    },
  },
};
</script>
