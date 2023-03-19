<template>
  <div>
    <!-- <v-row>
      <v-col>
        <v-menu
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              label="Date"
              hint="MM/DD/YYYY format"
              persistent-hint
              prepend-icon="mdi-calendar"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker no-title></v-date-picker>
        </v-menu>
      </v-col>

      <v-col>
        <v-menu
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              label="Date (read only text field)"
              hint="MM/DD/YYYY format"
              persistent-hint
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            no-title
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col> <v-btn color="red darken-2"> Filtrar </v-btn></v-col>
    </v-row> -->
    <v-row>
      <v-col md="6" sm="12" lg="6" xl="6" xs="12">
        <v-text-field
          outlined
          v-model="searchUuid"
          append-icon="mdi-magnify"
          label="Buscar por código"
          @click:append="search"
          @keypress.enter="search"
          :loading="loading"
        ></v-text-field>
      </v-col>
      <v-col md="6" sm="12" lg="6" xl="6" xs="12">
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
        v-for="desplazamiento in desplazamientos"
        :key="desplazamiento.id"
        sm="12"
        md="12"
        lg="12"
        xl="12"
      >
        <v-card>
          <v-card-title class="mb-0 pb-0">
            Fecha registro:
            {{ desplazamiento.fecha_creado.split(".").at(0).replace("T", " ") }}
          </v-card-title>
          <v-card-text class="my-0 py-0">
            <v-list>
              <v-list-item
                dense
                v-for="medio in desplazamiento.detalle_medios_desplazamiento"
                :key="medio.id"
              >
                <v-list-item-title>
                  {{ medio.medio_desplazamiento.nombre }}
                </v-list-item-title>

                <v-list-item-icon>
                  <v-icon>
                    {{ `mdi-${medio.medio_desplazamiento.icono}` }}
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-subtitle class="text-right">
                  {{ medio.duracion }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="mt-0 pt-0">
            <v-row>
              <v-col>
                <span class="font-weight-bold mr-2"> Identificador: </span>
                {{ desplazamiento.id }}
              </v-col>
              <v-col>
                <v-btn
                  dark
                  outlined
                  block
                  @click="visualizar(desplazamiento)"
                  color="red darken-2"
                >
                  Visualizar
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'DesplazamientoListado',

  created() {
    this.obtenerDesplazamientos();
  },

  data() {
    return {
      searchUuid: null,
      loading: false,
      numeroDePaginas: 0,
      paginaActiva: 1,
      desplazamientos: [],
    };
  },

  methods: {
    async obtenerDesplazamientos() {
      const search = typeof this.searchUuid === 'string' && !!this.searchUuid
        ? {
          value: this.searchUuid,
          case_sensitive: false,
        }
        : undefined;
      try {
        const {
          data: {
            data: desplazamientos,
            meta: { last_page: lastPage },
          },
        } = await this.axios.post(
          'desplazamientos/search',
          {
            sort: [{ field: 'fecha_creado', direction: 'desc' }],
            includes: [
              {
                relation: 'detalle_medios_desplazamiento.medio_desplazamiento',
              },
            ],
            search,
          },
          {
            params: {
              page: this.paginaActiva,
            },
          },
        );
        this.desplazamientos = desplazamientos;
        this.numeroDePaginas = lastPage;
      } catch (error) {
        this.$toast.error('Error al obtener los desplazamiento.');
      }
      this.loading = false;
    },

    search() {
      this.loading = true;
      this.paginaActiva = 1;
      this.obtenerDesplazamientos();
    },

    visualizar(desplazamiento) {
      this.$router.push({
        name: 'web:desplazamiento:detalle',
        params: { uuid: desplazamiento.id },
      });
    },
  },

  watch: {
    paginaActiva() {
      this.obtenerDesplazamientos();
    },
  },
};
</script>
