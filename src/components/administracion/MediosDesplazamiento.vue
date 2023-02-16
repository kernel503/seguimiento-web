<template>
  <div>
    <FilteredTable
      toolbarTitle="Medios desplazamiento"
      :headers="headers"
      :items="items"
      @create="create"
      @remove="remove"
      @edit="edit"
      @trashed="refresh"
      @refresh="refresh"
    >
    </FilteredTable>

    <v-dialog v-model="dialog" max-width="600">
      <MdiPicker
        v-if="initialForm.length"
        ref="mdipicker"
        @submit="submit"
        @close="close"
        :value="initialForm"
      ></MdiPicker>
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
          <v-btn color="gray darken-1" text @click="dialogDelete = false"
            >Cancelar</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import MdiPicker from './MdiPicker.vue';
import FilteredTable from './FilteredTable.vue';

export default {
  name: 'MediosDesplazamiento',

  components: { MdiPicker, FilteredTable },

  data() {
    return {
      with_trashed: false,
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          value: 'nombre',
        },
        { text: 'Icono', align: 'center', value: 'icono' },
        {
          text: 'Acciones',
          align: 'center',
          value: 'actions',
          sortable: false,
        },
      ],
      items: [],
      initialForm: ['', ''],
    };
  },

  async created() {
    this.with_trashed = this.$route?.query?.with_trashed || false;
    this.obtenerItems();
  },

  methods: {
    async obtenerItems() {
      this.with_trashed = this.$route?.query?.with_trashed || false;
      try {
        const {
          data: { data },
        } = await this.axios.get('/medios-desplazamiento', {
          params: { with_trashed: this.with_trashed },
        });

        this.items = data;
      } catch (error) {
        this.$toast.error('Error al obtener los medios de desplazamiento.');
      }
    },
    async deleteItem() {
      const id = this.initialForm.at(2);
      try {
        await this.axios.delete(`/medios-desplazamiento/${id}`);

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
      this.initialForm = [payload.nombre, payload.icono, payload.id];
    },
    edit(payload) {
      this.initialForm = [payload.nombre, payload.icono, payload.id];
      this.dialog = true;
    },
    refresh() {
      this.obtenerItems();
    },
    close() {
      this.dialog = false;
      this.initialForm = [];
    },
    async submit() {
      if (!Array.isArray(this.initialForm) && !this.initialForm.length > 2) {
        return;
      }
      const data = {
        nombre: this.initialForm.at(0),
        icono: this.initialForm.at(1),
      };

      if (this.initialForm.length === 2) {
        try {
          await this.axios.post('/medios-desplazamiento', data);
          this.$toast.success('Registro creado.');
        } catch (error) {
          this.$toast.error('Error al crear el medio de desplazamiento.');
        }
      }

      if (this.initialForm.length === 3) {
        const id = this.initialForm.at(2);
        try {
          this.axios.put(`/medios-desplazamiento/${id}`, data);
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
  },
};
</script>
