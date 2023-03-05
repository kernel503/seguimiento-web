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
    <!-- <v-row>
      <div class="text-center">
        <v-pagination v-model="page" :length="6"></v-pagination>
      </div>
    </v-row> -->
    <v-row>
      <v-col
        v-for="desplazamiento in desplazamientos"
        :key="desplazamiento.id"
        sm="12"
        md="12"
        lg="12"
      >
        <v-card>
          <v-card-title class="my-0 py-0">
            {{ desplazamiento.inicio_desplazamiento }}
          </v-card-title>
          <v-card-text class="my-0 py-0">
            <v-list class="transparent">
              <v-list-item
                class="my-0 py-0"
                v-for="medio in desplazamiento.detalle_medios_desplazamiento"
                :key="medio.id"
              >
                <v-list-item-title>{{medio.medio_desplazamiento.nombre}}</v-list-item-title>

                <v-list-item-icon>
                  <v-icon>{{`mdi-${medio.medio_desplazamiento.icono}`}}</v-icon>
                </v-list-item-icon>

                <v-list-item-subtitle class="text-right">
                  {{medio.duracion}}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="">
            <h3>{{ desplazamiento.id }}</h3>
            <v-spacer></v-spacer>
            <v-btn
              outlined
              @click="visualizar(desplazamiento)"
              color="red darken-2"
            >
              Visualizar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- <v-col>
        <v-card height="100%">
          <v-card-title class="my-0 py-0">
            22a3e45f-343e-4308-b42b-0cc2fe05873f
          </v-card-title>
          <v-card-text class="my-0 py-0">
            <v-list class="transparent">
              <v-list-item
                v-for="item in forecast"
                :key="item.day"
                class="my-0 py-0"
              >
                <v-list-item-title>{{ item.day }}</v-list-item-title>

                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-subtitle class="text-right">
                  {{ item.temp }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="">
            <v-btn text> Visualizar </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col>
        <v-card height="100%">
          <v-card-title class="my-0 py-0">
            22a3e45f-343e-4308-b42b-0cc2fe05873f
          </v-card-title>
          <v-card-text class="my-0 py-0">
            <v-list class="transparent">
              <v-list-item
                v-for="item in forecast.slice(2)"
                :key="item.day"
                class="my-0 py-0"
              >
                <v-list-item-title>{{ item.day }}</v-list-item-title>

                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-subtitle class="text-right">
                  {{ item.temp }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="d-flex align-end mb-6">
            <v-btn text> Visualizar </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col>
        <v-card height="100%">
          <v-card-title class="my-0 py-0">
            22a3e45f-343e-4308-b42b-0cc2fe05873f
          </v-card-title>
          <v-card-text class="my-0 py-0">
            <v-list class="transparent">
              <v-list-item
                v-for="item in forecast.slice(1)"
                :key="item.day"
                class="my-0 py-0"
              >
                <v-list-item-title>{{ item.day }}</v-list-item-title>

                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-subtitle class="text-right">
                  {{ item.temp }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn text> Visualizar </v-btn>
          </v-card-actions>
        </v-card>
      </v-col> -->
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'DesplazamientoListado',

  components: {},
  created() {
    this.obtenerDesplazamientos();
  },
  data() {
    return {
      page: 0,
      desplazamientos: [],
    };
  },

  methods: {
    async obtenerDesplazamientos() {
      try {
        const {
          data: { data: desplazamientos },
        } = await this.axios.get('desplazamientos', {
          params: {
            include: 'detalle_medios_desplazamiento.medio_desplazamiento',
          },
        });
        this.desplazamientos = desplazamientos;
      } catch (error) {
        this.$toast.error('Error al obtener los desplazamiento.');
      }
    },

    visualizar(desplazamiento) {
      this.$router.push({
        name: 'web:desplazamiento:detalle',
        params: { uuid: desplazamiento.id },
      });
    },
  },
};
</script>
