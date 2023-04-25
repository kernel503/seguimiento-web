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
                Nuevo registro
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
                        <v-text-field
                          :rules="[fieldRule]"
                          v-model="editedItem.codigo_ruta"
                          outlined
                          @keyup.enter="handleSave"
                        >
                          <template #label>
                            Ingrese el código de ruta
                            <span class="red--text"><strong>* </strong></span>
                          </template>
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" sm="12" class="my-0 py-0">
                        <v-text-field
                          :rules="[fieldRule]"
                          v-model="editedItem.ruta"
                          outlined
                          @keyup.enter="handleSave"
                        >
                          <template #label>
                            Ingrese la ruta
                            <span class="red--text"><strong>* </strong></span>
                          </template>
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" sm="12" class="my-0 py-0">
                        <v-autocomplete
                          v-model="editedItem.id_departamento"
                          :rules="[idDepartamento]"
                          item-text="nombre"
                          item-value="id"
                          outlined
                          :items="ctlDepartamentos"
                        >
                          <template #label>
                            Selecciona el departamento
                            <span class="red--text"><strong>* </strong></span>
                          </template>
                        </v-autocomplete>
                      </v-col>

                      <v-col cols="12" sm="12" class="my-0 py-0">
                        <v-autocomplete
                          v-model="editedItem.id_tipo_vehiculo_ruta"
                          :rules="[idTipo]"
                          item-text="tipo"
                          item-value="id"
                          outlined
                          :items="ctlTipos"
                        >
                          <template #label>
                            Selecciona el tipo de vehículo
                            <span class="red--text"><strong>* </strong></span>
                          </template>
                        </v-autocomplete>
                      </v-col>

                      <v-col cols="12" sm="12" class="my-0 py-0">
                        <v-autocomplete
                          v-model="editedItem.id_tipo_servicio_ruta"
                          :rules="[idServicio]"
                          item-text="subtipo"
                          item-value="id"
                          outlined
                          :items="ctlServicios"
                        >
                          <template #label>
                            Selecciona el tipo de ruta
                            <span class="red--text"><strong>* </strong></span>
                          </template>
                        </v-autocomplete>
                      </v-col>

                      <v-col cols="12" sm="12" class="my-0 py-0">
                        <v-autocomplete
                          v-model="editedItem.id_clase_servicio_ruta"
                          :rules="[idClase]"
                          item-text="clase"
                          item-value="id"
                          outlined
                          :items="ctlClases"
                        >
                          <template #label>
                            Selecciona la clase de servicio
                            <span class="red--text"><strong>* </strong></span>
                          </template>
                        </v-autocomplete>
                      </v-col>

                      <v-col cols="12" sm="12" class="my-0 py-0">
                        <v-text-field
                          v-model="editedItem.tarifa_autorizada"
                          outlined
                          :rules="[tarifaRule]"
                          @keyup.enter="handleSave"
                        >
                          <template #label>
                            Ingrese la tarifa autorizada
                            <span class="red--text"><strong>* </strong></span>
                          </template>
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" sm="12" class="my-0 py-0">
                        <v-text-field
                          v-model="editedItem.denominacion"
                          outlined
                          label="Denominación"
                          @keyup.enter="handleSave"
                        >
                        </v-text-field>
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
                  Guardar
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
        <v-icon @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon
          v-if="item.fecha_eliminado"
          @click="restoreItem(item)"
          color="grey"
        >
          mdi-delete-restore
        </v-icon>
        <v-icon
          v-if="!item.fecha_eliminado"
          color="red lighten-2"
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="restoreDialog" max-width="600">
      <v-card>
        <v-card-title class="text-center">
          ¿Quiere restaurar el registro {{ editedItem.codigo_ruta }}?
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
          ¿Quiere eliminar el registro {{ editedItem.codigo_ruta }}?
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
import { string, integer, number } from '../../../http/Validation';

export default {
  name: 'GestionRutasTransporte',

  data() {
    return {
      url: '',
      routeName: '',
      withTrashed: false,
      limit: 10,
      page: 1,
      total: 0,
      ctlDepartamentos: [],
      ctlTipos: [],
      ctlServicios: [],
      ctlClases: [],
      headers: [
        {
          text: 'Código ruta',
          align: 'start',
          value: 'codigo_ruta',
          sortable: false,
        },
        {
          text: 'Ruta',
          align: 'start',
          value: 'ruta',
          sortable: false,
        },
        {
          text: 'Departamento',
          align: 'start',
          value: 'departamento.nombre',
          sortable: false,
        },
        {
          text: 'Tipo vehículo',
          align: 'start',
          value: 'vehiculo.tipo',
          sortable: false,
        },
        {
          text: 'Tipo servicio',
          align: 'start',
          value: 'servicio.subtipo',
          sortable: false,
        },
        {
          text: 'Clase ruta',
          align: 'start',
          value: 'clase.clase',
          sortable: false,
        },
        {
          text: 'Denominación',
          align: 'start',
          value: 'denominacion',
          sortable: false,
        },
        {
          text: 'Tarifa autorizada',
          align: 'start',
          value: 'tarifa_autorizada',
          sortable: false,
        },
        {
          text: 'Acciones',
          align: 'start',
          value: 'actions',
          sortable: false,
        },
      ],
      items: [],
      dialog: false,
      deleteDialog: false,
      restoreDialog: false,
      editedIndex: -1,
      editedItem: {
        id: '',
        id_departamento: null,
        id_clase_servicio_ruta: null,
        id_tipo_servicio_ruta: null,
        id_tipo_vehiculo_ruta: null,
        ruta: null,
        codigo_ruta: null,
        denominacion: null,
        tarifa_autorizada: null,
      },
      defaultItem: {
        id: null,
        id_departamento: null,
        id_clase_servicio_ruta: null,
        id_tipo_servicio_ruta: null,
        id_tipo_vehiculo_ruta: null,
        ruta: null,
        codigo_ruta: null,
        denominacion: null,
        tarifa_autorizada: null,
      },
    };
  },

  created() {
    this.obtenerCatalogos();
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
    tarifaRule: number('Debe ser un número.'),
    idDepartamento: integer('Debe seleccionar un departamento.'),
    idTipo: integer('Debe seleccionar un tipo de vehículo.'),
    idServicio: integer('Debe seleccionar un servicio.'),
    idClase: integer('Debe seleccionar la clase.'),

    async fetchCatalogo({ path = '', config = {} }) {
      try {
        const {
          data: { data },
        } = await this.axios.get(path, config);
        return data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },

    async obtenerCatalogos() {
      this.ctlDepartamentos = await this.fetchCatalogo({
        path: 'departamentos',
      });
      this.ctlTipos = await this.fetchCatalogo({
        path: 'tipos-vehiculos-rutas',
      });
      this.ctlServicios = await this.fetchCatalogo({
        path: 'tipos-servicios-rutas',
      });
      this.ctlClases = await this.fetchCatalogo({
        path: 'clases-servicios-rutas',
      });
    },

    async obtenerItems() {
      const response = await this.axios.get('rutas-transporte', {
        params: {
          with_trashed: this.withTrashed,
          limit: this.limit,
          page: this.page,
          include: ['departamento', 'vehiculo', 'servicio', 'clase'].join(','),
        },
      });
      this.total = response.data.meta.total;
      this.items = response.data.data;
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
      const {
        id,
        id_departamento: idDepartamento,
        id_clase_servicio_ruta: idClaseServicioRuta,
        id_tipo_servicio_ruta: idTipoServicioRuta,
        id_tipo_vehiculo_ruta: idTipoVehiculoRuta,
        ruta,
        codigo_ruta: codigoRuta,
        denominacion,
        tarifa_autorizada: tarifaAutorizada,
      } = item;

      this.editedItem = {
        id,
        id_departamento: idDepartamento,
        id_clase_servicio_ruta: idClaseServicioRuta,
        id_tipo_servicio_ruta: idTipoServicioRuta,
        id_tipo_vehiculo_ruta: idTipoVehiculoRuta,
        ruta,
        codigo_ruta: codigoRuta,
        denominacion,
        tarifa_autorizada: +tarifaAutorizada,
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

        await this.axios.post('rutas-transporte', {
          ...this.editedItem,
          id: undefined,
        });
        this.$toast.success('Registro creado.');
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
        await this.axios.put(`rutas-transporte/${this.editedItem.id}`, {
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
        await this.axios.post(`rutas-transporte/${this.editedItem.id}/restore`);
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
        await this.axios.delete(`rutas-transporte/${this.editedItem.id}`);
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
