<template>
  <div>
    <v-row>
      <i class="mdi mdi-facebook-box"></i>
      <v-col sm="12" md="6" lg="6" xl="6">
        <v-text-field
          outlined
          v-model.trim="form.codigo"
          append-icon="mdi-magnify"
          label="Buscar por código"
          @click:append="search"
          @keypress.enter="search"
          :loading="loading"
        ></v-text-field>
      </v-col>
      <v-col md="6" sm="12" lg="6" xl="6">
        <v-pagination
          v-if="numeroDePaginas"
          v-model="paginaActiva"
          :length="numeroDePaginas"
          class="mb-2"
          color="red darken-2"
        ></v-pagination>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="conteo in levantamientos"
        :key="conteo.id"
        cols="12"
        sm="12"
        md="6"
        lg="6"
        xl="6"
      >
        <v-card>
          <v-card-title> Código: {{ conteo.codigo }} </v-card-title>
          <v-card-subtitle>
            {{ conteo.periodo_inicio }} - {{ conteo.periodo_fin }}
          </v-card-subtitle>
          <v-card-actions class="mt-0 pt-0">
            <v-btn
              dark
              outlined
              block
              @click="visualizar(conteo)"
              color="red darken-2"
            >
              Visualizar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'ConteoVehicularListado',

  created() {
    this.fetchLevantamientos();
  },

  data() {
    return {
      form: { codigo: null },
      loading: false,
      numeroDePaginas: 0,
      paginaActiva: 1,
      levantamientos: [],
    };
  },

  methods: {
    async fetchLevantamientos() {
      const filters = [];

      if (this.form.codigo) {
        filters.push({ field: 'codigo', operator: 'like', value: `%${this.codigo}%` });
      }

      try {
        const {
          data: {
            data,
            meta: { last_page: lastPage },
          },
        } = await this.axios.post(
          'conteo-vehicular/search',
          {
            filters: [],
          },
          {
            params: {
              page: this.paginaActiva,
              limit: 20,
            },
          },
        );
        this.levantamientos = data;
        this.numeroDePaginas = lastPage;
      } catch (error) {
        this.$toast.error('Error al obtener los registros de levantamiento.');
      }
      this.loading = false;
    },

    search() {
      this.loading = true;
      this.paginaActiva = 1;
      this.fetchLevantamientos();
    },

    visualizar(levantamiento) {
      this.$router.push({
        name: 'web:conteo-vehicular:detalle',
        params: { codigo: levantamiento.codigo },
      });
    },
  },

  watch: {
    paginaActiva() {
      this.fetchLevantamientos();
    },
  },
};
</script>
