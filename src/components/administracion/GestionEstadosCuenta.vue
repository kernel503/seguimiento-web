<template>
  <div>
    <EstadoCuentaTablaPaginada
      :toolbarTitle="this.path.replace('-', ' ')"
      :headers="headers"
      :items="items"
      @create="create"
      @remove="remove"
      @edit="edit"
      @refresh="obtenerItems"
      @restore="restore"
    >
    </EstadoCuentaTablaPaginada>

    <v-dialog v-model="dialog" max-width="600">
      <EstadoCuentaForm
        v-if="initialForm.length"
        ref="mdipicker"
        @submit="submit"
        @close="close"
        :value="initialForm"
      ></EstadoCuentaForm>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="600">
      <v-card v-if="initialForm.length">
        <v-card-title class="text-center">
          ¿Seguro que quieres borrar el registro
          {{ initialForm[0].toLocaleLowerCase() }}?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="deleteItem">Aceptar</v-btn>
          <v-btn color="gray darken-1" text @click="dialogDelete = false">
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogRestore" max-width="600">
      <v-card v-if="initialForm.length">
        <v-card-title class="text-center">
          Restaurar el registro
          {{ initialForm[0].toLocaleLowerCase() }}
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
import { mapMutations, mapState } from 'vuex';
import EstadoCuentaForm from './EstadoCuentaForm.vue';
import EstadoCuentaTablaPaginada from './EstadoCuentaTablaPaginada.vue';

export default {
  name: 'GestionEstadosCuenta',

  components: { EstadoCuentaForm, EstadoCuentaTablaPaginada },

  data() {
    return {
      dialog: false,
      dialogDelete: false,
      dialogRestore: false,
      path: '',
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          value: 'nombre',
        },
        { text: 'Acceso al software', align: 'center', value: 'permitir_acceso' },
        {
          text: 'Acciones',
          align: 'right',
          value: 'actions',
          sortable: false,
        },
      ],
      items: [],
      initialForm: ['', ''],
    };
  },

  computed: {
    ...mapState('withPaginationAndTrashed', ['page', 'limit', 'withTrashed']),
  },

  created() {
    this.resetPaginationAndTrashed();
    this.path = this.$route.path.split('/').at(-1);
    this.obtenerItems();
  },

  methods: {
    ...mapMutations('withPaginationAndTrashed', ['resetPaginationAndTrashed', 'actualizarQuery']),

    async obtenerItems() {
      try {
        const {
          data: {
            data,
            meta: { total },
          },
        } = await this.axios.get(this.path, {
          params: {
            with_trashed: this.withTrashed,
            limit: this.limit,
            page: this.page,
          },
        });

        this.items = data;
        this.actualizarQuery({ total });
      } catch (error) {
        this.$toast.error('Error al obtener los medios de desplazamiento.');
      }
    },

    async deleteItem() {
      const id = this.initialForm.at(2);
      try {
        await this.axios.delete(`${this.path}/${id}`);

        this.$toast.info('Registro eliminado.');
      } catch (error) {
        this.$toast.error('Error al eliminar el medio de desplazamiento.');
      }

      this.obtenerItems();
      this.dialogDelete = false;
    },

    create() {
      this.initialForm = ['', ''];
      this.dialog = true;
    },

    remove(payload) {
      this.dialogDelete = true;
      this.initialForm = [payload.nombre, payload.permitir_acceso, payload.id];
    },

    edit(payload) {
      this.initialForm = [payload.nombre, payload.permitir_acceso, payload.id];
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.initialForm = [];
    },

    async restoreItem() {
      const id = this.initialForm.at(2);
      try {
        await this.axios.post(`${this.path}/${id}/restore`);
        this.$toast.info('Registro restaurado.');
      } catch (error) {
        this.$toast.error('Error al actualizar el medio de desplazamiento.');
      }
      this.obtenerItems();
      this.dialogRestore = false;
    },

    async restore(payload) {
      this.dialogRestore = true;
      this.initialForm = [payload.nombre, payload.permitir_acceso, payload.id];
    },

    async submit() {
      if (!Array.isArray(this.initialForm) && !this.initialForm.length > 2) {
        return;
      }
      const data = {
        nombre: this.initialForm.at(0),
        permitir_acceso: this.initialForm.at(1),
      };

      if (this.initialForm.length === 2) {
        try {
          await this.axios.post(this.path, data);
          this.$toast.success('Registro creado.');
        } catch (error) {
          this.$toast.error('Error al crear el medio de desplazamiento.');
        }
      }

      if (this.initialForm.length === 3) {
        const id = this.initialForm.at(2);
        try {
          this.axios.put(`${this.path}/${id}`, data);
          this.$toast.info('Registro actualizado.');
        } catch (error) {
          this.$toast.error('Error al actualizar el medio de desplazamiento.');
        }
      }

      this.obtenerItems();
      this.dialog = false;
    },
  },

  watch: {
    dialog(newValue) {
      if (!newValue) {
        this.initialForm = [];
      }
    },

    dialogRestore(newValue) {
      if (!newValue) {
        this.initialForm = [];
      }
    },

    $route(to, from) {
      const nuevaRuta = this.$route.path.split('/').at(-1);

      if (this.path !== nuevaRuta) {
        this.resetPaginationAndTrashed();
        this.path = nuevaRuta;
        return;
      }

      if (from.fullPath !== to.fullPath) {
        this.obtenerItems();
      }
    },
  },
};
</script>
